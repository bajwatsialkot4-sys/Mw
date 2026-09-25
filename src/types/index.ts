export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number; // in PKR
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  description: string;
  volume: string;
  benefits: string[];
  ingredients: string;
  howToUse: string;
  inStock: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingDetails {
  fullName: string;
  phone: string; // 03XX-XXXXXXX
  alternatePhone?: string;
  email?: string;
  city: string;
  address: string;
  landmark: string;
  notes?: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string; // ISO string
  timestamp: number;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  totalAmount: number;
  shippingFee: number; // 0 for Free Shipping
  shippingDetails: ShippingDetails;
  paymentMethod: 'Cash on Delivery (COD)';
  status: OrderStatus;
  trackingNumber?: string;
  courier?: string;
}

export interface AdminAuth {
  isAuthenticated: boolean;
  googleUser?: {
    email: string;
    displayName: string;
    photoURL?: string;
  } | null;
  passcodeVerified: boolean;
}
