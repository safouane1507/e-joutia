import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './AuthContext';
import { colors, MOCK_REVIEWS, TRUST_BADGES, getAverageRating } from './data';

function StarRating({ rating, size = 18 }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={rating >= i ? 'star' : rating >= i - 0.5 ? 'star-half' : 'star-outline'}
          size={size}
          color={colors.star}
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );
}

function ReviewCard({ review }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
      <View style={{ flex: 1 }}>
        <View style={styles.cardHeader}>
          <Text style={styles.author}>{review.author}</Text>
          <Text style={styles.date}>{review.date}</Text>
        </View>
        <StarRating rating={review.rating} size={14} />
        <Text style={styles.comment}>{review.comment}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { user } = useAuth();
  const averageRating = getAverageRating(MOCK_REVIEWS);
  const avatarUri = `https://api.dicebear.com/7.x/micah/png?seed=${user?.username || 'Guest'}`;
  const registeredDate = user?.registeredAt
    ? new Date(user.registeredAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={MOCK_REVIEWS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ReviewCard review={item} />}
      ListHeaderComponent={
        <View>
          <View style={styles.header}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <Text style={styles.name}>{user?.username}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color={colors.textMuted} />
              <Text style={styles.infoText}>{user?.city}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
              <Text style={styles.infoText}>Membre depuis le {registeredDate}</Text>
            </View>

            <View style={styles.badgesRow}>
              {TRUST_BADGES.map((badge) => (
                <View key={badge.id} style={styles.badge}>
                  <Ionicons name={badge.icon} size={14} color={colors.badgeText} style={{ marginRight: 6 }} />
                  <Text style={styles.badgeLabel}>{badge.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.ratingRow}>
              <StarRating rating={averageRating} size={20} />
              <Text style={styles.ratingValue}>{averageRating.toFixed(1)} / 5</Text>
              <Text style={styles.reviewCount}>({MOCK_REVIEWS.length} avis)</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Avis des acheteurs</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32 },
  header: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 12, backgroundColor: colors.border },
  name: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  infoText: { marginLeft: 6, color: colors.textMuted, fontSize: 13 },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 },
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
  badgeLabel: { color: colors.badgeText, fontSize: 13, fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  ratingValue: { marginLeft: 8, fontWeight: '700', color: colors.text, fontSize: 15 },
  reviewCount: { marginLeft: 6, color: colors.textMuted, fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  author: { fontWeight: '700', color: colors.text, fontSize: 14 },
  date: { color: colors.textMuted, fontSize: 12 },
  comment: { color: colors.text, fontSize: 13, marginTop: 6, lineHeight: 18 },
});
