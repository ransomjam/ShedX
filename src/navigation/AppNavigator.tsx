import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

// Screens (ensure these paths match your project)
import Messages from "../screens/Messages";
import ChatThread from "../screens/ChatThread";
import Notifications from "../screens/Notifications";

// Optional: existing app screens (use placeholders if not present yet)
const Placeholder = ({ title }: { title: string }) => <Text style={{ padding: 16 }}>{title}</Text>;

// ---- Param Lists ----
export type RootStackParamList = {
  Tabs: undefined;
  ChatThread: { threadId: string; peerId?: string; title?: string };
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
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        // @ts-ignore
        component={() => <Placeholder title="Home (hook up your Home screen here)" />}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Listings"
        // @ts-ignore
        component={() => <Placeholder title="Listings (hook up your Listings screen here)" />}
        options={{ title: "Listings" }}
      />
      <Tab.Screen
        name="MessagesTab"
        component={Messages}
        options={{ title: "Messages" }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={Notifications}
        options={{ title: "Alerts" }}
      />
      <Tab.Screen
        name="Profile"
        // @ts-ignore
        component={() => <Placeholder title="Profile (hook up your Profile screen here)" />}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#fff",
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatThread"
          component={ChatThread}
          options={{ title: "Chat" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
