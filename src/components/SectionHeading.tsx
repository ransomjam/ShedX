import React from 'react';
import { View, Text } from 'react-native';

export default function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ fontSize: 22, fontWeight: '900', color: '#2563eb' }}>{title}</Text>
      {subtitle ? <Text style={{ color: '#6b7280', marginTop: 4 }}>{subtitle}</Text> : null}
    </View>
  );
}
