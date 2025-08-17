import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { optionalApi } from '../api/optional';

type Noti = { id: number|string; title: string; body?: string; read?: boolean; ts?: string };

const FALLBACK: Noti[] = [
  { id: 1, title: 'Welcome to ProList', body: 'Thanks for joining! Start by exploring verified businesses.', read: false },
  { id: 2, title: 'Vendor response', body: 'Bright Phones replied to your message.', read: false },
  { id: 3, title: 'Price drop', body: 'A product you saved has a new price.', read: true },
];

export default function NotificationsScreen() {
  const [items, setItems] = useState<Noti[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let data = await optionalApi.listNotifications();
      if (!Array.isArray(data) || !data.length) data = FALLBACK;
      setItems(data as Noti[]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}><ActivityIndicator /></View>;

  return (
    <FlatList
      data={items}
      keyExtractor={(m) => String(m.id)}
      contentContainerStyle={{ padding: 16, gap: 10 }}
      renderItem={({ item }) => (
        <View style={{ padding: 12, borderRadius: 12, borderWidth: 1, borderColor: item.read ? '#e5e7eb' : '#2563eb33', backgroundColor: item.read ? '#fff' : '#dbeafe' }}>
          <Text style={{ fontWeight: '800', marginBottom: 4 }}>{item.title}</Text>
          {item.body ? <Text style={{ color: '#475569' }}>{item.body}</Text> : null}
        </View>
      )}
    />
  );
}
