import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

// Screens
import Listings from "../screens/Listings";

// Simple placeholders to avoid import errors until real screens are wired
function HomeScreen() {
  return <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}><Text style={{ fontSize:18 }}>Home</Text></View>;
}
function MarketsScreen() {
  return <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}><Text style={{ fontSize:18 }}>Markets</Text></View>;
}
function AssetsScreen() {
  return <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}><Text style={{ fontSize:18 }}>Assets</Text></View>;
}
function ServicesScreen() {
  return <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}><Text style={{ fontSize:18 }}>Services</Text></View>;
}
function AuctionsScreen() {
  return <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}><Text style={{ fontSize:18 }}>Auctions</Text></View>;
}

// Detail routes used by Listings
import ProductDetails from "../screens/ProductDetails";
import AddListing from "../screens/AddListing";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const Tabs = () => (
  <Tab.Navigator
    initialRouteName="Listings"
    screenOptions={({ route }) => ({
      headerTitleAlign: "center",
      tabBarShowLabel: true,
      tabBarActiveTintColor: "#2563eb",
      tabBarInactiveTintColor: "#64748b",
      tabBarStyle: { borderTopWidth: 0.5, borderTopColor: "#e5e7eb" },
      tabBarIcon: ({ color, size }) => {
        const map: any = {
          Home: "home-outline",
          Listings: "grid-outline",
          Markets: "pricetag-outline",
          Assets: "briefcase-outline",
          Services: "bag-outline",
          Auctions: "cash-outline",
        };
        return <Ionicons name={map[route.name] || "ellipse-outline"} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Listings" component={Listings} />
    <Tab.Screen name="Markets" component={MarketsScreen} />
    <Tab.Screen name="Assets" component={AssetsScreen} />
    <Tab.Screen name="Services" component={ServicesScreen} />
    <Tab.Screen name="Auctions" component={AuctionsScreen} />
  </Tab.Navigator>
);

export default function AppNavigator() {
  return (
    <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: "#ffffff" } }}>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ title: "Details" }} />
        <Stack.Screen name="AddListing" component={AddListing} options={{ title: "Add Listing" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
