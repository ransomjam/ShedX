import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useAuth } from "../context/useAuth";
import api from "../lib/api";

type RootStackParamList = {
  ChatThread: { threadId: string; title?: string }; // threadId maps to backend chatId
};

type ChatMessage = {
  id?: string | number;
  chatId?: string | number;
  senderId?: string | number;
  receiverId?: string | number;
  content?: string;
  text?: string;
  createdAt?: string;
  timestamp?: string;
};

export default function ChatThread() {
  const route = useRoute<RouteProp<RootStackParamList, "ChatThread">>();
  const { threadId, title } = route.params ?? ({} as any);

  const { token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!threadId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<ChatMessage[]>(`/api/messages/${encodeURIComponent(threadId)}`, token);
      const arr = Array.isArray(data) ? data : [];
      arr.sort((a, b) => new Date(a.createdAt ?? a.timestamp ?? 0).getTime() - new Date(b.createdAt ?? b.timestamp ?? 0).getTime());
      setMessages(arr);
    } catch (e: any) {
      setError(e?.message ?? "Could not load chat.");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [threadId, token]);

  useEffect(() => {
    load();
  }, [load]);

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const text = item.content ?? item.text ?? "";
    const time = new Date(item.createdAt ?? item.timestamp ?? Date.now()).toLocaleTimeString();
    return (
      <View style={[styles.bubbleRow]}>
        <View style={[styles.bubble, styles.bubblePeer]}>
          <Text style={styles.msg}>{text}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 74 : 0}
    >
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.dim}>Loading chat…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={messages ?? []}
          keyExtractor={(m, i) => String(m.id ?? i)}
          renderItem={renderItem}
          contentContainerStyle={styles.listPad}
        />
      )}
      <View style={styles.footerNote}>
        <Text style={styles.footerText}>
          Sending not implemented yet. Backend appears to use Socket.IO. We'll wire this next.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6 },
  dim: { color: "#666", fontSize: 13 },
  error: { color: "#b00020", fontSize: 13 },
  listPad: { paddingVertical: 8, paddingHorizontal: 12 },
  bubbleRow: { flexDirection: "row", marginBottom: 8, justifyContent: "flex-start" },
  bubble: {
    maxWidth: "82%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },
  bubblePeer: { borderTopLeftRadius: 4 },
  msg: { color: "#111827" },
  time: { fontSize: 10, marginTop: 4, color: "#6B7280" },
  footerNote: {
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  footerText: { fontSize: 12, color: "#6B7280", textAlign: "center" },
});
