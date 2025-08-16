import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/ui/TopBar";
import { colors } from "../theme";

// Tabs
import HomeScreen from "../screens/HomeScreen";
import ListingsScreen from "../screens/ListingsScreen";
import MarketsScreen from "../screens/MarketsScreen";
import AssetsScreen from "../screens/AssetsScreen";
import ServicesScreen from "../screens/ServicesScreen";
import AuctionsScreen from "../screens/AuctionsScreen";

// Top actions
import MessagesScreen from "../screens/MessagesScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import SearchScreen from "../screens/SearchScreen";
import MenuScreen from "../screens/MenuScreen";
import AddListingScreen from "../screens/AddListingScreen";

// Auth
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";

const Root = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        header: () => <TopBar />,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      <Tabs.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ size }) => <Feather name="home" size={size} /> }} />
      <Tabs.Screen name="Listings" component={ListingsScreen} options={{ tabBarIcon: ({ size }) => <Feather name="list" size={size} /> }} />
      <Tabs.Screen name="Markets" component={MarketsScreen} options={{ tabBarIcon: ({ size }) => <Feather name="map-pin" size={size} /> }} />
      <Tabs.Screen name="Assets" component={AssetsScreen} options={{ tabBarIcon: ({ size }) => <Feather name="briefcase" size={size} /> }} />
      <Tabs.Screen name="Services" component={ServicesScreen} options={{ tabBarIcon: ({ size }) => <Feather name="grid" size={size} /> }} />
      <Tabs.Screen name="Auctions" component={AuctionsScreen} options={{ tabBarIcon: ({ size }) => <Feather name="dollar-sign" size={size} /> }} />
    </Tabs.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <NavigationContainer>
      {user ? (
        <Root.Navigator>
          <Root.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Root.Screen name="AddListing" component={AddListingScreen} options={{ presentation: "modal", title: "New Listing" }} />
          <Root.Screen name="Messages" component={MessagesScreen} options={{ title: "Messages" }} />
          <Root.Screen name="Notifications" component={NotificationsScreen} options={{ title: "Notifications" }} />
          <Root.Screen name="Search" component={SearchScreen} options={{ presentation: "modal", title: "Search" }} />
          <Root.Screen name="Menu" component={MenuScreen} options={{ presentation: "modal", title: "Menu" }} />
        </Root.Navigator>
      ) : (
        <Root.Navigator>
          <Root.Screen name="Login" component={LoginScreen} />
          <Root.Screen name="Signup" component={SignupScreen} />
        </Root.Navigator>
      )}
    </NavigationContainer>
  );
}
