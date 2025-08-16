import React from "react";
import { Text, TouchableOpacity, ActivityIndicator, ViewStyle } from "react-native";
import { colors, radii, typography } from "../../theme";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export default function Button({
  title, onPress, loading, variant="primary", size="md", style,
}: { title: string; onPress?: () => void; loading?: boolean; variant?: Variant; size?: Size; style?: ViewStyle }) {
  const paddings = { sm:10, md:14, lg:18 }[size];
  const base: ViewStyle = { borderRadius: radii.sm, alignItems: "center", justifyContent: "center", paddingVertical: paddings, paddingHorizontal: paddings + 6 };
  const theme: Record<Variant, ViewStyle> = {
    primary: { backgroundColor: colors.primary },
    outline: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.border },
    ghost:   { backgroundColor: "transparent" },
  };
  const textColor = variant === "primary" ? "#fff" : colors.text;

  return (
    <TouchableOpacity onPress={onPress} disabled={loading} style={[base, theme[variant], style]}>
      {loading ? <ActivityIndicator color={textColor} /> : <Text style={{ ...typography.p, color: textColor, fontWeight: "700" }}>{title}</Text>}
    </TouchableOpacity>
  );
}
