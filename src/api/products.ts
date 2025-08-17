import Constants from 'expo-constants';

const API_URL: string =
  (Constants?.expoConfig?.extra?.apiUrl as string) ||
  // @ts-ignore - legacy Expo Go
  (Constants?.manifest?.extra?.apiUrl as string) ||
  'https://backendshedx-production.up.railway.app';

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/api/products`);
  if (!res.ok) throw new Error(`Failed to load products: ${res.status}`);
  const json = await res.json();
  return json?.products || json || [];
}

export async function fetchProductById(id: string) {
  const res = await fetch(`${API_URL}/api/products/${id}`);
  if (!res.ok) throw new Error(`Failed to load product ${id}: ${res.status}`);
  return res.json();
}

export async function searchProducts(q: string) {
  const res = await fetch(`${API_URL}/api/products?search=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error(`Failed search: ${res.status}`);
  const json = await res.json();
  return json?.products || json || [];
}
