import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/products';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Listings'>;

export default function Listings() {
  const navigation = useNavigation<Nav>();
  const { data = [], isLoading, isError } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });

  if (isLoading) return <View className="flex-1 items-center justify-center"><Text>Loading…</Text></View>;
  if (isError) return <View className="flex-1 items-center justify-center"><Text>Failed to load.</Text></View>;

  return (
    <FlatList
      data={data}
      keyExtractor={(item: any) => String(item.id)}
      contentContainerStyle={{ padding: 12 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductDetails', { id: String(item.id) })}
          className="bg-white rounded-2xl p-4 mb-3 border border-gray-200"
        >
          <Text className="text-base font-semibold mb-1">{item.title}</Text>
          <Text className="text-gray-600">ID: {String(item.id)}</Text>

          <View className="mt-3 flex-row gap-8">
            <TouchableOpacity
              onPress={() => navigation.navigate('ProductDetails', { id: String(item.id) })}
              className="bg-black rounded-2xl py-2 px-4 items-center"
            >
              <Text className="text-white">View</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {/* TODO: Your Price flow */}}
              className="rounded-2xl py-2 px-4 border border-gray-300 items-center"
            >
              <Text className="text-gray-900">Your Price</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
