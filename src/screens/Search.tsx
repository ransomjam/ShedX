import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/useAuth";
import api from "../lib/api";

type Nav = any;

type ProductDTO = {
  id: string | number;
  title: string;
  price?: number | string;
  imageUrl?: string | null;
  vendorName?: string | null;
  location?: string | null;
};

export default function Search() {
  const navigation = useNavigation<Nav>();
  const { token } = useAuth();

  const [query, setQuery] = useState("");
  const [all, setAll] = useState<ProductDTO[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<ProductDTO[]>("/api/products", token);
      setAll(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load products.");
      setAll([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all ?? [];
    return (all ?? []).filter((p) => {
      const hay = `${p.title ?? ""} ${p.vendorName ?? ""} ${p.location ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [all, query]);

  const openProduct = (p: ProductDTO) => {
    navigation.navigate("ProductDetails", { id: p.id, title: p.title });
  };

  const renderItem = ({ item }: { item: ProductDTO }) => (
    <TouchableOpacity style={styles.card} onPress={() => openProduct(item)}>
      <View style={styles.thumbWrap}>
        {item.imageUrl ? (
          <Image source={{ uri: String(item.imageUrl) }} style={styles.thumb} />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Text style={styles.thumbTxt}>{String(item.title ?? "?").slice(0, 1).toUpperCase()}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {item.vendorName ? item.vendorName : "Vendor"}{item.location ? ` • ${item.location}` : ""}
        </Text>
        {"price" in item && item.price !== undefined && item.price !== null ? (
          <Text style={styles.price}>
            {typeof item.price === "number" ? Intl.NumberFormat().format(item.price) : String(item.price)}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.h1}>Search</Text>
        <Text style={styles.sub}>Find products, vendors and more</Text>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search products…"
          autoCapitalize="none"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.clearBtn} onPress={() => setQuery("")}>
          <Text style={styles.clearTxt}>×</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.dim}>Loading products…</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          contentContainerStyle={styles.listPad}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={!query ? null : (
            <View style={styles.center}><Text style={styles.dim}>No results for “{query}”.</Text></View>
          )}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  h1: { fontSize: 20, fontWeight: "800" },
  sub: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fff",
  },
  input: { flex: 1, paddingVertical: 8, fontSize: 14 },
  clearBtn: {
    width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center",
  },
  clearTxt: { fontSize: 20, lineHeight: 20, color: "#9CA3AF" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6 },
  dim: { color: "#6B7280", fontSize: 13, textAlign: "center", paddingHorizontal: 16 },
  error: { color: "#b00020", marginHorizontal: 16, marginTop: 8, fontSize: 12 },

  listPad: { paddingHorizontal: 12, paddingVertical: 8 },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: "#EEE", marginLeft: 96 },

  card: { flexDirection: "row", paddingHorizontal: 8, paddingVertical: 10, alignItems: "center" },
  thumbWrap: { width: 84, height: 64, borderRadius: 12, overflow: "hidden", backgroundColor: "#F3F4F6" },
  thumb: { width: "100%", height: "100%" },
  thumbPlaceholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  thumbTxt: { fontWeight: "800", fontSize: 18, color: "#374151" },
  cardRight: { flex: 1, marginLeft: 12 },
  title: { fontSize: 15, fontWeight: "700" },
  meta: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  price: { marginTop: 4, fontSize: 14, fontWeight: "800" },
});
