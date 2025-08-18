import React, { useMemo, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { listProductsWithVendorsAPI, Product } from "../services/api";
import { colors, spacing, typography } from "../theme";
import ProductCard from "../components/ProductCard";

function prettyCategory(key?: string) {
  if (!key) return "Other";
  const map: Record<string, string> = {
    electronics: "Electronics",
    gadgets: "Gadgets",
    phones: "Phones",
    phone: "Phones",
    laptops: "Laptops",
    laptop: "Laptops",
    computers: "Computers",
    fashion: "Fashion",
    beauty: "Beauty",
    home_office: "Home & Office",
    home: "Home",
    furniture: "Furniture",
    vehicles: "Vehicles",
    real_estate: "Real Estate",
    services: "Services",
    groceries: "Groceries",
  };
  return map[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function ListingsScreen() {
  const nav = useNavigation<any>();
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["listings", "withVendors"],
    queryFn: listProductsWithVendorsAPI,
  });

  const products: Product[] = data?.products ?? [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p: any) => p?.category && set.add(p.category));
    return ["all", ...Array.from(set)];
  }, [products]);

  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    if (category === "all") return products;
    return products.filter((p: any) => (p?.category ?? "").toLowerCase() === category.toLowerCase());
  }, [products, category]);

  const renderItem = ({ item }: { item: Product }) => {
    const withImage = { ...item, imageUrl: item.imageUrl ?? (item as any).imageUrls?.[0] };
    return (
      <View style={{ width: "48%" }}>
        <ProductCard product={withImage} onPress={() => nav.navigate("ProductDetails", { id: item.id })} />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header title */}
      <View style={{ padding: spacing.lg }}>
        <Text style={{ ...typography.h2 }}>Explore Listings</Text>
        <Text style={{ marginTop: 4, color: colors.muted }}>Browse items across categories from verified vendors.</Text>
      </View>

      {/* Categories pills (horizontal) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
        style={{ marginBottom: spacing.md }}
      >
        {categories.map((c) => {
          const active = c === category;
          return (
            <TouchableOpacity
              key={c}
              onPress={() => setCategory(c)}
              style={{
                borderWidth: 1,
                borderColor: active ? colors.primary : "#e5e7eb",
                backgroundColor: active ? colors.primary : "white",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 999,
                marginRight: 8,
              }}
            >
              <Text style={{ color: active ? "white" : colors.text, fontWeight: "700" }}>
                {c === "all" ? "All" : prettyCategory(c)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Grid */}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.lg }}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: spacing.lg }}
        numColumns={2}
        refreshing={isFetching}
        onRefresh={refetch}
        data={filtered}
        keyExtractor={(p: Product) => String(p.id)}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={{ padding: spacing.lg }}>
            <Text style={{ color: colors.muted }}>No listings found.</Text>
          </View>
        )}
      />
    </View>
  );
}
