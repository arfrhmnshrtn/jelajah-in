import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import CustomButton from '../../components/CustomButton';

export default function BookingScreen({ route, navigation }: any) {
  const { item } = route.params;
  const { isDarkMode } = useAppStore();

  const [pax, setPax] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    text: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    border: isDarkMode ? '#334155' : '#E2E8F0',
    input: isDarkMode ? '#334155' : '#F1F5F9',
  };

  // Kalkulasi Harga
  const basePrice = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
  const subTotal = basePrice * pax;
  const totalPayment = subTotal - discount;

  const formatRupiah = (angka: number) => {
    return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Logika Cek Promo
  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'JELAJAHBARU') {
      const discountValue = subTotal * 0.3; // Diskon 30%
      setDiscount(discountValue);
      setIsPromoApplied(true);
      Alert.alert("Berhasil!", "Kode promo JELAJAHBARU berhasil digunakan. Kamu hemat 30%!");
    } else {
      setDiscount(0);
      setIsPromoApplied(false);
      Alert.alert("Gagal", "Kode promo tidak valid atau sudah kedaluwarsa.");
    }
  };

  const handlePayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.replace('Success');
    }, 2000);
  };

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

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        {/* Ringkasan Destinasi */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={[styles.itemTitle, { color: theme.text }]}>{item.name}</Text>
            <Text style={[styles.itemLoc, { color: theme.textSub }]}>{item.location}</Text>
            <Text style={styles.itemPrice}>{item.price} <Text style={{ fontSize: 12, color: theme.textSub }}>/ orang</Text></Text>
          </View>
        </View>

        {/* Pengaturan Tiket */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Jumlah Tiket</Text>
        <View style={[styles.counterContainer, { backgroundColor: theme.card }]}>
          <TouchableOpacity 
            style={[styles.counterBtn, { backgroundColor: theme.border }]} 
            onPress={() => {
              setPax(pax > 1 ? pax - 1 : 1);
              setIsPromoApplied(false); // Reset promo jika jumlah berubah agar kalkulasi ulang
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

        {/* INPUT KODE PROMO */}
        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 30 }]}>Punya Kode Promo?</Text>
        <View style={styles.promoWrapper}>
          <TextInput 
            style={[styles.promoInput, { backgroundColor: theme.input, color: theme.text, borderColor: isPromoApplied ? '#10B981' : theme.border }]}
            placeholder="Masukkan kode promo..."
            placeholderTextColor={theme.textSub}
            value={promoCode}
            onChangeText={setPromoCode}
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
          <Text style={styles.promoNote}>Hemat {formatRupiah(discount)} dengan kode {promoCode.toUpperCase()}</Text>
        )}

        {/* Info Midtrans */}
        <View style={[styles.midtransInfo, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="shield-checkmark" size={24} color="#10B981" />
          <Text style={[styles.midtransText, { color: theme.textSub }]}>
            Pembayaran aman difasilitasi oleh Midtrans. Pilihan bank dan E-Wallet akan muncul pada langkah selanjutnya.
          </Text>
        </View>
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: theme.textSub }]}>Total Pembayaran</Text>
          {isPromoApplied && (
            <Text style={styles.strikePrice}>{formatRupiah(subTotal)}</Text>
          )}
          <Text style={styles.totalPrice}>{formatRupiah(totalPayment)}</Text>
        </View>
        <View style={{ width: 160 }}>
          <CustomButton title="Lanjut Bayar" onPress={handlePayment} isLoading={isLoading} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  card: { flexDirection: 'row', borderRadius: 16, overflow: 'hidden', marginBottom: 30, elevation: 2 },
  cardImage: { width: 100, height: 100 },
  cardContent: { flex: 1, padding: 15, justifyContent: 'center' },
  itemTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  itemLoc: { fontSize: 13, marginBottom: 8 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#38BDF8' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  counterContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 16, elevation: 1 },
  counterBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  counterValue: { fontSize: 18, fontWeight: 'bold' },
  
  // Styles Promo
  promoWrapper: { flexDirection: 'row', alignItems: 'center' },
  promoInput: { flex: 1, height: 50, borderRadius: 12, paddingHorizontal: 15, fontSize: 14, borderWidth: 1 },
  promoBtn: { marginLeft: 10, paddingHorizontal: 20, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  promoBtnText: { color: '#FFF', fontWeight: 'bold' },
  promoNote: { color: '#10B981', fontSize: 12, marginTop: 8, fontWeight: '600' },

  midtransInfo: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 30 },
  midtransText: { flex: 1, marginLeft: 12, fontSize: 13, lineHeight: 20 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalContainer: { flex: 1 },
  totalLabel: { fontSize: 12, marginBottom: 4 },
  strikePrice: { fontSize: 12, color: '#EF4444', textDecorationLine: 'line-through', marginBottom: 2 },
  totalPrice: { fontSize: 20, fontWeight: '900', color: '#38BDF8' }
});