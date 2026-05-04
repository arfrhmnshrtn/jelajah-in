import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';

export default function LoginScreen({ navigation }: any) {
  const { isDarkMode, login } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); // State khusus untuk pesan error

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    text: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
    link: '#38BDF8',
    error: '#EF4444'
  };

  const handleLogin = () => {
    setErrorMsg(''); // Reset error
    if (!email || !password) {
      setErrorMsg('Email dan Kata Sandi wajib diisi!');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const isSuccess = login(email, password);
      
      if (isSuccess) {
        navigation.replace('Home'); // Langsung pindah, tanpa alert OK!
      } else {
        setErrorMsg('Email atau Kata Sandi salah!');
      }
    }, 1200);

    // try {
    //   const request = await fetch('https://reqres.in/api/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'ngrok-skip-browser-warning': 'true', 
    //     },
    //     body: JSON.stringify({
    //       email,
    //       password  
    //     })
    //   });

    //   const response = await request.json();
    //   console.log(response);
    //   navigation.replace('Home'); // Langsung pindah, tanpa alert OK!
    // } catch (error) {
    //   setErrorMsg('Email atau Kata Sandi salah!');
    // }

    
    
      
    
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

          {/* Menampilkan pesan error dengan halus */}
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
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }
});