import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { api } from "../api/client";

type Product = { id: string; title: string; price?: number };

export default function ProductsScreen() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get("/products?limit=10");
        setItems(data.items || data);
      } catch (e: any) {
        setError(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <View style={{ flex:1, alignItems:"center", justifyContent:"center" }}><ActivityIndicator size="large" /></View>;
  if (error) return <View style={{ padding:16 }}><Text style={{ color: "red" }}>{error}</Text></View>;

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={items}
      keyExtractor={(i) => String(i.id)}
      renderItem={({ item }) => (
        <View style={{ padding: 12, backgroundColor: "#fff", borderRadius: 12, marginBottom: 10 }}>
          <Text style={{ fontWeight: "700" }}>{item.title}</Text>
          {item.price != null && <Text>FCFA {Number(item.price).toLocaleString()}</Text>}
        </View>
      )}
      ListEmptyComponent={<Text style={{ textAlign: "center", color: "#777" }}>No products.</Text>}
    />
  );
}
