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
import api from "../lib/api";

type Nav = any;

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "https://backendshedx-production.up.railway.app";
const LOGIN_PATH = "/api/auth/login";
const REGISTER_PATH = "/api/auth/register";
const ME_PATHS = ["/api/users/me", "/api/auth/me", "/api/me", "/users/me", "/me"];

async function fetchProfileWithFallback(token: string) {
  let lastErr = "";
  for (const path of ME_PATHS) {
    try {
      const data = await api.get<any>(path, token);
      if (data && (data.id || data.email || data.name)) return data;
    } catch (e: any) {
      lastErr = e?.message ?? String(e);
    }
  }
  throw new Error("No /me endpoint responded. " + lastErr);
}

export default function Login() {
  const { login } = useAuth();
  const navigation = useNavigation<Nav>();

  const [email, setEmail] = useState("jam@example.com");
  const [password, setPassword] = useState("pass123");
  const [loading, setLoading] = useState(false);

  const finishLogin = async (token: string) => {
    // compute a safe fallback name first to avoid mixing ?? and ||
    const fallbackName = (email.split("@")[0] || "User");

    try {
      // Try to fetch profile
      let profile: any | null = null;
      try {
        profile = await fetchProfileWithFallback(token);
      } catch {
        // Fallback: minimal profile from email
        profile = { id: "me", name: fallbackName, email };
      }
      await login(
        {
          id: String((profile?.id ?? "me")),
          name: String((profile?.name ?? fallbackName)),
          email: String((profile?.email ?? email)),
        },
        token
      );
      // @ts-ignore
      navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
    } catch (e: any) {
      throw e;
    }
  };

  const onSubmit = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing details", "Enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${LOGIN_PATH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Login failed (${res.status}). ${errText}`);
      }
      const data = await res.json();
      const token = data?.token as string | undefined;
      if (!token) throw new Error("No token in response.");
      await finishLogin(token);
    } catch (e: any) {
      Alert.alert("Login error", e?.message ?? "Could not sign in.");
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing details", "Enter your email and password first.");
      return;
    }
    setLoading(true);
    try {
      const name = email.split("@")[0] || "User";
      const res = await fetch(`${API_BASE}${REGISTER_PATH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: email.trim(), password }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Register failed (${res.status}). ${txt}`);
      }
      const data = await res.json();
      const token = data?.token as string | undefined;
      if (token) {
        await finishLogin(token);
      } else {
        // If register doesn't return token, try immediate login
        const res2 = await fetch(`${API_BASE}${LOGIN_PATH}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        });
        if (!res2.ok) {
          throw new Error(`Registered, but login failed (${res2.status}). ${await res2.text()}`);
        }
        const d2 = await res2.json();
        const token2 = d2?.token as string | undefined;
        if (!token2) throw new Error("Registered, but no token in login response.");
        await finishLogin(token2);
      }
    } catch (e: any) {
      Alert.alert("Register error", e?.message ?? "Could not create account.");
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

      <TouchableOpacity
        style={[styles.buttonOutline, loading && styles.buttonDisabled]}
        onPress={onRegister}
        disabled={loading}
      >
        <Text style={styles.buttonOutlineTxt}>Create account</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        Base: <Text style={styles.code}>{API_BASE}</Text>
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
  buttonOutline: {
    marginTop: 10,
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#111827",
  },
  buttonDisabled: { opacity: 0.5 },
  buttonTxt: { color: "#fff", fontWeight: "700" },
  buttonOutlineTxt: { color: "#111827", fontWeight: "700" },
  hint: { marginTop: 16, fontSize: 12, color: "#6B7280" },
  code: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), color: "#111827" },
});
