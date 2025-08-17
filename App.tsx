import React from 'react';
import { StatusBar } from 'expo-status-bar';
import QueryProvider from './src/providers/Query';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <QueryProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </QueryProvider>
  );
}
