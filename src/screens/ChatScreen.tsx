import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TextInput, Button, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from "react-native";
import client from "@/api/client";
import { getSocket } from "@/realtime/socket";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation";

type Message = {
  id: string;
  sender_id: string;
  message_text: string;
  created_at: string;
};

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

export default function ChatScreen({ route }: Props) {
  const { chatId } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList>(null);

  const load = async () => {
    try {
      const { data } = await client.get(`/messages/${chatId}`);
      setMessages(data.items || data);
    } catch (e) {
      Alert.alert("Error", "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [chatId]);

  useEffect(() => {
    (async () => {
      const socket = await getSocket();
      // Join room for this chat
      socket.emit("chat:join", { chatId });

      // Receive new messages
      const onNew = (msg: Message) => {
        if ((msg as any)?.chat_id && String((msg as any).chat_id) !== String(chatId)) return;
        setMessages((prev) => [...prev, msg]);
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
      };
      socket.on("message:new", onNew);

      return () => {
        socket.emit("chat:leave", { chatId });
        socket.off("message:new", onNew);
      };
    })();
  }, [chatId]);

  const send = async () => {
    const body = text.trim();
    if (!body) return;
    try {
      setText("");
      // Optimistic append (optional: generate client id)
      const optimistic: Message = {
        id: `tmp-${Date.now()}`,
        sender_id: "me",
        message_text: body,
        created_at: new Date().toISOString()
      };
      setMessages((prev) => [...prev, optimistic]);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);

      // Tell server via API (reliable) — server should broadcast "message:new"
      await client.post("/messages", { chat_id: chatId, message_text: body });
    } catch (e) {
      Alert.alert("Error", "Failed to send message");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <FlatList
        ref={listRef}
        contentContainerStyle={{ padding: 16 }}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10, alignSelf: "stretch" }}>
            <Text style={{ fontSize: 14, color: "#333" }}>{item.message_text}</Text>
            <Text style={{ fontSize: 12, color: "#999" }}>{new Date(item.created_at).toLocaleString()}</Text>
          </View>
        )}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={{ flexDirection: "row", padding: 12, borderTopWidth: 1, borderTopColor: "#eee" }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10, marginRight: 8 }}
        />
        <Button title="Send" onPress={send} />
      </View>
    </KeyboardAvoidingView>
  );
}
