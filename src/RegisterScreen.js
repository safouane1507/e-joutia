import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FormField, PrimaryButton } from './ui';
import { useAuth } from './AuthContext';
import { colors } from './data';

const schema = Yup.object({
  username: Yup.string().min(3, '3 caractères minimum').required("Nom d'utilisateur requis"),
  city: Yup.string().required('Ville requise'),
  email: Yup.string().email('Email invalide').required('Email requis'),
  password: Yup.string().min(6, '6 caractères minimum').required('Mot de passe requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('Confirmation requise'),
});

const FIELDS = [
  { name: 'username', label: "Nom d'utilisateur", placeholder: 'ex: Karim Bennani' },
  { name: 'city', label: 'Ville de résidence', placeholder: 'ex: Casablanca' },
  { name: 'email', label: 'Email', placeholder: 'exemple@email.com', autoCapitalize: 'none', keyboardType: 'email-address' },
  { name: 'password', label: 'Mot de passe', placeholder: '6 caractères minimum', secureTextEntry: true },
  { name: 'confirmPassword', label: 'Confirmer le mot de passe', placeholder: 'Retapez votre mot de passe', secureTextEntry: true },
];

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Rejoignez la communauté e-joutia en quelques secondes</Text>

        <Formik
          initialValues={{ username: '', city: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={schema}
          onSubmit={register}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <View>
              {FIELDS.map(({ name, ...field }) => (
                <FormField
                  key={name}
                  {...field}
                  value={values[name]}
                  onChangeText={handleChange(name)}
                  onBlur={handleBlur(name)}
                  error={errors[name]}
                  touched={touched[name]}
                />
              ))}
              <PrimaryButton title="S'inscrire" onPress={handleSubmit} loading={isSubmitting} style={styles.submit} />
            </View>
          )}
        </Formik>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Vous avez déjà un compte ?</Text>
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}> Se connecter</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: colors.primary, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: 32 },
  submit: { marginTop: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24, marginBottom: 16 },
  footerText: { color: colors.textMuted, fontSize: 14 },
  link: { color: colors.primary, fontSize: 14, fontWeight: '700' },
});
