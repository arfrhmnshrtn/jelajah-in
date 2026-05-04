import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  isLoading?: boolean;
  variant?: 'primary' | 'outline';
}

export default function CustomButton({ 
  title, onPress, iconName, isLoading = false, variant = 'primary' 
}: CustomButtonProps) {
  
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        isPrimary ? styles.bgPrimary : styles.bgOutline
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? '#0F172A' : '#38BDF8'} />
      ) : (
        <>
          <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textOutline]}>
            {title}
          </Text>
          {iconName && (
            <Ionicons 
              name={iconName} 
              size={20} 
              color={isPrimary ? '#0F172A' : '#38BDF8'} 
              style={styles.icon} 
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  bgPrimary: {
    backgroundColor: '#38BDF8',
    elevation: 6,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bgOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  text: { fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
  textPrimary: { color: '#0F172A' },
  textOutline: { color: '#38BDF8' },
  icon: { marginLeft: 8 },
});