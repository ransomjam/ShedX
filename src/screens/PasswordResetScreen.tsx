import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import client from "@/api/client";

export default function PasswordResetScreen() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [loading, setLoading] = useState(false);

  const requestReset = async () => {
    if (!email) return Alert.alert("Missing email", "Please enter your account email.");
    try {
      setLoading(true);
      await client.post("/auth/request-reset", { email });
      Alert.alert("Check your email", "We sent a reset code.");
      setStep("confirm");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Could not request reset");
    } finally {
      setLoading(false);
    }
  };

  const confirmReset = async () => {
    if (!code || !newPassword) return Alert.alert("Missing info", "Enter code and new password.");
    try {
      setLoading(true);
      await client.post("/auth/reset", { email, code, newPassword });
      Alert.alert("Success", "Password has been reset. You can now log in.");
      setStep("request");
      setEmail("");
      setCode("");
      setNewPassword("");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>Reset Password</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 12 }}
      />

      {step === "confirm" && (
        <>
          <TextInput
            placeholder="Reset code"
            value={code}
            onChangeText={setCode}
            style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 12 }}
          />
          <TextInput
            placeholder="New password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 12 }}
          />
        </>
      )}

      {step === "request" ? (
        <Button title={loading ? "Sending..." : "Send reset code"} onPress={requestReset} />
      ) : (
        <Button title={loading ? "Resetting..." : "Confirm reset"} onPress={confirmReset} />
      )}
    </View>
  );
}
