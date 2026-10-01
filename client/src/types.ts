export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  enabled?: boolean;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  category?: Category;
  brand: string;
  description: string;
  imageUrl: string;
  images: string[];
  originalPrice: number;
  sellingPrice: number;
  discountPercent: number;
  sizes: string[];
  colors: string[];
  keywords: string[];
  stock: number;
  visible: boolean;
  rating: number;
  reviewCount: number;
  featured: boolean;
  newArrival: boolean;
  offer: boolean;
  createdAt?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  quantity: number;
  size: string;
  color: string;
  stock: number;
}

export interface StoreSettings {
  shopName: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  address: string;
  description: string;
  websiteCredit: string;
  announcement: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  totalAmount: number;
  deliveryFee?: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}
