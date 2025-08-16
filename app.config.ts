import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  name: config.name ?? "ProList",
  slug: config.slug ?? "prolist",
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "https://backendshedx-production.up.railway.app",
  },
});
