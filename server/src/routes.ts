import { Router } from "express";
import { createHash, randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db } from "./db.js";
import { asyncRoute, HttpError, requireAdmin } from "./middleware.js";
import { ORDER_STATUSES, publicProduct, slugify } from "./lib.js";

export const api = Router();

const productFields = z.object({
  name: z.string().trim().min(2).max(120),
  categoryId: z.string().min(1),
  brand: z.string().trim().min(1).max(80),
  description: z.string().trim().min(5).max(2000),
  imageUrl: z.string().url(),
  images: z.array(z.string().url()).max(8).default([]),
  originalPrice: z.coerce.number().int().positive().max(10000000),
  sellingPrice: z.coerce.number().int().positive().max(10000000),
  discountPercent: z.coerce.number().int().min(0).max(100).default(0),
  sizes: z.array(z.string().trim().min(1).max(20)).max(16).default([]),
  colors: z.array(z.string().trim().min(1).max(30)).max(16).default([]),
  keywords: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  stock: z.coerce.number().int().min(0).max(100000),
  rating: z.coerce.number().min(0).max(5).default(4.5),
  reviewCount: z.coerce.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  offer: z.boolean().default(false)
});

function serializeProductInput(data: z.infer<typeof productFields>) {
  return {
    ...data,
    slug: `${slugify(data.name)}-${createHash("sha1").update(data.name + Date.now()).digest("hex").slice(0, 6)}`,
    images: JSON.stringify(data.images.length ? data.images : [data.imageUrl]),
    sizes: JSON.stringify(data.sizes),
    colors: JSON.stringify(data.colors),
    keywords: JSON.stringify(data.keywords)
  };
}

api.get("/health", (_req, res) => res.json({ status: "ok" }));

api.get("/products", asyncRoute(async (req, res) => {
  const search = String(req.query.search ?? "").trim();
  const category = String(req.query.category ?? "");
  const size = String(req.query.size ?? "");
  const color = String(req.query.color ?? "");
  const minPrice = Number(req.query.minPrice ?? 0);
  const maxPrice = Number(req.query.maxPrice ?? 10000000);
  const minDiscount = Number(req.query.minDiscount ?? 0);
  const sort = String(req.query.sort ?? "newest");
  const where = {
    category: { is: { enabled: true, ...(category && category !== "all" ? { slug: category } : {}) } },
    ...(req.query.featured === "true" ? { featured: true } : {}),
    ...(req.query.newArrival === "true" ? { newArrival: true } : {}),
    ...(req.query.offer === "true" ? { offer: true } : {}),
    ...(req.query.inStock === "true" ? { stock: { gt: 0 } } : {}),
    ...(minDiscount > 0 ? { discountPercent: { gte: minDiscount } } : {}),
    sellingPrice: { gte: Number.isFinite(minPrice) ? minPrice : 0, lte: Number.isFinite(maxPrice) ? maxPrice : 10000000 },
    ...(size ? { sizes: { contains: `"${size}"` } } : {}),
    ...(color ? { colors: { contains: `"${color}"` } } : {}),
    ...(search ? { OR: [
      { name: { contains: search } },
      { brand: { contains: search } },
      { description: { contains: search } },
      { keywords: { contains: search } },
      { category: { is: { name: { contains: search }, enabled: true } } }
    ] } : {})
  };
  const orderBy = sort === "price-asc" ? { sellingPrice: "asc" as const }
    : sort === "price-desc" ? { sellingPrice: "desc" as const }
      : sort === "popular" ? { rating: "desc" as const }
        : sort === "discount" ? { discountPercent: "desc" as const }
          : { createdAt: "desc" as const };
  const products = await db.product.findMany({ where, include: { category: true }, orderBy });
  res.json(products.map(publicProduct));
}));

api.get("/products/:id", asyncRoute(async (req, res) => {
  const id = String(req.params.id);
  const product = await db.product.findFirst({
    where: { OR: [{ id }, { slug: id }], category: { is: { enabled: true } } },
    include: { category: true }
  });
  if (!product) throw new HttpError(404, "We couldn't find that product.");
  res.json(publicProduct(product));
}));

api.get("/categories", asyncRoute(async (_req, res) => {
  const categories = await db.category.findMany({
    where: { enabled: true }, orderBy: { name: "asc" }, include: { _count: { select: { products: true } } }
  });
  res.json(categories);
}));

api.get("/store", asyncRoute(async (_req, res) => {
  const settings = await db.storeSettings.findUnique({ where: { id: "store" } });
  res.json(settings);
}));

