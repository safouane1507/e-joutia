import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/AuthContext';
import LoginScreen from './src/LoginScreen';
import RegisterScreen from './src/RegisterScreen';
import HomeScreen from './src/HomeScreen';
import ProfileScreen from './src/ProfileScreen';
import { colors } from './src/data';

const Stack = createNativeStackNavigator();

// Bascule automatiquement entre la stack d'authentification (Login/Register)
// et la stack principale (Home/Profile) selon l'état de connexion.
function Navigation() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '700' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'e-joutia' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil public' }} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Navigation />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
});
