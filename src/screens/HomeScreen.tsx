import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/ui/Button";
import { colors, spacing, radii, typography } from "../theme";
import { useAuth } from "../context/useAuth";

export default function HomeScreen() {
  const { user } = useAuth();
  const nav = useNavigation<any>();

  const actions = [
    {
      label: "Browse Products",
      icon: "pricetag-outline" as const,
      colors: ["#3b82f6", "#1d4ed8"],
      route: "Listings",
    },
    {
      label: "Live Auctions",
      icon: "hammer-outline" as const,
      colors: ["#f472b6", "#db2777"],
      route: "Auctions",
    },
    {
      label: "Find Services",
      icon: "construct-outline" as const,
      colors: ["#34d399", "#059669"],
      route: "Services",
    },
    {
      label: "Add Listing",
      icon: "add-circle-outline" as const,
      colors: ["#fbbf24", "#d97706"],
      route: "AddListing",
    },
  ];

  const stats = [
    { label: "Local Businesses", value: 150, icon: "storefront-outline" as const },
    { label: "Listings", value: 320, icon: "list-outline" as const },
    { label: "Services", value: 90, icon: "construct-outline" as const },
    { label: "Members", value: 1200, icon: "people-outline" as const },
  ];

  const vendors = [
    { id: 1, name: "Alice's Shop", location: "Bamenda", listings: 12, rating: 4.8 },
    { id: 2, name: "Bob Mart", location: "Mankon", listings: 8, rating: 4.5 },
    { id: 3, name: "Caro Boutique", location: "Nkwen", listings: 15, rating: 4.9 },
    { id: 4, name: "Dan's Electronics", location: "City Center", listings: 20, rating: 4.7 },
  ];

  const categories = [
    { id: 1, label: "Electronics", icon: "phone-portrait-outline" as const, colors: ["#3b82f6", "#1e3a8a"] },
    { id: 2, label: "Fashion", icon: "shirt-outline" as const, colors: ["#ec4899", "#be185d"] },
    { id: 3, label: "Services", icon: "build-outline" as const, colors: ["#34d399", "#059669"] },
    { id: 4, label: "Real Estate", icon: "home-outline" as const, colors: ["#fbbf24", "#d97706"] },
    { id: 5, label: "Automotive", icon: "car-outline" as const, colors: ["#a78bfa", "#6d28d9"] },
    { id: 6, label: "Agriculture", icon: "leaf-outline" as const, colors: ["#22c55e", "#15803d"] },
    { id: 7, label: "Health", icon: "medkit-outline" as const, colors: ["#f87171", "#b91c1c"] },
    { id: 8, label: "Education", icon: "book-outline" as const, colors: ["#60a5fa", "#1e40af"] },
  ];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: spacing["2xl"] }}>
      {/* Header */}
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=60" }}
        style={{ padding: spacing["2xl"], paddingTop: spacing["2xl"] + 20 }}
        imageStyle={{ opacity: 0.15 }}
      >
        <LinearGradient
          colors={["#2563eb", "#1e3a8a"]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <Text style={{ ...typography.h1, color: "white" }}>
          Welcome back, {user?.name || "Guest"}
        </Text>
        <View
          style={{
            marginTop: spacing.sm,
            alignSelf: "flex-start",
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: radii.pill,
            paddingHorizontal: spacing.sm,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: "white", fontSize: 12 }}>Free Account · Level 1</Text>
        </View>
        <Text style={{ marginTop: spacing.md, color: "white" }}>
          Discover amazing deals in your city.
        </Text>
      </ImageBackground>

      {/* Actions */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          padding: spacing.lg,
        }}
      >
        {actions.map((a) => (
          <TouchableOpacity
            key={a.label}
            onPress={() => nav.navigate(a.route as never)}
            style={{ width: "48%", marginBottom: spacing.lg }}
          >
            <LinearGradient
              colors={a.colors}
              style={{
                padding: spacing.lg,
                borderRadius: radii.md,
                alignItems: "center",
              }}
            >
              <Ionicons name={a.icon} size={32} color="#fff" />
              <Text style={{ marginTop: spacing.sm, color: "#fff", fontWeight: "600", textAlign: "center" }}>
                {a.label}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      <View style={{ backgroundColor: colors.bg, padding: spacing.lg }}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </View>
      </View>

      {/* Top Vendors */}
      <View style={{ padding: spacing.lg }}>
        <Text style={{ ...typography.h2, marginBottom: spacing.md }}>Top Vendors</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          {vendors.map((v, i) => (
            <VendorCard key={v.id} index={i + 1} vendor={v} />
          ))}
        </View>
      </View>

      {/* Popular Categories */}
      <View style={{ padding: spacing.lg }}>
        <Text style={{ ...typography.h2, marginBottom: spacing.md }}>Popular Categories</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          {categories.map((c) => (
            <CategoryCard key={c.id} {...c} />
          ))}
        </View>
      </View>

      {/* CTA */}
      <LinearGradient
        colors={["#2563eb", "#1d4ed8"]}
        style={{ margin: spacing.lg, padding: spacing["2xl"], borderRadius: radii.lg, alignItems: "center" }}
      >
        <Text style={{ ...typography.h2, color: "white", marginBottom: spacing.md }}>Join our marketplace</Text>
        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <Button
            title="Become a Vendor"
            onPress={() => nav.navigate("Signup")}
            style={{ backgroundColor: colors.accent }}
          />
          <Button
            title="Start Shopping"
            variant="outline"
            onPress={() => nav.navigate("Listings")}
            style={{ borderColor: "#fff", borderWidth: 1 }}
          />
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const listener = anim.addListener(({ value }) => setDisplay(Math.floor(value)));
    Animated.timing(anim, {
      toValue: value,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    return () => anim.removeListener(listener);
  }, [value]);

  return (
    <View
      style={{
        width: "48%",
        backgroundColor: colors.card,
        borderRadius: radii.md,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Ionicons name={icon} size={24} color={colors.primary} />
      <Text style={{ fontSize: 20, fontWeight: "800", marginTop: spacing.sm }}>{display}+</Text>
      <Text style={{ color: colors.muted, marginTop: 4 }}>{label}</Text>
    </View>
  );
}

function VendorCard({
  vendor,
  index,
}: {
  vendor: { id: number; name: string; location: string; listings: number; rating: number };
  index: number;
}) {
  const [hover, setHover] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: hover ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [hover]);

  return (
    <Pressable
      onPress={() => {}}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={{
        width: "48%",
        backgroundColor: colors.card,
        borderRadius: radii.md,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: spacing.sm,
          left: spacing.sm,
          backgroundColor: colors.primary,
          borderRadius: radii.pill,
          paddingHorizontal: spacing.sm,
          paddingVertical: 2,
        }}
      >
        <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>{index}</Text>
      </View>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: radii.pill,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 28, fontWeight: "700" }}>{vendor.name.charAt(0)}</Text>
      </View>
      <Ionicons
        name="checkmark-circle"
        size={16}
        color={colors.success}
        style={{ position: "absolute", top: 56, right: spacing.lg }}
      />
      <Text style={{ marginTop: spacing.sm, fontWeight: "700" }}>{vendor.name}</Text>
      <Text style={{ color: colors.muted, fontSize: 12 }}>{vendor.location}</Text>
      <Text style={{ color: colors.muted, fontSize: 12 }}>
        {vendor.listings} listings · {vendor.rating}★
      </Text>
      <Animated.View style={{ opacity: fade, marginTop: spacing.sm }}>
        <Button title="View Profile" variant="outline" size="sm" onPress={() => {}} />
      </Animated.View>
    </Pressable>
  );
}

function CategoryCard({
  label,
  icon,
  colors: gradient,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: string[];
}) {
  return (
    <TouchableOpacity
      style={{
        width: "48%",
        backgroundColor: colors.card,
        borderRadius: radii.md,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <LinearGradient
        colors={gradient}
        style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" }}
      >
        <Ionicons name={icon} size={22} color="#fff" />
      </LinearGradient>
      <Text style={{ marginTop: spacing.md, fontWeight: "700" }}>{label}</Text>
      <Text style={{ marginTop: 4, color: colors.muted, fontSize: 12 }}>Explore Now</Text>
    </TouchableOpacity>
  );
}

