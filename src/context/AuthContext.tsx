import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { loginAPI, registerAPI, RegisterInput, User } from "../services/api";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

const KEY_USER = "prolist_user";
const KEY_TOKEN = "shedx_token"; // keep in sync with api/client.ts

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session quickly; never hang
  useEffect(() => {
    let cancelled = false;
    const safety = setTimeout(() => !cancelled && setLoading(false), 3000); // safety valve

    (async () => {
      try {
        const raw = await SecureStore.getItemAsync(KEY_USER);
        if (raw) {
          try { setUser(JSON.parse(raw)); } catch { /* ignore parse */ }
        }
      } catch { /* ignore */ }
      finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; clearTimeout(safety); };
  }, []);

  const login = async (username: string, password: string) => {
    const res = await loginAPI(username, password);
    // Expect res.user and res.token (adapt if your API differs)
    const token = (res as any).token || (res as any).accessToken || "";
    const u = (res as any).user || res as any;
    if (token) await SecureStore.setItemAsync(KEY_TOKEN, String(token));
    await SecureStore.setItemAsync(KEY_USER, JSON.stringify(u));
    setUser(u);
  };

  const register = async (input: RegisterInput) => {
    const res = await registerAPI(input);
    const token = (res as any).token || (res as any).accessToken || "";
    const u = (res as any).user || res as any;
    if (token) await SecureStore.setItemAsync(KEY_TOKEN, String(token));
    await SecureStore.setItemAsync(KEY_USER, JSON.stringify(u));
    setUser(u);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(KEY_TOKEN);
    await SecureStore.deleteItemAsync(KEY_USER);
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
