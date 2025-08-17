import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native';
import { api } from '../api/client';
import { Vendor, Product } from '../types';
import ProductCard from '../components/ProductCard';

export default function VendorProfileScreen({ route }: any) {
  const { vendorId } = route.params || {};
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const v = await api.getVendor(vendorId);
        setVendor(v);
      } catch {}
      try {
        const vp = await api.getVendorProducts(vendorId);
        setProducts(vp || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [vendorId]);

  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;

  return (
    <FlatList
      data={products}
      keyExtractor={(p) => String(p.id)}
      numColumns={2}
      columnWrapperStyle={{ gap: 12 }}
      ListHeaderComponent={
        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Image source={{ uri: vendor?.avatarUrl || 'https://via.placeholder.com/80' }} style={{ width: 64, height: 64, borderRadius: 32 }} />
            <View>
              <Text style={{ fontSize: 18, fontWeight: '800' }}>{vendor?.fullName || vendor?.username || 'Vendor'}</Text>
              {vendor?.location ? <Text style={{ color: '#6b7280' }}>{vendor.location}</Text> : null}
              {vendor?.status ? <Text style={{ color: '#10b981', fontWeight: '600' }}>{vendor.status}</Text> : null}
            </View>
          </View>
          <Text style={{ fontWeight: '700', marginBottom: 8 }}>Products</Text>
        </View>
      }
      contentContainerStyle={{ padding: 16, paddingTop: 0 }}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
}
