import React, { useMemo } from "react";
import { View, Text, Image, FlatList } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { listVendorProductsAPI, Product } from "../services/api";
import { colors, spacing, typography } from "../theme";
import { Card } from "../components/ui/Card";
import VerificationBadge from "../components/ui/VerificationBadge";
import StatTile from "../components/ui/StatTile";
import ProductCard from "../components/ui/ProductCard";
import Button from "../components/ui/Button";

export default function ProfileScreen(){
  const { user, logout } = useAuth();
  const vendorId = user?.id;

  const { data: myProducts = [], isLoading } = useQuery({
    queryKey: ["vendorProducts", vendorId],
    queryFn: () => listVendorProductsAPI(vendorId as number),
    enabled: !!vendorId,
  });

  const Header = () => (
    <View style={{ padding: spacing.lg, gap: spacing.lg }}>
      {/* Identity card */}
      <Card>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
          {user?.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={{ width: 64, height: 64, borderRadius: 32 }} />
          ) : (
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "#e2e8f0", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontWeight: "800", fontSize: 20 }}>{user?.username?.charAt(0)?.toUpperCase()}</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ ...typography.h2 }}>@{user?.username}</Text>
              <VerificationBadge level={user?.verificationStatus} />
            </View>
            {!!user?.email && <Text style={{ marginTop: 2, color: colors.muted }}>{user.email}</Text>}
            {!!user?.accountType && <Text style={{ marginTop: 2, color: colors.muted }}>{user.accountType.replace("_"," ")}</Text>}
            {!!user?.location && <Text style={{ marginTop: 2, color: colors.muted }}>{user.location}</Text>}
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.lg }}>
          <Button title="Edit Profile" variant="outline" />
          {user?.verificationStatus !== "premium_verified" && <Button title="Get Verified" />}
        </View>
      </Card>

      {/* Quick stats */}
      <View style={{ flexDirection:"row", gap: spacing.md }}>
        <StatTile icon="package" value={String(myProducts.length)} label="My Listings" />
        <StatTile icon="heart" value="0" label="Saved" />
      </View>
      <View style={{ height: spacing.md }} />
      <View style={{ flexDirection:"row", gap: spacing.md }}>
        <StatTile icon="shopping-bag" value="0" label="Orders" />
        <StatTile icon="award" value={user?.verificationStatus === "premium_verified" ? "Premium" : (user?.verificationStatus ? "Verified" : "None")} label="Status" />
      </View>

      {/* Account details */}
      <Card>
        <Text style={typography.h2}>Account details</Text>
        <View style={{ height: 12 }} />
        <InfoRow label="Username" value={user?.username} />
        <InfoRow label="Email" value={user?.email} />
        <InfoRow label="Phone" value={user?.phone} />
        <InfoRow label="Location" value={user?.location} />
        <InfoRow label="Account type" value={user?.accountType?.replace("_"," ")} />
        {/* Optional business fields */}
        {/* If web exposes these on user, they will render; otherwise they stay hidden */}
        <InfoRow label="Business name" value={(user as any)?.businessName} />
        <InfoRow label="Market location" value={(user as any)?.marketLocation} />
        <InfoRow label="Specialization" value={(user as any)?.specialization} />
        <InfoRow label="Verification" value={user?.verificationStatus} />
      </Card>

      {/* My Listings title */}
      <Text style={typography.h2}>My Listings</Text>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={<Header />}
      contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, gap: spacing.lg }}
      data={myProducts}
      keyExtractor={(p: Product) => String(p.id)}
      renderItem={({ item }) => <ProductCard product={item} />}
      ListEmptyComponent={() => (
        <View style={{ padding: spacing.lg }}>
          <Text style={{ color: colors.muted }}>{isLoading ? "Loading your listings..." : "You have no listings yet."}</Text>
          <View style={{ height: 12 }} />
          <Button title="Add your first listing" />
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
      ListFooterComponent={
        <View style={{ paddingVertical: spacing.lg }}>
          <Button title="Log out" onPress={logout} variant="outline" />
        </View>
      }
    />
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View style={{ flexDirection:"row", justifyContent:"space-between", paddingVertical: 8 }}>
      <Text style={{ color: colors.muted }}>{label}</Text>
      <Text style={{ fontWeight: "600" }}>{value}</Text>
    </View>
  );
}
