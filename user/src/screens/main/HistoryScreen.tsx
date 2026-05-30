import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';

export default function HistoryScreen({ navigation }: any) {
  const { isDarkMode, currentUser } = useAppStore();
  
  // State untuk API
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    text: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    border: isDarkMode ? '#334155' : '#E2E8F0',
  };

  const formatRupiah = (angka: number) => {
    return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // 🟢 FUNGSI AMBIL DATA DARI SERVER ARIEF
  const fetchHistory = async () => {
    if (!currentUser || !currentUser.token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://203.194.115.158:3000/api/booking/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Accept': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok) {
        const dataArray = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];
        // Urutkan dari yang paling baru
        const sortedData = dataArray.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setHistoryData(sortedData);
      }
    } catch (error) {
      console.log("Error fetch history:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Panggil saat halaman dibuka
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsLoading(true);
      fetchHistory();
    });
    return unsubscribe;
  }, [navigation]);

  // Fitur Tarik ke Bawah untuk Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, [currentUser]);

  // Pengatur Warna Status Dinamis
  const getStatusStyle = (status: string) => {
    const s = status?.toUpperCase() || 'PENDING';
    if (s === 'SUCCESS' || s === 'PAID') return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', text: 'Berhasil' }; 
    if (s === 'PENDING') return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', text: 'Menunggu Pembayaran' }; 
    return { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', text: 'Dibatalkan' }; 
  };

  // Render Tiap Item (Menggunakan UI Keren Buatanmu!)
  const renderItem = ({ item }: any) => {
    const statusObj = getStatusStyle(item.status);
    const dateFormatted = new Date(item.createdAt || item.date).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric'
    });

    return (
      <View style={[styles.ticketCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {/* Bagian Atas: Info Wisata */}
        <View style={styles.ticketTop}>
          {/* Default Image jika backend Arief belum Join ke tabel Wisata */}
          <View style={[styles.placeholderImage, { backgroundColor: theme.border }]}>
             <Ionicons name="image-outline" size={30} color={theme.textSub} />
          </View>
          
          <View style={styles.ticketInfo}>
            {/* Tampilkan ID Package karena kita belum dapat nama dari backend */}
            <Text style={[styles.destName, { color: theme.text }]} numberOfLines={1}>
              Paket Wisata #{item.packageId}
            </Text>
            <Text style={[styles.destLoc, { color: theme.textSub }]}>Kode: {item.bookingCode}</Text>
            <Text style={[styles.statusText, { color: statusObj.color, backgroundColor: statusObj.bg }]}>
              {statusObj.text}
            </Text>
          </View>
        </View>

        {/* Garis Pemisah Putus-putus seperti Tiket Asli */}
        <View style={[styles.divider, { borderColor: theme.border }]} />

        {/* Bagian Bawah: Detail Pesanan & Barcode */}
        <View style={styles.ticketBottom}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: theme.textSub }]}>Tanggal Pesan:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{dateFormatted}</Text>
            
            <Text style={[styles.label, { color: theme.textSub, marginTop: 10 }]}>Jumlah & Total:</Text>
            <Text style={[styles.value, { color: theme.text }]}>
              {item.quantity} Orang • <Text style={{ color: '#38BDF8' }}>{formatRupiah(item.totalPrice || 0)}</Text>
            </Text>
          </View>
          
          {/* Simulasi Barcode QR (Pakai Icon) */}
          <View style={[styles.qrContainer, { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }]}>
            <Ionicons name="receipt-outline" size={40} color={theme.text} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* 🟢 HEADER DENGAN TOMBOL BACK */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Riwayat Pemesanan</Text>
        {/* View kosong untuk menyeimbangkan flex space-between jika diperlukan */}
        <View style={{ width: 24 }} /> 
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#38BDF8" />
        </View>
      ) : !currentUser ? (
        <View style={styles.centerContainer}>
          <Ionicons name="lock-closed-outline" size={80} color={theme.textSub} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Silakan Login</Text>
        </View>
      ) : historyData.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="time-outline" size={80} color={theme.textSub} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Belum ada riwayat</Text>
          <Text style={[styles.emptySub, { color: theme.textSub }]}>
            Riwayat transaksimu akan muncul di sini.
          </Text>
        </View>
      ) : (
        <FlatList
          data={historyData}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38BDF8" />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  
  // 🟢 STYLE HEADER DIPERBARUI AGAR SEJAJAR DENGAN TOMBOL BACK
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20, 
    paddingBottom: 15, 
    borderBottomWidth: 1 
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  
  ticketCard: { borderRadius: 16, borderWidth: 1, marginBottom: 20, overflow: 'hidden', elevation: 2 },
  ticketTop: { flexDirection: 'row', padding: 15 },
  placeholderImage: { width: 70, height: 70, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  ticketInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  destName: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  destLoc: { fontSize: 14, marginBottom: 6 },
  statusText: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  
  divider: { borderBottomWidth: 2, borderStyle: 'dashed', marginHorizontal: 15 },
  
  ticketBottom: { flexDirection: 'row', padding: 15, alignItems: 'center' },
  label: { fontSize: 11, marginBottom: 2 },
  value: { fontSize: 13, fontWeight: 'bold' },
  qrContainer: { padding: 10, borderRadius: 12, marginLeft: 15 },

  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  emptySub: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40, lineHeight: 22 },
});