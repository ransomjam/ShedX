import React from "react";
import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import { colors, spacing, typography } from "../../theme";

export default function SectionHeader({ title, subtitle, actionLabel, onAction, style }:
  { title: string; subtitle?: string; actionLabel?: string; onAction?: () => void; style?: ViewStyle }) {
  return (
    <View style={[{ paddingHorizontal: spacing.lg, marginBottom: spacing.md }, style]}>
      <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
        <Text style={typography.h2}>{title}</Text>
        {actionLabel ? <TouchableOpacity onPress={onAction}><Text style={{ color: colors.primary, fontWeight:"700" }}>{actionLabel}</Text></TouchableOpacity> : null}
      </View>
      {subtitle ? <Text style={{ marginTop: 4, ...typography.muted }}>{subtitle}</Text> : null}
    </View>
  );
}
