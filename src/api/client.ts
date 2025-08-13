import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/config";

const client = axios.create({
  baseURL: API_URL,
  timeout: 15000
});

client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
