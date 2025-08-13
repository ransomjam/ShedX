import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, Button } from "react-native";
import client from "@/api/client";
import StatusBadge from "@/components/StatusBadge";

type Order = {
  id: string;
  product?: { title: string; images?: string[] };
  quantity: number;
  total_price: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    try {
      const { data } = await client.get("/orders");
      setOrders(data.items || data);
    } catch (e) {
      Alert.alert("Error", "Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const confirmDelivery = async (id: string) => {
    try {
      setBusy(id);
      await client.put(`/orders/${id}/status`, { action: "confirm_delivery" });
      await load();
      Alert.alert("Success", "Delivery confirmed. Funds will be released to the seller.");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Could not confirm delivery");
    } finally {
      setBusy(null);
    }
  };

  const cancelOrder = async (id: string) => {
    try {
      setBusy(id);
      await client.put(`/orders/${id}/status`, { action: "cancel" });
      await load();
      Alert.alert("Order cancelled");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Could not cancel order");
    } finally {
      setBusy(null);
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
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>My Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.product?.title ?? "Product"}</Text>
            <Text style={{ marginTop: 4 }}>Qty: {item.quantity}</Text>
            <Text>Total: FCFA {Number(item.total_price || 0).toLocaleString()}</Text>
            <View style={{ marginTop: 6 }}>
              <StatusBadge status={item.status} />
            </View>
            <Text style={{ color: "#666", marginTop: 6 }}>{new Date(item.created_at).toLocaleString()}</Text>

            {/* Actions */}
            <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
              {(item.status === "shipped" || item.status === "confirmed") && (
                <View style={{ flex: 1 }}>
                  <Button title={busy === item.id ? "Confirming..." : "Confirm delivery"} onPress={() => confirmDelivery(item.id)} />
                </View>
              )}
              {item.status === "pending" && (
                <View style={{ flex: 1 }}>
                  <Button color={"#ef4444"} title={busy === item.id ? "Cancelling..." : "Cancel order"} onPress={() => cancelOrder(item.id)} />
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}
