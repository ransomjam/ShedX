import React from "react";
import { View, Text } from "react-native";

export default function StatusBadge({ status }: { status: string }) {
  const color = (() => {
    switch (status) {
      case "pending": return "#ffcc00";
      case "confirmed": return "#4da6ff";
      case "shipped": return "#7c4dff";
      case "delivered": return "#22c55e";
      case "cancelled": return "#ef4444";
      default: return "#d4d4d4";
    }
  })();

  return (
    <View style={{ alignSelf: "flex-start", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999, backgroundColor: color + "33" }}>
      <Text style={{ color, fontWeight: "600", fontSize: 12 }}>{status}</Text>
    </View>
  );
}
