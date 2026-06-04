import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, StatusBar, TextInput, ActivityIndicator, RefreshControl, TouchableOpacity, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAppStore } from '../../store/useAppStore';
import DestinationCard from '../../components/DestinationCard';
import CategoryChip from '../../components/CategoryChip';
import { dummyDestinations } from '../../utils/dummyDestinations'; // Sesuaikan folder jika berbeda

interface Destination {
  id: string;
  name: string;
  category: string;
  location: string;
  distance: string;
  price: string;
  image: string;
  images: string[];
  description?: string;
  lat: number;
  lon: number;
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLatSin = Math.sin(dLat / 2);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const dLonSin = Math.sin(dLon / 2);
  
  const a = dLatSin * dLatSin + 
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * dLonSin * dLonSin;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function HomeScreen({ navigation }: any) {
  const { isDarkMode, currentUser } = useAppStore();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState('Mendeteksi lokasi...');
  const [userCoords, setUserCoords] = useState<{lat: number, lon: number} | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🚀 KOORDINASI ANIMASI PULSA SKELETON (DIOPTIMALKAN AGAR LEBIH RINGAN)
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.8, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  const theme = useMemo(() => ({
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    text: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    border: isDarkMode ? '#334155' : '#E2E8F0',
    inputBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    skeleton: isDarkMode ? '#334155' : '#E2E8F0',
  }), [isDarkMode]);

  const fetchLocation = useCallback(async () => {
    try {
      let currentCoords = { latitude: -5.3971, longitude: 105.2668 };
      if (Platform.OS === 'web') {
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();
        if (data.status === 'success') {
          currentCoords = { latitude: data.lat, longitude: data.lon };
          setUserLocation(`${data.city}, ${data.regionName}`);
        }
      } else {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let location = await Location.getCurrentPositionAsync({});
          currentCoords = { latitude: location.coords.latitude, longitude: location.coords.longitude };
          let address = await Location.reverseGeocodeAsync(currentCoords);
          if (address.length > 0) setUserLocation(`${address[0].city || address[0].region}`);
        }
      }
      setUserCoords({ lat: currentCoords.latitude, lon: currentCoords.longitude });
    } catch (error) {
      setUserLocation("Lampung");
      setUserCoords({ lat: -5.3971, lon: 105.2668 });
    }
  }, []);

  const fetchDestinations = useCallback(async () => {
    if (!userCoords) return;
    setIsLoading(true);

    // 🔴 SAKELAR DUMMY: Ubah ke 'false' kalau VPS Arief sudah menyala!
    const USE_DUMMY_DATA = true;

    if (USE_DUMMY_DATA) {
      // Pura-pura loading 1,5 detik agar animasi Skeleton buatanmu sempat terlihat
      setTimeout(() => {
        const formattedDummy = dummyDestinations.map((item: any) => ({
          id: item.id.toString(),
          name: item.name,
          category: item.name.includes('Gunung') || item.name.includes('Menara') ? 'Gunung' : 'Pantai', // Logika kategori sederhana
          location: item.location,
          price: `Rp ${item.price.toLocaleString('id-ID')}`,
          image: item.image,
          images: [item.image],
          description: 'Deskripsi wisata sementara karena server sedang mati.',
          lat: -5.4,
          lon: 105.2,
          distance: item.distance,
          rawDist: parseInt(item.distance)
        }));
        
        setDestinations(formattedDummy);
        setIsLoading(false);
        setRefreshing(false);
      }, 1500);
      return; // Berhenti di sini, fungsi fetch API ke server tidak akan dijalankan
    }

    // --- KODINGAN API ASLI (AMAN TIDAK TERHAPUS) ---
    try {
      const request = await fetch('http://203.194.115.158:3000/api/packages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        }
      });
      
      const response = await request.json();

      if (request.ok) {
        const apiData = response.data || response;

        const formattedData = apiData.map((item: any) => {
          const itemLat = parseFloat(item.latitude || item.lat || 0);
          const itemLon = parseFloat(item.longitude || item.lon || 0);
          
          const dist = (itemLat && itemLon) 
            ? calculateDistance(userCoords.lat, userCoords.lon, itemLat, itemLon) 
            : 0;

          return {
            id: item.id?.toString() || Math.random().toString(),
            name: item.name || item.title || 'Destinasi Wisata',
            category: item.category || 'Semua',
            location: item.location || item.city || 'Lokasi tidak diketahui',
            price: item.price ? `Rp ${item.price.toLocaleString('id-ID')}` : 'Rp 0', 
            image: item.imageUrl || item.image || item.thumbnail || 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
            images: item.images || [item.imageUrl || item.image || 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0'], 
            description: item.description || 'Deskripsi tidak tersedia.',
            lat: itemLat,
            lon: itemLon,
            distance: `${dist.toFixed(1)} km`,
            rawDist: dist
          };
        });

        setDestinations(formattedData);
      } else {
        console.log("Gagal mengambil data wisata:", response.message);
      }
    } catch (e) { 
      console.error("Error fetch API Packages:", e); 
    } finally { 
      setIsLoading(false); 
      setRefreshing(false); 
    }
  }, [userCoords, currentUser?.token]);

