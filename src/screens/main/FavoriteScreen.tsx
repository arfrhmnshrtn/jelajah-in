import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAppStore } from '../../store/useAppStore';

export default function FavoriteScreen() {
  const rootNavigation = useNavigation<any>();
  const { isDarkMode, currentUser, toggleFavorite } = useAppStore();
  
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // STATE UNTUK UI
  const [toastMessage, setToastMessage] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{bookmarkId: number, packageId: string} | null>(null);

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    text: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    border: isDarkMode ? '#334155' : '#E2E8F0',
    danger: '#EF4444',
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000); 
  };

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const request = await fetch('http://203.194.115.158:3000/api/bookmarks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`,
          'Accept': 'application/json'
        }
      });
      const response = await request.json();
      if (request.ok) {
        setBookmarks(response.data || response); 
      }
    } catch (error) {
      console.log("Error fetch bookmarks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    const { bookmarkId, packageId } = itemToDelete;
    
    setDeleteModalVisible(false);

    try {
      const request = await fetch(`http://203.194.115.158:3000/api/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`,
          'Accept': 'application/json'
        }
      });

      if (request.ok) {
        setBookmarks((prev) => prev.filter((item) => item.id !== bookmarkId));
        if (packageId) {
           toggleFavorite(packageId); 
        }
        showToast("Wisata berhasil dihapus dari favorit! 🗑️");
      } else {
        showToast("Gagal menghapus wisata ❌");
      }
    } catch (error: any) {
      showToast("Error jaringan, periksa koneksimu 🌐");
    }
  };

  const confirmDelete = (bookmarkId: number, packageId: string) => {
    setItemToDelete({ bookmarkId, packageId });
    setDeleteModalVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();
    }, [])
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-dislike-outline" size={80} color={theme.textSub} opacity={0.5} />
      <Text style={[styles.emptyTitle, { color: theme.text }]}>Belum ada favorit</Text>
      <Text style={[styles.emptySub, { color: theme.textSub }]}>
        Kamu belum menambahkan paket wisata apa pun ke daftar favoritmu.
      </Text>
      <TouchableOpacity 
        style={[styles.exploreBtn, { zIndex: 9999, elevation: 10 }]} // 🟢 Paksa tombolnya maju ke paling depan
        onPress={() => {
          try {
            // Coba navigasi standar lagi
            navigation.navigate('Beranda'); 
          } catch (error) {
            console.log("Error Navigasi:", error);
          }
        }}
      >
        <Text style={styles.exploreBtnText}>Cari Wisata Sekarang</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => rootNavigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Wisata Favoritmu</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {toastMessage !== '' && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#38BDF8" />
          <Text style={{ color: theme.textSub, marginTop: 10 }}>Memuat daftar favorit...</Text>
        </View>
      ) : bookmarks.length === 0 ? (
        renderEmptyComponent()
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => {
            const wisata = item.package || item; 
            const bookmarkId = item.id; 
            const packageId = wisata.id?.toString(); 

            return (
              <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Image 
                  source={{ uri: wisata?.imageUrl || 'https://via.placeholder.com/150' }} 
                  style={styles.cardImage} 
                />
                
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={2}>
                    {wisata?.name || 'Nama Wisata'}
                  </Text>
                  <Text style={[styles.cardPrice, { color: '#38BDF8' }]}>
                    Rp {wisata?.price || '0'}
                  </Text>
                </View>

                <TouchableOpacity 
                  style={styles.deleteBtn} 
                  onPress={() => confirmDelete(bookmarkId, packageId)} 
                >
                  <Ionicons name="trash-outline" size={22} color={theme.danger} />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      <Modal visible={deleteModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalIconBg}>
              <Ionicons name="trash" size={36} color={theme.danger} />
            </View>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Hapus Favorit?</Text>
            <Text style={[styles.modalMessage, { color: theme.textSub }]}>
              Wisata ini akan dihapus dari daftar favoritmu. Kamu yakin?
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setDeleteModalVisible(false)}>
                <Text style={[styles.cancelBtnText, { color: theme.textSub }]}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmDeleteBtn, { backgroundColor: theme.danger }]} onPress={executeDelete}>
                <Text style={styles.confirmDeleteBtnText}>Ya, Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 50, paddingBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  backBtn: { padding: 5 },
  listContainer: { padding: 20, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  card: { flexDirection: 'row', borderRadius: 16, marginBottom: 16, padding: 12, borderWidth: 1, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardImage: { width: 80, height: 80, borderRadius: 12 },
  cardInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  cardPrice: { fontSize: 14, fontWeight: '600' },
  deleteBtn: { justifyContent: 'center', padding: 10 },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  emptySub: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  exploreBtn: { backgroundColor: '#38BDF8', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, elevation: 3 },
  exploreBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  toastContainer: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: '#10B981', 
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  toastText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
  },
  modalIconBg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalMessage: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  modalActions: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: 'rgba(148, 163, 184, 0.1)', marginRight: 10, alignItems: 'center' },
  cancelBtnText: { fontSize: 15, fontWeight: 'bold' },
  confirmDeleteBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginLeft: 10 },
  confirmDeleteBtnText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
});