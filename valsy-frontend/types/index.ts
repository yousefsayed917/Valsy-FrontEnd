// ─── Product Types ─────────────────────────────────────────────────────────────

export interface ProductVariantDto {
  id: string;
  size: string;
  color: string;
  stock: number;
}

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  variants: ProductVariantDto[];
}

// ─── Order Types ───────────────────────────────────────────────────────────────

export type OrderStatus = "Pending" | "Paid" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderItemDto {
  id: string;
  orderId: string;
  productId: string;
  productVariantId: string;
  productName: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderDto {
  id: string;
  customerId: string;
  status: OrderStatus;
  shippingAddressLine1: string;
  shippingCity: string;
  shippingCountry: string;
  contactPhone: string;
  totalAmount: number;
  items: OrderItemDto[];
}

// ─── Cart (client-side only) ───────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  productVariantId: string;
  productName: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
}

// ─── Customer / Checkout Types ────────────────────────────────────────────────

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  city: string;
  country: string;
}
