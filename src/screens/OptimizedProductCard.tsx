import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  product: {
    id: number|string;
    title: string;
    description?: string;
    image?: string;
    imageUrls?: string[];
    price?: number;
    category?: string;
    location?: string;
    verified?: boolean;
    vendorVerified?: boolean;
    vendor?: { id?: number|string; name?: string; avatarUrl?: string };
    ownerId?: number|string;
  };
  currentUserId?: number|string | null;
  onDelete?: (id: number|string) => void;
  onBid?: (id: number|string) => void;
};

export default function OptimizedProductCard({ product, currentUserId, onDelete, onBid }: Props) {
  const nav = useNavigation<any>();
  const img = (product.image || product.imageUrls?.[0]) || 'https://via.placeholder.com/600x400?text=No+Image';
  const verified = product.verified || product.vendorVerified;
  const price = typeof product.price === 'number' ? `FCFA ${Number(product.price).toLocaleString()}` : undefined;
  const trust = Math.min(100, 40 + (Number(product.id) % 60)); // simple deterministic score
  const followers = 100 + (Number(product.id) % 900);

  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' }}>
      {/* Image + top badges */}
      <View>
        <Image source={{ uri: img }} style={{ width: '100%', height: 130 }} />
        <View style={{ position: 'absolute', top: 8, left: 8, flexDirection: 'row', gap: 6 }}>
          {product.category ? (
            <View style={{ backgroundColor: '#111827cc', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 }}>
              <Text style={{ color: '#fff', fontSize: 11 }}>{product.category}</Text>
            </View>
          ) : null}
          {verified ? (
            <View style={{ backgroundColor: '#22c55ecc', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="shield-checkmark" size={12} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 11 }}>Verified</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Body */}
      <View style={{ padding: 10, gap: 6 }}>
        <Text numberOfLines={1} style={{ fontWeight: '800' }}>{product.title}</Text>
        {product.description ? <Text numberOfLines={2} style={{ color: '#64748b', fontSize: 12 }}>{product.description}</Text> : null}
        {price ? <Text style={{ fontWeight: '700' }}>{price}</Text> : null}

        {/* Stats row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="star" size={14} color="#f59e0b" />
            <Text style={{ fontSize: 12 }}>{trust}%</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="people" size={14} color="#64748b" />
            <Text style={{ fontSize: 12 }}>{followers}</Text>
          </View>
          {product.location ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="location-outline" size={14} color="#64748b" />
              <Text numberOfLines={1} style={{ fontSize: 12, color: '#64748b', maxWidth: 140 }}>{product.location}</Text>
            </View>
          ) : null}
        </View>

        {/* Vendor mini row */}
        {product.vendor?.name ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 10 }}>{(product.vendor.name[0] || 'V').toUpperCase()}</Text>
            </View>
            <Text style={{ fontSize: 12, color: '#334155' }}>{product.vendor.name}</Text>
          </View>
        ) : null}

        {/* Actions */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
          <TouchableOpacity onPress={() => nav.navigate('ProductDetails', { productId: product.id })} style={{ flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: '#0f172a', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>View</Text>
          </TouchableOpacity>
          {String(product.ownerId ?? '') === String(currentUserId ?? '') ? (
            <TouchableOpacity onPress={() => onDelete?.(product.id)} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#ef4444' }}>
              <Ionicons name="trash-outline" size={16} color="#fff" />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={() => onBid?.(product.id)} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#2563eb' }}>
            <Ionicons name="pricetags-outline" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
