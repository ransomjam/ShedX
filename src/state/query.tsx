import React from "react";
import { QueryClient, QueryClientProvider, focusManager } from "@tanstack/react-query";
import { AppState } from "react-native";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 mins
      gcTime: 1000 * 60 * 30,   // 30 mins
    },
  },
});

focusManager.setEventListener((handleFocus) => {
  const sub = AppState.addEventListener("change", (state) => {
    handleFocus(state === "active");
  });
  return () => sub.remove();
});

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
