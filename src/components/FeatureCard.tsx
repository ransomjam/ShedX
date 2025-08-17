import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function FeatureCard({ title, subtitle, icon }: { title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={{ backgroundColor: colors.bg, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 }}>
      <View style={{ alignSelf: 'center', width: 64, height: 64, borderRadius: 16, backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Ionicons name={icon} size={28} color={colors.primary} />
      </View>
      <Text style={{ fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: 6 }}>{title}</Text>
      <Text style={{ textAlign: 'center', color: colors.mutedText }}>{subtitle}</Text>
    </View>
  );
}
