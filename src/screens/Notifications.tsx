import React from 'react';
import { View, Text } from 'react-native';

export default function Notifications() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-lg font-semibold mb-2">Notifications</Text>
      <Text className="text-gray-600 text-center">
        Placeholder screen. Next step: poll /api/notifications or use websockets.
      </Text>
    </View>
  );
}
