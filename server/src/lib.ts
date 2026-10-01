export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function jsonArray(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function publicProduct<T extends {
  sizes: string;
  colors: string;
  images: string;
  keywords: string;
  category?: unknown;
}>(product: T) {
  const { sizes, colors, images, keywords, ...rest } = product;
  return {
    ...rest,
    sizes: jsonArray(sizes),
    colors: jsonArray(colors),
    images: jsonArray(images),
    keywords: jsonArray(keywords)
  };
}

export const ORDER_STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"] as const;
