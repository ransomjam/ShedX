import { API_URL } from "../../config";
import { getToken } from "../auth/token";

const BASE = (API_URL || "").replace(/\/$/, "");

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as any || {}),
  };
  const token = await getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(BASE + path, { ...options, headers });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || res.statusText || "Request failed";
    const err: any = new Error(msg);
    (err as any).status = res.status;
    (err as any).data = data;
    throw err;
  }
  return data;
}

export const api = {
  get: (path: string, init: RequestInit = {}) => request(path, { method: "GET", ...init }),
  post: (path: string, body?: any, init: RequestInit = {}) =>
    request(path, { method: "POST", body: JSON.stringify(body ?? {}), ...init }),
};

export default api;