api.post("/orders", asyncRoute(async (req, res) => {
  const input = z.object({
    customerName: z.string().trim().min(2).max(100),
    mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number."),
    address: z.string().trim().min(8).max(300),
    city: z.string().trim().min(2).max(80),
    state: z.string().trim().min(2).max(80),
    pinCode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code."),
    items: z.array(z.object({
      productId: z.string().min(1),
      quantity: z.coerce.number().int().min(1).max(20),
      size: z.string().min(1).max(20),
      color: z.string().min(1).max(30)
    })).min(1).max(30)
  }).parse(req.body);

  const created = await db.$transaction(async (tx) => {
    let subtotal = 0;
    const lines = [];
    for (const item of input.items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new HttpError(404, "A product in your cart is no longer available.");
      if (product.stock < item.quantity) throw new HttpError(409, `${product.name} has only ${product.stock} left in stock.`);
      if (!JSON.parse(product.sizes).includes(item.size) || !JSON.parse(product.colors).includes(item.color)) {
        throw new HttpError(400, `Please choose an available size and color for ${product.name}.`);
      }
      subtotal += product.sellingPrice * item.quantity;
      lines.push({ product, item });
    }

    const suffix = `${Date.now().toString().slice(-7)}${randomInt(0, 10).toString()}`;
    const deliveryFee = subtotal >= 1999 ? 0 : 99;
    const totalAmount = subtotal + deliveryFee;
    const orderNumber = `SBR-${new Date().getFullYear()}-${suffix}`;
    const order = await tx.order.create({
      data: {
        ...input,
        orderNumber,
        deliveryFee,
        totalAmount,
        items: { create: lines.map(({ product, item }) => ({
          productId: product.id,
          productName: product.name,
          imageUrl: product.imageUrl,
          unitPrice: product.sellingPrice,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        })) }
      },
      include: { items: true }
    });
    for (const { product, item } of lines) {
      const updated = await tx.product.updateMany({
        where: { id: product.id, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } }
      });
      if (updated.count !== 1) throw new HttpError(409, `${product.name} just sold out. Please update your cart.`);
    }
    return order;
  });
  res.status(201).json(created);
}));

api.post("/orders/track", asyncRoute(async (req, res) => {
  const { orderNumber, mobile } = z.object({
    orderNumber: z.string().trim().min(8).max(40),
    mobile: z.string().trim().regex(/^[6-9]\d{9}$/)
  }).parse(req.body);
  const order = await db.order.findFirst({
    where: { orderNumber: orderNumber.toUpperCase(), mobile },
    select: { orderNumber: true, customerName: true, status: true, createdAt: true, items: true, totalAmount: true }
  });
  if (!order) throw new HttpError(404, "No order found for those details. Please check the order ID and mobile number.");
  res.json(order);
}));

api.post("/admin/login", asyncRoute(async (req, res) => {
  const { email, password } = z.object({
    email: z.string().email().max(254),
    password: z.string().min(1).max(200)
  }).parse(req.body);
  const admin = await db.admin.findUnique({ where: { email: email.toLowerCase() } });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    throw new HttpError(401, "Email or password is incorrect.");
  }
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new HttpError(500, "Admin authentication is not configured securely.");
  const token = jwt.sign({ sub: admin.id }, secret, { expiresIn: "8h" });
  res.cookie("saba_admin", token, {
    httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production",
    maxAge: 8 * 60 * 60 * 1000, path: "/"
  });
  res.json({ email: admin.email });
}));

api.post("/admin/logout", (_req, res) => {
  res.clearCookie("saba_admin", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/" });
  res.json({ ok: true });
});

api.get("/admin/me", requireAdmin, asyncRoute(async (req, res) => {
  const payload = jwt.verify(req.cookies.saba_admin, process.env.JWT_SECRET!) as jwt.JwtPayload;
  const admin = await db.admin.findUnique({ where: { id: String(payload.sub) }, select: { email: true } });
  if (!admin) throw new HttpError(401, "Admin account no longer exists.");
  res.json(admin);
}));

api.use("/admin", requireAdmin);

api.get("/admin/dashboard", asyncRoute(async (_req, res) => {
  const [totalProducts, totalOrders, pendingOrders, deliveredOrders, cancelledOrders, lowStock, outOfStock, revenue, recentOrders] = await Promise.all([
    db.product.count(), db.order.count(), db.order.count({ where: { status: "Pending" } }),
    db.order.count({ where: { status: "Delivered" } }), db.order.count({ where: { status: "Cancelled" } }),
    db.product.count({ where: { stock: { gt: 0, lte: 5 } } }), db.product.count({ where: { stock: 0 } }),
    db.order.aggregate({ where: { status: { not: "Cancelled" } }, _sum: { totalAmount: true } }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 7, include: { items: true } })
  ]);
  const ordersByMonth = await db.order.findMany({
    where: { createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1) } },
    select: { createdAt: true, totalAmount: true, status: true }
  });
  res.json({ totalProducts, totalOrders, pendingOrders, deliveredOrders, cancelledOrders, lowStock, outOfStock, totalSales: revenue._sum.totalAmount ?? 0, recentOrders, ordersByMonth });
}));

api.get("/admin/products", asyncRoute(async (_req, res) => {
  const products = await db.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  res.json(products.map(publicProduct));
}));

api.post("/admin/products", asyncRoute(async (req, res) => {
  const input = productFields.parse(req.body);
  const category = await db.category.findUnique({ where: { id: input.categoryId } });
  if (!category) throw new HttpError(400, "Choose a valid product category.");
  const product = await db.product.create({ data: serializeProductInput(input), include: { category: true } });
  res.status(201).json(publicProduct(product));
}));

