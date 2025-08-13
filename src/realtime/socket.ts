import { io, Socket } from "socket.io-client";
import { API_URL } from "@/config";
import * as SecureStore from "expo-secure-store";

/**
 * Creates/returns a singleton Socket.IO connection.
 * Uses API_URL as base and swaps http(s) -> ws(s).
 */
let socket: Socket | null = null;

function makeWsUrl(baseHttp: string) {
  if (baseHttp.startsWith("https://")) return baseHttp.replace("https://", "wss://");
  if (baseHttp.startsWith("http://")) return baseHttp.replace("http://", "ws://");
  return baseHttp;
}

export async function getSocket(): Promise<Socket> {
  if (socket && socket.connected) return socket;
  const token = await SecureStore.getItemAsync("token");
  const url = makeWsUrl(API_URL);
  socket = io(url, {
    path: "/socket.io",
    transports: ["websocket"],
    extraHeaders: token ? { Authorization: `Bearer ${token}` } : undefined
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
