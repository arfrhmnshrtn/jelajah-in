import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';

export default function RegisterScreen({ navigation }: any) {
  // Catatan: 'register' dihapus dari useAppStore karena data sekarang disimpan di database server
  const { isDarkMode } = useAppStore(); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [msg, setMsg] = useState({ text: '', type: '' });

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    text: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
    link: '#38BDF8'
  };

  const handleRegister = async () => {
    // Kosongkan pesan setiap kali tombol ditekan
    setMsg({ text: '', type: '' });
    
    // 1. Validasi Tidak Boleh Kosong
    if (!name || !email || !password) {
      setMsg({ text: 'Semua kolom wajib diisi!', type: 'error' });
      return;
    }

    // 2. Validasi Format Email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setMsg({ text: 'Format email tidak valid!', type: 'error' });
      return;
    }

    // 3. Validasi Minimal Karakter Password
    if (password.length < 6) {
      setMsg({ text: 'Kata sandi minimal 6 karakter!', type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      // Menembak API Backend (URL disesuaikan dengan dokumentasi: /auth/register)
      // Catatan: Pastikan apakah Arief menggunakan awalan /api/ atau langsung /auth/
      const request = await fetch('http://203.194.115.158:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: name,
          email: email, 
          password: password 
        }),
      });

      const response = await request.json();

      // Jika ada error dari server (misal email sudah terpakai)
      if (!request.ok) {
        setMsg({ text: response.message || 'Pendaftaran gagal!', type: 'error' });
        return;
      }

      // ✅ Kalau sukses
      console.log('Register success:', response);
      
      // Tampilkan teks sukses berwarna hijau
      setMsg({ text: 'Akun berhasil dibuat! Mengalihkan...', type: 'success' });
      
      // Tunggu 1.5 detik agar user bisa baca pesan sukses, lalu pindah ke halaman Login
      setTimeout(() => navigation.replace('Login'), 1500);

    } catch (error) {
      console.log(error);
      setMsg({ text: 'Terjadi kesalahan jaringan. Coba lagi!', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: theme.bg }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color={theme.text} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Buat Akun</Text>
          <Text style={[styles.subtitle, { color: theme.textSub }]}>Mulai perjalanan luar biasamu bersama jelajah.in</Text>
        </View>

        <View style={styles.form}>
          <InputField label="Nama Lengkap" iconName="person-outline" placeholder="Masukkan nama kamu" value={name} onChangeText={setName} />
          <InputField label="Alamat Email" iconName="mail-outline" placeholder="contoh@email.com" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <InputField label="Kata Sandi" iconName="lock-closed-outline" placeholder="Buat kata sandi yang kuat" isPassword={true} value={password} onChangeText={setPassword} />

          {/* Render pesan sukses/error di sini */}
          {msg.text ? (
            <Text style={[styles.msgText, { color: msg.type === 'error' ? '#EF4444' : '#10B981' }]}>{msg.text}</Text>
          ) : null}

          <View style={{ marginTop: 20 }}>
            <CustomButton title="DAFTAR SEKARANG" onPress={handleRegister} isLoading={isLoading} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { position: 'absolute', top: 50, left: 24, zIndex: 10, padding: 8, backgroundColor: 'rgba(128,128,128,0.1)', borderRadius: 20 },
  scrollContent: { flexGrow: 1, padding: 24, paddingTop: 120, justifyContent: 'center' },
  header: { marginBottom: 40 },
  title: { fontSize: 36, fontWeight: '900', marginBottom: 10, letterSpacing: -1 },
  subtitle: { fontSize: 16, lineHeight: 24 },
  form: { marginBottom: 30 },
  msgText: { textAlign: 'center', marginBottom: 15, fontWeight: 'bold' }
});