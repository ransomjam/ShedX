import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native';
import { optionalApi } from '../api/optional';

type Asset = { id: number|string; title: string; price?: number; image?: string; category?: string; location?: string };

const FALLBACK: Asset[] = [
  { id: 1, title: 'Dump Truck - Used', price: 12000000, image: 'https://images.unsplash.com/photo-1558980664-10a5e464d3c8?q=80&w=1200' },
  { id: 2, title: 'Excavator 330D', price: 38000000, image: 'https://images.unsplash.com/photo-1606198184758-6015147996b8?q=80&w=1200' },
  { id: 3, title: 'Wheel Loader', price: 24000000, image: 'https://images.unsplash.com/photo-1618172193763-3e4f7955cd30?q=80&w=1200' },
  { id: 4, title: 'Crusher Plant', price: 65000000, image: 'https://images.unsplash.com/photo-1607013407384-11f1b6b9a5f8?q=80&w=1200' },
];

export default function AssetsScreen() {
  const [items, setItems] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let data = await optionalApi.listAssets();
      if (!Array.isArray(data) || !data.length) data = FALLBACK;
      setItems(data as Asset[]);
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
        <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' }}>
          <Image source={{ uri: item.image || 'https://via.placeholder.com/600x400?text=Asset' }} style={{ width: '100%', height: 120 }} />
          <View style={{ padding: 10 }}>
            <Text numberOfLines={1} style={{ fontWeight: '800' }}>{item.title}</Text>
            {typeof item.price === 'number' ? <Text>FCFA {Number(item.price).toLocaleString()}</Text> : null}
          </View>
        </View>
      )}
    />
  );
}
