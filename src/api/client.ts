import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function getToken(): Promise<string | null> {
  try { return await SecureStore.getItemAsync('shedx_token'); } catch { return null; }
}

async function request(path: string, method: HttpMethod = 'GET', body?: any) {
  const token = await getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const url = `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
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
  login: (email: string, password: string) => request('/auth/login', 'POST', { email, password }),
  me: () => request('/users/me', 'GET'),

  // Products
  listProducts: () => request('/products', 'GET'),
  getProduct: (id: number | string) => request(`/products/${id}`, 'GET'),
  searchProducts: (q: string) => request(`/products/search?q=${encodeURIComponent(q)}`, 'GET'),

  // Vendors
  getVendor: (id: string | number) => request(`/vendors/${id}`, 'GET'),
  getVendorProducts: (id: string | number) => request(`/vendors/${id}/products`, 'GET'),

  // Categories (optional endpoint; fallback client-side)
  listCategories: () => request('/products/categories', 'GET'),
};
