import React, { useMemo, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getVendorApplicationAPI } from "../services/api";
import { colors, spacing, typography, radii } from "../theme";
import Button from "../components/ui/Button";

const CATEGORIES = [
  "electronics","phones","laptops","computers","fashion","beauty",
  "home_office","furniture","vehicles","real_estate","services","groceries"
];

export default function AddListingScreen() {
  const nav = useNavigation<any>();
  const qc = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id as number | undefined;

  const { data: vendorApp } = useQuery({
    queryKey: ["vendorApplication", userId],
    queryFn: () => getVendorApplicationAPI(userId as number),
    enabled: !!userId,
  });

  const isVerified = (vendorApp?.status === "Basic Verified" || vendorApp?.status === "Premium Verified");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(""); // required
  const [price, setPrice] = useState(""); // string (as web)
  const [description, setDescription] = useState(""); // optional
  const [location, setLocation] = useState(vendorApp?.location || user?.location || "");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      quality: 0.6,
      base64: true,
      allowsEditing: true,
      aspect: [4,3]
    });
    if (!res.canceled && res.assets?.[0]) {
      const a = res.assets[0];
      const mime = a.mimeType || "image/jpeg";
      const base64 = a.base64;
      if (base64) {
        setImageDataUrl(`data:${mime};base64,${base64}`);
      }
    }
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Not logged in");
      if (!isVerified) throw new Error("Your business must be verified to list products.");
      if (!title || !category || !price) throw new Error("Please fill all required fields.");

      const body = {
        vendorId: userId,
        title,
        category,
        price,
        description,
        location: location || vendorApp?.location || "Bamenda",
        imageUrls: imageDataUrl ? [imageDataUrl] : []
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to create product listing");
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/products"] });
      qc.invalidateQueries({ queryKey: ["vendorProducts", userId] });
      Alert.alert("Success", "Your product has been listed successfully.", [
        { text: "OK", onPress: () => nav.goBack() }
      ]);
    },
    onError: (e: any) => {
      Alert.alert("Error", e?.message || "Failed to create product listing");
    }
  });

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <Text style={typography.h2}>Create Listing</Text>
      {!isVerified && (
        <View style={{ padding: spacing.md, backgroundColor: "#fff7ed", borderRadius: radii.md, borderWidth: 1, borderColor: "#fcd34d" }}>
          <Text style={{ fontWeight: "700", marginBottom: 4 }}>Get Your Business Verified!</Text>
          <Text style={{ color: colors.muted }}>
            Verified listings get more views and higher customer trust. Please complete vendor verification on the web.
          </Text>
        </View>
      )}

      {/* Title */}
      <Field label="Title">
        <TextInput value={title} onChangeText={setTitle} placeholder="e.g. HP Laptop 15" style={inputStyle} />
      </Field>

      {/* Category pills */}
      <Field label="Category">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setCategory(c)}
                style={{
                  borderWidth: 1,
                  borderColor: active ? colors.primary : "#e5e7eb",
                  backgroundColor: active ? colors.primary : "white",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 999
                }}
              >
                <Text style={{ color: active ? "white" : colors.text, fontWeight: "700" }}>
                  {c.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Field>

      {/* Price */}
      <Field label="Price (XAF)">
        <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="50000" style={inputStyle} />
      </Field>

      {/* Description */}
      <Field label="Description">
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Write a short description"
          style={[inputStyle, { height: 100, textAlignVertical: "top" }]}
          multiline
        />
      </Field>

      {/* Location */}
      <Field label="Location">
        <TextInput value={location} onChangeText={setLocation} placeholder="Bamenda" style={inputStyle} />
      </Field>

      {/* Image */}
      <Field label="Image">
        <TouchableOpacity onPress={pickImage} style={{ padding: 12, borderWidth: 1, borderRadius: 10 }}>
          <Text>{imageDataUrl ? "Change image" : "Select image"}</Text>
        </TouchableOpacity>
        {imageDataUrl && <Image source={{ uri: imageDataUrl }} style={{ width: "100%", height: 160, marginTop: 8, borderRadius: 10 }} />}
      </Field>

      <Button title="Publish Listing" onPress={() => createMutation.mutate()} loading={createMutation.isPending} />
      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={{ marginBottom: 6, fontWeight: "700" }}>{label}</Text>
      {children}
    </View>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: "#e5e7eb",
  borderRadius: 10,
  padding: 12
} as const;
