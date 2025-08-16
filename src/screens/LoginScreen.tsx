import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";
import Button from "../components/ui/Button";

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async () => {
    setErr("");
    setLoading(true);
    try {
      await login(username.trim(), password);
    } catch (e: any) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center", gap: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Welcome back</Text>

      <View>
        <Text style={{ marginBottom: 6 }}>Username or Email</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholder="e.g. jam"
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />
      </View>

      <View>
        <Text style={{ marginBottom: 6 }}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPw}
          placeholder="••••••••"
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />
        <TouchableOpacity onPress={() => setShowPw((s) => !s)} style={{ marginTop: 8 }}>
          <Text style={{ color: colors.primary }}>{showPw ? "Hide" : "Show"} password</Text>
        </TouchableOpacity>
      </View>

      {err ? <Text style={{ color: "red" }}>{err}</Text> : null}

      <Button title="Sign in" onPress={onSubmit} loading={loading} />

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text>
          Don’t have an account? <Text style={{ color: colors.primary, fontWeight: "700" }}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
