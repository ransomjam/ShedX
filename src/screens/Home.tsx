import React, { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/useAuth";
import api from "../lib/api";

type Product = { id: string | number; title: string };

export default function Home() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setErr(null);
    try {
      const data = await api.get<Product[]>("/api/products", token);
      setProducts(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
    >
      <Text style={styles.hi}>Hi, {user?.name || "there"} 👋</Text>
      <Text style={styles.sub}>Welcome to SHEDX. This Home shows live data from your backend.</Text>

      {loading ? (
        <View style={styles.center}><ActivityIndicator /><Text style={styles.dim}>Loading…</Text></View>
      ) : err ? (
        <Text style={styles.err}>{err}</Text>
      ) : (
        <View style={styles.cards}>
          <View style={styles.card}>
            <Text style={styles.cardNum}>{products.length}</Text>
            <Text style={styles.cardLbl}>Products</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardNum}>{products.slice(0, 5).length}</Text>
            <Text style={styles.cardLbl}>New (sample)</Text>
          </View>
        </View>
      )}

      <View style={{ height: 24 }} />
      <Text style={styles.dim}>API base: {process.env.EXPO_PUBLIC_API_URL}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  hi: { fontSize: 22, fontWeight: "800" },
  sub: { marginTop: 6, color: "#6B7280" },
  center: { paddingVertical: 40, alignItems: "center", gap: 8 },
  dim: { color: "#6B7280", fontSize: 12 },
  err: { color: "#b00020" },
  cards: { flexDirection: "row", gap: 12, marginTop: 16 },
  card: { flex: 1, backgroundColor: "#F3F4F6", borderRadius: 16, padding: 16 },
  cardNum: { fontSize: 28, fontWeight: "900" },
  cardLbl: { color: "#6B7280", marginTop: 4 },
});
