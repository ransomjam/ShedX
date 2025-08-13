import React from "react";
import { View, Text, Button, Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>Profile</Text>
      <Text style={{ fontSize: 16 }}>Name: {user?.name}</Text>
      <Text style={{ fontSize: 16, marginTop: 6 }}>Email: {user?.email}</Text>

      <View style={{ height: 20 }} />
      <Button
        title="Logout"
        onPress={async () => {
          try {
            await logout();
          } catch (e) {
            Alert.alert("Error", "Could not logout");
          }
        }}
      />
    </View>
  );
}
