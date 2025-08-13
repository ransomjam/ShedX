import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  price: number;
  image?: string;
  onPress: () => void;
};

export default function ProductCard({ title, price, image, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={{ backgroundColor: "#fff", borderRadius: 12, overflow: "hidden" }}>
      {image ? (
        <Image source={{ uri: image }} style={{ width: "100%", height: 160 }} />
      ) : (
        <View style={{ width: "100%", height: 160, backgroundColor: "#eee" }} />
      )}
      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>{title}</Text>
        <Text style={{ marginTop: 6, fontSize: 15 }}>FCFA {price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
}
