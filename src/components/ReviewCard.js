import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import StarRating from './StarRating';
import colors from '../theme/colors';

// Carte affichant un avis laissé par un autre utilisateur
export default function ReviewCard({ review }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: review.avatar }} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.author}>{review.author}</Text>
          <Text style={styles.date}>{review.date}</Text>
        </View>
        <StarRating rating={review.rating} size={14} />
        <Text style={styles.comment}>{review.comment}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  author: {
    fontWeight: '700',
    color: colors.text,
    fontSize: 14,
  },
  date: {
    color: colors.textMuted,
    fontSize: 12,
  },
  comment: {
    color: colors.text,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
});
