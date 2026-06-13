import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Dimensions, 
  TouchableOpacity, 
  StatusBar, 
  Modal, 
  ActivityIndicator, 
  Alert,
  Linking,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import MapView, { Marker } from 'react-native-maps';


const { width } = Dimensions.get('window');

const isWeb = Platform.OS === 'web';

export default function DetailScreen({ route, navigation }: any) {
  const { item } = route.params;
  const { isDarkMode, currentUser } = useAppStore();
  
  const [activeImage, setActiveImage] = useState(0);
  
  // STATE UNTUK FITUR BOOKING
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    text: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    border: isDarkMode ? '#334155' : '#E2E8F0',
  };

  const rawPrice = item.price ? parseInt(item.price.toString().replace(/[^0-9]/g, '')) : 0;
  const totalPrice = rawPrice * quantity;

  const handleScroll = (event: any) => {
    const slide = Math.ceil(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
    if (slide !== activeImage) setActiveImage(slide);
  };

  // 🟢 FUNGSI EKSEKUSI PEMESANAN & BYPASS KE MIDTRANS
  const executeBooking = async () => {
    if (!currentUser || !currentUser.token) {
      Alert.alert("Perhatian", "Silakan login terlebih dahulu untuk memesan.");
      setShowModal(false);
      return;
    }

    setIsBooking(true);

    try {
      const payloadData = {
        bookingCode: `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`, 
        packageId: Number(item.id),
        date: new Date().toISOString(), 
        quantity: quantity,
        totalPrice: totalPrice
      };

      const request = await fetch('http://203.194.115.158:3000/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payloadData)
      });

      const responseData = await request.json(); 

      if (request.ok) {
        setShowModal(false);
        setQuantity(1); 

        // Tangkap URL sesuai balasan Arief
        const midtransUrl = responseData.redirectUrl 
                         || responseData.data?.redirectUrl 
                         || responseData.redirect_url;

        if (midtransUrl) {
          // 🚀 LANGSUNG LEMPAR KE MIDTRANS TANPA BASA-BASI
          Linking.openURL(midtransUrl);
        } else {
          Alert.alert("Pemesanan Berhasil!", "Tapi link pembayaran tidak ditemukan di balasan server.");
        }

      } else {
        Alert.alert("Gagal Memesan", responseData.message || "Terjadi kesalahan pada server.");
      }
    } catch (error: any) {
      Alert.alert("Error Jaringan", "Periksa koneksi internetmu.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" />
      
      {/* CAROUSEL IMAGES */}
      <View style={styles.carouselContainer}>
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {item.images ? item.images.map((img: string, index: number) => (
            <Image key={index} source={{ uri: img }} style={styles.mainImage} />
          )) : <Image source={{ uri: item.imageUrl || item.image }} style={styles.mainImage} />}
        </ScrollView>

        <View style={styles.pagination}>
          {item.images?.map((_: any, i: number) => (
            <View key={i} style={[styles.dot, { backgroundColor: i === activeImage ? '#38BDF8' : 'rgba(255,255,255,0.5)' }]} />
          ))}
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color="#38BDF8" />
              <Text style={[styles.location, { color: theme.textSub }]}>{item.location}</Text>
            </View>
          </View>
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>{item.distance}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Deskripsi</Text>
        <Text style={[styles.description, { color: theme.textSub }]}>{item.description || "Tidak ada deskripsi tersedia untuk wisata ini."}</Text>

        {item.latitude && item.longitude && (
          <View style={styles.mapSection}>
            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Lokasi Peta</Text>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: parseFloat(item.latitude),
                  longitude: parseFloat(item.longitude),
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                <Marker
                  coordinate={{ 
                    latitude: parseFloat(item.latitude), 
                    longitude: parseFloat(item.longitude) 
                  }}
                  title={item.name}
                  description={item.location}
                />
              </MapView>
            </View>
          </View>
        )}
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={[styles.bottomBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <View>
          <Text style={[styles.priceLabel, { color: theme.textSub }]}>Harga Tiket</Text>
          <Text style={styles.priceValue}>{item.price}</Text>
        </View>
        <TouchableOpacity 
          style={styles.bookBtn}
          onPress={() => setShowModal(true)} 
        >
          <Text style={styles.bookBtnText}>Pesan Sekarang</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL PEMESANAN */}
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Atur Jumlah Pesanan</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={28} color={theme.textSub} />
              </TouchableOpacity>
            </View>

            <View style={styles.orderContainer}>
              <Text style={[styles.orderLabel, { color: theme.text }]}>Jumlah Tiket / Orang</Text>
              
              <View style={styles.qtyController}>
                <TouchableOpacity 
                  style={[styles.qtyBtn, { backgroundColor: theme.border }]} 
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Ionicons name="remove" size={24} color={theme.text} />
                </TouchableOpacity>
                
                <Text style={[styles.qtyText, { color: theme.text }]}>{quantity}</Text>
                
                <TouchableOpacity 
                  style={[styles.qtyBtn, { backgroundColor: '#38BDF8' }]} 
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Ionicons name="add" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.totalContainer}>
              <Text style={[styles.totalLabel, { color: theme.textSub }]}>Total Pembayaran</Text>
              <Text style={styles.totalPrice}>Rp {totalPrice.toLocaleString('id-ID')}</Text>
            </View>

            <TouchableOpacity 
              style={styles.confirmBtn} 
              onPress={() => {
                // 1. 🚀 TUTUP MODALNYA DULU BIAR GAK TEMBUS!
                setShowModal(false); 
                
                // 2. Baru setelah itu pindah ke halaman Booking
                navigation.navigate('Booking', { item: item }); 
              }}
            >
              <Text style={styles.confirmBtnText}>Pesan Sekarang</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  carouselContainer: { width: width, height: 400 },
  mainImage: { width: width, height: 400, resizeMode: 'cover' },
  pagination: { position: 'absolute', bottom: 20, flexDirection: 'row', alignSelf: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  backButton: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 12 },
  
  // BAGIAN YANG DIUBAH: paddingBottom menjadi 140
  content: { padding: 24, paddingBottom: 140 }, 
  
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 25 },
  name: { fontSize: 28, fontWeight: 'bold' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  location: { marginLeft: 5, fontSize: 16 },
  distanceBadge: { backgroundColor: 'rgba(56, 189, 248, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  distanceText: { color: '#38BDF8', fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 24 },
  
  bottomBar: { position: 'absolute', bottom: 0, width: '100%', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1 },
  priceLabel: { fontSize: 12, marginBottom: 4 },
  priceValue: { fontSize: 20, fontWeight: 'bold', color: '#38BDF8' },
  bookBtn: { backgroundColor: '#38BDF8', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 16, elevation: 3 },
  bookBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, elevation: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  orderContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  orderLabel: { fontSize: 16, fontWeight: '600' },
  qtyController: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20 },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(150,150,150,0.2)' },
  totalLabel: { fontSize: 16 },
  totalPrice: { fontSize: 22, fontWeight: 'bold', color: '#38BDF8' },
  confirmBtn: { backgroundColor: '#10B981', paddingVertical: 16, borderRadius: 16, alignItems: 'center', elevation: 2 }, 
  confirmBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  // BAGIAN YANG DITAMBAHKAN: Style untuk Map
  mapSection: { marginTop: 10 },
  mapContainer: { 
    height: 220, 
    width: '100%', 
    borderRadius: 16, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: 'rgba(150,150,150,0.2)' 
  },
  map: { ...StyleSheet.absoluteFillObject }
});