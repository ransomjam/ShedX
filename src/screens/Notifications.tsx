import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/useAuth";
import api from "../lib/api";

type NotificationDTO = {
  id: string;
  type: string;
  title: string;
  body: string;
  createdAt: string;
  read?: boolean;
};

const DEMO_NOTIFICATIONS: NotificationDTO[] = [
  { id: "n1", type: "order", title: "Order Confirmed", body: "Your order #1234 has been confirmed.", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false },
  { id: "n2", type: "message", title: "New Message", body: "You have a new message from ProList Vendor.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: true },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.max(1, Math.floor(diff / 1000));
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const d = Math.floor(hr / 24);
  return `${d}d`;
}

export default function Notifications() {
  const { token } = useAuth();
  const [items, setItems] = useState<NotificationDTO[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await api.get<NotificationDTO[]>("/notifications", token);
      setItems(data);
    } catch (e: any) {
      setItems(DEMO_NOTIFICATIONS);
      setError("Showing demo notifications (connect backend for real data).");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator />
          <Text style={styles.loaderText}>Loading notifications…</Text>
        </View>
      ) : (
        <FlatList
          data={items ?? []}
          keyExtractor={(n) => n.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.row, !item.read && styles.unread]}>
              <View style={styles.rowMain}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
              </View>
              <Text style={styles.rowBody} numberOfLines={2}>
                {item.body}
              </Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          contentContainerStyle={styles.listPad}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  title: { fontSize: 20, fontWeight: "700" },
  error: {
    marginHorizontal: 16,
    marginTop: 8,
    color: "#b00020",
    fontSize: 13,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loaderText: { fontSize: 13, color: "#555" },
  listPad: { paddingVertical: 6 },
  row: { paddingHorizontal: 16, paddingVertical: 12 },
  unread: { backgroundColor: "#F9FAFB" },
  rowMain: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowTitle: { fontSize: 15, fontWeight: "600", flexShrink: 1, marginRight: 8 },
  time: { fontSize: 12, color: "#6B7280" },
  rowBody: { fontSize: 13, color: "#4B5563", marginTop: 2 },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: "#EFEFEF", marginLeft: 16 },
});
