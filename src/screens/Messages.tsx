import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

type Nav = any;

export default function Messages() {
  const navigation = useNavigation<Nav>();
  const [chatId, setChatId] = useState("1"); // placeholder

  const open = () => {
    const id = chatId.trim();
    if (!id) return;
    // @ts-ignore
    navigation.navigate("ChatThread", { threadId: id, title: `Chat ${id}` });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <Text style={styles.h1}>Messages</Text>
      <Text style={styles.sub}>Enter a chat ID to open messages from your backend route <Text style={{fontFamily: Platform.select({ios:'Menlo', android:'monospace'})}}>/api/messages/:chatId</Text>.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Chat ID</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 1"
          value={chatId}
          onChangeText={setChatId}
          keyboardType="default"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={open}>
          <Text style={styles.buttonTxt}>Open Chat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.examples}>
        <Text style={styles.dim}>Tip: If you don’t know any chat IDs yet, create some data on the server or seed the DB.</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 20 },
  h1: { fontSize: 20, fontWeight: "800" },
  sub: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  card: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
  },
  label: { fontSize: 12, color: "#6B7280", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  button: { backgroundColor: "#111827", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  buttonTxt: { color: "#fff", fontWeight: "700" },
  examples: { marginTop: 12 },
  dim: { color: "#6B7280", fontSize: 12 },
});
