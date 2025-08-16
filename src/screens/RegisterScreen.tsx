import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen() {
  const { register } = useAuth();
  const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password);
      navigation.navigate("Tabs");
    } catch (e: any) {
      Alert.alert("Sign up failed", e?.message || "Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex:1, padding:16, gap:12 }}>
      <Text style={{ fontSize:22, fontWeight:"700", marginBottom:12 }}>Create account</Text>
      <TextInput
        placeholder="Full name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth:1, borderColor:"#ddd", borderRadius:8, padding:12 }}
      />
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth:1, borderColor:"#ddd", borderRadius:8, padding:12 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth:1, borderColor:"#ddd", borderRadius:8, padding:12 }}
      />
      <Button title={loading ? "Please wait..." : "Create account"} onPress={onSubmit} disabled={loading} />
      <View style={{ height: 10 }} />
      <Button title="I already have an account" onPress={() => navigation.navigate("Login")} />
    </View>
  );
}
