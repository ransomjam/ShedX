import React from "react";
import { View, Text } from "react-native";
import { colors, spacing, typography } from "../../theme";
import IconButton from "./IconButton";
import { useNavigation } from "@react-navigation/native";

export default function TopBar() {
  const nav = useNavigation<any>();
  return (
    <View style={{ backgroundColor: "white", paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
      flexDirection:"row", alignItems:"center", justifyContent:"space-between", borderBottomWidth:1, borderColor:"#eef2f2" }}>
      <Text style={{ ...typography.h2, color: colors.primary }}>ProList</Text>
      <View style={{ flexDirection:"row", alignItems:"center" }}>
        <IconButton name="plus-circle" onPress={() => nav.navigate("AddListing")} />
        <IconButton name="message-circle" badge={3} onPress={() => nav.navigate("Messages")} />
        <IconButton name="bell" onPress={() => nav.navigate("Notifications")} />
        <IconButton name="search" onPress={() => nav.navigate("Search")} />
        <IconButton name="menu" onPress={() => nav.navigate("Menu")} />
      </View>
    </View>
  );
}
