import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import type { RegisterInput } from "../services/api";
import Button from "../components/ui/Button";
import { colors } from "../theme";

export default function SignupScreen() {
  const { register } = useAuth();
  const [form, setForm] = useState<RegisterInput>({
    username: "",
    email: "",
    password: "",
    accountType: "user",
    specialization: "",
    phone: "",
    location: "",
    profilePicture: null,
    businessName: "",
    marketLocation: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
      quality: 0.6,
    });
    if (!res.canceled && res.assets?.[0]?.base64) {
      setForm((f) => ({ ...f, profilePicture: res.assets[0].base64! }));
    }
  };

  const onSubmit = async () => {
    setErr("");
    if (!form.username || !form.password) {
      setErr("Username and password are required");
      return;
    }
    if ((form.accountType === "professional" || form.accountType === "shop_owner") && !form.specialization) {
      setErr("Please specify your specialization");
      return;
    }
    setLoading(true);
    try {
      await register(form);
    } catch (e: any) {
      setErr(e.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const Chip = ({ value, label }: { value: string; label: string }) => (
    <TouchableOpacity
      onPress={() => setForm({ ...form, accountType: value })}
      style={{
        borderWidth: 1,
        borderColor: form.accountType === value ? colors.primary : "#e5e7eb",
        backgroundColor: form.accountType === value ? colors.primary : "white",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text style={{ color: form.accountType === value ? "white" : "black" }}>{label}</Text>
    </TouchableOpacity>
  );

  const Input = (p: { label: string; value: string; onChangeText: (t: string) => void; secure?: boolean; placeholder?: string }) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 6 }}>{p.label}</Text>
      <TextInput
        value={p.value}
        onChangeText={p.onChangeText}
        secureTextEntry={!!p.secure}
        placeholder={p.placeholder}
        autoCapitalize="none"
        style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 6 }}>Create account</Text>

      <Input label="Username" value={form.username} onChangeText={(t) => setForm({ ...form, username: t })} />
      <Input label="Email" value={form.email ?? ""} onChangeText={(t) => setForm({ ...form, email: t })} />
      <Input label="Phone" value={form.phone ?? ""} onChangeText={(t) => setForm({ ...form, phone: t })} />
      <Input label="Location" value={form.location ?? ""} onChangeText={(t) => setForm({ ...form, location: t })} />
      <Input label="Password" value={form.password} onChangeText={(t) => setForm({ ...form, password: t })} secure />

      <View style={{ marginVertical: 6 }}>
        <Text style={{ marginBottom: 6 }}>Account Type</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Chip value="user" label="User" />
          <Chip value="shop_owner" label="Shop owner" />
          <Chip value="professional" label="Professional" />
          <Chip value="real_estate" label="Real estate" />
        </View>
      </View>

      {(form.accountType === "professional" || form.accountType === "shop_owner") && (
        <Input
          label="Specialization"
          value={form.specialization ?? ""}
          onChangeText={(t) => setForm({ ...form, specialization: t })}
          placeholder="e.g. Electrician / Fashion / Electronics"
        />
      )}

      {form.accountType === "shop_owner" && (
        <>
          <Input label="Business Name" value={form.businessName ?? ""} onChangeText={(t) => setForm({ ...form, businessName: t })} />
          <Input label="Market Location" value={form.marketLocation ?? ""} onChangeText={(t) => setForm({ ...form, marketLocation: t })} />
        </>
      )}

      <TouchableOpacity onPress={pickImage} style={{ padding: 12, borderWidth: 1, borderRadius: 10, marginTop: 6, marginBottom: 6 }}>
        <Text>{form.profilePicture ? "Change profile picture" : "Add profile picture"}</Text>
      </TouchableOpacity>

      {err ? <Text style={{ color: "red" }}>{err}</Text> : null}

      <Button title="Create account" onPress={onSubmit} loading={loading} />
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}
