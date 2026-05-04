import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';

interface CategoryChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export default function CategoryChip({ label, isActive, onPress }: CategoryChipProps) {
  const { isDarkMode } = useAppStore();

  return (
    <TouchableOpacity 
      style={[
        styles.chip, 
        isActive ? styles.chipActive : (isDarkMode ? styles.chipInactiveDark : styles.chipInactiveLight)
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.text, 
        isActive ? styles.textActive : (isDarkMode ? styles.textInactiveDark : styles.textInactiveLight)
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: '#38BDF8', // Biru terang saat aktif
    elevation: 4,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  chipInactiveLight: { backgroundColor: '#F1F5F9' },
  chipInactiveDark: { backgroundColor: '#1E293B' }, // Biru dongker gelap untuk dark mode
  text: { fontSize: 14, fontWeight: '600' },
  textActive: { color: '#0F172A' }, // Teks gelap di atas background terang
  textInactiveLight: { color: '#64748B' },
  textInactiveDark: { color: '#94A3B8' },
});