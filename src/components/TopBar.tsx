import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import Badge from './Badge';

function AppLogo() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '800' }}>P</Text>
      </View>
      <View>
        <Text style={{ fontWeight: '800', fontSize: 18, color: '#1e293b' }}>ProList</Text>
        <Text style={{ color: colors.mutedText, fontSize: 11, marginTop: -2 }}>Marketplace</Text>
      </View>
    </View>
  );
}

function RoundIcon({ onPress, children }: React.PropsWithChildren<{ onPress?: () => void }>) {
  return (
    <TouchableOpacity onPress={onPress} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
      {children}
    </TouchableOpacity>
  );
}

export default function TopBar() {
  const nav = useNavigation<any>();
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.bg, borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <AppLogo />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <RoundIcon onPress={() => nav.navigate('AddListing')}>
          <Ionicons name="add" size={20} />
        </RoundIcon>
        <View>
          <RoundIcon onPress={() => nav.navigate('MessagesTab')}>
            <Ionicons name="chatbubbles-outline" size={20} />
          </RoundIcon>
          <Badge value={3} />
        </View>
        <View>
          <RoundIcon onPress={() => nav.navigate('NotificationsTab')}>
            <Ionicons name="notifications-outline" size={20} />
          </RoundIcon>
          <Badge dot />
        </View>
        <RoundIcon onPress={() => nav.navigate('Search')}>
          <Ionicons name="search" size={20} />
        </RoundIcon>
        <RoundIcon onPress={() => nav.navigate('Menu')}>
          <MaterialCommunityIcons name="menu" size={22} />
        </RoundIcon>
      </View>
    </View>
  );
}
