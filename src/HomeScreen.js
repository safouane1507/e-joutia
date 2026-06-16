import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { PrimaryButton } from './ui';
import { useAuth } from './AuthContext';
import { colors } from './data';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.greeting}>Bonjour {user?.username} 👋</Text>
        <Text style={styles.subtitle}>Bienvenue sur e-joutia, votre marketplace de seconde main.</Text>

        <PrimaryButton title="Voir mon profil public" onPress={() => navigation.navigate('Profile')} style={styles.button} />
        <PrimaryButton title="Se déconnecter" variant="outline" onPress={logout} style={styles.button} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  greeting: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 32 },
  button: { marginBottom: 12 },
});
