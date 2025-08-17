import React from "react";
import { View } from "react-native";

export default function SkeletonCard({ width }: { width?: number }) {
  const cardWidth = width ?? 360;
  const imgHeight = Math.max(180, Math.round(cardWidth * 0.52));
  return (
    <View style={{ width: cardWidth, backgroundColor: "#fff", borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: "#e5e7eb" }}>
      <View style={{ width: "100%", height: imgHeight, backgroundColor: "#e5e7eb" }} />
      <View style={{ padding: 14 }}>
        <View style={{ height: 12, backgroundColor: "#e5e7eb", borderRadius: 6, marginBottom: 10 }} />
        <View style={{ height: 12, backgroundColor: "#e5e7eb", borderRadius: 6, width: "60%" }} />
      </View>
    </View>
  );
}
