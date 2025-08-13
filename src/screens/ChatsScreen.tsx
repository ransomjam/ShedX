import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import client from "@/api/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation";

type Chat = {
  id: string;
  buyer_id: string;
  seller_id: string;
  last_message?: string;
  updated_at: string;
  counterpart?: { id: string; name: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "Chats">;

export default function ChatsScreen({ navigation }: Props) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await client.get("/chats");
        setChats(data.items || data);
      } catch (e) {
        Alert.alert("Error", "Failed to load chats");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>Chats</Text>
      <FlatList
        data={chats}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Chat", { chatId: item.id })}
            style={{ backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 10 }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.counterpart?.name ?? "User"}</Text>
            <Text numberOfLines={1} style={{ color: "#666", marginTop: 4 }}>{item.last_message ?? "No messages yet"}</Text>
            <Text style={{ color: "#999", marginTop: 4 }}>{new Date(item.updated_at).toLocaleString()}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
