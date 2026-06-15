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
import { registerSchema } from '../../validation/schemas';
import { useAuth } from '../../context/AuthContext';
import colors from '../../theme/colors';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  const handleRegister = async (values, { setSubmitting }) => {
    try {
      await register(values);
      // Le RootNavigator bascule automatiquement vers AppNavigator
      // dès que `user` est renseigné dans AuthContext.
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
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>
          Rejoignez la communauté e-joutia en quelques secondes
        </Text>

        <Formik
          initialValues={{
            username: '',
            city: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={registerSchema}
          onSubmit={handleRegister}
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
                label="Nom d'utilisateur"
                placeholder="ex: Karim Bennani"
                value={values.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                error={errors.username}
                touched={touched.username}
              />
              <FormField
                label="Ville de résidence"
                placeholder="ex: Casablanca"
                value={values.city}
                onChangeText={handleChange('city')}
                onBlur={handleBlur('city')}
                error={errors.city}
                touched={touched.city}
              />
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
              <FormField
                label="Confirmer le mot de passe"
                placeholder="Retapez votre mot de passe"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                secureTextEntry
              />

              <PrimaryButton
                title="S'inscrire"
                onPress={handleSubmit}
                loading={isSubmitting}
                style={styles.submitButton}
              />
            </View>
          )}
        </Formik>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Vous avez déjà un compte ?</Text>
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            {' '}Se connecter
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
    fontSize: 28,
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
    marginBottom: 16,
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
