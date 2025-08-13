import React from "react";
import { View, Text, Button } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>Welcome to ProList 🚀</Text>
      <Text style={{ color: "#555", marginBottom: 16 }}>Navigation is configured correctly.</Text>
      <Button title="It works!" onPress={() => {}} />
    </View>
  );
}
