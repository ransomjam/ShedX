import React from "react";
import { View, Text } from "react-native";

export default function ProductMeta({ label, value }: { label: string; value?: string | number }) {
  if (!value && value !== 0) return null;
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}>
      <Text style={{ color: "#666" }}>{label}</Text>
      <Text style={{ fontWeight: "600" }}>{String(value)}</Text>
    </View>
  );
}
