import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const iconFor = (name: string, focused: boolean) => {
  const size = 22;
  const tint = focused ? colors.primary : '#475569';
  switch (name) {
    case 'Home': return <Ionicons name="home-outline" size={size} color={tint} />;
    case 'Listings': return <Ionicons name="bag-handle-outline" size={size} color={tint} />;
    case 'Markets': return <MaterialCommunityIcons name="storefront" size={size} color={tint} />;
    case 'Assets': return <Ionicons name="cube-outline" size={size} color={tint} />;
    case 'Services': return <Ionicons name="briefcase-outline" size={size} color={tint} />;
    case 'Auctions': return <MaterialIcons name="gavel" size={size} color={tint} />;
    default: return <Ionicons name="ellipse-outline" size={size} color={tint} />;
  }
};

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 6, paddingHorizontal: 6, justifyContent: 'space-between' }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={{ flex: 1, alignItems: 'center', paddingVertical: 6, gap: 4 }}>
              {iconFor(route.name, isFocused)}
              <Text style={{ fontSize: 12, color: isFocused ? colors.primary : '#475569' }}>{String(label)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