  const fetchFavorites = useCallback(async () => {
    if (!currentUser?.token) return;
    try {
      const request = await fetch('http://203.194.115.158:3000/api/bookmarks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Accept': 'application/json'
        }
      });
      const response = await request.json();
      if (request.ok) {
        const data = response.data || response;
        const savedIds = data.map((item: any) => {
          const wisata = item.package || item;
          return String(wisata.id);
        });
        useAppStore.setState({ favoriteIds: savedIds });
      }
    } catch (error) {
      console.log("Gagal memulihkan status favorit:", error);
    }
  }, [currentUser?.token]);

  useEffect(() => { 
    fetchLocation(); 
    fetchFavorites(); 
  }, [currentUser, fetchLocation, fetchFavorites]); 

  useEffect(() => { 
    fetchDestinations(); 
  }, [userCoords, fetchDestinations]);

  // 🚀 OPTIMASI MEMORI UTAMA: Filter dan urutkan hanya jika state pemicu berubah (useMemo)
  const filteredItems = useMemo(() => {
    let items = destinations.filter(item => {
      const matchCat = activeCategory === 'Semua' || item.category === activeCategory;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (sortBy === 'price') {
      return [...items].sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, '')));
    } else if (sortBy === 'distance') {
      return [...items].sort((a, b) => (a as any).rawDist - (b as any).rawDist);
    }
    return items;
  }, [destinations, activeCategory, searchQuery, sortBy]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true); 
    fetchLocation();
    fetchFavorites(); 
  }, [fetchLocation, fetchFavorites]);

  const SkeletonItem = useCallback(({ extraStyle }: { extraStyle: any }) => (
    <Animated.View style={[{ opacity: pulseAnim, backgroundColor: theme.skeleton }, extraStyle]} />
  ), [pulseAnim, theme.skeleton]);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.text }]}>Halo, {currentUser?.name?.split(' ')[0] || 'User'}!</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#38BDF8" />
            <Text style={[styles.locationText, { color: theme.textSub }]}>{userLocation}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ProfilTab')}>
          <Image source={{ uri: currentUser?.profilePictureUrl || `https://ui-avatars.com/api/?name=${currentUser?.name || 'U'}&background=38BDF8&color=fff&size=100` }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh} 
            tintColor="#38BDF8" 
          />
        }
      >
        <View style={styles.searchSection}>
          <View style={[styles.searchBox, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
            <Ionicons name="search" size={20} color={theme.textSub} />
            <TextInput placeholder="Cari destinasi..." placeholderTextColor={theme.textSub} style={[styles.searchInput, { color: theme.text }]} value={searchQuery} onChangeText={setSearchQuery} />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          {['Semua', 'Gunung', 'Pantai', 'Budaya'].map(cat => (
            <CategoryChip key={cat} label={cat} isActive={activeCategory === cat} onPress={() => setActiveCategory(cat)} />
          ))}
          <View style={{ width: 40 }} />
        </ScrollView>

        <View style={styles.sortContainer}>
          <Text style={[styles.sortLabel, { color: theme.textSub }]}>Urutkan:</Text>
          <TouchableOpacity onPress={() => setSortBy('default')} style={[styles.sortBtn, sortBy === 'default' && styles.sortBtnActive]}>
            <Text style={[styles.sortBtnText, sortBy === 'default' && { color: '#FFF' }]}>Default</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortBy('price')} style={[styles.sortBtn, sortBy === 'price' && styles.sortBtnActive]}>
            <Text style={[styles.sortBtnText, sortBy === 'price' && { color: '#FFF' }]}>Harga Termurah</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortBy('distance')} style={[styles.sortBtn, sortBy === 'distance' && styles.sortBtnActive]}>
            <Text style={[styles.sortBtnText, sortBy === 'distance' && { color: '#FFF' }]}>Terdekat</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listWrapper}>
          {isLoading ? (
            [1, 2, 3].map((key) => (
              <View key={key} style={[styles.skeletonCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <SkeletonItem extraStyle={styles.skeletonImage} />
                <View style={styles.skeletonInfo}>
                  <SkeletonItem extraStyle={styles.skeletonRowTitle} />
                  <SkeletonItem extraStyle={styles.skeletonRowSub} />
                  <View style={styles.skeletonBottomRow}>
                    <SkeletonItem extraStyle={styles.skeletonRowBadge} />
                    <SkeletonItem extraStyle={styles.skeletonRowPrice} />
                  </View>
                </View>
              </View>
            ))
          ) : filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <DestinationCard key={item.id} {...item} onPress={() => navigation.navigate('Detail', { item })} />
            ))
          ) : (
            <Text style={{ textAlign: 'center', color: theme.textSub, marginTop: 20 }}>Tidak ada destinasi ditemukan.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { marginLeft: 6, fontSize: 14 },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#fff' },
  searchSection: { paddingHorizontal: 24, marginBottom: 20 },
  searchBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, height: 50 },
  searchInput: { flex: 1, marginLeft: 12 },
  categoryContainer: { paddingLeft: 24, marginBottom: 15 },
  sortContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 20 },
  sortLabel: { fontSize: 12, marginRight: 10, fontWeight: 'bold' },
  sortBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#38BDF8' },
  sortBtnActive: { backgroundColor: '#38BDF8' },
  sortBtnText: { fontSize: 11, color: '#38BDF8', fontWeight: 'bold' },
  listWrapper: { paddingHorizontal: 24, paddingBottom: 100 },

  skeletonCard: { flexDirection: 'row', padding: 12, borderRadius: 20, marginBottom: 16, borderWidth: 1, elevation: 1 },
  skeletonImage: { width: 100, height: 100, borderRadius: 16 },
  skeletonInfo: { flex: 1, marginLeft: 16, justifyContent: 'space-between', paddingVertical: 2 },
  skeletonRowTitle: { width: '85%', height: 18, borderRadius: 4 },
  skeletonRowSub: { width: '55%', height: 13, borderRadius: 4, marginTop: 6 },
  skeletonBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  skeletonRowBadge: { width: 60, height: 20, borderRadius: 8 },
  skeletonRowPrice: { width: 80, height: 18, borderRadius: 4 }
});