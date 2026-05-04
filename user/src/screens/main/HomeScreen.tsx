import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, StatusBar, TextInput, ActivityIndicator, RefreshControl, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAppStore } from '../../store/useAppStore';
import DestinationCard from '../../components/DestinationCard';
import CategoryChip from '../../components/CategoryChip';

interface Destination {
  id: string;
  name: string;
  category: string;
  location: string;
  distance: string;
  price: string;
  image: string;
  description?: string;
  lat?: number; // Tambahan untuk menyimpan koordinat
  lon?: number; // Tambahan untuk menyimpan koordinat
}

// ==========================================
// RUMUS HAVERSINE (Penghitung Jarak Nyata)
// ==========================================
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius bumi dalam Kilometer
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  // Format angka: Jika > 1000km jangan pakai koma, jika dekat pakai 1 angka di belakang koma
  return distance > 1000 ? Math.round(distance).toString() : distance.toFixed(1); 
};

export default function HomeScreen({ navigation }: any) {
  const { isDarkMode, currentUser } = useAppStore();
  
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState('Mendeteksi lokasi...');
  
  // State baru untuk menyimpan titik koordinat kamu
  const [userCoords, setUserCoords] = useState<{lat: number, lon: number} | null>(null);
  
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    text: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    border: isDarkMode ? '#334155' : '#E2E8F0',
    inputBg: isDarkMode ? '#1E293B' : '#FFFFFF',
  };

  const categories = ['Semua', 'Gunung', 'Pantai', 'Budaya', 'Populer'];

  // Fungsi Lokasi Nyata (Web & HP)
  const fetchLocation = async () => {
    try {
      setUserLocation('Mendeteksi lokasi...');
      let currentCoords = { latitude: -5.3971, longitude: 105.2668 }; // Default: Bandar Lampung

      if (Platform.OS === 'web') {
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();
        if (data.status === 'success') {
          currentCoords = { latitude: data.lat, longitude: data.lon };
          setUserLocation(`${data.city}, ${data.regionName}`);
        } else {
          setUserLocation('Lokasi Web Tidak Diketahui');
        }
      } else {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          currentCoords = { latitude: location.coords.latitude, longitude: location.coords.longitude };
          let address = await Location.reverseGeocodeAsync(currentCoords);
          if (address.length > 0) { 
            const { city, subregion, region } = address[0]; 
            setUserLocation(`${city || subregion || region || 'Indonesia'}`); 
          }
        } else {
          setUserLocation('Izin GPS Ditolak');
        }
      }
      
      // Simpan koordinat ke state agar memicu kalkulasi jarak
      setUserCoords({ lat: currentCoords.latitude, lon: currentCoords.longitude });

    } catch (error) { 
      setUserLocation("Bandar Lampung (Simulasi)"); 
      setUserCoords({ lat: -5.3971, lon: 105.2668 }); // Paksa pakai koordinat Lampung jika error
    }
  };

  // Fetch Data Destinasi (Dengan Koordinat Peta Asli)
  const fetchDestinations = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Animasi loading
      
      // DATA MENTAH dengan titik koordinat asli di Google Maps
      const rawData = [
        { id: '1', name: 'Gunung Bromo', category: 'Gunung', location: 'Jawa Timur', lat: -7.9425, lon: 112.9530, price: 'Rp 350.000', image: 'https://images5.alphacoders.com/349/349417.jpg', description: 'Gunung Bromo adalah ikon Jawa Timur, menawarkan pemandangan matahari terbit yang spektakuler.' },
        { id: '2', name: 'Pantai Kuta', category: 'Pantai', location: 'Bali', lat: -8.7176, lon: 115.1695, price: 'Rp 50.000', image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=600&auto=format&fit=crop', description: 'Pantai Kuta adalah pusat pariwisata Bali, terkenal dengan selancar dan matahari terbenamnya.' },
        { id: '3', name: 'Candi Borobudur', category: 'Budaya', location: 'Jawa Tengah', lat: -7.6079, lon: 110.2038, price: 'Rp 75.000', image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?q=80&w=600&auto=format&fit=crop', description: 'Candi Buddha terbesar di dunia, sebuah mahakarya arsitektur yang memukau.' },
        { id: '4', name: 'Raja Ampat', category: 'Populer', location: 'Papua Barat', lat: -0.4285, lon: 130.2750, price: 'Rp 4.500.000', image: 'https://images.unsplash.com/photo-1516690553959-71a414d6b9b6?q=80&w=600&auto=format&fit=crop', description: 'Surga bawah laut terindah di dunia, tempat diving yang tak tertandingi.' },
      ];

      // Kalkulasi jarak otomatis untuk setiap tempat wisata
      const formattedData = rawData.map(item => {
        let calculatedDistance = "Menghitung...";
        if (userCoords) {
          calculatedDistance = `${calculateDistance(userCoords.lat, userCoords.lon, item.lat, item.lon)} km`;
        }
        return {
          ...item,
          distance: calculatedDistance,
        };
      });

      setDestinations(formattedData);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setIsLoading(false); 
      setRefreshing(false); 
    }
  };

  // 1. Ambil lokasi dulu saat pertama kali dibuka
  useEffect(() => { 
    fetchLocation(); 
  }, []);

  // 2. Jika koordinat sudah didapat (userCoords berubah), langsung hitung jarak tempat wisata
  useEffect(() => {
    if (userCoords) {
      fetchDestinations();
    }
  }, [userCoords]);

  const onRefresh = () => { 
    setRefreshing(true); 
    fetchLocation(); // fetchLocation otomatis akan memicu fetchDestinations karena userCoords di-update
  };

  // Logika Filter & Search
  const filteredItems = destinations.filter(item => {
    const matchCat = activeCategory === 'Semua' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />

      {/* HEADER Nyata (Nama & Foto dinamis) */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.text }]}>Halo, {currentUser?.name?.split(' ')[0] || 'Pejalan'}!</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#38BDF8" />
            <Text style={[styles.locationText, { color: theme.textSub }]}>{userLocation}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ProfilTab')}>
          <Image 
            source={{ uri: currentUser?.profilePictureUrl || `https://ui-avatars.com/api/?name=${currentUser?.name || 'G'}&background=38BDF8&color=fff&size=100` }} 
            style={styles.avatar} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38BDF8" />}
      >
        {/* SEARCH BAR */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBox, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
            <Ionicons name="search" size={20} color={theme.textSub} />
            <TextInput placeholder="Cari destinasi impianmu..." placeholderTextColor={theme.textSub} style={[styles.searchInput, { color: theme.text }]} value={searchQuery} onChangeText={setSearchQuery} />
          </View>
        </View>

        {/* PROMO */}
        <TouchableOpacity 
          activeOpacity={0.9}
          style={styles.bannerContainer}
          onPress={() => navigation.navigate('Detail', { 
            item: { 
              name: 'Promo Pengguna Baru', 
              location: 'Seluruh Indonesia', 
              price: 'Diskon 30%', 
              image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000&auto=format&fit=crop',
              description: 'Dapatkan diskon 30% untuk pemesanan pertamamu di destinasi mana pun! Berlaku hingga akhir bulan ini. Gunakan kode promo: JELAJAHBARU.'
            } 
          })}
        >
          <Image source={{ uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000&auto=format&fit=crop' }} style={styles.bannerImage} />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Diskon 30%</Text>
            <Text style={styles.bannerSub}>Khusus pengguna baru jelajah.in</Text>
          </View>
        </TouchableOpacity>

        {/* CATEGORIES */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          {categories.map(cat => ( <CategoryChip key={cat} label={cat} isActive={activeCategory === cat} onPress={() => setActiveCategory(cat)} /> ))}
          <View style={{ width: 40 }} />
        </ScrollView>

        {/* LIST TITLE */}
        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Destinasi Pilihan</Text>
          <TouchableOpacity><Text style={styles.seeAllText}>Lihat Semua</Text></TouchableOpacity>
        </View>

        {/* CONTENT LIST */}
        <View style={styles.listWrapper}>
          {isLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#38BDF8" />
              <Text style={{ color: theme.textSub, marginTop: 10 }}>Mengkalkulasi Jarak...</Text>
            </View>
          ) : (
            filteredItems.map(item => (
              <DestinationCard 
                key={item.id}
                id={item.id}
                name={item.name}
                location={item.location}
                distance={item.distance}
                price={item.price}
                image={item.image}
                onPress={() => navigation.navigate('Detail', { item })} 
              />
            ))
          )}
          {filteredItems.length === 0 && !isLoading && (
            <View style={styles.loadingBox}>
              <Ionicons name="search-outline" size={50} color={theme.textSub} />
              <Text style={{ color: theme.textSub, marginTop: 10 }}>Pencarian tidak ditemukan</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 24, fontWeight: 'bold' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { marginLeft: 6, fontSize: 14, fontWeight: '500' },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#ffffff' },
  searchSection: { paddingHorizontal: 24, marginBottom: 24 },
  searchBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, height: 56, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16 },
  bannerContainer: { marginHorizontal: 24, height: 160, borderRadius: 24, overflow: 'hidden', marginBottom: 30 },
  bannerImage: { width: '100%', height: '100%' },
  bannerOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'rgba(0,0,0,0.3)' },
  bannerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  bannerSub: { color: '#E2E8F0', fontSize: 14 },
  categoryContainer: { paddingLeft: 24, marginBottom: 30 },
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  seeAllText: { color: '#38BDF8', fontWeight: 'bold' },
  listWrapper: { paddingHorizontal: 24, paddingBottom: 100 },
  loadingBox: { alignItems: 'center', justifyContent: 'center', marginTop: 40 },
});