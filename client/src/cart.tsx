import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem, Product } from "./types";

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (product: Product, size: string, color: string, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "saba-readymade-cart";
const itemKey = (item: Pick<CartItem, "productId" | "size" | "color">) => `${item.productId}::${item.size}::${item.color}`;

function loadCart(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is CartItem =>
      !!item && typeof item === "object"
      && "productId" in item && typeof item.productId === "string"
      && "name" in item && typeof item.name === "string"
      && "imageUrl" in item && typeof item.imageUrl === "string"
      && "price" in item && typeof item.price === "number" && item.price >= 0
      && "originalPrice" in item && typeof item.originalPrice === "number"
      && "discountPercent" in item && typeof item.discountPercent === "number"
      && "quantity" in item && typeof item.quantity === "number" && Number.isInteger(item.quantity) && item.quantity > 0
      && "size" in item && typeof item.size === "string"
      && "color" in item && typeof item.color === "string"
      && "stock" in item && typeof item.stock === "number" && item.stock >= 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(items)), [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
    add(product, size, color, quantity = 1) {
      setItems((current) => {
        const key = itemKey({ productId: product.id, size, color });
        const match = current.find((item) => itemKey(item) === key);
        if (!match) return [...current, {
          productId: product.id, name: product.name, imageUrl: product.imageUrl,
          price: product.sellingPrice, originalPrice: product.originalPrice,
          discountPercent: product.discountPercent, quantity: Math.min(quantity, product.stock),
          size, color, stock: product.stock
        }];
        return current.map((item) => itemKey(item) === key
          ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock), stock: product.stock }
          : item);
      });
    },
    setQuantity(key, quantity) {
      setItems((current) => current.map((item) => itemKey(item) === key
        ? { ...item, quantity: Math.min(Math.max(1, quantity), item.stock) }
        : item));
    },
    remove(key) { setItems((current) => current.filter((item) => itemKey(item) !== key)); },
    clear() { setItems([]); }
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider.");
  return value;
}

export { itemKey };
