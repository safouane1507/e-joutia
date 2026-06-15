import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

// Stack affichée une fois l'utilisateur connecté
export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'e-joutia' }} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil public' }}
      />
    </Stack.Navigator>
  );
}
