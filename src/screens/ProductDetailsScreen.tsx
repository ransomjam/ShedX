import React from "react";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getProductAPI, Product } from "../services/api";
import { colors, spacing, typography, radii } from "../theme";
import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import VerificationBadge from "../components/ui/VerificationBadge";
import { useNavigation, useRoute } from "@react-navigation/native";

type RouteParams = { id: number };

export default function ProductDetailsScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { id } = route.params as RouteParams;

  const { data, isLoading, error } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getProductAPI(id),
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg }}>
        <Text style={{ color: colors.danger, textAlign: "center" }}>Failed to load product.</Text>
      </View>
    );
  }

  const p = data;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
      {/* Image */}
      {p.imageUrl ? (
        <Image source={{ uri: p.imageUrl }} style={{ width: "100%", height: 260 }} />
      ) : (
        <View style={{ width: "100%", height: 260, backgroundColor: "#f1f5f9" }} />
      )}

      <View style={{ padding: spacing.lg, gap: spacing.lg }}>
        {/* Title + price */}
        <View>
          <Text style={{ ...typography.h2 }}>{p.title}</Text>
          <View style={{ height: 6 }} />
          <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text }}>{p.price}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 6 }}>
            <Feather name="map-pin" size={16} color={colors.muted} />
            <Text style={{ color: colors.muted }}>{p.location}</Text>
          </View>
        </View>

        {/* Vendor card */}
        {p.vendor && (
          <Card>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#e2e8f0", alignItems: "center", justifyContent: "center" }}>
                  <Feather name="user" size={20} color={colors.text} />
                </View>
                <View>
                  <Text style={{ fontWeight: "700" }}>{p.vendor.name ?? "Vendor"}</Text>
                  <View style={{ height: 4 }} />
                  <VerificationBadge level={p.vendor.verificationStatus} />
                </View>
              </View>
              <Button title="Message" onPress={() => nav.navigate("Messages", { vendorId: p.vendor?.id })} />
            </View>
          </Card>
        )}

        {/* Actions */}
        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <Button title="Save" variant="outline" />
          <Button title="Report" variant="outline" />
        </View>

        {/* Description placeholder (if web exposes later) */}
        <Card>
          <Text style={typography.h2}>Description</Text>
          <View style={{ height: 8 }} />
          <Text style={{ color: colors.muted }}>Details not provided.</Text>
        </Card>
      </View>
    </ScrollView>
  );
}
