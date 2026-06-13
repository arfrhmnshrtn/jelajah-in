import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';

interface DestinationCardProps {
  id: string;
  name: string;
  location: string;
  distance: string;
  price: string;
  image: string;
  onPress: () => void;
}

export default function DestinationCard({ 
  id, name, location, distance, price, image, onPress 
}: DestinationCardProps) {
  
  const { isDarkMode, favoriteIds, toggleFavorite, currentUser } = useAppStore();
  const isLiked = favoriteIds.includes(id);

  const [isLoadingLike, setIsLoadingLike] = useState(false);

  const themeColors = {
    bg: isDarkMode ? '#1E293B' : '#FFFFFF',
    textTitle: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
  };

  const handleToggleFavorite = async () => {
    // 1. Nyalakan animasi loading
    setIsLoadingLike(true);

    try {
      // 2. Trik API Bohongan: Pura-pura menunggu server Arief merespons selama 1,5 detik
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 3. Langsung ubah warna tombol Love-nya (Nyalakan/Matikan)
      toggleFavorite(id); 

      // 4. Beri pesan sukses di konsol
      if (isLiked) {
        console.log("Pura-pura berhasil MENGHAPUS dari server!");
      } else {
        console.log("Pura-pura berhasil MENAMBAH ke server!");
      }

    } catch (error) {
      Alert.alert("Gagal", "Sistem bohongan error");
    } finally {
      // 5. Matikan animasi loading
      setIsLoadingLike(false);
    }
  };

  // const handleToggleFavorite = async () => {
    
  //   if (!currentUser || !currentUser.token) {
  //     Alert.alert("Perhatian", "Silakan login terlebih dahulu untuk menyimpan wisata favorit.");
  //     return;
  //   }

  //   if (!isLiked) {
  //     // --- 🟢 JIKA MENAMBAH FAVORIT (POST) ---
  //     try {
  //       const request = await fetch('http://203.194.115.158:3000/api/bookmarks', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Accept': 'application/json',
  //           'Authorization': `Bearer ${currentUser.token}`
  //         },
  //         body: JSON.stringify({ packageId: parseInt(id) }) 
  //       });

  //       const rawText = await request.text();

  //       if (!request.ok) {
  //         if (rawText.includes("Sudah di-bookmark") || rawText.includes("already")) {
  //            // Kalau ternyata sudah ada di server, nyalakan saja warnanya di HP
  //            toggleFavorite(id); 
  //         } else {
  //            Alert.alert("Gagal Menyimpan", rawText);
  //         }
  //       } else {
  //         toggleFavorite(id); // Berhasil, nyalakan love
  //         console.log("Wisata berhasil ditambah ke server Arief!");
  //       }
  //     } catch (error: any) {
  //       Alert.alert("Masalah Jaringan", `Gagal terhubung ke server: ${error.message}`);
  //     }

  //   } else {
  //     // --- 🔴 JIKA MENGHAPUS FAVORIT DARI HALAMAN HOME (DELETE) ---
  //     try {
  //       // 1. Ambil daftar bookmark dari server untuk mencari ID Bookmark-nya
  //       const getRequest = await fetch('http://203.194.115.158:3000/api/bookmarks', {
  //         method: 'GET',
  //         headers: {
  //           'Authorization': `Bearer ${currentUser.token}`,
  //           'Accept': 'application/json'
  //         }
  //       });
        
  //       const getResponse = await getRequest.json();
        
  //       if (getRequest.ok) {
  //         const bookmarksList = getResponse.data || getResponse;
          
  //         // 2. Cari bookmark yang cocok dengan ID Wisata (packageId) ini
  //         const targetBookmark = bookmarksList.find((b: any) => {
  //            const wisata = b.package || b;
  //            return wisata.id?.toString() === id.toString();
  //         });

  //         // 3. Jika ketemu ID Bookmark-nya, langsung tembak perintah DELETE
  //         if (targetBookmark && targetBookmark.id) {
  //           const deleteRequest = await fetch(`http://203.194.115.158:3000/api/bookmarks/${targetBookmark.id}`, {
  //             method: 'DELETE',
  //             headers: {
  //               'Authorization': `Bearer ${currentUser.token}`,
  //               'Accept': 'application/json'
  //             }
  //           });

  //           if (deleteRequest.ok) {
  //             toggleFavorite(id); // Matikan warna merah di HP
  //             console.log("Berhasil hapus favorit langsung dari Home!");
  //           } else {
  //             Alert.alert("Gagal", "Gagal menghapus dari daftar favorit di server.");
  //           }
  //         } else {
  //           // Kalau di server Arief ternyata tidak ada (sinkronisasi telat), 
  //           // kita matikan saja paksa love merahnya di HP agar sesuai.
  //           toggleFavorite(id);
  //         }
  //       }
  //     } catch (error: any) {
  //       Alert.alert("Masalah Jaringan", `Gagal menghapus favorit: ${error.message}`);
  //     }
  //   }
  // };

  return (
    <View style={[styles.card, { backgroundColor: themeColors.bg }]}>
      
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
        
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: themeColors.textTitle }]} numberOfLines={1}>{name}</Text>
            <View style={styles.ratingContainer}>
              
              
            </View>
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={themeColors.textSub} />
            <Text style={[styles.locationText, { color: themeColors.textSub }]}>
              {location} • {distance}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{price}</Text>
            <Text style={[styles.perPerson, { color: themeColors.textSub }]}>/orang</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.likeButtonWrapper}>
        <TouchableOpacity 
          style={styles.likeButton} 
          onPress={handleToggleFavorite} 
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={22} 
            color={isLiked ? "#EF4444" : "#FFFFFF"} 
          />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    marginBottom: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    position: 'relative', 
  },
  imageContainer: { 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    overflow: 'hidden' 
  },
  image: { width: '100%', height: 180 },
  likeButtonWrapper: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  likeButton: {
    backgroundColor: 'rgba(15, 23, 42, 0.4)', 
    borderRadius: 20,
    padding: 8,
  },
  content: { padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 20, fontWeight: 'bold', flex: 1, marginRight: 10 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(245, 158, 11, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingText: { color: '#F59E0B', fontWeight: 'bold', fontSize: 12, marginLeft: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  locationText: { fontSize: 13, marginLeft: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontSize: 18, fontWeight: '900', color: '#38BDF8' },
  perPerson: { fontSize: 12, marginLeft: 4 },
});