import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { optionalApi } from '../api/optional';

type Market = { id: number|string; name: string; image?: string };

const FALLBACK: Market[] = [
  { id: 1, name: 'Food Market', image: 'https://images.unsplash.com/photo-1543168256-418811576931?q=80&w=1200' },
  { id: 2, name: 'Material', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200' },
  { id: 3, name: 'Electronics Hub', image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200' },
  { id: 4, name: 'Clothing & Fashion', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200' },
];

export default function MarketsScreen() {
  const [items, setItems] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let data = await optionalApi.listMarkets();
      if (!Array.isArray(data) || !data.length) data = FALLBACK;
      setItems(data as Market[]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}><ActivityIndicator /></View>;

  return (
    <FlatList
      data={items}
      keyExtractor={(m) => String(m.id)}
      numColumns={2}
      columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
      contentContainerStyle={{ paddingVertical: 16, gap: 12 }}
      renderItem={({ item }) => (
        <TouchableOpacity style={{ flex: 1 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' }}>
            <Image source={{ uri: item.image || 'https://via.placeholder.com/600x400?text=Market' }} style={{ width: '100%', height: 120 }} />
            <View style={{ padding: 10 }}>
              <Text style={{ fontWeight: '800' }}>{item.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
