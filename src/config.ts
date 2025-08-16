/**
 * Central API URL for the app.
 * Reads from EXPO_PUBLIC_API_URL at runtime.
 * Appends /api if missing.
 */
const raw = process.env.EXPO_PUBLIC_API_URL || "https://YOUR-RAILWAY-API.example.com";
export const API_URL = raw.endsWith("/api") ? raw : (raw.replace(/\/$/, "") + "/api");
