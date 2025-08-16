import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/useAuth";
import api from "../lib/api";
type Nav = any;

type ThreadDTO = {
  id: string;
  peerId: string;
  peerName: string;
  peerAvatar?: string | null;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
};

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

const DEMO_THREADS: ThreadDTO[] = [
  {
    id: "t_demo_1",
    peerId: "u_vendor_1",
    peerName: "ProList Vendor",
    peerAvatar: null,
    lastMessage: "Hello! Is this still available?",
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    unreadCount: 2,
  },
  {
    id: "t_demo_2",
    peerId: "u_buyer_1",
    peerName: "Buyer Doreen",
    peerAvatar: null,
    lastMessage: "Thanks for the quick response.",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    unreadCount: 0,
  },
];

export default function Messages() {
  const navigation = useNavigation<Nav>();
  const { token } = useAuth();
  const [threads, setThreads] = useState<ThreadDTO[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThreads = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await api.get<ThreadDTO[] | { threads: ThreadDTO[] }>("/messages/threads", token);
      const normalized = Array.isArray(data)
        ? data
        : Array.isArray((data as any).threads)
        ? (data as any).threads
        : [];

      normalized.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setThreads(normalized);
    } catch (e: any) {
      setThreads(DEMO_THREADS);
      setError("Showing demo messages (connect auth to see real chats).");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchThreads();
    } finally {
      setRefreshing(false);
    }
  }, [fetchThreads]);

  useFocusEffect(
    React.useCallback(() => {
      fetchThreads();
    }, [fetchThreads])
  );

  const empty = useMemo(() => !loading && (threads?.length ?? 0) === 0, [loading, threads]);

  const openThread = (t: ThreadDTO) => {
    navigation.navigate("ChatThread", {
      threadId: t.id,
      peerId: t.peerId,
      title: t.peerName,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator />
          <Text style={styles.loaderText}>Loading chats…</Text>
        </View>
      ) : empty ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No conversations yet</Text>
          <Text style={styles.emptySub}>
            Start a chat from a product page or your orders.
          </Text>
        </View>
      ) : (
        <FlatList
          data={threads ?? []}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.row} onPress={() => openThread(item)}>
              <View style={styles.avatar}>
                <Text style={styles.avatarTxt}>
                  {String(item.peerName ?? "?").slice(0, 1).toUpperCase()}
                </Text>
              </View>

              <View style={styles.rowCenter}>
                <View style={styles.rowTop}>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.peerName}
                  </Text>
                  <Text style={styles.time}>{timeAgo(item.updatedAt)}</Text>
                </View>

                <View style={styles.rowBottom}>
                  <Text style={styles.preview} numberOfLines={1}>
                    {item.lastMessage}
                  </Text>
                  {item.unreadCount > 0 ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeTxt}>
                        {item.unreadCount > 99 ? "99+" : item.unreadCount}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
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
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6 },
  emptyTitle: { fontSize: 16, fontWeight: "600" },
  emptySub: { fontSize: 13, color: "#666" },
  listPad: { paddingVertical: 6 },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: "#F1F5F9",
    alignItems: "center", justifyContent: "center",
  },
  avatarTxt: { fontSize: 16, fontWeight: "700", color: "#374151" },
  rowCenter: { flex: 1, marginLeft: 12 },
  rowTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  name: { fontSize: 15, fontWeight: "600", flexShrink: 1, marginRight: 8 },
  time: { fontSize: 12, color: "#6B7280" },
  rowBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 2 },
  preview: { fontSize: 13, color: "#4B5563", flex: 1, marginRight: 8 },
  badge: {
    minWidth: 22, height: 22, borderRadius: 11, backgroundColor: "#111827",
    alignItems: "center", justifyContent: "center", paddingHorizontal: 6,
  },
  badgeTxt: { color: "#fff", fontSize: 11, fontWeight: "700" },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: "#EFEFEF", marginLeft: 72 },
});
