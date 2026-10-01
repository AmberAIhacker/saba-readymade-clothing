import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Boxes, Check, ChevronRight, CircleDollarSign, Sparkles,
  ClipboardCopy, ClipboardList, LayoutDashboard, LogOut, Menu, Package, Plus, Search, Settings,
  ShieldCheck, Tag, Trash2, Truck, UserPlus, Users, X
} from "lucide-react";
import { money, request } from "../api";
import type { Category, Order, Product, StoreSettings } from "../types";
import { DEFAULT_ADDRESS, DEFAULT_PHONE, DEFAULT_WHATSAPP } from "../storeDetails";
import { StoreImage } from "../components/StoreImage";

type DashboardData = {
  totalProducts: number; totalOrders: number; pendingOrders: number; confirmedOrders: number; deliveredOrders: number;
  cancelledOrders: number; lowStock: number; outOfStock: number; totalSales: number;
  recentOrders: Order[]; ordersByMonth: { createdAt: string; totalAmount: number; status: string }[];
};

const navigation = [
  { label: "Overview", path: "/admin", icon: LayoutDashboard },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Categories", path: "/admin/categories", icon: Tag },
  { label: "Orders", path: "/admin/orders", icon: ClipboardList },
  { label: "Admin access", path: "/admin/access", icon: UserPlus },
  { label: "Store & homepage", path: "/admin/settings", icon: Settings }
];
const statuses = ["Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      await request("/admin/login", { method: "POST", body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
      onLogin();
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  return <div className="admin-login-screen"><Link to="/" className="admin-back-link"><ArrowLeft size={15} /> Back to SABA READYMADE</Link><form className="admin-login-card" onSubmit={submit}><div className="admin-login-icon"><ShieldCheck size={24} /></div><span className="admin-kicker">THE BACK ROOM</span><h1>Welcome back.</h1><p>Sign in to take care of the shop.</p><label>Email address<input name="email" type="email" required autoComplete="username" placeholder="admin@yourshop.com" /></label><label>Password<input name="password" type="password" required autoComplete="current-password" placeholder="Your secure password" /></label>{error && <div className="form-error">{error}</div>}<button className="admin-primary-button" disabled={busy}>{busy ? "Checking..." : "Sign in securely"} <ChevronRight size={17} /></button><small>This is a private area for store administrators.</small><Link className="admin-invite-signup-link" to="/admin/signup">Have an invitation? Create an admin account</Link></form><div className="admin-login-footer">SABA READYMADE · LAHERIYASARAI</div></div>;
}

function AdminSignup({ onCreated }: { onCreated: (email: string) => void }) {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [invite, setInvite] = useState<{ email: string; expiresAt: string } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) return;
    request<{ email: string; expiresAt: string }>(`/admin/invites/validate/${encodeURIComponent(token)}`)
      .then(setInvite)
      .catch((err: Error) => setError(err.message));
  }, [token]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const password = new FormData(event.currentTarget).get("password");
    try {
      const result = await request<{ email: string }>("/admin/signup", {
        method: "POST",
        body: JSON.stringify({ token, password })
      });
      onCreated(result.email);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return <div className="admin-login-screen"><Link to="/" className="admin-back-link"><ArrowLeft size={15} /> Back to SABA READYMADE</Link>
    <form className="admin-login-card" onSubmit={submit}>
      <div className="admin-login-icon"><UserPlus size={24} /></div><span className="admin-kicker">PRIVATE ADMIN INVITATION</span><h1>Create your admin account.</h1>
      {!token ? <p>Admin accounts are invite-only. Open the private invitation link sent by your shop administrator.</p> :
        error && !invite ? <div className="form-error">{error}</div> :
          !invite ? <div className="admin-loading"><span /> Checking your invitation...</div> :
            <><p>Invitation for <strong>{invite.email}</strong></p><label>Create password<input name="password" type="password" required minLength={12} maxLength={200} autoComplete="new-password" placeholder="At least 12 characters" /></label>{error && <div className="form-error">{error}</div>}<button className="admin-primary-button" disabled={busy}>{busy ? "Creating account..." : "Create admin account"} <ChevronRight size={17} /></button><small>This invitation can only be used once and expires after 24 hours.</small></>}
      <Link className="admin-invite-signup-link" to="/admin">Already have an account? Sign in</Link>
    </form><div className="admin-login-footer">SABA READYMADE · PRIVATE ADMIN AREA</div>
  </div>;
}

