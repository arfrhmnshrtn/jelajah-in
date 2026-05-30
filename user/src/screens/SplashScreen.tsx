import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  Animated, 
  ImageBackground 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ Import AsyncStorage
import { useAppStore } from '../store/useAppStore'; // ✅ Import Zustand

export default function SplashScreen({ navigation }: any) {
  const { login } = useAppStore(); // Ambil fungsi login dari Zustand

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Fungsi untuk mengecek ingatan/memori HP
    const checkLoginStatus = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        
        if (storedUser) {
          // 1. Jika pengguna sudah pernah login, masukkan data ke Zustand
          login(JSON.parse(storedUser));
          // 2. Langsung lompat ke Home tanpa menjalankan animasi
          navigation.replace('Home');
        } else {
          // 3. Jika belum login (memori kosong), jalankan animasi UI kamu
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            })
          ]).start();
        }
      } catch (error) {
        console.log('Gagal mengecek status login', error);
        // Jika terjadi error saat cek memori, tetap jalankan animasi agar aplikasi tidak nge-blank
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 1000, useNativeDriver: true })
        ]).start();
      }
    };

    checkLoginStatus(); // Panggil fungsi saat layar dimuat
  }, []);

  return (
    <ImageBackground 
      // Menggunakan URL Raja Ampat High-Res (Source: Unsplash)
      source={{ uri: 'https://images.unsplash.com/photo-1702664045144-8c97b3034d26?q=80&w=682&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }} 
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Overlay Gelap untuk Meningkatkan Kontras Teks */}
      <View style={styles.overlay}>
        
        <Animated.View 
          style={[
            styles.brandContainer, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="compass" size={50} color="#ffffff" />
          </View>
          <Text style={styles.title}>
            jelajah<Text style={styles.titleDot}>.in</Text>
          </Text>
          <Text style={styles.subtitle}>
            Keajaiban alam Indonesia dalam genggamanmu.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.replace('Login')}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>MULAI EKSPLORASI</Text>
          </TouchableOpacity>
          
        </Animated.View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.30)', // Memberikan lapisan gelap agar UI menonjol
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  brandContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  iconWrapper: {
    marginBottom: 10,
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  titleDot: {
    color: '#0044ffc2',
  },
  subtitle: {
    fontSize: 17,
    color: '#F8FAFC',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#0044ffc2',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    // Shadow untuk iOS/Android
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  buttonIcon: {
    marginLeft: 10,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  }
});