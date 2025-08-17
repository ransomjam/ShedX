import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '../api/products';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Search'>;

export default function Search() {
  const [q, setQ] = useState('');
  const navigation = useNavigation<Nav>();
  const { data = [], refetch, isFetching } = useQuery({
    queryKey: ['search', q],
    queryFn: () => searchProducts(q),
    enabled: false,
  });

  return (
    <View className="flex-1 p-4 bg-white">
      <View className="flex-row gap-3">
        <TextInput
          placeholder="Search products…"
          value={q}
          onChangeText={setQ}
          onSubmitEditing={() => { refetch(); Keyboard.dismiss(); }}
          className="flex-1 border border-gray-300 rounded-2xl px-4 py-3"
        />
        <TouchableOpacity onPress={() => { refetch(); Keyboard.dismiss(); }} className="px-4 py-3 rounded-2xl bg-black">
          <Text className="text-white">{isFetching ? '...' : 'Go'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        className="mt-4"
        data={data}
        keyExtractor={(item: any) => String(item.id)}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ProductDetails', { id: String(item.id) })}
            className="border border-gray-200 rounded-2xl p-4 mb-3"
          >
            <Text className="font-semibold">{item.title}</Text>
            {item.price ? <Text className="text-gray-600">Price: {item.price}</Text> : null}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text className="text-gray-500 mt-6 text-center">No results</Text>}
      />
    </View>
  );
}
