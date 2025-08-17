import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://backendshedx-production.up.railway.app';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function getToken(): Promise<string | null> {
  try { return await SecureStore.getItemAsync('shedx_token'); } catch { return null; }
}

async function request(path: string, method: HttpMethod = 'GET', body?: any) {
  const token = await getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json: any;
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }

  if (!res.ok) {
    const msg = (json && (json.message || json.error)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

export const api = {
  // Auth
  login: (email: string, password: string) => request('/api/auth/login', 'POST', { email, password }),
  me: () => request('/api/users/me', 'GET'),

  // Products
  listProducts: () => request('/api/products', 'GET'),
  getProduct: (id: number | string) => request(`/api/products/${id}`, 'GET'),
  searchProducts: (q: string) => request(`/api/products/search?q=${encodeURIComponent(q)}`, 'GET'),

  // Vendors
  getVendor: (id: string | number) => request(`/api/vendors/${id}`, 'GET'),
  getVendorProducts: (id: string | number) => request(`/api/vendors/${id}/products`, 'GET'),

  // Categories (optional endpoint; fallback client-side)
  listCategories: () => request('/api/products/categories', 'GET'),
};
