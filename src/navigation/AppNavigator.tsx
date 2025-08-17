import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import Listings from '../screens/Listings';
import ProductDetails from '../screens/ProductDetails';
import Search from '../screens/Search';
import Messages from '../screens/Messages';
import Notifications from '../screens/Notifications';

export type RootStackParamList = {
  Listings: undefined;
  ProductDetails: { id: string };
  Search: undefined;
  Messages: undefined;
  Notifications: undefined;
};

export type StackProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Listings" component={Listings} options={{ title: 'Listings' }} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ title: 'Product details' }} />
        <Stack.Screen name="Search" component={Search} options={{ title: 'Search' }} />
        <Stack.Screen name="Messages" component={Messages} options={{ title: 'Messages' }} />
        <Stack.Screen name="Notifications" component={Notifications} options={{ title: 'Notifications' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
