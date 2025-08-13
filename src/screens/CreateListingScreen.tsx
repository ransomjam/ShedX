import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import client from "@/api/client";
import { uploadFile } from "@/utils/upload";

export default function CreateListingScreen() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState("");
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert("Permission needed", "Please allow photo access to upload images.");
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8
    });
    if (!res.canceled) {
      const uri = res.assets[0].uri;
      setLocalImage(uri);
    }
  };

  const doUpload = async () => {
    if (!localImage) return;
    try {
      setLoading(true);
      const url = await uploadFile(localImage);
      setImageUrl(url);
      Alert.alert("Uploaded", "Image uploaded successfully.");
    } catch (e: any) {
      Alert.alert("Upload failed", e?.message || "Could not upload image");
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!title || !price) return Alert.alert("Missing info", "Title and price are required.");
    try {
      setLoading(true);
      const payload = {
        title,
        price: Number(price),
        description,
        images: imageUrl ? [imageUrl] : []
      };
      await client.post("/products", payload);
      Alert.alert("Success", "Listing created");
      setTitle("");
      setPrice("");
      setDescription("");
      setLocalImage(null);
      setImageUrl(null);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Could not create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 16 }}>Sell an item</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 12 }}
      />
      <TextInput
        placeholder="Price (FCFA)"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 12 }}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, minHeight: 100 }}
      />

      <View style={{ height: 12 }} />

      {localImage ? (
        <Image source={{ uri: localImage }} style={{ width: "100%", height: 200, borderRadius: 10, marginBottom: 10 }} />
      ) : null}

      <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <Button title="Pick image" onPress={pickImage} />
        </View>
        <View style={{ flex: 1 }}>
          <Button title={loading ? "Uploading..." : "Upload"} onPress={doUpload} />
        </View>
      </View>

      <Button title={loading ? "Saving..." : "Create listing"} onPress={submit} />
    </ScrollView>
  );
}
