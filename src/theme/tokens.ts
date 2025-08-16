export const colors = {
  primary: "#2563eb",
  primary600: "#1d4ed8",
  accent: "#f97316",
  bg: "#f8fafc",
  card: "#ffffff",
  border: "#e5e7eb",
  text: "#0f172a",
  muted: "#64748b",
  success: "#16a34a",
  warning: "#f59e0b",
  danger: "#ef4444",
};

export const spacing = { xs:4, sm:8, md:12, lg:16, xl:24, "2xl":32 };
export const radii   = { xs:6, sm:10, md:14, lg:20, xl:28, pill:999 };

export const typography = {
  h1: { fontSize: 24, fontWeight: "800" as const, color: colors.text },
  h2: { fontSize: 20, fontWeight: "700" as const, color: colors.text },
  p:  { fontSize: 14, color: colors.text },
  muted: { fontSize: 13, color: colors.muted },
};
