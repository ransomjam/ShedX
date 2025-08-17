import React from 'react';
import { View, Text } from 'react-native';

type RowProps = { label: string; value?: string | number | null };
export default function ProductMetaRow({ label, value }: RowProps) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <View className="flex-row justify-between items-start py-2">
      <Text className="text-gray-500 w-32">{label}</Text>
      <Text className="flex-1 pl-3 text-gray-900">{String(value)}</Text>
    </View>
  );
}
