import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { radii } from "../../theme";

export default function VerificationBadge({ level }: { level?: string }) {
  if (!level || level === "none") return null;
  const isPremium = level === "premium_verified";
  const bg = isPremium ? "#fff7ed" : "#ecfeff";
  const fg = isPremium ? "#b45309" : "#0e7490";
  const icon = isPremium ? "award" : "check-circle";
  const label = isPremium ? "Premium" : "Verified";

  return (
    <View style={{ flexDirection: "row", gap: 6, backgroundColor: bg, borderRadius: radii.pill, paddingVertical: 4, paddingHorizontal: 8, alignItems: "center" }}>
      <Feather name={icon as any} size={14} color={fg} />
      <Text style={{ color: fg, fontSize: 12, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}
