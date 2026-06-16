import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from './data';

// Champ de formulaire connecté à Formik (value, onChangeText, onBlur, error, touched)
export function FormField({ label, error, touched, style, ...props }) {
  const hasError = Boolean(touched && error);
  return (
    <View style={[styles.field, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, hasError && styles.inputError]}
        placeholderTextColor={colors.textMuted}
        {...props}
      />
      {hasError ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

// Bouton principal (variante "filled" ou "outline")
export function PrimaryButton({ title, onPress, loading, variant = 'filled', style }) {
  const outline = variant === 'outline';
  return (
    <TouchableOpacity
      style={[styles.button, outline ? styles.outline : styles.filled, style]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={outline ? colors.primary : '#FFFFFF'} />
      ) : (
        <Text style={[styles.buttonText, { color: outline ? colors.primary : '#FFFFFF' }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
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
  inputError: { borderColor: colors.error },
  error: { color: colors.error, fontSize: 12, marginTop: 4 },
  button: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  filled: { backgroundColor: colors.primary },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  buttonText: { fontSize: 16, fontWeight: '700' },
});
