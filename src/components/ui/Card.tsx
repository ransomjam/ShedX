import React from "react";
import { View, ViewStyle } from "react-native";
import { colors, radii, spacing } from "../../theme";
import { shadow } from "../../utils/shadow";

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View style={[{ backgroundColor: colors.card, borderRadius: radii.lg, padding: spacing.lg, borderColor: colors.border, borderWidth: 1 }, shadow(1), style]}>
      {children}
    </View>
  );
}
