import React from "react";
import { Alert, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useAuth } from "../context/useAuth";

export default function Profile() {
  const { user, token, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Profile</Text>
      <View style={styles.card}>
        <Row label="Name" value={user?.name ?? "—"} />
        <Row label="Email" value={user?.email ?? "—"} />
        <Row label="Token" value={token ? `${token.slice(0, 12)}…` : "—"} />
        <Row label="API Base" value={String(process.env.EXPO_PUBLIC_API_URL || "not set")} />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          Alert.alert("Sign out", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { text: "Sign out", style: "destructive", onPress: logout },
          ]);
        }}
      >
        <Text style={styles.buttonTxt}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  h1: { fontSize: 22, fontWeight: "800", marginBottom: 12 },
  card: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, backgroundColor: "#fff", padding: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#eee" },
  label: { color: "#6B7280" },
  value: { fontWeight: "700" },
  button: { marginTop: 16, backgroundColor: "#111827", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  buttonTxt: { color: "#fff", fontWeight: "700" },
});
