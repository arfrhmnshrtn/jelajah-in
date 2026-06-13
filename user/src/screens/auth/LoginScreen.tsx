import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../../store/useAppStore';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';

// 🚀 IMPORT AXIOS CLIENT
import axiosClient from '../../api/axiosClient'; 

export default function LoginScreen({ navigation }: any) {
  const { isDarkMode, login } = useAppStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    text: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
    link: '#38BDF8',
    error: '#EF4444',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
  };

  // 🛠️ JALUR RESMI: Tembak API Server Arief
  const handleLogin = async () => {
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Email dan Kata Sandi wajib diisi!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosClient.post('/auth/login/user', {
        email: email.trim(),
        password: password
      });

      const responseData = response.data;

      // Mengantisipasi jika server mengirimkan HTML darurat (bukan JSON)
      if (typeof responseData === 'string' && responseData.includes('<!DOCTYPE html>')) {
        setErrorMsg('Server Arief mengirim balasan HTML. Hubungi Arief untuk cek Ngrok!');
        setIsLoading(false);
        return;
      }

      // Ekstrak data diri
      const fetchedName = responseData.user?.name || responseData.data?.name || responseData.data?.user?.name || responseData.name || 'Pengguna Jelajah';
      const fetchedEmail = responseData.user?.email || responseData.data?.email || responseData.data?.user?.email || responseData.email || email;
      const fetchedId = responseData.user?.id || responseData.data?.id || responseData.data?.user?.id || responseData.id || Date.now().toString();

      // Ekstrak Token
      const realToken = responseData.token 
                     || responseData.data?.token 
                     || responseData.access_token 
                     || responseData.data?.access_token 
                     || responseData.accessToken 
                     || responseData.data?.accessToken;

      if (!realToken) {
        setErrorMsg('Login sukses di server, tapi format Token berubah. Cek Inspect Console!');
        console.log('Struktur Response:', responseData);
        setIsLoading(false);
        return; 
      }

      const userDataFromServer = {
        id: fetchedId.toString(),
        name: fetchedName, 
        email: fetchedEmail,
        token: realToken 
      };

      await AsyncStorage.setItem('userData', JSON.stringify(userDataFromServer));
      login(userDataFromServer);

      setWelcomeName(fetchedName);
      setShowSuccessModal(true);

    } catch (error: any) {
      console.log('Login Error:', error);
      const serverError = error.response?.data?.message || 'Gagal terhubung ke server. Pastikan laptop Arief menyala dan internet aktif!';
      setErrorMsg(serverError);
    } finally {
      setIsLoading(false);
    }
  };

  // 🚀 JALUR BELAKANG: Dobrak Masuk Tanpa Server (Khusus Dev Mode)
  const bypassLogin = async () => {
    const dummyUser = { 
      id: "999", 
      name: "Geevan (Dev Mode)", 
      email: "geevan@dev.com", 
      token: "token_bypass_lokal" 
    };
    
    await AsyncStorage.setItem('userData', JSON.stringify(dummyUser));
    login(dummyUser);
    navigation.replace('Home');
  };

  const handleProceedToHome = () => {
    setShowSuccessModal(false);
    navigation.replace('Home');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Selamat Datang!</Text>
          <Text style={[styles.subtitle, { color: theme.textSub }]}>Masuk untuk melanjutkan petualanganmu.</Text>
        </View>

        <View style={styles.form}>
          <InputField label="Alamat Email" iconName="mail-outline" placeholder="contoh@email.com" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <InputField label="Kata Sandi" iconName="lock-closed-outline" placeholder="Masukkan kata sandi" isPassword={true} value={password} onChangeText={setPassword} />
          
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={{ color: theme.link, fontWeight: '600' }}>Lupa Kata Sandi?</Text>
          </TouchableOpacity>

          {errorMsg ? <Text style={[styles.errorText, { color: theme.error }]}>{errorMsg}</Text> : null}

          <View style={{ marginTop: 10 }}>
            <CustomButton title="MASUK SEKARANG" onPress={handleLogin} isLoading={isLoading} iconName="log-in-outline" />
          </View>

          {/* TOMBOL SAKTI UNTUK BYPASS SAAT SERVER OFF */}
          <TouchableOpacity onPress={bypassLogin} style={styles.bypassBtn}>
            <Text style={styles.bypassText}>🚀 [ DEV MODE ] PAKSA MASUK KE HOME</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={{ color: theme.textSub }}>Belum punya akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ color: theme.link, fontWeight: 'bold', fontSize: 15 }}>Daftar di sini</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showSuccessModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={40} color="#FFF" />
            </View>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Login Berhasil!</Text>
            <Text style={[styles.modalMessage, { color: theme.textSub }]}>
              Selamat datang kembali, <Text style={{fontWeight: 'bold', color: theme.text}}>{welcomeName}</Text>! Siap untuk menjelajah?
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleProceedToHome}>
              <Text style={styles.modalButtonText}>Lanjut Berpetualang</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" style={{marginLeft: 8}} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 40, marginTop: 20 },
  title: { fontSize: 36, fontWeight: '900', marginBottom: 10, letterSpacing: -1 },
  subtitle: { fontSize: 16, lineHeight: 24 },
  form: { marginBottom: 30 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -5 },
  errorText: { textAlign: 'center', marginBottom: 15, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  bypassBtn: { marginTop: 20, padding: 14, alignItems: 'center', backgroundColor: '#334155', borderRadius: 12, borderWidth: 1, borderColor: '#475569' },
  bypassText: { color: '#F1F5F9', fontWeight: '800', fontSize: 13, letterSpacing: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { width: '100%', borderRadius: 24, padding: 30, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 15 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 6, borderColor: 'rgba(16, 185, 129, 0.2)' },
  modalTitle: { fontSize: 24, fontWeight: '800', marginBottom: 10 },
  modalMessage: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 30 },
  modalButton: { backgroundColor: '#38BDF8', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingVertical: 16, borderRadius: 16 },
  modalButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});