export default {
  name: "ProListMobile",
  slug: "prolist-mobile",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  updates: { fallbackToCacheTimeout: 0 },
  assetBundlePatterns: ["**/*"],
  ios: { supportsTablet: true },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    }
  },
  web: { favicon: "./assets/favicon.png" },
  plugins: [
    ["expo-notifications", { icon: "./assets/icon.png", color: "#ffffff", sounds: [] }],
    "expo-secure-store"
  ],
  extra: { apiUrl: process.env.EXPO_PUBLIC_API_URL }
};
