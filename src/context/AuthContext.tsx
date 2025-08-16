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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const rawUser = await SecureStore.getItemAsync(KEY_USER);
        if (rawUser) setUser(JSON.parse(rawUser));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (username: string, password: string) => {
    const u = await loginAPI(username, password);
    setUser(u);
    await SecureStore.setItemAsync(KEY_USER, JSON.stringify(u));
  };

  const register = async (input: RegisterInput) => {
    const u = await registerAPI(input);
    setUser(u);
    await SecureStore.setItemAsync(KEY_USER, JSON.stringify(u));
  };

  const logout = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync(KEY_USER);
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
