import React from 'react';
import { StatusBar } from 'expo-status-bar';
import QueryProvider from './src/providers/Query';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </AuthProvider>
    </QueryProvider>
  );
}