function AdminShell({ email, children, title, subtitle, active, onLogout }: {
  email: string; children: React.ReactNode; title: string; subtitle: string; active: string; onLogout: () => void;
}) {
  const [mobileNav, setMobileNav] = useState(false);
  return <div className="admin-shell">
    <aside className={`admin-sidebar ${mobileNav ? "admin-sidebar-open" : ""}`}><Link to="/" className="admin-brand"><span className="admin-brand-mark">S</span><span><strong>SABA</strong><small>STORE STUDIO</small></span></Link><span className="admin-nav-label">WORKSPACE</span><nav>{navigation.map(({ label, path, icon: Icon }) => <NavLink end={path === "/admin"} onClick={() => setMobileNav(false)} to={path} key={path} className={({ isActive }) => `admin-nav-link ${isActive || active === path ? "active" : ""}`}><Icon size={17} /><span>{label}</span>{path === "/admin/orders" && <ChevronRight size={14} className="admin-nav-chevron" />}</NavLink>)}</nav><div className="admin-sidebar-bottom"><div className="admin-store-status"><span /> Your shop is open</div><Link to="/" className="admin-store-link" target="_blank"><ArrowUpRight size={15} /> View your storefront</Link><div className="admin-account"><div className="admin-account-avatar">{email.slice(0, 1).toUpperCase()}</div><div><strong>Store admin</strong><span>{email}</span></div><button aria-label="Sign out" onClick={onLogout}><LogOut size={16} /></button></div></div></aside>
    {mobileNav && <button className="admin-overlay" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
    <main className="admin-main"><header className="admin-topbar"><button className="admin-mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation"><Menu size={20} /></button><div className="admin-breadcrumb">SABA READYMADE <ChevronRight size={13} /> <strong>{title}</strong></div><div className="admin-topbar-right"><span className="admin-live-dot" /> Store is live <div className="admin-top-avatar">{email.slice(0, 1).toUpperCase()}</div></div></header><div className="admin-content"><div className="admin-page-heading"><div><span className="admin-kicker">{active === "/admin" ? "A LITTLE LOOK AT YOUR SHOP" : "SABA READYMADE · STORE STUDIO"}</span><h1>{title}</h1><p>{subtitle}</p></div>{active === "/admin/products" && <Link to="/admin/products?new=1" className="admin-primary-button"><Plus size={17} /> Add a product</Link>}</div>{children}</div></main>
  </div>;
}

function Dashboard({ onOrders }: { onOrders: () => void }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { request<DashboardData>("/admin/dashboard").then(setData).catch((err: Error) => setError(err.message)); }, []);
  if (error) return <div className="admin-error">{error} <button onClick={() => location.reload()}>Try again</button></div>;
  if (!data) return <div className="admin-loading"><span /> Getting your shop ready...</div>;
  const stats = [
    { label: "All-time sales", value: money(data.totalSales), icon: CircleDollarSign, tone: "green", note: "Excludes cancelled orders" },
    { label: "Products", value: String(data.totalProducts), icon: Package, tone: "lavender", note: `${data.lowStock} running low` },
    { label: "Orders to date", value: String(data.totalOrders), icon: ClipboardList, tone: "blue", note: "All customer orders" },
    { label: "Pending", value: String(data.pendingOrders), icon: ClipboardList, tone: "peach", note: "Waiting for confirmation" },
    { label: "Confirmed", value: String(data.confirmedOrders), icon: Check, tone: "blue", note: "Ready to process" },
    { label: "Delivered", value: String(data.deliveredOrders), icon: Truck, tone: "green", note: "Successfully completed" },
    { label: "Cancelled", value: String(data.cancelledOrders), icon: X, tone: "peach", note: "Cancelled orders" },
    { label: "Low stock", value: String(data.lowStock), icon: Boxes, tone: "lavender", note: `${data.outOfStock} out of stock` }
  ];
  const months = Array.from({ length: 6 }, (_, i) => new Date(new Date().getFullYear(), new Date().getMonth() - 5 + i, 1));
  const chart = months.map((month) => ({
    label: month.toLocaleDateString("en-IN", { month: "short" }),
    amount: data.ordersByMonth.filter((order) => new Date(order.createdAt).getMonth() === month.getMonth() && new Date(order.createdAt).getFullYear() === month.getFullYear() && order.status !== "Cancelled").reduce((sum, order) => sum + order.totalAmount, 0)
  }));
  const max = Math.max(1, ...chart.map((month) => month.amount));
  return <div className="admin-dashboard"><div className="admin-stats-grid">{stats.map(({ label, value, icon: Icon, tone, note }) => <article className="admin-stat-card" key={label}><div className={`admin-stat-icon ${tone}`}><Icon size={19} /></div><span className="admin-stat-label">{label}</span><strong>{value}</strong><small>{note}</small></article>)}</div>
    <div className="admin-dashboard-grid"><section className="admin-panel admin-sales-panel"><div className="admin-panel-heading"><div><span className="admin-kicker">THE BIG PICTURE</span><h2>Sales at a glance</h2></div><span className="admin-panel-chip">Last 6 months</span></div><div className="sales-chart"><div className="chart-gridlines"><span>{money(max)}</span><span>{money(Math.round(max / 2))}</span><span>{money(0)}</span></div><div className="chart-columns">{chart.map((month) => <div className="chart-column" key={`${month.label}-${month.amount}`}><span className="chart-tooltip">{money(month.amount)}</span><div style={{ height: `${Math.max(4, month.amount / max * 100)}%` }} /><small>{month.label}</small></div>)}</div></div><div className="chart-footer"><span><i /> Sales from placed orders</span><strong>{money(data.totalSales)} total</strong></div></section>
      <section className="admin-panel admin-inventory-panel"><div className="admin-panel-heading"><div><span className="admin-kicker">A FRIENDLY NUDGE</span><h2>Stock check</h2></div><Boxes size={19} /></div><div className="stock-alert-row"><span className="stock-alert-dot low" /><div><strong>Running a little low</strong><small>Five or fewer left on the shelf</small></div><b>{data.lowStock}</b></div><div className="stock-alert-row"><span className="stock-alert-dot empty" /><div><strong>Out of stock</strong><small>Ready for a restock</small></div><b>{data.outOfStock}</b></div><Link to="/admin/products" className="admin-text-link">Take a look at your products <ArrowRight size={14} /></Link></section></div>
    <section className="admin-panel admin-recent-panel"><div className="admin-panel-heading"><div><span className="admin-kicker">FRESH FROM THE SHOP</span><h2>Recent orders</h2></div><button className="admin-text-link" onClick={onOrders}>See every order <ArrowRight size={14} /></button></div>{data.recentOrders.length ? <OrderTable orders={data.recentOrders} compact /> : <div className="admin-empty"><Users size={22} /><span>Your first customer is just around the corner.</span></div>}</section>
  </div>;
}

