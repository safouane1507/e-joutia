import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

// Petit badge "pilule" affichant une icône + un libellé de confiance
// (ex: "Profil vérifié", "Répond rapidement")
export default function TrustBadge({ label, icon }) {
  return (
    <View style={styles.badge}>
      <Ionicons name={icon} size={14} color={colors.badgeText} style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.badgeBackground,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    color: colors.badgeText,
    fontSize: 13,
    fontWeight: '600',
  },
});
