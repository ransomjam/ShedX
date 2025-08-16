import React from "react";
import { Text, View } from "react-native";
import { colors, radii } from "../../theme";

export default function Badge({ label, tone="info" }: { label: string; tone?: "info"|"success"|"warning"|"danger"; }) {
  const map = {
    info:    { bg:"#eef2ff", fg: colors.primary },
    success: { bg:"#ecfdf5", fg: colors.success },
    warning: { bg:"#fffbeb", fg: colors.warning },
    danger:  { bg:"#fef2f2", fg: colors.danger },
  } as const;

  return (
    <View style={{ alignSelf: "flex-start", backgroundColor: map[tone].bg, borderRadius: radii.pill, paddingVertical: 4, paddingHorizontal: 10 }}>
      <Text style={{ color: map[tone].fg, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}