function ProductEditor({ product, categories, onClose, onSaved }: {
  product: Product | null; categories: Category[]; onClose: () => void; onSaved: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name"), categoryId: form.get("categoryId"), brand: form.get("brand"),
      description: form.get("description"), imageUrl: form.get("imageUrl"),
      images: String(form.get("images") || form.get("imageUrl")).split(",").map((item) => item.trim()).filter(Boolean),
      originalPrice: Number(form.get("originalPrice")), sellingPrice: Number(form.get("sellingPrice")),
      discountPercent: Number(form.get("discountPercent")), sizes: String(form.get("sizes")).split(",").map((item) => item.trim()).filter(Boolean),
      colors: String(form.get("colors")).split(",").map((item) => item.trim()).filter(Boolean),
      keywords: String(form.get("keywords")).split(",").map((item) => item.trim()).filter(Boolean),
      stock: Number(form.get("stock")), rating: Number(form.get("rating")), reviewCount: Number(form.get("reviewCount")),
      visible: form.get("visible") === "on",
      featured: form.get("featured") === "on", newArrival: form.get("newArrival") === "on", offer: form.get("offer") === "on"
    };
    try {
      await request(`/admin/products${product ? `/${product.id}` : ""}`, { method: product ? "PUT" : "POST", body: JSON.stringify(payload) });
      onSaved();
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  return <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><form className="admin-product-modal" onSubmit={submit}><div className="admin-modal-heading"><div><span className="admin-kicker">MAKE IT JUST RIGHT</span><h2>{product ? "A little product update" : "Add a new favorite"}</h2></div><button type="button" className="admin-icon-button" onClick={onClose} aria-label="Close"><X size={19} /></button></div><div className="admin-form-grid"><label>Product name<input name="name" required minLength={2} defaultValue={product?.name} placeholder="A lovely everyday shirt" /></label><label>Category<select name="categoryId" required defaultValue={product?.categoryId ?? categories[0]?.id}>{categories.filter((cat) => cat.enabled !== false).map((cat) => <option value={cat.id} key={cat.id}>{cat.name}</option>)}</select></label><label>Brand<input name="brand" required defaultValue={product?.brand ?? "SABA READYMADE"} /></label><label>Main image URL<input name="imageUrl" type="url" required defaultValue={product?.imageUrl} placeholder="https://..." /></label><label className="admin-field-wide">More image URLs <span>(comma-separated)</span><input name="images" defaultValue={product?.images.join(", ")} placeholder="https://..., https://..." /></label><label className="admin-field-wide">Description<textarea name="description" required minLength={5} rows={3} defaultValue={product?.description} /></label><label>Original price (₹)<input name="originalPrice" type="number" min="1" required defaultValue={product?.originalPrice} /></label><label>Selling price (₹)<input name="sellingPrice" type="number" min="1" required defaultValue={product?.sellingPrice} /></label><label>Discount (%)<input name="discountPercent" type="number" min="0" max="100" defaultValue={product?.discountPercent ?? 0} /></label><label>Stock on hand<input name="stock" type="number" min="0" required defaultValue={product?.stock ?? 10} /></label><label>Available sizes <span>(comma-separated)</span><input name="sizes" defaultValue={product?.sizes.join(", ") ?? "S, M, L, XL"} placeholder="S, M, L, XL" /></label><label>Colors <span>(comma-separated)</span><input name="colors" defaultValue={product?.colors.join(", ") ?? "Midnight, Sand"} /></label><label>Search keywords <span>(comma-separated)</span><input name="keywords" defaultValue={product?.keywords.join(", ")} placeholder="cotton, everyday, casual" /></label><label>Rating (0–5)<input name="rating" type="number" min="0" max="5" step="0.1" defaultValue={product?.rating ?? 4.5} /></label><label>Review count<input name="reviewCount" type="number" min="0" defaultValue={product?.reviewCount ?? 0} /></label></div><div className="admin-checkboxes"><label><input name="featured" type="checkbox" defaultChecked={product?.featured} /> Featured on homepage</label><label><input name="newArrival" type="checkbox" defaultChecked={product?.newArrival} /> New arrival</label><label><input name="offer" type="checkbox" defaultChecked={product?.offer} /> Show in offers</label><label><input name="visible" type="checkbox" defaultChecked={product?.visible !== false} /> Visible in customer shop</label></div>{error && <div className="form-error">{error}</div>}<div className="admin-modal-actions"><button type="button" className="admin-secondary-button" onClick={onClose}>Not now</button><button className="admin-primary-button" disabled={busy || !categories.length}>{busy ? "Saving..." : product ? "Save these changes" : "Add to the collection"} <Check size={16} /></button></div></form></div>;
}

function ProductsManager({ categories }: { categories: Category[] }) {
  const [availableCategories, setAvailableCategories] = useState<Category[]>(categories);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [sort, setSort] = useState("newest");
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const load = () => request<Product[]>("/admin/products").then(setProducts).catch((err: Error) => setError(err.message));
  useEffect(() => {
    load();
    request<Category[]>("/admin/categories").then(setAvailableCategories).catch((err: Error) => setError(err.message));
  }, []);
  useEffect(() => { if (new URLSearchParams(location.search).get("new")) setEditing(null); }, []);
  async function remove(product: Product) {
    if (!window.confirm(`Remove "${product.name}" from the shop?`)) return;
    try { await request(`/admin/products/${product.id}`, { method: "DELETE" }); setNotice(`${product.name} removed.`); load(); }
    catch (err) { setError((err as Error).message); }
  }
  const visible = products.filter((product) =>
    `${product.name} ${product.category?.name} ${product.brand} ${product.keywords.join(" ")}`.toLowerCase().includes(search.toLowerCase()) &&
    (!category || product.categoryId === category) &&
    (!stockFilter || (stockFilter === "hidden" ? !product.visible : product.visible && (stockFilter === "out" ? product.stock === 0 : stockFilter === "low" ? product.stock > 0 && product.stock <= 5 : product.stock > 5)))
  ).sort((a, b) => sort === "price-asc" ? a.sellingPrice - b.sellingPrice : sort === "price-desc" ? b.sellingPrice - a.sellingPrice : sort === "stock-asc" ? a.stock - b.stock : new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
  return <div className="admin-panel admin-table-panel"><div className="admin-toolbar"><label className="admin-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a product..." /></label><select className="admin-filter-select" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{availableCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select className="admin-filter-select" value={stockFilter} onChange={(event) => setStockFilter(event.target.value)}><option value="">All availability</option><option value="low">Low stock</option><option value="out">Out of stock</option><option value="hidden">Hidden</option></select><select className="admin-filter-select" value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="stock-asc">Stock: low to high</option></select><span>{visible.length} of {products.length} styles</span><button className="admin-primary-button" onClick={() => setEditing(null)}><Plus size={16} /> Add a product</button></div>{error && <div className="admin-inline-error">{error}<button onClick={() => setError("")}><X size={14} /></button></div>}{notice && <div className="admin-inline-success">{notice}<button onClick={() => setNotice("")}><X size={14} /></button></div>}{visible.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>PRODUCT</th><th>CATEGORY</th><th>PRICE</th><th>STOCK</th><th>HOMEPAGE</th><th /></tr></thead><tbody>{visible.map((product) => <tr key={product.id}><td><div className="admin-product-cell"><StoreImage src={product.imageUrl} alt="" /><div><strong>{product.name}</strong><span>{product.brand}</span></div></div></td><td>{product.category?.name ?? "—"}</td><td><strong>{money(product.sellingPrice)}</strong>{product.originalPrice > product.sellingPrice && <small className="admin-old-price">{money(product.originalPrice)}</small>}</td><td><span className={`inventory-pill ${!product.visible ? "inventory-out" : product.stock === 0 ? "inventory-out" : product.stock <= 5 ? "inventory-low" : "inventory-ok"}`}>{!product.visible ? "Hidden" : product.stock === 0 ? "Out of stock" : product.stock <= 5 ? `${product.stock} left` : `${product.stock} in stock`}</span></td><td><div className="admin-badges">{product.featured && <span>Featured</span>}{product.newArrival && <span>New</span>}{product.offer && <span>Offer</span>}</div></td><td><div className="admin-row-actions"><button onClick={() => setEditing(product)}>Edit</button><button aria-label={`Remove ${product.name}`} onClick={() => remove(product)}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div> : <div className="admin-empty"><Package size={22} /><span>No products match those filters.</span></div>}{editing !== undefined && <ProductEditor product={editing} categories={availableCategories} onClose={() => setEditing(undefined)} onSaved={() => { setEditing(undefined); setNotice("Your product is safely updated."); load(); }} />}</div>;
}

function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const load = () => request<Category[]>("/admin/categories").then(setCategories).catch((err: Error) => setError(err.message));
  useEffect(() => { load(); }, []);
  async function add(event: React.FormEvent) {
    event.preventDefault(); setError(""); setNotice("");
    try { await request("/admin/categories", { method: "POST", body: JSON.stringify({ name, imageUrl }) }); setName(""); setImageUrl(""); setNotice("Your new category is ready."); load(); }
    catch (err) { setError((err as Error).message); }
  }
  async function update(category: Category, changes: Partial<Category>) {
    setError(""); setNotice("");
    try { await request(`/admin/categories/${category.id}`, { method: "PUT", body: JSON.stringify({ name: changes.name ?? category.name, imageUrl: changes.imageUrl ?? category.imageUrl ?? "", enabled: changes.enabled ?? category.enabled !== false }) }); setNotice("Category updated with care."); load(); }
    catch (err) { setError((err as Error).message); }
  }
  async function rename(category: Category) {
    const nextName = window.prompt("What would you like to call this category?", category.name);
    if (!nextName?.trim() || nextName.trim() === category.name) return;
    await update(category, { name: nextName.trim() });
  }
  async function remove(category: Category) {
    if (!window.confirm(`Remove the "${category.name}" category?`)) return;
    try { await request(`/admin/categories/${category.id}`, { method: "DELETE" }); load(); }
    catch (err) { setError((err as Error).message); }
  }
  return <div className="admin-category-layout"><section className="admin-panel admin-categories-panel"><div className="admin-panel-heading"><div><span className="admin-kicker">A PLACE FOR EVERY STYLE</span><h2>Your categories</h2></div><span className="admin-panel-chip">{categories.length} altogether</span></div>{error && <div className="admin-inline-error">{error}<button onClick={() => setError("")}><X size={14} /></button></div>}{notice && <div className="admin-inline-success">{notice}</div>}{categories.map((category, index) => <div className="admin-category-row" key={category.id}><div className="admin-category-number">{String(index + 1).padStart(2, "0")}</div><div className="admin-category-name"><strong>{category.name}</strong><span>{category._count?.products ?? 0} styles</span></div><span className={`category-status ${category.enabled === false ? "disabled" : ""}`}>{category.enabled === false ? "Hidden" : "On the shop"}</span><button className="admin-secondary-button" onClick={() => update(category, { enabled: category.enabled === false })}>{category.enabled === false ? "Show" : "Hide"}</button><button className="admin-row-edit-category" onClick={() => rename(category)}>Edit</button><button className="admin-icon-button danger" aria-label={`Remove ${category.name}`} onClick={() => remove(category)}><Trash2 size={15} /></button></div>)}</section><section className="admin-panel admin-add-category"><div className="admin-panel-heading"><div><span className="admin-kicker">GROW YOUR COLLECTION</span><h2>Add a category</h2></div></div><form onSubmit={add}><label>Category name<input required minLength={2} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Occasion wear" /></label><label>Cover image URL <span>(optional)</span><input type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://..." /></label><button className="admin-primary-button"><Plus size={16} /> Add category</button></form><div className="admin-note-card"><Sparkles size={16} /><p>Hidden categories stay safely in your studio but won't show in the customer shop.</p></div></section></div>;
}

function OrderTable({ orders, compact = false, onStatus }: { orders: Order[]; compact?: boolean; onStatus?: (order: Order, status: string) => void }) {
  return <div className="admin-table-wrap"><table className="admin-table orders-table"><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>WHEN</th><th>TOTAL</th><th>STATUS</th>{!compact && <th>ITEMS</th>}</tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong className="order-id">{order.orderNumber}</strong></td><td><div className="admin-order-customer"><strong>{order.customerName}</strong><span>{order.mobile}</span></div></td><td>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td><td><strong>{money(order.totalAmount)}</strong></td><td>{onStatus ? <select className={`order-status-select status-${order.status.toLowerCase().replaceAll(" ", "-")}`} value={order.status} onChange={(event) => onStatus(order, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select> : <span className={`order-status-tag status-${order.status.toLowerCase().replaceAll(" ", "-")}`}>{order.status}</span>}</td>{!compact && <td>{order.items.length} {order.items.length === 1 ? "style" : "styles"}<button className="admin-row-detail" onClick={() => window.alert(`${order.customerName}\\n${order.mobile}\\n${order.address}, ${order.city}, ${order.state} ${order.pinCode}\\n\\n${order.items.map((item) => `${item.productName} · ${item.size} · Qty ${item.quantity}`).join("\\n")}`)}>View details</button></td>}</tr>)}</tbody></table></div>;
}

function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const load = () => {
    const query = new URLSearchParams({ ...(search ? { search } : {}), ...(status ? { status } : {}) });
    request<Order[]>(`/admin/orders?${query}`).then(setOrders).catch((err: Error) => setError(err.message));
  };
  useEffect(load, [search, status]);
  async function changeStatus(order: Order, next: string) {
    if (next === "Cancelled" && !window.confirm(`Cancel order ${order.orderNumber}? Its stock will be returned to inventory.`)) return;
    try { await request(`/admin/orders/${order.id}/status`, { method: "PATCH", body: JSON.stringify({ status: next }) }); load(); }
    catch (err) { setError((err as Error).message); }
  }
  return <section className="admin-panel admin-table-panel"><div className="admin-toolbar"><label className="admin-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Order ID, customer or mobile" /></label><select className="admin-filter-select" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All order statuses</option>{statuses.map((value) => <option key={value}>{value}</option>)}</select><span>{orders.length} orders</span></div>{error && <div className="admin-inline-error">{error}<button onClick={() => setError("")}><X size={14} /></button></div>}{orders.length ? <OrderTable orders={orders} onStatus={changeStatus} /> : <div className="admin-empty"><ClipboardList size={23} /><span>{search || status ? "No orders match those filters." : "Your first order will be right here."}</span></div>}</section>;
}

type AdminInvite = { id: string; email: string; expiresAt: string; createdAt: string };

function AdminAccessManager() {
  const [email, setEmail] = useState("");
  const [invites, setInvites] = useState<AdminInvite[]>([]);
  const [inviteUrl, setInviteUrl] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const load = () => request<AdminInvite[]>("/admin/invites").then(setInvites).catch((err: Error) => setError(err.message));
  useEffect(() => { load(); }, []);

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(""); setNotice(""); setInviteUrl("");
    try {
      const invite = await request<AdminInvite & { token: string }>("/admin/invites", {
        method: "POST", body: JSON.stringify({ email })
      });
      setInviteUrl(`${window.location.origin}/admin/signup?token=${encodeURIComponent(invite.token)}`);
      setEmail("");
      setNotice(`Invitation created for ${invite.email}. Copy and share the private link; it expires in 24 hours.`);
      load();
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setNotice("Invitation link copied.");
    } catch {
      setError("Couldn't copy automatically. Select and copy the invitation link below.");
    }
  }

  async function revoke(invite: AdminInvite) {
    if (!window.confirm(`Revoke the invitation for ${invite.email}?`)) return;
    try {
      await request(`/admin/invites/${invite.id}`, { method: "DELETE" });
      setNotice(`Invitation for ${invite.email} revoked.`);
      load();
    } catch (err) { setError((err as Error).message); }
  }

  return <div className="admin-access-layout">
    <section className="admin-panel admin-invite-panel">
      <div className="admin-panel-heading"><div><span className="admin-kicker">PRIVATE ACCESS ONLY</span><h2>Invite another admin</h2></div><ShieldCheck size={19} /></div>
      <p>Only a signed-in administrator can create invitations. Each link is single-use and expires in 24 hours.</p>
      <form onSubmit={create}><label>Administrator email<input type="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="colleague@example.com" /></label><button className="admin-primary-button" disabled={busy}><UserPlus size={16} /> {busy ? "Creating invitation..." : "Create invitation"}</button></form>
      {error && <div className="admin-inline-error">{error}<button onClick={() => setError("")}><X size={14} /></button></div>}
      {notice && <div className="admin-inline-success">{notice}<button onClick={() => setNotice("")}><X size={14} /></button></div>}
      {inviteUrl && <div className="admin-invite-result"><label>Private invitation link<input readOnly value={inviteUrl} onFocus={(event) => event.currentTarget.select()} /></label><button className="admin-secondary-button" onClick={copyLink}><ClipboardCopy size={15} /> Copy invite link</button></div>}
    </section>
    <section className="admin-panel admin-invites-panel"><div className="admin-panel-heading"><div><span className="admin-kicker">LINKS NOT YET USED</span><h2>Active invitations</h2></div><span className="admin-panel-chip">{invites.length} active</span></div>
      {invites.length ? invites.map((invite) => <div className="admin-invite-row" key={invite.id}><div><strong>{invite.email}</strong><span>Expires {new Date(invite.expiresAt).toLocaleString("en-IN")}</span></div><button className="admin-row-edit-category" onClick={() => revoke(invite)}>Revoke</button></div>) : <div className="admin-empty"><Users size={22} /><span>No active invitations.</span></div>}
    </section>
  </div>;
}

const defaultSettings: StoreSettings = {
  shopName: "SABA READYMADE", ownerName: "Mr. MD Jawed Equbal", phone: DEFAULT_PHONE, whatsapp: DEFAULT_WHATSAPP,
  address: DEFAULT_ADDRESS, description: "Everyday fashion for the whole family.",
  websiteCredit: "Mr. Amber Rehan", announcement: "Fresh styles. Lovely prices. Made for you.",
  heroTitle: "Find your everyday\nfavorite.", heroSubtitle: "Thoughtful styles for every version of you.", heroImageUrl: ""
};

function SettingsManager() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => { request<StoreSettings>("/store").then((value) => setSettings(value)).catch((err: Error) => setError(err.message)); }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try { setSettings(await request<StoreSettings>("/admin/store", { method: "PUT", body: JSON.stringify(payload) })); setNotice("Your storefront has the fresh details."); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  return <form className="admin-settings-layout" onSubmit={submit}><section className="admin-panel admin-settings-form"><div className="admin-panel-heading"><div><span className="admin-kicker">THE LITTLE DETAILS THAT MAKE IT YOURS</span><h2>Store information</h2></div></div><div className="admin-form-grid"><label>Shop name<input name="shopName" required defaultValue={settings.shopName} key={`shop-${settings.shopName}`} /></label><label>Owner name<input name="ownerName" required defaultValue={settings.ownerName} key={`owner-${settings.ownerName}`} /></label><label>Contact number<input name="phone" required defaultValue={settings.phone} key={`phone-${settings.phone}`} /></label><label>WhatsApp number<input name="whatsapp" required defaultValue={settings.whatsapp} key={`whatsapp-${settings.whatsapp}`} /></label><label className="admin-field-wide">Shop address<input name="address" required defaultValue={settings.address} key={`address-${settings.address}`} /></label><label className="admin-field-wide">A little about the shop<textarea name="description" required rows={3} defaultValue={settings.description} key={`description-${settings.description}`} /></label><label>Website credit<input name="websiteCredit" required defaultValue={settings.websiteCredit} key={`credit-${settings.websiteCredit}`} /></label></div></section><section className="admin-panel admin-homepage-settings"><div className="admin-panel-heading"><div><span className="admin-kicker">WHAT YOUR CUSTOMERS SEE FIRST</span><h2>Homepage & announcements</h2></div></div><div className="admin-form-stack"><label>Announcement bar<input name="announcement" maxLength={180} defaultValue={settings.announcement} key={`announcement-${settings.announcement}`} /></label><label>Hero headline <span>(use a new line for a line break)</span><textarea name="heroTitle" required rows={2} defaultValue={settings.heroTitle} key={`title-${settings.heroTitle}`} /></label><label>Hero description<textarea name="heroSubtitle" rows={2} defaultValue={settings.heroSubtitle} key={`subtitle-${settings.heroSubtitle}`} /></label><label>Hero image URL <span>(leave empty for the current collection)</span><input name="heroImageUrl" type="url" defaultValue={settings.heroImageUrl} key={`hero-${settings.heroImageUrl}`} /></label></div><div className="admin-homepage-tip"><Sparkles size={17} /><span>Choose your featured, new-arrival and offer products from the product editor — your home page updates automatically.</span></div></section>{error && <div className="form-error">{error}</div>}{notice && <div className="admin-inline-success">{notice}</div>}<div className="admin-settings-save"><span><ShieldCheck size={15} /> Changes appear on your customer storefront straight away.</span><button className="admin-primary-button" disabled={busy}>{busy ? "Saving your details..." : "Save store details"} <Check size={16} /></button></div></form>;
}

export function AdminApp() {
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(true);
  const routeLocation = useLocation();
  const navigate = useNavigate();
  const active = navigation.find(({ path }) => path === routeLocation.pathname)?.path ?? routeLocation.pathname;
  const page = useMemo(() => ({
    "/admin": ["A nice little overview", "Here's how things are going at your shop."],
    "/admin/products": ["Your products", "All your styles, prices and stock — right where you need them."],
    "/admin/categories": ["Your categories", "Give every collection its own little corner of the shop."],
    "/admin/orders": ["Customer orders", "Take good care of every order and everyone who made it."],
    "/admin/access": ["Admin access", "Invite trusted people without opening admin registration to the public."],
    "/admin/settings": ["Store & homepage", "Keep your shop details, announcements and first impression feeling like you."]
  }[routeLocation.pathname] ?? ["Store studio", "Everything you need to take care of your shop."]), [routeLocation.pathname]);
  function verify() {
    setChecking(true);
    request<{ email: string }>("/admin/me").then((admin) => setEmail(admin.email)).catch(() => setEmail("")).finally(() => setChecking(false));
  }
  useEffect(verify, []);
  async function logout() {
    await request("/admin/logout", { method: "POST" }).catch(() => undefined);
    setEmail("");
    navigate("/admin");
  }
  if (routeLocation.pathname === "/admin/signup") {
    return <AdminSignup onCreated={(createdEmail) => { setEmail(createdEmail); navigate("/admin"); }} />;
  }
  if (checking) return <div className="admin-checking"><span /> Opening your studio...</div>;
  if (!email) return <AdminLogin onLogin={verify} />;
  const [title, subtitle] = page;
  const sharedProps = { email, title, subtitle, active, onLogout: logout };
  return <AdminShell {...sharedProps}>{routeLocation.pathname === "/admin" ? <Dashboard onOrders={() => navigate("/admin/orders")} /> :
    routeLocation.pathname === "/admin/products" ? <ProductsManager categories={[]} /> :
      routeLocation.pathname === "/admin/categories" ? <CategoriesManager /> :
        routeLocation.pathname === "/admin/orders" ? <OrdersManager /> :
          routeLocation.pathname === "/admin/access" ? <AdminAccessManager /> :
          routeLocation.pathname === "/admin/settings" ? <SettingsManager /> : <Dashboard onOrders={() => navigate("/admin/orders")} />}</AdminShell>;
}
