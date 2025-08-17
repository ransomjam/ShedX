import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://backendshedx-production.up.railway.app";

type Product = {
  id: string;
  title: string;
  price: number;
};

async function fetchProducts() {
  const res = await fetch(`${API_URL}/api/products`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export default function ProductsScreen() {
  const navigation = useNavigation<any>();
  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading…</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Failed to load products.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("ProductDetails", { id: item.id })}
          style={{
            padding: 12,
            backgroundColor: "#fff",
            borderRadius: 12,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: "#eee",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.title}</Text>
          {item.price != null && (
            <Text style={{ fontSize: 14, marginTop: 4, color: "#444" }}>
              FCFA {Number(item.price).toLocaleString()}
            </Text>
          )}
        </TouchableOpacity>
      )}
    />
  );
}
