import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../theme/colors';
export default function Badge({ value, dot=false }: { value?: number|string; dot?: boolean }) {
  if (dot) return <View style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.brandGreen }} />;
  if (!value) return null;
  return (
    <View style={{ position: 'absolute', top: -6, right: -6, backgroundColor: colors.danger, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, minWidth: 18, alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{String(value)}</Text>
    </View>
  );
}
