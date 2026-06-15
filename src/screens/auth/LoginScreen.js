import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import { loginSchema } from '../../validation/schemas';
import { useAuth } from '../../context/AuthContext';
import colors from '../../theme/colors';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      await login(values);
      // Pas besoin de naviguer manuellement : le RootNavigator détecte
      // automatiquement la connexion et bascule vers AppNavigator.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>e-joutia</Text>
        <Text style={styles.subtitle}>
          Connectez-vous pour acheter et vendre près de chez vous
        </Text>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <View>
              <FormField
                label="Email"
                placeholder="exemple@email.com"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={errors.email}
                touched={touched.email}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <FormField
                label="Mot de passe"
                placeholder="6 caractères minimum"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                error={errors.password}
                touched={touched.password}
                secureTextEntry
              />

              <PrimaryButton
                title="Se connecter"
                onPress={handleSubmit}
                loading={isSubmitting}
                style={styles.submitButton}
              />
            </View>
          )}
        </Formik>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Pas encore de compte ?</Text>
          <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
            {' '}Créer un compte
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 32,
  },
  submitButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  link: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
