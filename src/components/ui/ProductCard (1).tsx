import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { colors, radii, spacing } from "../../theme";
import { shadow } from "../../utils/shadow";
import VerificationBadge from "./VerificationBadge";
import type { Product } from "../../services/api";

export default function ProductCard({ product, onPress }: { product: Product; onPress?: () => void; }) {
  return (
    <TouchableOpacity onPress={onPress} style={[{ backgroundColor: colors.card, borderRadius: radii.lg, borderWidth: 1,
      borderColor: colors.border, overflow: "hidden" }, shadow(1)]}>
      {product.imageUrl ? <Image source={{ uri: product.imageUrl }} style={{ width: "100%", height: 160 }} /> : <View style={{ width:"100%", height:160, backgroundColor:"#eef2f7" }} />}
      <View style={{ padding: spacing.md }}>
        <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
          <Text numberOfLines={1} style={{ fontWeight:"800", fontSize:16, color: colors.text }}>{product.title}</Text>
          <VerificationBadge level={product.vendor?.verificationStatus} />
        </View>
        <Text style={{ marginTop: 6, color: colors.muted }} numberOfLines={1}>{product.location}</Text>
        <Text style={{ marginTop: 8, fontWeight:"800", color: colors.text }}>{product.price}</Text>
      </View>
    </TouchableOpacity>
  );
}
