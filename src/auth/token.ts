import * as SecureStore from "expo-secure-store";

const KEY = "prolist_token";

export async function setToken(token: string) {
  await SecureStore.setItemAsync(KEY, token);
}

export async function getToken(): Promise<string | null> {
  try { return await SecureStore.getItemAsync(KEY); } catch { return null; }
}

export async function clearToken() {
  try { await SecureStore.deleteItemAsync(KEY); } catch {}
}
