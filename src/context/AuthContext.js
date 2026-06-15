import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clés utilisées dans AsyncStorage
const SESSION_KEY = '@e-joutia/session'; // utilisateur actuellement connecté
const USERS_KEY = '@e-joutia/users'; // "base de données" locale simulée

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au lancement de l'app, on regarde si une session a déjà été
  // enregistrée précédemment (=> persistance de la connexion).
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const sessionJson = await AsyncStorage.getItem(SESSION_KEY);
        if (sessionJson) {
          setUser(JSON.parse(sessionJson));
        }
      } catch (error) {
        console.warn('Impossible de restaurer la session :', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Inscription : on simule l'enregistrement du nouvel utilisateur dans une
  // "base de données" locale, puis on connecte automatiquement la personne.
  const register = async ({ username, email, password, city }) => {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    const users = usersJson ? JSON.parse(usersJson) : [];

    const newUser = {
      username,
      email,
      city,
      registeredAt: new Date().toISOString(),
    };

    const updatedUsers = [...users.filter((u) => u.email !== email), newUser];

    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    setUser(newUser);
  };

  // Connexion : on recherche l'utilisateur par email dans la "base" locale.
  // S'il n'existe pas (cas de démo), on crée un profil générique afin que
  // l'écran Profil reste exploitable.
  const login = async ({ email }) => {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    const users = usersJson ? JSON.parse(usersJson) : [];

    const existingUser =
      users.find((u) => u.email === email) ||
      {
        username: email.split('@')[0],
        email,
        city: 'Casablanca',
        registeredAt: new Date().toISOString(),
      };

    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(existingUser));
    setUser(existingUser);
  };

  // Déconnexion : on efface uniquement la session active.
  const logout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook pratique pour accéder à l'état d'authentification depuis les écrans
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}
