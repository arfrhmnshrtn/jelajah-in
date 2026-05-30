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

export default function TicketScreen({ navigation }: any) {
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

  // AMBIL DATA DARI SERVER ARIEF & FILTER KHUSUS YANG LUNAS
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
        
        // 🚀 JALAN NINJA FILTER: Hanya loloskan tiket yang berstatus SUCCESS atau PAID 🚀
        const validTickets = dataArray.filter((item: any) => {
          const s = item.status?.toUpperCase();
          return s === 'SUCCESS' || s === 'PAID';
        });

        // Urutkan dari yang paling baru dibeli
        const sortedData = validTickets.sort((a: any, b: any) => 
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsLoading(true);
      fetchHistory();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, [currentUser]);

  // Render Tiap Item Tiket Lunas
  const renderItem = ({ item }: any) => {
    const dateFormatted = new Date(item.createdAt || item.date).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric'
    });

    const imageUrl = item.package?.imageUrl || item.package?.image || item.imageUrl || item.image;
    const packageName = item.package?.name || `Paket Wisata #${item.packageId}`;

    return (
      <View style={[styles.ticketCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {/* Bagian Atas: Info Wisata */}
        <View style={styles.ticketTop}>
          
          {/* Tampilkan gambar destinasi asli */}
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.ticketImage} />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: theme.border }]}>
               <Ionicons name="image-outline" size={30} color={theme.textSub} />
            </View>
          )}
          
          <View style={styles.ticketInfo}>
            <Text style={[styles.destName, { color: theme.text }]} numberOfLines={1}>
              {packageName}
            </Text>
            <Text style={[styles.destLoc, { color: theme.textSub }]}>Kode: {item.bookingCode}</Text>
            
            {/* Badge Status dibuat fix Berhasil karena sudah difilter */}
            <Text style={[styles.statusText, { color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              Berhasil / Lunas
            </Text>
          </View>
        </View>

        {/* Garis Pemisah Putus-putus seperti Tiket Asli */}
        <View style={[styles.divider, { borderColor: theme.border }]} />

        {/* Bagian Bawah: Detail Pesanan & Struk Bukti */}
        <View style={styles.ticketBottom}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: theme.textSub }]}>Tanggal Pesan:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{dateFormatted}</Text>
            
            <Text style={[styles.label, { color: theme.textSub, marginTop: 10 }]}>Jumlah & Total:</Text>
            <Text style={[styles.value, { color: theme.text }]}>
              {item.quantity} Orang • <Text style={{ color: '#38BDF8' }}>{formatRupiah(item.totalPrice || 0)}</Text>
            </Text>
          </View>
          
          {/* Ikon Struk Bukti fisik untuk ditunjukkan ke panitia */}
          <View style={[styles.qrContainer, { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }]}>
            <Ionicons name="receipt-outline" size={40} color={theme.text} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* HEADER BARU UNTUK KOMUNITAS PANITIA */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>E-Tiket Wisata Anda</Text>
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
          <Ionicons name="qr-code-outline" size={80} color={theme.textSub} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Belum Ada Tiket Aktif</Text>
          <Text style={[styles.emptySub, { color: theme.textSub }]}>
            Tiket yang sudah berhasil dibayar dan lunas akan muncul di sini sebagai bukti masuk objek wisata.
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  
  ticketCard: { borderRadius: 16, borderWidth: 1, marginBottom: 20, overflow: 'hidden', elevation: 2 },
  ticketTop: { flexDirection: 'row', padding: 15 },
  ticketImage: { width: 70, height: 70, borderRadius: 12 }, 
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

  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  emptySub: { fontSize: 14, textAlign: 'center', paddingHorizontal: 20, lineHeight: 22 },
});