import React from "react";
import { View, Text, ImageBackground, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/useAuth";
import { useQuery } from "@tanstack/react-query";
import { listProductsAPI, Product } from "../services/api";
import { colors, spacing, typography } from "../theme";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const { user } = useAuth();
  const nav = useNavigation<any>();
  const { data = [] } = useQuery({ queryKey: ["homeProducts"], queryFn: listProductsAPI });

  return (
    <FlatList
      ListHeaderComponent={
        <View>
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60",
            }}
            style={{ padding: spacing.lg, paddingTop: spacing.xl }}
            imageStyle={{ borderBottomLeftRadius: spacing.lg, borderBottomRightRadius: spacing.lg }}
          >
            <Text style={{ ...typography.h2, color: "white" }}>Welcome back, {user?.name || ""}!</Text>
            <Text style={{ color: "white", marginTop: spacing.sm }}>
              Discover amazing deals, connect with local vendors, and explore Bamenda's vibrant marketplace ecosystem.
            </Text>
          </ImageBackground>

          <View
            style={{
              padding: spacing.lg,
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <QuickAction icon="cart-outline" label="Browse Products" onPress={() => nav.navigate("Listings")} />
            <QuickAction icon="hammer" label="Live Auctions" onPress={() => nav.navigate("Auctions")} />
            <QuickAction icon="construct-outline" label="Find Services" onPress={() => nav.navigate("Services")} />
            <QuickAction icon="add-circle-outline" label="Add Listing" onPress={() => nav.navigate("AddListing")} />
          </View>

          <Text style={{ ...typography.h2, paddingHorizontal: spacing.lg }}>Recommended</Text>
        </View>
      }
      contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, gap: spacing.lg }}
      data={data}
      keyExtractor={(item: Product) => String(item.id)}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={() => nav.navigate("ProductDetails", { id: item.id })} />
      )}
      ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
    />
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: "48%",
        backgroundColor: colors.card,
        borderRadius: spacing.md,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        alignItems: "center",
      }}
    >
      <Ionicons name={icon} size={32} color={colors.primary} />
      <Text style={{ marginTop: spacing.sm, textAlign: "center" }}>{label}</Text>
    </TouchableOpacity>
  );
}

