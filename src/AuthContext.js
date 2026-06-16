import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@e-joutia/session';
const USERS_KEY = '@e-joutia/users';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaure la session enregistrée au précédent lancement, si elle existe
  useEffect(() => {
    AsyncStorage.getItem(SESSION_KEY)
      .then((json) => json && setUser(JSON.parse(json)))
      .finally(() => setIsLoading(false));
  }, []);

  const register = async ({ username, email, city }) => {
    const users = JSON.parse((await AsyncStorage.getItem(USERS_KEY)) || '[]');
    const newUser = { username, email, city, registeredAt: new Date().toISOString() };
    const updatedUsers = [...users.filter((u) => u.email !== email), newUser];

    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    setUser(newUser);
  };

  const login = async ({ email }) => {
    const users = JSON.parse((await AsyncStorage.getItem(USERS_KEY)) || '[]');
    const existingUser = users.find((u) => u.email === email) || {
      username: email.split('@')[0],
      email,
      city: 'Casablanca',
      registeredAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(existingUser));
    setUser(existingUser);
  };

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return context;
}
