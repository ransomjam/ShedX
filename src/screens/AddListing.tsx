import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from "react-native";

export default function AddListing() {
  const simulateAdd = async () => {
    await AsyncStorage.setItem("product_added", "1");
    DeviceEventEmitter.emit("product_added");
    alert("Simulated add: Listings will auto-refresh on back.");
  };

  return (
    <View style={{ flex:1, padding:16, alignItems:"center", justifyContent:"center" }}>
      <Text style={{ fontSize:22, fontWeight:"900", marginBottom:12 }}>Add Listing</Text>
      <Text style={{ color:"#64748b", textAlign:"center", marginBottom:16 }}>
        Replace this with your real add-listing form.
      </Text>
      <TouchableOpacity onPress={simulateAdd} style={{ backgroundColor:"#2563eb", paddingVertical:12, paddingHorizontal:16, borderRadius:12 }}>
        <Text style={{ color:"#fff", fontWeight:"800" }}>Simulate Add & Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}