api.put("/admin/products/:id", asyncRoute(async (req, res) => {
  const id = String(req.params.id);
  const input = productFields.parse(req.body);
  if (!(await db.category.findUnique({ where: { id: input.categoryId } }))) throw new HttpError(400, "Choose a valid product category.");
  const slug = `${slugify(input.name)}-${createHash("sha1").update(input.name + id).digest("hex").slice(0, 6)}`;
  const product = await db.product.update({
    where: { id },
    data: { ...input, slug, images: JSON.stringify(input.images.length ? input.images : [input.imageUrl]), sizes: JSON.stringify(input.sizes), colors: JSON.stringify(input.colors), keywords: JSON.stringify(input.keywords) },
    include: { category: true }
  });
  res.json(publicProduct(product));
}));

api.delete("/admin/products/:id", asyncRoute(async (req, res) => {
  const id = String(req.params.id);
  try {
    await db.product.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2003") {
      throw new HttpError(409, "This product is part of an order and cannot be deleted. Set its stock to zero instead.");
    }
    throw error;
  }
}));

api.get("/admin/categories", asyncRoute(async (_req, res) => {
  res.json(await db.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } }));
}));

api.post("/admin/categories", asyncRoute(async (req, res) => {
  const { name, imageUrl } = z.object({ name: z.string().trim().min(2).max(60), imageUrl: z.string().url().optional().or(z.literal("")) }).parse(req.body);
  const category = await db.category.create({ data: { name, slug: slugify(name), imageUrl: imageUrl || null } });
  res.status(201).json(category);
}));

api.put("/admin/categories/:id", asyncRoute(async (req, res) => {
  const id = String(req.params.id);
  const { name, imageUrl, enabled } = z.object({
    name: z.string().trim().min(2).max(60),
    imageUrl: z.string().url().optional().or(z.literal("")),
    enabled: z.boolean()
  }).parse(req.body);
  const category = await db.category.update({
    where: { id }, data: { name, slug: slugify(name), imageUrl: imageUrl || null, enabled }
  });
  res.json(category);
}));

api.delete("/admin/categories/:id", asyncRoute(async (req, res) => {
  const id = String(req.params.id);
  const category = await db.category.findUnique({ where: { id }, include: { _count: { select: { products: true } } } });
  if (!category) throw new HttpError(404, "Category not found.");
  if (category._count.products) throw new HttpError(409, "Move or remove this category's products before deleting it.");
  await db.category.delete({ where: { id } });
  res.status(204).end();
}));

api.get("/admin/orders", asyncRoute(async (req, res) => {
  const search = String(req.query.search ?? "").trim();
  const status = String(req.query.status ?? "");
  const orders = await db.order.findMany({
    where: {
      ...(status && ORDER_STATUSES.includes(status as typeof ORDER_STATUSES[number]) ? { status } : {}),
      ...(search ? { OR: [
        { orderNumber: { contains: search } }, { customerName: { contains: search } }, { mobile: { contains: search } }
      ] } : {})
    },
    include: { items: true }, orderBy: { createdAt: "desc" }
  });
  res.json(orders);
}));

api.get("/admin/orders/:id", asyncRoute(async (req, res) => {
  const id = String(req.params.id);
  const order = await db.order.findFirst({ where: { OR: [{ id }, { orderNumber: id }] }, include: { items: true } });
  if (!order) throw new HttpError(404, "Order not found.");
  res.json(order);
}));

api.patch("/admin/orders/:id/status", asyncRoute(async (req, res) => {
  const id = String(req.params.id);
  const { status } = z.object({ status: z.enum(ORDER_STATUSES) }).parse(req.body);
  const order = await db.$transaction(async (tx) => {
    const current = await tx.order.findUnique({ where: { id }, include: { items: true } });
    if (!current) throw new HttpError(404, "Order not found.");
    if (current.status !== status && status === "Cancelled") {
      for (const item of current.items) {
        await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
      }
    } else if (current.status === "Cancelled" && status !== "Cancelled") {
      for (const item of current.items) {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } }
        });
        if (updated.count !== 1) throw new HttpError(409, `There isn't enough stock to reinstate ${item.productName}.`);
      }
    }
    return tx.order.update({ where: { id }, data: { status }, include: { items: true } });
  });
  res.json(order);
}));

api.put("/admin/store", asyncRoute(async (req, res) => {
  const input = z.object({
    shopName: z.string().trim().min(2).max(100),
    ownerName: z.string().trim().min(2).max(100),
    phone: z.string().trim().min(7).max(20),
    whatsapp: z.string().trim().min(7).max(20),
    address: z.string().trim().min(5).max(300),
    description: z.string().trim().min(5).max(500),
    websiteCredit: z.string().trim().min(2).max(100),
    announcement: z.string().trim().max(180),
    heroTitle: z.string().trim().min(2).max(120),
    heroSubtitle: z.string().trim().max(240),
    heroImageUrl: z.string().url().or(z.literal(""))
  }).parse(req.body);
  res.json(await db.storeSettings.upsert({ where: { id: "store" }, create: { id: "store", ...input }, update: input }));
}));
