import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from './src/store/useAppStore';

// --- IMPORT SEMUA SCREEN ---
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/main/HomeScreen';
import FavoriteScreen from './src/screens/main/FavoriteScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';
import DetailScreen from './src/screens/main/DetailScreen';
import BookingScreen from './src/screens/main/BookingScreen'; 
import SuccessScreen from './src/screens/main/SuccessScreen'; 
import TicketScreen from './src/screens/main/TicketScreen';

// 🟢 TAMBAHAN: Import HistoryScreen di sini!
import HistoryScreen from './src/screens/main/HistoryScreen';

// Inisialisasi Navigator
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ==========================================
// 1. MENU BAWAH (BOTTOM TABS)
// ==========================================
function BottomTabs() {
  const { isDarkMode } = useAppStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'TicketTab') iconName = focused ? 'ticket' : 'ticket-outline';
          else if (route.name === 'FavoriteTab') iconName = focused ? 'heart' : 'heart-outline';
          else if (route.name === 'ProfilTab') iconName = focused ? 'person' : 'person-outline';
          
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#38BDF8',
        tabBarInactiveTintColor: isDarkMode ? '#64748B' : '#94A3B8',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
          borderTopColor: isDarkMode ? '#334155' : '#E2E8F0',
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' }
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Beranda' }} />
      <Tab.Screen name="TicketTab" component={TicketScreen} options={{ tabBarLabel: 'Tiket Saya' }} />
      <Tab.Screen name="FavoriteTab" component={FavoriteScreen} options={{ tabBarLabel: 'Favorit' }} />
      <Tab.Screen name="ProfilTab" component={ProfileScreen} options={{ tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
}

// ==========================================
// 2. NAVIGATOR UTAMA (ROOT STACK)
// ==========================================
export default function App() {
  const { isDarkMode } = useAppStore();

  return (
    <NavigationContainer>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent" 
        translucent 
      />
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        
        {/* Halaman Splash & Auth */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Halaman Utama yang ada menu bawahnya */}
        <Stack.Screen name="Home" component={BottomTabs} />

        {/* Halaman Transaksional (Fullscreen tanpa menu bawah) */}
        <Stack.Screen name="Detail" component={DetailScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Booking" component={BookingScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Success" component={SuccessScreen} options={{ animation: 'fade' }} />
        
        {/* 🟢 TAMBAHAN: Daftarkan HistoryScreen di sini! */}
        <Stack.Screen name="History" component={HistoryScreen} options={{ animation: 'slide_from_right' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}