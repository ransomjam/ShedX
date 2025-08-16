import React, { useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function OrdersScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    try {
      setLoading(true);
      if (!user) throw new Error("Please login first");
      const payload = { items: [{ id: "p1", qty: 1 }], amount: 25000 };
      const res = await api.post("/orders/checkout", payload);
      Alert.alert("Checkout", `Status: ${res?.status}\nRef: ${res?.ref}`);
    } catch (e: any) {
      Alert.alert("Checkout failed", e?.message || "Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex:1, alignItems:"center", justifyContent:"center", padding:16 }}>
      <Text style={{ fontSize:22, fontWeight:"700", marginBottom:12 }}>Orders</Text>
      <Button title={loading ? "Processing..." : "Mock Checkout"} onPress={checkout} disabled={loading} />
    </View>
  );
}
