import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../../store/useAppStore';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }: any) {
  const { isDarkMode, login } = useAppStore();
  const [email, setEmail] = useState('ariefraa@gmail.com');
  const [password, setPassword] = useState('12345678');
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

  const handleLogin = async () => {
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Email dan Kata Sandi wajib diisi!');
      return;
    }

    setIsLoading(true);

<<<<<<< HEAD
    // 🔴 SAKELAR PUSAT: Ubah jadi 'false' saat server Arief sudah hidup!
    const USE_DUMMY_LOGIN = true; 
=======
    // 🔴 SAKELAR DUMMY LOGIN: Ubah ke 'false' kalau VPS Arief sudah menyala!
    const USE_DUMMY_LOGIN = true;

    if (USE_DUMMY_LOGIN) {
      // Pura-pura menunggu server membalas selama 1,5 detik
      setTimeout(async () => {
        // Buat data pengguna bohongan untuk sementara
        const dummyUserData = {
          id: "999",
          name: "Penjelajah Dummy", 
          email: email.trim(),
          token: "token_bohongan_sementara_12345" // Token ini yang akan mengizinkanmu masuk ke HomeScreen
        };

        // Simpan ke memori HP dan nyalakan status login
        await AsyncStorage.setItem('userData', JSON.stringify(dummyUserData));
        login(dummyUserData);

        // Tampilkan pop-up sukses
        setWelcomeName(dummyUserData.name);
        setShowSuccessModal(true);
        setIsLoading(false);
      }, 1500);
      
      return; // 🛑 BERHENTI DI SINI: Jangan jalankan fetch ke server Arief
    }

    // --- KODINGAN API ASLI (AMAN TIDAK TERHAPUS) ---
    try {
      const request = await fetch('http://203.194.115.158:3000/api/auth/login/user', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });
>>>>>>> 3d90731b9b16cad645285aed8f8bda056d4fed8c

    if (USE_DUMMY_LOGIN) {
      // ==========================================
      // JALUR 1: MODE DUMMY VIP 
      // ==========================================
      setTimeout(async () => {
        const dummyUserData = {
          id: "999",
          name: "Geevan Alva", 
          email: email.trim(),
          token: "token_super_rahasia_123" 
        };

        try {
          await AsyncStorage.setItem('userData', JSON.stringify(dummyUserData));
          login(dummyUserData);
          setWelcomeName(dummyUserData.name);
          setShowSuccessModal(true);
        } catch (err) {
          setErrorMsg("Gagal menyimpan sesi login.");
        } finally {
          setIsLoading(false);
        }
      }, 1000);

    } else {
      // ==========================================
      // JALUR 2: MODE PRODUKSI (API ASLI - AMAN)
      // ==========================================
      try {
        const request = await fetch('http://203.194.115.158:3000/api/auth/login/user', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json' 
          },
          body: JSON.stringify({ email: email.trim(), password }),
        });

        const rawText = await request.text();
        let response;
        try { response = JSON.parse(rawText); } catch (e) { throw new Error(`Server membalas format salah.`); }

        if (!request.ok) {
          setErrorMsg(response.message || 'Login ditolak oleh server Arief!');
          setIsLoading(false);
          return;
        }

        const fetchedName = response.user?.name || response.data?.name || response.name || 'Pengguna Jelajah';
        const fetchedEmail = response.user?.email || response.data?.email || response.email || email;
        const fetchedId = response.user?.id || response.data?.id || response.id || Date.now().toString();
        const realToken = response.token || response.data?.token || response.access_token || response.accessToken;

        if (!realToken) {
          setErrorMsg(`Token hilang! Balasan Arief: ${rawText.substring(0, 150)}`);
          setIsLoading(false);
          return; 
        }

        const userDataFromServer = { id: fetchedId.toString(), name: fetchedName, email: fetchedEmail, token: realToken };
        await AsyncStorage.setItem('userData', JSON.stringify(userDataFromServer));
        login(userDataFromServer);
        setWelcomeName(fetchedName);
        setShowSuccessModal(true);

      } catch (error: any) {
        setErrorMsg(`Error: ${error.message}`); 
      } finally {
        setIsLoading(false);
      }
<<<<<<< HEAD
=======

      const fetchedName = response.user?.name || response.data?.name || response.data?.user?.name || response.name || 'Pengguna Jelajah';
      const fetchedEmail = response.user?.email || response.data?.email || response.data?.user?.email || response.email || email;
      const fetchedId = response.user?.id || response.data?.id || response.data?.user?.id || response.id || Date.now().toString();

      // 🕵️ PENARIK TOKEN SUPER LENGKAP (Termasuk gaya Laravel)
      const realToken = response.token 
                     || response.data?.token 
                     || response.access_token 
                     || response.data?.access_token 
                     || response.accessToken 
                     || response.data?.accessToken
                     || response.authorisation?.token;

      if (!realToken) {
        console.log("BALASAN ASLI ARIEF:", rawText);
        setErrorMsg(`Token hilang! Balasan Arief: ${rawText.substring(0, 150)}`);
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
      setErrorMsg(`Error: ${error.message}`); 
    } finally {
      setIsLoading(false);
>>>>>>> 3d90731b9b16cad645285aed8f8bda056d4fed8c
    }
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { width: '100%', borderRadius: 24, padding: 30, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 15 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 6, borderColor: 'rgba(16, 185, 129, 0.2)' },
  modalTitle: { fontSize: 24, fontWeight: '800', marginBottom: 10 },
  modalMessage: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 30 },
  modalButton: { backgroundColor: '#38BDF8', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingVertical: 16, borderRadius: 16 },
  modalButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});