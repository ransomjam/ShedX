import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://backendshedx-production.up.railway.app";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency?: string;
  images?: string[];
  category?: string;
  vendor?: { id: string; name: string; avatarUrl?: string };
};

async function fetchJSON(path: string) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

function useProduct(productId: string) {
  return useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => fetchJSON(`/api/products/${productId}`),
  });
}

function useVendorProducts(vendorId?: string) {
  return useQuery<Product[]>({
    queryKey: ["vendor-products", vendorId],
    queryFn: () => fetchJSON(`/api/vendors/${vendorId}/products`),
    enabled: !!vendorId,
  });
}

function useSimilar(category?: string, productId?: string) {
  return useQuery<Product[]>({
    queryKey: ["similar", category],
    queryFn: () => fetchJSON(`/api/products?category=${encodeURIComponent(category || "")}&limit=8`),
    enabled: !!category,
    select: (items) => (productId ? items.filter((p:any) => String(p.id) !== String(productId)) : items),
  });
}

export default function ProductDetails() {
  const params = useLocalSearchParams<{ id?: string }>();
  const navigation = useNavigation<any>();
  const id = String(params?.id || "");
  const { data, isLoading, error } = useProduct(id);

  const vendorId = data?.vendor?.id;
  const { data: vendorProducts } = useVendorProducts(vendorId);
  const { data: similar } = useSimilar(data?.category, id);

  React.useEffect(() => {
    if (data?.title) navigation.setOptions({ title: data.title });
  }, [data?.title]);

  if (isLoading) {
    return (
      <View style={{ flex:1, alignItems:"center", justifyContent:"center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Could not load this product.</Text>
      </View>
    );
  }

  const currency = data.currency || "XAF";

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Gallery */}
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {(data.images && data.images.length ? data.images : [undefined]).map((src, idx) => (
          <View key={idx} style={{ width: "100%", aspectRatio: 1, backgroundColor: "#f2f2f2", alignItems:"center", justifyContent:"center" }}>
            {src ? (
              <Image source={{ uri: src }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
            ) : (
              <Ionicons name="image" size={64} />
            )}
          </View>
        ))}
      </ScrollView>

      {/* Title & Price */}
      <View style={{ padding: 16, gap: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: "700" }}>{data.title}</Text>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>
          {currency} {Number(data.price).toLocaleString()}
        </Text>
      </View>

      {/* Vendor */}
      <TouchableOpacity
        style={{ marginHorizontal: 16, padding: 12, borderRadius: 16, backgroundColor: "#fafafa", flexDirection: "row", alignItems: "center", gap: 12 }}
        onPress={() => navigation.navigate("VendorProfile" as never, { id: vendorId } as never)}
      >
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#e9e9e9", alignItems:"center", justifyContent:"center" }}>
          <Ionicons name="person" size={20} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "600" }}>{data.vendor?.name || "Vendor"}</Text>
          <Text style={{ color: "#666" }}>Tap to view vendor profile</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} />
      </TouchableOpacity>

      {/* Actions */}
      <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: 16, marginTop: 12 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Chat" as never, { toVendorId: vendorId, productId: id } as never)}
          style={{ flex: 1, backgroundColor: "#111", padding: 14, borderRadius: 16, alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Chat with Seller</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {/* bookmark local state - integrate later */}}
          style={{ width: 56, alignItems:"center", justifyContent:"center", borderRadius: 16, borderWidth: 1, borderColor: "#ddd" }}
        >
          <Ionicons name="bookmark-outline" size={22} />
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, lineHeight: 22, color: "#222" }}>{data.description || "No description provided."}</Text>
      </View>

      {/* Other products by vendor */}
      {vendorProducts?.length ? (
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>More from this vendor</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {vendorProducts.map((p) => (
              <TouchableOpacity
                key={p.id}
                onPress={() => navigation.push("ProductDetails" as never, { id: p.id } as never)}
                style={{ width: 220, borderWidth: 1, borderColor: "#eee", borderRadius: 16, overflow: "hidden" }}
              >
                <View style={{ width: "100%", aspectRatio: 16/9, backgroundColor: "#f2f2f2", alignItems:"center", justifyContent:"center" }}>
                  {p.images?.[0] ? (
                    <Image source={{ uri: p.images[0] }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                  ) : (
                    <Ionicons name="image" size={32} />
                  )}
                </View>
                <View style={{ padding: 10 }}>
                  <Text numberOfLines={1} style={{ fontWeight: "600" }}>{p.title}</Text>
                  <Text style={{ color: "#333", marginTop: 4 }}>{(p.currency || "XAF")} {Number(p.price).toLocaleString()}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {/* Similar listings */}
      {similar?.length ? (
        <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>Similar listings</Text>
          <View style={{ rowGap: 12 }}>
            {similar.map((p) => (
              <TouchableOpacity
                key={p.id}
                onPress={() => navigation.push("ProductDetails" as never, { id: p.id } as never)}
                style={{ borderWidth: 1, borderColor: "#eee", borderRadius: 16, overflow: "hidden" }}
              >
                <View style={{ width: "100%", aspectRatio: 16/9, backgroundColor: "#f2f2f2", alignItems:"center", justifyContent:"center" }}>
                  {p.images?.[0] ? (
                    <Image source={{ uri: p.images[0] }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                  ) : (
                    <Ionicons name="image" size={32} />
                  )}
                </View>
                <View style={{ padding: 10 }}>
                  <Text numberOfLines={1} style={{ fontWeight: "600" }}>{p.title}</Text>
                  <Text style={{ color: "#333", marginTop: 4 }}>{(p.currency || "XAF")} {Number(p.price).toLocaleString()}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}
