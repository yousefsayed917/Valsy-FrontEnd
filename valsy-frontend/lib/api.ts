import type { ProductDto, OrderDto, CheckoutFormData } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5220";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(body?.message || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Products ─────────────────────────────────────────────────────────────────

export const api = {
  // Store
  getProducts: (searchTerm?: string): Promise<ProductDto[]> => {
    const qs = searchTerm ? `?searchTerm=${encodeURIComponent(searchTerm)}` : "";
    return request<ProductDto[]>(`/api/products${qs}`);
  },

  getProductById: (id: string): Promise<ProductDto | null> =>
    request<ProductDto>(`/api/products/${id}`),

  // Admin
  getAdminProducts: (searchTerm?: string): Promise<ProductDto[]> => {
    const qs = searchTerm ? `?searchTerm=${encodeURIComponent(searchTerm)}` : "";
    return request<ProductDto[]>(`/api/admin/products${qs}`);
  },

  createProduct: (
    name: string,
    description: string,
    price: number,
    requestedBy: string
  ): Promise<{ productId: string }> =>
    request("/api/admin/products", {
      method: "POST",
      body: JSON.stringify({ name, description, price, requestedBy }),
    }),

  createProductVariant: (
    productId: string,
    size: string,
    color: string,
    stock: number,
    requestedBy: string
  ): Promise<{ variantId: string }> =>
    request(`/api/admin/products/${productId}/variants`, {
      method: "POST",
      body: JSON.stringify({ size, color, stock, requestedBy }),
    }),

  adjustStock: (
    variantId: string,
    newStock: number,
    requestedBy: string
  ): Promise<void> =>
    request(`/api/admin/products/variants/${variantId}/stock`, {
      method: "PUT",
      body: JSON.stringify({ newStock, requestedBy }),
    }),

  // ─── Customers ──────────────────────────────────────────────────────────────

  createCustomer: (
    data: CheckoutFormData,
    requestedBy: string
  ): Promise<{ customerId: string }> =>
    request("/api/customers", {
      method: "POST",
      body: JSON.stringify({ ...data, requestedBy }),
    }),

  // ─── Orders ─────────────────────────────────────────────────────────────────

  createOrder: (
    customerId: string,
    shippingAddressLine1: string,
    shippingCity: string,
    shippingCountry: string,
    contactPhone: string,
    requestedBy: string
  ): Promise<{ orderId: string }> =>
    request("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        customerId,
        shippingAddressLine1,
        shippingCity,
        shippingCountry,
        contactPhone,
        requestedBy,
      }),
    }),

  addOrderItem: (
    orderId: string,
    productId: string,
    productVariantId: string,
    quantity: number,
    requestedBy: string
  ): Promise<void> =>
    request(`/api/orders/${orderId}/items`, {
      method: "POST",
      body: JSON.stringify({ productId, productVariantId, quantity, requestedBy }),
    }),

  submitOrder: (orderId: string, requestedBy: string): Promise<void> =>
    request(`/api/orders/${orderId}/submit`, {
      method: "POST",
      body: JSON.stringify({ requestedBy }),
    }),

  getOrderById: (id: string): Promise<OrderDto> =>
    request<OrderDto>(`/api/orders/${id}`),
};
