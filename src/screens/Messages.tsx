import React from 'react';
import { View, Text } from 'react-native';

export default function Messages() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-lg font-semibold mb-2">Messages</Text>
      <Text className="text-gray-600 text-center">
        Placeholder screen. Next step: wire Socket.IO and /api/messages endpoints.
      </Text>
    </View>
  );
}
