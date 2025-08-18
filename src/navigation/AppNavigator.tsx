import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Tab screens
import Home from '../screens/Home';
import Listings from '../screens/Listings';
import Markets from '../screens/Markets';
import Assets from '../screens/Assets';
import Services from '../screens/Services';
import Auctions from '../screens/Auctions';

// Stack screens
import ProductDetails from '../screens/ProductDetails';
import AddListing from '../screens/AddListing';
import Search from '../screens/Search';

export type RootStackParamList = {
  Tabs: undefined;
  Listings: undefined; // for typed navigation inside tab screens
  ProductDetails: { id: string };
  Search: undefined;
  AddListing: undefined;
};

export type StackProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        headerShown: true,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: { borderTopWidth: 0.5, borderTopColor: '#e5e7eb' },
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, string> = {
            Home: 'home-outline',
            Listings: 'grid-outline',
            Markets: 'pricetag-outline',
            Assets: 'briefcase-outline',
            Services: 'bag-outline',
            Auctions: 'cash-outline',
          };
          return <Ionicons name={map[route.name] || 'ellipse-outline'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Listings" component={Listings} />
      <Tab.Screen name="Markets" component={Markets} />
      <Tab.Screen name="Assets" component={Assets} />
      <Tab.Screen name="Services" component={Services} />
      <Tab.Screen name="Auctions" component={Auctions} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#ffffff' } }}>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ title: 'Details' }} />
        <Stack.Screen name="Search" component={Search} options={{ title: 'Search' }} />
        <Stack.Screen name="AddListing" component={AddListing} options={{ title: 'Add Listing' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

