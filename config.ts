/**
 * Project-root config used by src/api/client.ts via "../../config"
 * Reads the backend URL from EXPO_PUBLIC_API_URL and ensures it ends with /api.
 */
// @ts-ignore: process.env available at build/start time for Expo
const raw = process.env.EXPO_PUBLIC_API_URL || "";
export const API_URL = raw.endsWith("/api") ? raw : (raw.replace(/\/$/, "") + "/api");
