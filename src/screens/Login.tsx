import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/useAuth";

type Nav = any;

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "https://backendshedx-production.up.railway.app";

export default function Login() {
  const { login } = useAuth();
  const navigation = useNavigation<Nav>();

  const [email, setEmail] = useState("jam@example.com");
  const [password, setPassword] = useState("pass123");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing details", "Enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      // Adjust endpoint if your backend differs (e.g., /login)
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Login failed (${res.status}). ${txt}`);
      }

      const data = await res.json();
      // Expected shape: { token: string, user: { id, email, name? } }
      if (!data?.token || !data?.user) {
        throw new Error("Unexpected response from server.");
      }

      await login(data.user, data.token);
      // Go to main app
      // If your nav uses an Auth flow, this will trigger rerender
      // Otherwise, navigate explicitly to Tabs
      // @ts-ignore
      navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
    } catch (e: any) {
      Alert.alert("Login error", e?.message ?? "Could not sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={loading}
      >
        {loading ? <ActivityIndicator /> : <Text style={styles.buttonTxt}>Sign in</Text>}
      </TouchableOpacity>

      <Text style={styles.hint}>
        API: <Text style={styles.code}>{API_BASE}/auth/login</Text>
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  title: { fontSize: 24, fontWeight: "800" },
  subtitle: { fontSize: 14, color: "#6B7280", marginTop: 4, marginBottom: 24 },
  field: { marginBottom: 16 },
  label: { fontSize: 12, color: "#6B7280", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.5 },
  buttonTxt: { color: "#fff", fontWeight: "700" },
  hint: { marginTop: 16, fontSize: 12, color: "#6B7280" },
  code: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), color: "#111827" },
});
