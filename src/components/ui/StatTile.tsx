import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, radii, spacing } from "../../theme";
import { shadow } from "../../utils/shadow";

export default function StatTile({ icon, value, label }: { icon: React.ComponentProps<typeof Feather>["name"]; value: string; label: string; }) {
  return (
    <View style={[{ backgroundColor: colors.card, borderRadius: radii.md, padding: spacing.lg, flex:1, alignItems:"center",
      borderColor: colors.border, borderWidth: 1 }, shadow(1)]}>
      <Feather name={icon} size={22} color={colors.primary} />
      <Text style={{ marginTop: 8, fontSize: 20, fontWeight: "800" }}>{value}</Text>
      <Text style={{ marginTop: 4, color: colors.muted }}>{label}</Text>
    </View>
  );
}
