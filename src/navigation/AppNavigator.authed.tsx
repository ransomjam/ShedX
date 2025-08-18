import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "../context/useAuth";

// Screens
import Login from "../screens/Login";
import Messages from "../screens/Messages";
import ChatThread from "../screens/ChatThread";
import Notifications from "../screens/Notifications";

const Placeholder = ({ title }: { title: string }) => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <Text style={{ padding: 16 }}>{title}</Text>
  </View>
);

const HomePlaceholder: React.FC = () => (
  <Placeholder title="Home (hook up your Home screen here)" />
);
const ListingsPlaceholder: React.FC = () => (
  <Placeholder title="Listings (hook up your Listings screen here)" />
);
const ProfilePlaceholder: React.FC = () => (
  <Placeholder title="Profile (hook up your Profile screen here)" />
);

// ---- Param Lists ----
export type RootStackParamList = {
  Tabs: undefined;
  ChatThread: { threadId: string; peerId?: string; title?: string };
  Login: undefined;
};

export type TabsParamList = {
  Home: undefined;
  Listings: undefined;
  MessagesTab: undefined;
  NotificationsTab: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabsParamList>();

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomePlaceholder}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Listings"
        component={ListingsPlaceholder}
        options={{ title: "Listings" }}
      />
      <Tab.Screen name="MessagesTab" component={Messages} options={{ title: "Messages" }} />
      <Tab.Screen name="NotificationsTab" component={Notifications} options={{ title: "Alerts" }} />
      <Tab.Screen
        name="Profile"
        component={ProfilePlaceholder}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "#fff" },
};

export default function AppNavigator() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 6, color: "#666" }}>Restoring session…</Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerBackTitle: "Back" }}>
        {token ? (
          <>
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="ChatThread" component={ChatThread} options={{ title: "Chat" }} />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
