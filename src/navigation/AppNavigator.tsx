import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import TabBar from '../components/TabBar';

// Tab screens
import HomeScreen from '../screens/HomeScreen';
import Listings from '../screens/Listings';
import Markets from '../screens/Markets';
import RealEstate from '../screens/Assets';
import Services from '../screens/Services';
import Auctions from '../screens/Auctions';
import AddListing from '../screens/AddListing';

// Stack screens
import ProductDetails from '../screens/ProductDetails';
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
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Listings" component={Listings} />
      <Tab.Screen name="Markets" component={Markets} />
      <Tab.Screen name="Assets" component={RealEstate} options={{ title: 'Assets' }} />
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

