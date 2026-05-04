import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import CustomButton from '../../components/CustomButton';


export default function DetailScreen({ route, navigation }: any) {
  // Menerima data 'item' yang dilempar dari HomeScreen
  const { item } = route.params; 
  const { isDarkMode, favoriteIds, toggleFavorite } = useAppStore();
  
  // Cek apakah item sudah di-Love (untuk mockup, promo tidak di-love)
  const isLiked = item.id && favoriteIds.includes(item.id);

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
    bottomBar: isDarkMode ? '#1E293B' : '#E2E8F0'
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Gambar Full Screen atas */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
          
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          
          {/* Tombol Love Nyata (Hanya jika ada ID wisata) */}
          {item.id && (
            <TouchableOpacity style={styles.loveBtn} onPress={() => toggleFavorite(item.id)}>
              <Ionicons name={isLiked ? "heart" : "heart-outline"} size={26} color={isLiked ? "#EF4444" : "#FFF"} />
            </TouchableOpacity>
          )}
        </View>

        {/* Konten Detail */}
        <View style={[styles.contentPanel, { backgroundColor: theme.bg }]}>
          <Text style={[styles.title, { color: theme.text }]}>{item.name}</Text>
          
          <View style={styles.locationRow}>
            <Ionicons name="location" size={18} color="#38BDF8" />
            <Text style={[styles.locationText, { color: theme.textSub }]}>
              {item.location} {item.distance ? `• ${item.distance}` : ''}
            </Text>
          </View>

          <Text style={[styles.price, { color: theme.text }]}>
            {item.price} {item.id ? <Text style={{ fontSize: 14, color: theme.textSub, fontWeight: 'normal' }}>/ orang</Text> : ''}
          </Text>

          <Text style={[styles.descTitle, { color: theme.text }]}>Tentang Destinasi</Text>
          <Text style={[styles.descText, { color: theme.textSub }]}>
            {item.description || `${item.name} adalah salah satu destinasi terbaik di ${item.location}. Nikmati pengalaman tak terlupakan dengan pemandangan alam yang memukau dan suasana yang menyegarkan. Jangan lupa bawa kamera terbaikmu!`}
          </Text>
        </View>
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.bg, borderTopColor: theme.bottomBar }]}>
        <CustomButton 
          title={item.id ? "Pesan Sekarang" : "Gunakan Promo"} 
          // UBAH BARIS ONPRESS DI BAWAH INI:
          onPress={() => item.id ? navigation.navigate('Booking', { item }) : alert('Kode Promo Tersalin!')} 
          iconName="calendar-outline"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { width: '100%', height: 350, position: 'relative' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  backBtn: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.4)', padding: 10, borderRadius: 20 },
  loveBtn: { position: 'absolute', top: 50, right: 20, backgroundColor: 'rgba(0,0,0,0.4)', padding: 10, borderRadius: 20 },
  contentPanel: { flex: 1, marginTop: -30, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingTop: 30, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  title: { fontSize: 28, fontWeight: '900', marginBottom: 10, letterSpacing: -1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  locationText: { fontSize: 16, marginLeft: 6 },
  price: { fontSize: 24, fontWeight: 'bold', color: '#38BDF8', marginBottom: 30 },
  descTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  descText: { fontSize: 15, lineHeight: 24, marginBottom: 20 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: Platform.OS === 'ios' ? 30 : 20, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});