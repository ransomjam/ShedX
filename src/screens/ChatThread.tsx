import React, { useCallback, useEffect, useRef, useState } from "react";
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
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../context/useAuth";
import api from "../lib/api";

type Nav = any;
type RootStackParamList = {
  ChatThread: { threadId: string; peerId?: string; title?: string };
};

type ChatMessage = {
  id: string;
  threadId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read?: boolean;
};

type Paged<T> = { items: T[]; nextCursor?: string | null };

const DEMO_MESSAGES: ChatMessage[] = [
  { id: "m1", threadId: "t_demo_1", senderId: "u_vendor_1", receiverId: "me", content: "Hello! Is this still available?", createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString() },
  { id: "m2", threadId: "t_demo_1", senderId: "me", receiverId: "u_vendor_1", content: "Yes, it is. When would you like to pick it up?", createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: "m3", threadId: "t_demo_1", senderId: "u_vendor_1", receiverId: "me", content: "This evening works for me.", createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
];

export default function ChatThread() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProp<RootStackParamList, "ChatThread">>();
  const { threadId, title } = route.params ?? ({} as any);

  const { token } = useAuth();
  const myUserId = "me"; // Replace with real user id from useAuth once available

  const [messages, setMessages] = useState<ChatMessage[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    if (title) navigation.setOptions({ title });
  }, [navigation, title]);

  const fetchPage = useCallback(async (direction: "initial" | "older" = "initial") => {
    try {
      if (direction === "initial") setLoading(true);
      setError(null);

      const data = await api.get<Paged<ChatMessage> | ChatMessage[]>(`/messages/thread/${threadId}${direction === "older" && cursor ? `?cursor=${cursor}` : ""}`, token);

      let items: ChatMessage[] = [];
      let nextCursor: string | null | undefined = null;

      if (Array.isArray(data)) {
        items = data;
      } else {
        items = data.items ?? [];
        nextCursor = data.nextCursor ?? null;
      }

      items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      setMessages((prev) => {
        if (!prev || direction === "initial") return items;
        const existing = new Set(prev.map((m) => m.id));
        const merged = [...items.filter((m) => !existing.has(m.id)), ...prev];
        merged.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        return merged;
      });

      setCursor(nextCursor ?? null);
      setHasMore(Boolean(nextCursor));
    } catch (e: any) {
      if (direction === "initial") {
        setMessages(DEMO_MESSAGES.map((m) => ({ ...m, threadId: threadId ?? "t_demo_1" })));
        setHasMore(false);
        setError("Showing demo chat (connect auth to see real messages).");
      } else {
        setError("Could not load more messages.");
      }
    } finally {
      if (direction === "initial") setLoading(false);
    }
  }, [cursor, threadId, token]);

  useEffect(() => {
    if (threadId) fetchPage("initial");
  }, [threadId, fetchPage]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const tempId = `temp_${Date.now()}`;
    const optimistic: ChatMessage = {
      id: tempId,
      threadId: threadId ?? "t_demo_1",
      senderId: myUserId,
      receiverId: "peer",
      content: trimmed,
      createdAt: new Date().toISOString(),
      read: true,
    };

    setMessages((prev) => {
      const next = [...(prev ?? []), optimistic];
      next.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      return next;
    });
    setInput("");
    setSending(true);

    try {
      const saved = await api.post<ChatMessage>("/messages", { threadId, content: trimmed }, token);
      setMessages((prev) => (prev ?? []).map((m) => (m.id === tempId ? saved : m)));
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    } catch (e: any) {
      setMessages((prev) => (prev ?? []).filter((m) => m.id !== tempId));
      setError("Failed to send. Check your connection or sign in.");
    } finally {
      setSending(false);
    }
  }, [input, myUserId, threadId, token]);

  const loadOlder = useCallback(() => {
    if (hasMore && !loading) fetchPage("older");
  }, [hasMore, loading, fetchPage]);

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const mine = item.senderId === myUserId;
    return (
      <View style={[styles.bubbleRow, mine ? styles.right : styles.left]}>
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubblePeer]}>
          <Text style={[styles.msg, mine && { color: "#fff" }]}>{item.content}</Text>
          <Text style={styles.time}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
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
      {loading && !messages ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.dim}>Loading chat…</Text>
        </View>
      ) : (
        <>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <FlatList
            ref={listRef}
            data={messages ?? []}
            keyExtractor={(m) => m.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listPad}
            onEndReachedThreshold={0.2}
            onEndReached={loadOlder}
          />

          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              placeholder="Type a message…"
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendBtn, (!input.trim() || sending) && styles.sendBtnDisabled]}
              onPress={sendMessage}
              disabled={!input.trim() || sending}
            >
              <Text style={styles.sendTxt}>{sending ? "…" : "Send"}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6 },
  dim: { color: "#666", fontSize: 13 },
  error: { color: "#b00020", marginHorizontal: 12, marginTop: 8, fontSize: 12 },

  listPad: { paddingVertical: 8, paddingHorizontal: 12 },
  bubbleRow: { flexDirection: "row", marginBottom: 8 },
  left: { justifyContent: "flex-start" },
  right: { justifyContent: "flex-end" },
  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  bubblePeer: { backgroundColor: "#F3F4F6", borderTopLeftRadius: 4 },
  bubbleMine: { backgroundColor: "#111827", borderTopRightRadius: 4 },
  msg: { color: "#111827" },
  time: { fontSize: 10, marginTop: 4, color: "#6B7280" },

  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
    gap: 8,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 14,
  },
  sendBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#111827",
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendTxt: { color: "#fff", fontWeight: "700" },
});
