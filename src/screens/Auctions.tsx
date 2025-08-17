import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { optionalApi } from '../api/optional';

type AuctionItem = { id: number|string; title: string; image?: string; location?: string; originalPrice?: number|string; currentBid?: number|string; endsIn?: string };

const FALLBACK: AuctionItem[] = [
  { id: 1, title: 'iPhone 13 Pro', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200', location: 'Yaoundé', originalPrice: 'FCFA 550,000', currentBid: 'FCFA 315,000', endsIn: '2h 14m' },
  { id: 2, title: 'Dell XPS 13', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200', location: 'Bamenda', originalPrice: 'FCFA 800,000', currentBid: 'FCFA 410,000', endsIn: '5h 02m' },
  { id: 3, title: 'Yamaha Generator', image: 'https://images.unsplash.com/photo-1556909218-31e11d3720f7?q=80&w=1200', location: 'Buea', originalPrice: 'FCFA 300,000', currentBid: 'FCFA 155,000', endsIn: '1d 3h' },
];

export default function AuctionsScreen() {
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let data = await optionalApi.listAuctions();
      if (!Array.isArray(data) || !data.length) data = FALLBACK;
      setItems(data as AuctionItem[]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}><ActivityIndicator /></View>;

  return (
    <FlatList
      data={items}
      keyExtractor={(m) => String(m.id)}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      renderItem={({ item }) => (
        <TouchableOpacity>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' }}>
            <Image source={{ uri: item.image || 'https://via.placeholder.com/600x400?text=Auction' }} style={{ width: '100%', height: 150 }} />
            <View style={{ padding: 10 }}>
              <Text style={{ fontWeight: '800' }}>{item.title}</Text>
              {item.location ? <Text style={{ color: '#6b7280' }}>{item.location}</Text> : null}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
                {item.originalPrice ? <Text style={{ textDecorationLine: 'line-through', color: '#9ca3af' }}>{String(item.originalPrice)}</Text> : null}
                {item.currentBid ? <Text style={{ fontWeight: '800', color: '#10b981' }}>{String(item.currentBid)}</Text> : null}
                {item.endsIn ? <Text style={{ marginLeft: 'auto', color: '#ef4444' }}>{item.endsIn}</Text> : null}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
