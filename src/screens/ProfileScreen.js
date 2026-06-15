import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StarRating from '../components/StarRating';
import TrustBadge from '../components/TrustBadge';
import ReviewCard from '../components/ReviewCard';
import { useAuth } from '../context/AuthContext';
import { MOCK_REVIEWS, TRUST_BADGES, getAverageRating } from '../data/mockProfile';
import colors from '../theme/colors';

// Écran "Profil Public" (vue vendeur) : photo, nom, localisation, date
// d'inscription, badges de confiance et avis laissés par d'autres
// utilisateurs (données fictives pour ce module).
export default function ProfileScreen() {
  const { user } = useAuth();
  const averageRating = getAverageRating(MOCK_REVIEWS);

  const avatarUri = `https://i.pravatar.cc/300?u=${user?.email || 'e-joutia'}`;

  const registeredDate = user?.registeredAt
    ? new Date(user.registeredAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
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
                <TrustBadge key={badge.id} label={badge.label} icon={badge.icon} />
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
    backgroundColor: colors.border,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 6,
    color: colors.textMuted,
    fontSize: 13,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  ratingValue: {
    marginLeft: 8,
    fontWeight: '700',
    color: colors.text,
    fontSize: 15,
  },
  reviewCount: {
    marginLeft: 6,
    color: colors.textMuted,
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
});
