import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Product } from '../types';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function ProductCard({ product }: { product: Product }) {
  const nav = useNavigation<any>();
  const price = product.price ? `FCFA ${Number(product.price).toLocaleString()}` : '';
  const img = (product.image || (product.imageUrls && product.imageUrls[0])) as string | undefined;
  const verified = (product as any)?.verified || (product as any)?.vendorVerified;

  return (
    <TouchableOpacity onPress={() => nav.navigate('ProductDetails', { productId: product.id })} style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' }}>
        <Image source={{ uri: img || 'https://via.placeholder.com/300x200?text=No+Image' }} style={{ width: '100%', height: 130 }} />
        <View style={{ padding: 10, gap: 4 }}>
          <Text numberOfLines={1} style={{ fontWeight: '700' }}>{product.title}</Text>
          {price ? <Text>{price}</Text> : null}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {product.location ? (<><Ionicons name="location-outline" size={14} color="#64748b" /><Text numberOfLines={1} style={{ color: '#64748b', marginLeft: 4, flex: 1 }}>{product.location}</Text></>) : null}
            {verified ? (<View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}><Ionicons name="shield-checkmark" size={14} color="#22c55e" /><Text style={{ color: '#22c55e', marginLeft: 4, fontSize: 12 }}>Verified</Text></View>) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
