import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator, Animated, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import DateTimePicker from '@react-native-community/datetimepicker'; // 🚀 IMPORT KALENDER
import { useAppStore } from '../../store/useAppStore';

// 🚀 FUNGSI PEMBUAT ORDER ID UNIK (Anti Error 500 Midtrans)
const generateOrderId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Format: JLJ-20260528-184037
  return `JLJ-${year}${month}${day}-${hours}${minutes}${seconds}`;
};

export default function BookingScreen({ route, navigation }: any) {
  const { item } = route?.params || { item: {} };
  const { isDarkMode, addTicket, currentUser } = useAppStore(); 

  const [pageLoading, setPageLoading] = useState(true);
  const [pax, setPax] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🚀 STATE KALENDER BARU
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);

  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const theme = useMemo(() => ({
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    text: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    border: isDarkMode ? '#334155' : '#E2E8F0',
    inputBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    skeleton: isDarkMode ? '#334155' : '#E2E8F0',
  }), [isDarkMode]);

  const getRawPrice = () => {
    if (!item || !item.price) return 0;
    return parseInt(item.price.toString().replace(/[^0-9]/g, '')) || 0;
  };

  const basePrice = getRawPrice();
  const subTotal = basePrice * pax;
  const totalPayment = subTotal - discount;

  const formatRupiah = (angka: number) => {
    return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // 🚀 FUNGSI HANDLER KALENDER
  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const formatDateDisplay = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  const fetchUserVouchers = useCallback(async () => {
    if (!currentUser?.token) return;
    setIsLoadingVouchers(true);
    try {
      const response = await fetch('http://203.194.115.158:3000/api/vouchers/available-for-me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setAvailableVouchers(result.data || []);
      }
    } catch (error) {
      console.log("Gagal sinkronisasi data voucher:", error);
    } finally {
      setIsLoadingVouchers(false);
    }
  }, [currentUser?.token]);

  useEffect(() => {
    fetchUserVouchers();
  }, [currentUser, fetchUserVouchers]);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      Alert.alert("Perhatian", "Silakan masukkan kode voucher terlebih dahulu.");
      return;
    }

    // 🚀 --- START: KODE DUMMY SEMENTARA UNTUK SCREENSHOT ---
    if (promoCode.trim().toUpperCase() === 'PROMODOSEN') {
      const nilaiDiskon = 15000; 
      const finalDiscount = nilaiDiskon > subTotal ? subTotal : nilaiDiskon;
      setDiscount(finalDiscount);
      setIsPromoApplied(true);
      Alert.alert("Berhasil!", "Voucher PROMODOSEN berhasil digunakan! Anda hemat Rp 15.000 ✨");
      return; 
    }
    // 🚀 --- END: KODE DUMMY ---

    // Logika asli pencarian voucher dari server
    const matchedVoucher = availableVouchers.find(
      (v) => v.code.toUpperCase() === promoCode.trim().toUpperCase()
    );
  };

  const handlePayment = async () => {
    if (!currentUser || !currentUser.token) {
      Alert.alert("Akses Ditolak", "Silakan login terlebih dahulu untuk memesan tiket.");
      navigation.navigate('Login');
      return;
    }

    setIsLoading(true);

    // 🚀 BIKIN ID BARU TEPAT SAAT TOMBOL DITEKAN
    const newOrderId = generateOrderId();

    const payloadData: any = {
      order_id: newOrderId,       // Menyuntikkan ID unik
      gross_amount: totalPayment, // Menyuntikkan total harga
      packageId: Number(item?.id) || 1, 
      date: selectedDate.toISOString(), // Menggunakan tanggal dari DatePicker
      quantity: pax,
    };

    if (isPromoApplied && promoCode.trim() !== '') {
      payloadData.voucherCode = promoCode.trim().toUpperCase();
    }

    try {
      const response = await fetch('http://203.194.115.158:3000/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payloadData) 
      });

      const result = await response.json();

      const midtransUrl = result.redirectUrl 
                       || result.data?.redirectUrl 
                       || result.redirect_url 
                       || result.data?.paymentUrl 
                       || result.paymentUrl;

      if (response.ok && midtransUrl) {
        setIsLoading(false);
        setPaymentUrl(midtransUrl);
      } else {
        setIsLoading(false);
        Alert.alert("Pemesanan Gagal", result.message || "Gagal memproses tagihan di server.");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error Jaringan", "Gagal terhubung ke sistem pembayaran server.");
    }
  };

  const handleWebViewNavigation = (navState: any) => {
    const { url } = navState;

    if (url.includes('transaction_status=settlement') || url.includes('transaction_status=capture') || url.includes('status_code=200')) {
      setPaymentUrl(null); 
      
      if (typeof addTicket === 'function') {
        addTicket({
          destinationName: item?.name || 'Destinasi Wisata',
          location: item?.location || 'Lokasi',
          image: item?.image || item?.imageUrl || 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
          pax: pax,
          totalPrice: totalPayment,
        });
      }
      
      navigation.replace('Success'); 
    }

    if (url.includes('transaction_status=cancel') || url.includes('transaction_status=deny') || url.includes('transaction_status=expire')) {
      setPaymentUrl(null); 
      Alert.alert("Pembayaran Dibatalkan", "Transaksi gagal atau telah dibatalkan.");
    }
  };

  const SkeletonItem = useCallback(({ extraStyle }: { extraStyle: any }) => (
    <Animated.View style={[{ opacity: pulseAnim, backgroundColor: theme.skeleton }, extraStyle]} />
  ), [pulseAnim, theme.skeleton]);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.bg, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Pemesanan Tiket</Text>
        <View style={{ width: 34 }} /> 
      </View>

      {pageLoading ? (
        <ScrollView contentContainerStyle={{ paddingVertical: 24 }} scrollEnabled={false}>
          <View style={{ paddingHorizontal: 24 }}>
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <SkeletonItem extraStyle={styles.skeletonImage} />
              <View style={styles.cardContent}>
                <SkeletonItem extraStyle={styles.skeletonTextTitle} />
                <SkeletonItem extraStyle={styles.skeletonTextSub} />
                <SkeletonItem extraStyle={styles.skeletonTextPrice} />
              </View>
            </View>
          </View>
          
          <SkeletonItem extraStyle={styles.skeletonSectionLabel} />
          {/* Skeleton untuk tombol kalender baru */}
          <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
             <SkeletonItem extraStyle={styles.skeletonDatePicker} />
          </View>

          <View style={{ paddingHorizontal: 24 }}>
            <SkeletonItem extraStyle={styles.skeletonSectionLabel} />
            <SkeletonItem extraStyle={styles.skeletonCounterContainer} />
            <SkeletonItem extraStyle={styles.skeletonSectionLabel} />
            <SkeletonItem extraStyle={styles.skeletonPromoContainer} />
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ paddingVertical: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          
          <View style={{ paddingHorizontal: 24 }}>
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <Image source={{ uri: item?.image || item?.imageUrl || 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0' }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={[styles.itemTitle, { color: theme.text }]}>{item?.name || 'Wisata'}</Text>
                <Text style={[styles.itemLoc, { color: theme.textSub }]}>{item?.location || 'Lokasi'}</Text>
                <Text style={styles.itemPrice}>{item?.price || 'Rp 0'} <Text style={{ fontSize: 12, color: theme.textSub }}>/ orang</Text></Text>
              </View>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text, paddingHorizontal: 24, marginTop: 10 }]}>Pilih Tanggal Kunjungan</Text>
          
          {/* 🚀 UI TOMBOL KALENDER BARU */}
          <View style={{ paddingHorizontal: 24, marginBottom: 15 }}>
            <TouchableOpacity 
              style={[styles.datePickerBtn, { backgroundColor: theme.inputBg, borderColor: theme.border }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={24} color="#38BDF8" style={{ marginRight: 12 }} />
              <Text style={{ color: theme.text, fontSize: 16, flex: 1, fontWeight: '500' }}>
                {formatDateDisplay(selectedDate)}
              </Text>
              <Ionicons name="chevron-down" size={20} color={theme.textSub} />
            </TouchableOpacity>
          </View>

          {/* 🚀 COMPONENT KALENDER POP-UP */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              minimumDate={new Date()} // Mencegah pesan di hari yang sudah lewat
              onChange={handleDateChange}
            />
          )}

          <View style={{ paddingHorizontal: 24 }}>
            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 15 }]}>Jumlah Tiket</Text>
            <View style={[styles.counterContainer, { backgroundColor: theme.card }]}>
              <TouchableOpacity 
                style={[styles.counterBtn, { backgroundColor: theme.border }]} 
                onPress={() => {
                  setPax(pax > 1 ? pax - 1 : 1);
                  setIsPromoApplied(false); 
                  setDiscount(0);
                }}
              >
                <Ionicons name="remove" size={20} color={theme.text} />
              </TouchableOpacity>
              <Text style={[styles.counterValue, { color: theme.text }]}>{pax} Orang</Text>
              <TouchableOpacity 
                style={[styles.counterBtn, { backgroundColor: '#38BDF8' }]} 
                onPress={() => {
                  setPax(pax + 1);
                  setIsPromoApplied(false); 
                  setDiscount(0);
                }}
              >
                <Ionicons name="add" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 30 }]}>Punya Kode Promo?</Text>
            <View style={styles.promoWrapper}>
              <TextInput 
                style={[styles.promoInput, { backgroundColor: theme.inputBg, color: theme.text, borderColor: isPromoApplied ? '#10B981' : theme.border }]}
                placeholder="Masukkan kode promo..."
                placeholderTextColor={theme.textSub}
                value={promoCode}
                onChangeText={(txt) => {
                  setPromoCode(txt);
                  if (isPromoApplied) {
                    setIsPromoApplied(false);
                    setDiscount(0);
                  }
                }}
                autoCapitalize="characters"
              />
              <TouchableOpacity 
                style={[styles.promoBtn, { backgroundColor: isPromoApplied ? '#10B981' : '#38BDF8' }]} 
                onPress={handleApplyPromo}
              >
                <Text style={styles.promoBtnText}>{isPromoApplied ? 'Terpasang' : 'Gunakan'}</Text>
              </TouchableOpacity>
            </View>
            {isPromoApplied && (
              <Text style={styles.promoNote}>Hemat {formatRupiah(discount)} dengan voucher ini ✨</Text>
            )}

            {isLoadingVouchers ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                <ActivityIndicator size="small" color="#38BDF8" />
                <Text style={{ color: theme.textSub, fontSize: 13, marginLeft: 8 }}>Memuat voucher eksklusifmu...</Text>
              </View>
            ) : availableVouchers.length > 0 ? (
              <View style={{ marginTop: 12 }}>
                <Text style={{ color: theme.textSub, fontSize: 12, fontWeight: '600', marginBottom: 8 }}>Voucher yang tersedia untuk Anda (Klik untuk gunakan):</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4 }}>
                  {availableVouchers.map((voucher) => (
                    <TouchableOpacity 
                      key={voucher.id || voucher.code}
                      style={[
                        styles.voucherChip,
                        { backgroundColor: isDarkMode ? 'rgba(56,189,248,0.08)' : '#F0F9FF', borderColor: theme.border },
                        promoCode.toUpperCase() === voucher.code.toUpperCase() && { borderColor: '#38BDF8', backgroundColor: isDarkMode ? 'rgba(56,189,248,0.15)' : '#E0F2FE' }
                      ]}
                      onPress={() => {
                        setPromoCode(voucher.code);
                        if (isPromoApplied) {
                          setIsPromoApplied(false);
                          setDiscount(0);
                        }
                      }}
                    >
                      <Ionicons name="ticket-outline" size={14} color="#38BDF8" style={{ marginRight: 6 }} />
                      <Text style={styles.voucherChipText}>{voucher.code}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : (
              <Text style={{ color: theme.textSub, fontSize: 12, marginTop: 10, fontStyle: 'italic' }}>Tidak ada voucher tersedia untuk Anda saat ini.</Text>
            )}

            <View style={[styles.midtransInfo, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Ionicons name="shield-checkmark" size={24} color="#10B981" />
              <Text style={[styles.midtransText, { color: theme.textSub }]}>
                Pembayaran aman difasilitasi oleh Midtrans. Pilihan bank dan E-Wallet akan muncul pada layar selanjutnya.
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Floating Bottom Bar */}
      {!pageLoading && (
        <View style={[styles.bottomBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <View style={styles.totalContainer}>
            <Text style={[styles.totalLabel, { color: theme.textSub }]}>Total Pembayaran</Text>
            {isPromoApplied && (
              <Text style={styles.strikePrice}>{formatRupiah(subTotal)}</Text>
            )}
            <Text style={styles.totalPrice}>{formatRupiah(totalPayment)}</Text>
          </View>
          
          <View style={{ width: 160 }}>
            <TouchableOpacity 
              style={[styles.nativePayBtn, isLoading && { backgroundColor: '#64748B' }]}
              onPress={handlePayment}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.nativePayBtnText}>Lanjut Bayar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* MODAL BROWSER IN-APP MIDTRANS */}
      <Modal visible={!!paymentUrl} animationType="slide" onRequestClose={() => setPaymentUrl(null)}>
        <View style={{ flex: 1, backgroundColor: theme.bg }}>
          <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: theme.border }}>
            <TouchableOpacity onPress={() => setPaymentUrl(null)}>
              <Ionicons name="close" size={28} color={theme.text} />
            </TouchableOpacity>
            <Text style={{ marginLeft: 15, fontSize: 18, fontWeight: 'bold', color: theme.text }}>Pembayaran Aman</Text>
          </View>
          
          {paymentUrl && (
            <WebView
              source={{ uri: paymentUrl }}
              onNavigationStateChange={handleWebViewNavigation}
              startInLoadingState={true}
              renderLoading={() => (
                <ActivityIndicator size="large" color="#38BDF8" style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -18, marginTop: -18 }} />
              )}
            />
          )}
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  card: { flexDirection: 'row', borderRadius: 16, overflow: 'hidden', marginBottom: 10, elevation: 2 },
  cardImage: { width: 100, height: 100 },
  cardContent: { flex: 1, padding: 15, justifyContent: 'center' },
  itemTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  itemLoc: { fontSize: 13, marginBottom: 8 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#38BDF8' },

  // 🚀 STYLE TOMBOL KALENDER BARU
  datePickerBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, paddingVertical: 14, marginTop: 5 },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  counterContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 16, elevation: 1 },
  counterBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  counterValue: { fontSize: 18, fontWeight: 'bold' },
  promoWrapper: { flexDirection: 'row', alignItems: 'center' },
  promoInput: { flex: 1, height: 50, borderRadius: 12, paddingHorizontal: 15, fontSize: 14, borderWidth: 1 },
  promoBtn: { marginLeft: 10, paddingHorizontal: 20, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  promoBtnText: { color: '#FFF', fontWeight: 'bold' },
  promoNote: { color: '#10B981', fontSize: 12, marginTop: 8, fontWeight: '600' },
  voucherChip: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderStyle: 'dashed', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginRight: 10, elevation: 0.5 },
  voucherChipText: { color: '#38BDF8', fontWeight: 'bold', fontSize: 13 },
  midtransInfo: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 20 },
  midtransText: { flex: 1, marginLeft: 12, fontSize: 13, lineHeight: 20 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 5 },
  totalContainer: { flex: 1 },
  totalLabel: { fontSize: 12, marginBottom: 4 },
  strikePrice: { fontSize: 12, color: '#EF4444', textDecorationLine: 'line-through', marginBottom: 2 },
  totalPrice: { fontSize: 20, fontWeight: '900', color: '#38BDF8' },
  nativePayBtn: { backgroundColor: '#38BDF8', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  nativePayBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  skeletonImage: { width: 100, height: 100, borderRadius: 0 },
  skeletonTextTitle: { width: '80%', height: 18, borderRadius: 4, marginBottom: 8 },
  skeletonTextSub: { width: '50%', height: 14, borderRadius: 4, marginBottom: 12 },
  skeletonTextPrice: { width: '40%', height: 18, borderRadius: 4 },
  skeletonSectionLabel: { width: 150, height: 18, borderRadius: 4, marginLeft: 24, marginVertical: 15 },
  
  // 🚀 STYLE SKELETON KALENDER BARU
  skeletonDatePicker: { width: '100%', height: 50, borderRadius: 12 },
  
  skeletonCounterContainer: { width: '100%', height: 70, borderRadius: 16, marginBottom: 10 },
  skeletonPromoContainer: { width: '100%', height: 50, borderRadius: 12 }
});