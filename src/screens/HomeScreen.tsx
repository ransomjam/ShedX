import React from "react";
import { View, Text, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { listProductsAPI, Product } from "../services/api";
import { colors, spacing, typography } from "../theme";
import { Card } from "../components/ui/Card";
import StatTile from "../components/ui/StatTile";
import ProductCard from "../components/ProductCard";

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const { data = [] } = useQuery({ queryKey: ["products"], queryFn: listProductsAPI });

  return (
    <FlatList
      ListHeaderComponent={
        <View style={{ padding: spacing.lg, gap: spacing.lg }}>
          {/* Live Auctions promo */}
          <Card>
            <Text style={{ ...typography.h2, color: colors.primary }}>Live Auctions</Text>
            <Text style={{ marginTop: 6, color: colors.muted }}>
              Bid on unique items and get the best deals in real-time auctions.
            </Text>
          </Card>

          {/* Growing Community */}
          <View style={{ backgroundColor: colors.primary, borderRadius: 16, padding: spacing.lg }}>
            <Text style={{ fontSize: 18, fontWeight:"800", color:"white", marginBottom: spacing.md }}>Growing Community</Text>
            <View style={{ flexDirection:"row", gap: spacing.md }}>
              <StatTile icon="users" value="500+" label="Active Vendors" />
              <StatTile icon="package" value="2K+" label="Products Listed" />
            </View>
            <View style={{ height: spacing.md }} />
            <View style={{ flexDirection:"row", gap: spacing.md }}>
              <StatTile icon="activity" value="50+" label="Live Auctions" />
              <StatTile icon="smile" value="1K+" label="Happy Users" />
            </View>
          </View>

          <Text style={typography.h2}>Recommended</Text>
        </View>
      }
      contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, gap: spacing.lg }}
      data={data}
      keyExtractor={(p: Product) => String(p.id)}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={() => nav.navigate("ProductDetails", { id: item.id })} />
      )}
      ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
    />
  );
}
