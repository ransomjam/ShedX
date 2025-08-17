import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";
import * as SecureStore from "expo-secure-store";

type Ctx = { socket: Socket | null };
const SocketCtx = createContext<Ctx>({ socket: null });

const SOCKET_URL =
  process.env.EXPO_PUBLIC_SOCKET_URL ||
  process.env.EXPO_PUBLIC_API_URL ||
  "http://localhost:3000";

async function getToken() {
  try { return await SecureStore.getItemAsync("shedx_token"); } catch { return null; }
}

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let s: Socket | null = null;
    let mounted = true;

    (async () => {
      const token = await getToken();
      s = io(SOCKET_URL, {
        transports: ["websocket"],
        path: "/socket.io",
        autoConnect: true,
        reconnection: true,
        auth: token ? { token } : undefined,
      });
      s.on("connect", () => mounted && setSocket(s!));
      return () => { s?.removeAllListeners(); s?.disconnect(); };
    })();

    return () => { mounted = false; s?.disconnect(); };
  }, []);

  const value = useMemo(() => ({ socket }), [socket]);
  return <SocketCtx.Provider value={value}>{children}</SocketCtx.Provider>;
};

export const useSocket = () => useContext(SocketCtx);
