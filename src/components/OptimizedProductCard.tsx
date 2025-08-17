import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  product: {
    id: number | string;
    title: string;
    description?: string;
    image?: string;
    imageUrls?: string[];
    price?: number;
    category?: string;
    location?: string;
    verified?: boolean;
    vendorVerified?: boolean;
    vendor?: { name?: string; avatarUrl?: string };
    ownerId?: number | string;
  };
  currentUserId?: number | string | null;
  onBid?: (id: number | string) => void; // reused for "Your Price"
  width?: number;
};

function stableInt(seed: any) {
  const s = String(seed ?? "");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function OptimizedProductCard({ product, currentUserId, onBid, width }: Props) {
  const nav = useNavigation<any>();
  const img = product.image || product.imageUrls?.[0] || "https://via.placeholder.com/600x400?text=No+Image";
  const verified = product.verified || product.vendorVerified;

  const numPrice = typeof product.price === "number" && !isNaN(product.price) ? product.price : undefined;
  const price = typeof numPrice === "number" ? `FCFA ${Number(numPrice).toLocaleString()}` : undefined;

  const seed = product.id ?? product.title ?? "seed";
  const base = stableInt(seed);
  const trust = 50 + (base % 50);
  const followers = 100 + (base % 900);

  const cardWidth = width ?? 360;
  const imgHeight = Math.max(180, Math.round(cardWidth * 0.52));

  return (
    <View style={{ width: cardWidth, backgroundColor: "#fff", borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: "#e5e7eb" }}>
      {/* Image + badges */}
      <View>
        <Image source={{ uri: img }} style={{ width: "100%", height: imgHeight }} />
        <View style={{ position: "absolute", top: 10, left: 10, flexDirection: "row" }}>
          {product.category ? (
            <View style={{ backgroundColor: "#111827cc", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, marginRight: 8 }}>
              <Text style={{ color: "#fff", fontSize: 12 }}>{product.category}</Text>
            </View>
          ) : null}
          {verified ? (
            <View style={{ backgroundColor: "#22c55ecc", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="shield-checkmark" size={14} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 12, marginLeft: 6 }}>Verified</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Body */}
      <View style={{ padding: 14 }}>
        <Text numberOfLines={1} style={{ fontWeight: "900", fontSize: 16 }}>{product.title}</Text>
        {!!product.description && (
          <Text numberOfLines={2} style={{ color: "#64748b", fontSize: 13, marginTop: 6 }}>{product.description}</Text>
        )}
        {!!price && <Text style={{ fontWeight: "900", marginTop: 8 }}>{price}</Text>}

        {/* Stats row */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginRight: 16 }}>
            <Ionicons name="star" size={16} color="#f59e0b" />
            <Text style={{ fontSize: 13, marginLeft: 6 }}>{trust}%</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginRight: 16 }}>
            <Ionicons name="people" size={16} color="#64748b" />
            <Text style={{ fontSize: 13, marginLeft: 6 }}>{followers}</Text>
          </View>
          {!!product.location && (
            <View style={{ flexDirection: "row", alignItems: "center", flexShrink: 1 }}>
              <Ionicons name="location-outline" size={16} color="#64748b" />
              <Text numberOfLines={1} style={{ fontSize: 13, color: "#64748b", marginLeft: 6 }}>
                {product.location}
              </Text>
            </View>
          )}
        </View>

        {/* Actions: View + Your Price */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
          <TouchableOpacity
            onPress={() => nav.navigate("ProductDetails", { id: product.id })}
            style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#0f172a", alignItems: "center", justifyContent: "center", flexDirection: "row" }}
          >
            <Ionicons name="eye-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 13 }}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onBid?.(product.id) ?? nav.navigate("ProductDetails", { id: product.id, mode: "offer" })}
            style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#2563eb", alignItems: "center", justifyContent: "center", flexDirection: "row", marginLeft: 12 }}
          >
            <Ionicons name="pricetags-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 13 }}>Your Price</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
