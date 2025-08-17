import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, DeviceEventEmitter, Alert, useWindowDimensions } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OptimizedProductCard from "../components/OptimizedProductCard";
import SkeletonCard from "../components/SkeletonCard";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

const DEFAULT_CATEGORIES = ["All","Electronics","Fashion","Phones","Home & Garden","Sports","Books","Automotive","Services"];

export default function ListingsScreen({ navigation }: any) {
  const route = useRoute<any>();
  const initialCategory = route?.params?.category as string | undefined;
  const [category, setCategory] = useState<string>(initialCategory || "All");
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { width } = useWindowDimensions();

  const horizontalPadding = 16;
  const gap = 12;
  const numColumns = 1;
  const cardWidth = Math.floor(width - horizontalPadding * 2);

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: api.listProducts,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const flag = await AsyncStorage.getItem("product_added");
        if (flag) {
          await AsyncStorage.removeItem("product_added");
          queryClient.invalidateQueries({ queryKey: ["products"] });
        }
      })();
    }, [])
  );

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener("product_added", () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    });
    return () => sub.remove();
  }, []);

  const productCategories = useMemo(
    () => Array.from(new Set((products || []).map((p: any) => p.category).filter(Boolean))),
    [products]
  );
  const categories = useMemo(
    () => Array.from(new Set([...DEFAULT_CATEGORIES, ...productCategories])),
    [productCategories]
  );

  const filteredProducts = useMemo(
    () => (category === "All" ? products : (products || []).filter((p: any) => p.category === category)),
    [products, category]
  );

  const handleYourPrice = (id: number | string) => {
    // Navigate to details with 'offer' mode (placeholder for your pricing flow)
    navigation.navigate("ProductDetails", { productId: id, mode: "offer" });
  };

  const Empty = () => (
    <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 48, paddingHorizontal: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "800", color: "#1e293b", marginBottom: 8 }}>No listings found</Text>
      <Text style={{ color: "#64748b", textAlign: "center", marginBottom: 16 }}>
        {category === "All"
          ? "No products have been listed yet. Be the first to add a listing!"
          : `No products found in the ${category} category.`}
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("AddListing")}
        style={{ backgroundColor: "#2563eb", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 }}
      >
        <Text style={{ color: "#fff", fontWeight: "800" }}>Add Your First Listing</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: horizontalPadding }}>
      <Text style={{ fontSize: 24, fontWeight: "900", color: "#2563eb", marginBottom: 12 }}>Explore Listings</Text>

      <FlatList
        data={categories}
        keyExtractor={(c) => String(c)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
        renderItem={({ item: cat }) => {
          const active = category === cat;
          const count = cat !== "All" ? filteredProducts.filter((p: any) => p.category === cat).length : 0;
          return (
            <TouchableOpacity onPress={() => { setCategory(cat); navigation.setParams?.({ category: cat }); }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: active ? "#2563eb" : "#e5e7eb",
                  backgroundColor: active ? "#2563eb" : "#e5e7eb33",
                  marginRight: 8,
                }}
              >
                <Text style={{ fontWeight: "700", color: active ? "#fff" : "#334155" }}>{cat}</Text>
                {cat !== "All" ? (
                  <Text style={{ marginLeft: 6, color: active ? "#e5edff" : "#64748b" }}>({count})</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {isLoading ? (
        <FlatList
          data={[1, 2, 3, 4]}
          keyExtractor={(i) => String(i)}
          numColumns={numColumns}
          ItemSeparatorComponent={() => <View style={{ height: gap }} />}
          renderItem={() => <SkeletonCard width={cardWidth} />}
        />
      ) : isError ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#ef4444" }}>Could not load listings. Pull to refresh or try again later.</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <Empty />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => String(item.id)}
          numColumns={numColumns}
          ItemSeparatorComponent={() => <View style={{ height: gap }} />}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={({ item }) => (
            <OptimizedProductCard
              product={item}
              currentUserId={user?.id}
              onBid={handleYourPrice}
              width={cardWidth}
            />
          )}
        />
      )}
    </View>
  );
}
