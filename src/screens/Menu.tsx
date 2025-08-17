import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function MenuScreen() {
  const { signOut } = useAuth();

  const Item = ({ label, onPress }: { label: string; onPress?: () => void }) => (
    <TouchableOpacity onPress={onPress} style={{ padding: 14, borderBottomWidth: 1, borderColor: '#e5e7eb' }}>
      <Text style={{ fontWeight: '600' }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={{ backgroundColor: '#fff' }}>
      <Item label="Profile" />
      <Item label="Saved" />
      <Item label="Orders" />
      <Item label="Settings" />
      <Item label="Help & Support" />
      <Item label="Sign out" onPress={signOut} />
    </ScrollView>
  );
}
