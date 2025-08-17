import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CategoryPills({
  categories,
  active,
  onChange,
}: {
  categories: string[];
  active: string;
  onChange: (c: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8, gap: 8 }}>
      {categories.map((c) => {
        const focused = c === active;
        return (
          <TouchableOpacity key={c} onPress={() => onChange(c)}>
            <View style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: focused ? '#2563eb' : '#e5e7eb', backgroundColor: focused ? '#dbeafe' : '#fff' }}>
              <Text style={{ color: focused ? '#1e40af' : '#334155', fontWeight: focused ? '700' : '500' }}>{c}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
