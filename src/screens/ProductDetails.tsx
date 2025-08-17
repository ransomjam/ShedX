import React, { useMemo } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import ProductMetaRow from '../components/ProductMeta';
import { fetchProductById } from '../api/products';
import type { StackProps } from '../navigation/AppNavigator';

type Params = StackProps<'ProductDetails'>['route']['params'];

function formatMoney(amount?: number, currency?: string) {
  if (amount === undefined || amount === null) return '—';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency || 'XAF' }).format(amount);
  } catch {
    return `${amount} ${currency || ''}`.trim();
  }
}

export default function ProductDetails() {
  const route = useRoute();
  const { id } = (route.params as Params) || ({} as any);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });

  const product: any = data?.product || data;

  const hero = useMemo(() => product?.images?.[0] || null, [product]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
        <Text className="mt-2 text-gray-600">Loading product…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-red-600 font-medium mb-2">Failed to load product.</Text>
        <Text className="text-gray-600 mb-4">{(error as Error)?.message}</Text>
        <TouchableOpacity onPress={() => refetch()} className="px-4 py-2 bg-black rounded-2xl">
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="w-full h-64 bg-gray-100">
          {hero ? (
            <Image source={{ uri: hero }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Text className="text-gray-400">No image</Text>
            </View>
          )}
        </View>

        <View className="p-4">
          <Text className="text-2xl font-bold mb-2">{product?.title || 'Untitled product'}</Text>
          <Text className="text-lg text-gray-800">{formatMoney(product?.price, product?.currency)}</Text>
        </View>

        <View className="px-4 flex-row gap-3">
          <TouchableOpacity className="flex-1 items-center py-3 rounded-2xl bg-black">
            <Text className="text-white font-medium">Your Price</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center py-3 rounded-2xl border border-gray-300">
            <Text className="text-gray-900 font-medium">View Vendor</Text>
          </TouchableOpacity>
        </View>

        <View className="p-4">
          <Text className="text-lg font-semibold mb-2">Details</Text>
          <ProductMetaRow label="Category" value={product?.category} />
          <ProductMetaRow label="Location" value={product?.location} />
          <ProductMetaRow label="Updated" value={product?.updatedAt ? new Date(product.updatedAt).toLocaleString() : undefined} />
          <ProductMetaRow label="Created" value={product?.createdAt ? new Date(product.createdAt).toLocaleString() : undefined} />
        </View>

        {product?.description ? (
          <View className="px-4 pb-6">
            <Text className="text-lg font-semibold mb-2">Description</Text>
            <Text className="text-gray-800 leading-6">{product.description}</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
