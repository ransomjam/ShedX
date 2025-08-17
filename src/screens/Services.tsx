import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native';
import { optionalApi } from '../api/optional';

type Service = { id: number|string; title: string; price?: number; image?: string; category?: string; location?: string };

const FALLBACK: Service[] = [
  { id: 1, title: 'Plumbing & Repairs', price: 15000, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200' },
  { id: 2, title: 'House Painting', price: 45000, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200' },
  { id: 3, title: 'Phone Repair', price: 10000, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200' },
  { id: 4, title: 'Catering Service', price: 80000, image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200' },
];

export default function ServicesScreen() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let data = await optionalApi.listServices();
      if (!Array.isArray(data) || !data.length) data = FALLBACK;
      setItems(data as Service[]);
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
          <Image source={{ uri: item.image || 'https://via.placeholder.com/600x400?text=Service' }} style={{ width: '100%', height: 120 }} />
          <View style={{ padding: 10 }}>
            <Text numberOfLines={1} style={{ fontWeight: '800' }}>{item.title}</Text>
            {typeof item.price === 'number' ? <Text>FCFA {Number(item.price).toLocaleString()}</Text> : null}
          </View>
        </View>
      )}
    />
  );
}
