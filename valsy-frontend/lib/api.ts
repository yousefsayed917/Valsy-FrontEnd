import type { ProductDto, OrderDto, CheckoutFormData, ProductCatalogDto } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7156";

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
  getProducts: (params?: { search?: string, size?: string, color?: string, minPrice?: number, maxPrice?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("searchTerm", params.search);
    if (params?.size) searchParams.append("size", params.size);
    if (params?.color) searchParams.append("color", params.color);
    if (params?.minPrice) searchParams.append("minPrice", params.minPrice.toString());
    if (params?.maxPrice) searchParams.append("maxPrice", params.maxPrice.toString());
    
    const query = searchParams.toString();
    return request<ProductCatalogDto>(`/api/products${query ? `?${query}` : ""}`);
  },

  getProductById: (id: number): Promise<ProductDto | null> =>
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
    requestedBy: string,
    variants: { size: string; color: string; stock: number; image?: string }[]
  ): Promise<{ productId: number }> =>
    request("/api/admin/products", {
      method: "POST",
      body: JSON.stringify({ name, description, price, requestedBy, variants }),
    }),

  createProductVariant: (
    productId: number,
    size: string,
    color: string,
    stock: number,
    requestedBy: string
  ): Promise<{ variantId: number }> =>
    request(`/api/admin/products/${productId}/variants`, {
      method: "POST",
      body: JSON.stringify({ size, color, stock, requestedBy }),
    }),

  adjustStock: (
    variantId: number,
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
  ): Promise<{ customerId: number }> =>
    request("/api/customers", {
      method: "POST",
      body: JSON.stringify({ ...data, requestedBy }),
    }),

  // ─── Orders ─────────────────────────────────────────────────────────────────

  createOrder: (
    customerId: number,
    shippingAddressLine1: string,
    shippingCity: string,
    shippingCountry: string,
    contactPhone: string,
    requestedBy: string,
    items: { productVariantId: number; quantity: number }[]
  ): Promise<{ orderId: number }> =>
    request("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        customerId,
        shippingAddressLine1,
        shippingCity,
        shippingCountry,
        contactPhone,
        requestedBy,
        items,
      }),
    }),

  addOrderItem: (
    orderId: number,
    productId: number,
    productVariantId: number,
    quantity: number,
    requestedBy: string
  ): Promise<void> =>
    request(`/api/orders/${orderId}/items`, {
      method: "POST",
      body: JSON.stringify({ productId, productVariantId, quantity, requestedBy }),
    }),

  submitOrder: (orderId: number, requestedBy: string): Promise<void> =>
    request(`/api/orders/${orderId}/submit`, {
      method: "POST",
      body: JSON.stringify({ requestedBy }),
    }),

  getOrderById: (id: number): Promise<OrderDto> =>
    request<OrderDto>(`/api/orders/${id}`),
};
