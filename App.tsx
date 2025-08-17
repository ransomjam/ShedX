import React from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";     // your auth
import { QueryProvider } from "./src/state/query";             // React Query provider
import { SocketProvider } from "./src/socket/SocketProvider";  // Socket.IO
import { UIProvider } from "./src/context/UIContext";          // Badges (messages/notifications/saved)

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <SocketProvider>
          <UIProvider>
            <StatusBar style="auto" />
            <AppNavigator />
          </UIProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
