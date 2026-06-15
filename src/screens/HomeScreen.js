import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import colors from '../theme/colors';

// Écran "principal" minimal de démonstration : il matérialise le switch
// automatique vers AppNavigator une fois l'utilisateur connecté, et permet
// d'accéder au Profil ou de se déconnecter (test de la persistance).
export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.greeting}>Bonjour {user?.username} 👋</Text>
        <Text style={styles.subtitle}>
          Bienvenue sur e-joutia, votre marketplace de seconde main.
        </Text>

        <PrimaryButton
          title="Voir mon profil public"
          onPress={() => navigation.navigate('Profile')}
          style={styles.button}
        />
        <PrimaryButton
          title="Se déconnecter"
          variant="outline"
          onPress={logout}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 32,
  },
  button: {
    marginBottom: 12,
  },
});
