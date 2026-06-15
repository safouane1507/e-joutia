import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

// Affiche une note sur 5 sous forme d'étoiles (pleine, demi, vide)
export default function StarRating({ rating, size = 18 }) {
  const stars = [];

  for (let i = 1; i <= 5; i += 1) {
    let iconName = 'star-outline';
    if (rating >= i) {
      iconName = 'star';
    } else if (rating >= i - 0.5) {
      iconName = 'star-half';
    }

    stars.push(
      <Ionicons
        key={i}
        name={iconName}
        size={size}
        color={colors.star}
        style={styles.star}
      />
    );
  }

  return <View style={styles.row}>{stars}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },
});
