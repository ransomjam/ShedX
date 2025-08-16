import { API_URL } from "../config/env";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any)?.message || `HTTP ${res.status}`);
  return data as T;
}

// ===== Types =====
export type User = {
  id: number;
  username: string;
  email?: string;
  role?: string;
  verificationStatus?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string | null;
  accountType?: string; // user | shop_owner | professional | real_estate | vendor | premium
  phone?: string;
  location?: string;
};

export type Product = {
  id: number;
  title: string;
  price: string;
  location: string;
  imageUrl?: string;
  imageUrls?: string[];
  vendor?: {
    id: number;
    username?: string;
    name?: string;
    verificationStatus?: "none" | "basic_verified" | "premium_verified";
    rating?: number;
    lastChecked?: string;
  };
};

// ===== API Calls aligned with ProList/server/routes.ts =====

// Login returns the user (no token)
export async function loginAPI(username: string, password: string) {
  return request<User>("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

// Register returns the user (no token)
export type RegisterInput = {
  username: string;
  email?: string;
  password: string;
  accountType?: string;
  specialization?: string;
  phone?: string;
  location?: string;
  profilePicture?: string | null; // base64
  businessName?: string;
  marketLocation?: string;
};
export async function registerAPI(input: RegisterInput) {
  return request<User>("/api/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// Products
export async function listProductsAPI() {
  return request<Product[]>("/api/products");
}

// Vendor products
export async function listVendorProductsAPI(vendorId: number) {
  return request<Product[]>(`/api/products/vendor/${vendorId}`);
}

// Top vendors (used on Home or discovery)
export async function getTopVendorsAPI() {
  return request<any[]>("/api/top-vendors");
}

// Get single product by ID
export async function getProductAPI(id: number) {
  return request<Product>(`/api/products/${id}`);
}

// Products with vendors (discovery grid like web)
export async function listProductsWithVendorsAPI() {
  return request<{ products: Product[]; pagination: { total: number; limit: number; hasMore: boolean } }>(`/api/products/with-vendors`);
}
