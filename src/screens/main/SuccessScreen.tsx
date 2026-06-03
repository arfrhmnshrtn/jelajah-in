import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import CustomButton from '../../components/CustomButton';

export default function SuccessScreen({ navigation }: any) {
  const { isDarkMode } = useAppStore();

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    text: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={100} color="#10B981" />
      </View>
      
      <Text style={[styles.title, { color: theme.text }]}>Pembayaran Berhasil!</Text>
      <Text style={[styles.subtitle, { color: theme.textSub }]}>
        Tiket perjalananmu sudah kami kirimkan ke email. Siapkan barang bawaanmu dan selamat berlibur!
      </Text>

      <View style={styles.buttonWrapper}>
        <CustomButton 
          title="Kembali ke Beranda" 
          // 🚀 UBAH KE REPLACE: Agar user tidak bisa "back" ke halaman ini
          onPress={() => navigation.replace('Home')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  iconContainer: { marginBottom: 30, backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 20, borderRadius: 100 },
  title: { fontSize: 28, fontWeight: '900', marginBottom: 15, textAlign: 'center' },
  subtitle: { fontSize: 16, lineHeight: 24, textAlign: 'center', marginBottom: 50 },
  buttonWrapper: { width: '100%' }
});