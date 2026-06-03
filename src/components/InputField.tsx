import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';

interface InputFieldProps extends TextInputProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export default function InputField({ label, iconName, isPassword = false, ...rest }: InputFieldProps) {
  const { isDarkMode } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const themeColors = {
    text: isDarkMode ? '#F8FAFC' : '#0F172A',
    bg: isDarkMode ? '#1E293B' : '#F8FAFC',
    border: isDarkMode ? '#334155' : '#E2E8F0',
    borderFocus: '#38BDF8',
    label: isDarkMode ? '#94A3B8' : '#64748B',
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: themeColors.label }]}>{label}</Text>
      
      <View style={[
        styles.inputContainer, 
        { backgroundColor: themeColors.bg, borderColor: isFocused ? themeColors.borderFocus : themeColors.border }
      ]}>
        <Ionicons name={iconName} size={20} color={isFocused ? themeColors.borderFocus : themeColors.label} style={styles.icon} />
        
        <TextInput
          style={[styles.input, { color: themeColors.text }]}
          placeholderTextColor={themeColors.label}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={themeColors.label} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 56,
  },
  icon: { marginRight: 12 },
  input: { flex: 1, height: '100%', fontSize: 16 },
  eyeIcon: { padding: 4 },
});