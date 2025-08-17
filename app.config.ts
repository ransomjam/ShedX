import 'dotenv/config';
import { ExpoConfig } from 'expo/config';

export default ({ config }: { config: ExpoConfig }) => ({
  ...config,
  name: config.name ?? "ProList Mobile",
  slug: config.slug ?? "prolist-mobile",
  owner: "ransomjam", // ✅ your Expo username

  runtimeVersion: { policy: "sdkVersion" },
  updates: {
    url: "https://u.expo.dev/a3d3851e-c6c3-4aa2-8c44-7f4b3e084596", // ✅ your EAS Project ID
    fallbackToCacheTimeout: 0,
  },

  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "https://backendshedx-production.up.railway.app",
    eas: {
      projectId: "a3d3851e-c6c3-4aa2-8c44-7f4b3e084596", // ✅ same EAS Project ID
    },
  },

  scheme: "prolist",
  version: "1.0.0",
  orientation: "portrait",

  assetBundlePatterns: ["**/*"],

  ios: { supportsTablet: true },
  android: { package: "com.prolist.app" },
  web: { bundler: "metro" },
});
