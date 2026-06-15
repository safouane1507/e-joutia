import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import colors from '../theme/colors';

// Champ de formulaire réutilisable, connecté à Formik via les props
// `value`, `onChangeText`, `onBlur`, et affichant l'erreur de validation
// dès que le champ a été "touché" par l'utilisateur (validation temps réel).
export default function FormField({
  label,
  error,
  touched,
  containerStyle,
  ...textInputProps
}) {
  const hasError = Boolean(touched && error);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, hasError && styles.inputError]}
        placeholderTextColor={colors.textMuted}
        {...textInputProps}
      />
      {hasError ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});
