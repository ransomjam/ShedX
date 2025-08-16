import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function CreateListingScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  if (!user) {
    // Redirect to login if not authenticated
    navigation.navigate("Login");
    return null;
  }

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const submit = async () => {
    try {
      const payload = { title: title.trim(), price: Number(price), image: image.trim() };
      if (!payload.title || !payload.price) {
        Alert.alert("Missing info", "Please fill title and price.");
        return;
      }
      await api.post("/products", payload);
      Alert.alert("Posted", "Your product is live.");
      navigation.navigate("Browse");
    } catch (e: any) {
      if (e?.status === 401) {
        navigation.navigate("Login");
      } else {
        Alert.alert("Post failed", e?.message || "Try again");
      }
    }
  };

  return (
    <View style={{ flex:1, padding:16, gap:12 }}>
      <Text style={{ fontSize:22, fontWeight:"700", marginBottom:12 }}>Create a listing</Text>
      <TextInput
        placeholder="Title (e.g. Granite 20mm)"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth:1, borderColor:"#ddd", borderRadius:8, padding:12 }}
      />
      <TextInput
        placeholder="Price (FCFA)"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
        style={{ borderWidth:1, borderColor:"#ddd", borderRadius:8, padding:12 }}
      />
      <TextInput
        placeholder="Image URL (optional)"
        value={image}
        onChangeText={setImage}
        style={{ borderWidth:1, borderColor:"#ddd", borderRadius:8, padding:12 }}
      />
      <Button title="Publish" onPress={submit} />
    </View>
  );
}
