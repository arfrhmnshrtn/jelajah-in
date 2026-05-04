import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';

// --- Import Semua Screens ---
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/main/HomeScreen';
import FavoriteScreen from '../screens/main/FavoriteScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- Konfigurasi Menu Bawah (Bottom Tabs) ---
function MainTabs() {
  // Mengambil state mode gelap dari Zustand untuk mengubah warna menu bawah
  const { isDarkMode } = useAppStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Menyembunyikan header atas bawaan
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          borderTopColor: isDarkMode ? '#333' : '#E0E0E0',
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#1E88E5', // Warna ikon saat aktif (Biru)
        tabBarInactiveTintColor: isDarkMode ? '#888' : '#BDBDBD', // Warna ikon saat tidak aktif
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          // Menentukan ikon berdasarkan nama halaman
          if (route.name === 'Beranda') {
            iconName = 'home';
          } else if (route.name === 'Disukai') {
            iconName = 'heart';
          } else if (route.name === 'Profil') {
            iconName = 'person';
          }
          
          return <Ionicons name={iconName} size={size + 2} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        }
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="Disukai" component={FavoriteScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// --- Navigasi Utama (Stack Navigator) ---
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }} // Menyembunyikan header bawaan Stack
      >
        {/* Halaman Awal */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        
        {/* Halaman Autentikasi */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        
        {/* Halaman Utama (Setelah Login akan masuk ke Menu Bawah) */}
        <Stack.Screen name="Home" component={MainTabs} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}