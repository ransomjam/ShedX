const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "https://backendshedx-production.up.railway.app";

type Options = {
  token?: string | null;
  headers?: Record<string, string>;
  body?: any;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
};

async function request<T = any>(path: string, opts: Options = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Accept": "application/json",
    ...(opts.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(opts.headers ?? {}),
  };
  if (opts.token) headers["Authorization"] = `Bearer ${opts.token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body instanceof FormData ? opts.body : opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* keep text */ data = text; }

  if (!res.ok) {
    const msg = typeof data === "string" ? data : data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export const api = {
  get: <T = any>(path: string, token?: string | null) => request<T>(path, { token, method: "GET" }),
  post: <T = any>(path: string, body?: any, token?: string | null) => request<T>(path, { token, method: "POST", body }),
  put:  <T = any>(path: string, body?: any, token?: string | null) => request<T>(path, { token, method: "PUT", body }),
  patch:<T = any>(path: string, body?: any, token?: string | null) => request<T>(path, { token, method: "PATCH", body }),
  delete:<T = any>(path: string, token?: string | null) => request<T>(path, { token, method: "DELETE" }),
};

export default api;
