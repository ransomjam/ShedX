import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, radii, spacing } from "../../theme";

export default function IconButton({
  name, onPress, badge,
}: { name: React.ComponentProps<typeof Feather>["name"]; onPress?: () => void; badge?: number; }) {
  return (
    <View style={{ position: "relative" }}>
      <TouchableOpacity onPress={onPress} style={{ padding: spacing.sm, borderRadius: radii.sm }}>
        <Feather name={name} size={22} color={colors.text} />
      </TouchableOpacity>
      {badge ? (
        <View style={{ position: "absolute", top: 2, right: 2, minWidth: 16, height: 16, borderRadius: 8,
          backgroundColor: colors.danger, alignItems: "center", justifyContent: "center", paddingHorizontal: 3 }}>
          <Text style={{ color: "white", fontSize: 10, fontWeight: "800" }}>{badge}</Text>
        </View>
      ) : null}
    </View>
  );
}
