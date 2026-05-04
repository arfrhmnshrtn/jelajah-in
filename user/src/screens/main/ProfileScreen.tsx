import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Import library unggah foto
import { useAppStore } from '../../store/useAppStore';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';

export default function ProfileScreen({ navigation }: any) {
  const { isDarkMode, toggleDarkMode, currentUser, updateProfile, logout } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPicUrl, setEditPicUrl] = useState(currentUser?.profilePictureUrl || '');

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    text: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
  };

  const profileImage = editPicUrl 
    ? { uri: editPicUrl } 
    : { uri: currentUser?.profilePictureUrl || `https://ui-avatars.com/api/?name=${currentUser?.name || 'G'}&background=38BDF8&color=fff&size=150` };

  // FUNGSI MEMBUKA GALERI
  const pickImage = async () => {
    // Meminta izin akses galeri (opsional di web, wajib di HP)
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Hanya gambar
      allowsEditing: true, // Izinkan potong gambar (crop)
      aspect: [1, 1], // Rasio kotak (persegi)
      quality: 0.5, // Kompresi agar tidak berat
    });

    if (!result.canceled) {
      setEditPicUrl(result.assets[0].uri); // Simpan path gambar ke state sementara
    }
  };

  const handleSave = () => {
    if (!editName) {
      alert("Nama Lengkap wajib diisi!");
      return;
    }
    
    // Simpan nama dan foto ke Zustand
    updateProfile({ name: editName, profilePictureUrl: editPicUrl });
    setIsEditing(false);
    alert("Profil berhasil diperbarui!");
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (confirm('Apakah kamu yakin ingin keluar?')) {
        logout();
        navigation.replace('Login');
      }
    } else {
      Alert.alert('Konfirmasi', 'Apakah kamu yakin ingin keluar?', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', onPress: () => { logout(); navigation.replace('Login'); } }
      ]);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      
      {/* Header Profil */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image source={profileImage} style={styles.avatar} />
          {/* Tampilkan tombol kamera hanya saat mode edit */}
          {isEditing && (
            <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
              <Ionicons name="camera" size={20} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
        
        {!isEditing && (
          <>
            <Text style={[styles.name, { color: theme.text }]}>{currentUser?.name || 'Pengguna'}</Text>
            <Text style={[styles.email, { color: theme.textSub }]}>{currentUser?.email || 'email@belum-diisi.com'}</Text>
          </>
        )}
      </View>

      {/* FORM EDIT */}
      {isEditing ? (
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: theme.textSub }]}>Edit Data Profil</Text>
          
          <Text style={{ color: theme.textSub, marginBottom: 15, textAlign: 'center' }}>
            Klik ikon kamera di atas untuk mengubah foto profil.
          </Text>

          <InputField label="Nama Lengkap" iconName="person-outline" value={editName} onChangeText={setEditName} placeholder="Masukkan nama kamu" />
          
          <CustomButton title="SIMPAN PERUBAHAN" onPress={handleSave} iconName="save-outline" />
          <TouchableOpacity onPress={() => { setIsEditing(false); setEditPicUrl(currentUser?.profilePictureUrl || ''); }} style={styles.cancelBtn}>
            <Text style={[styles.cancelText, { color: theme.textSub }]}>Batal Edit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* MENU SEKSI (Statistik sudah dihapus) */
        <View style={styles.menuSection}>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]} onPress={() => setIsEditing(true)}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="person-circle-outline" size={24} color="#38BDF8" />
              <Text style={[styles.menuText, { color: theme.text }]}>Edit Profil</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSub} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]} onPress={toggleDarkMode}>
            <View style={styles.menuIconContainer}>
              <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={24} color="#38BDF8" />
              <Text style={[styles.menuText, { color: theme.text }]}>{isDarkMode ? "Mode Terang" : "Mode Gelap"}</Text>
            </View>
            <View style={[styles.toggleBtn, { backgroundColor: isDarkMode ? '#38BDF8' : '#E2E8F0' }]}>
              <View style={[styles.toggleCircle, { backgroundColor: '#FFF', alignSelf: isDarkMode ? 'flex-end' : 'flex-start' }]} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('FavoriteTab')}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="heart-outline" size={24} color="#38BDF8" />
              <Text style={[styles.menuText, { color: theme.text }]}>Wisata Favoritmu</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSub} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card, marginTop: 30 }]} onPress={handleLogout}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              <Text style={[styles.menuText, { color: '#EF4444', fontWeight: 'bold' }]}>Keluar Akun</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSub} />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileHeader: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#ffffff' },
  cameraButton: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#38BDF8', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF' },
  name: { fontSize: 26, fontWeight: 'bold', marginBottom: 5, letterSpacing: -1 },
  email: { fontSize: 16 },
  
  formSection: { marginBottom: 30 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' },
  cancelBtn: { marginTop: 15, padding: 10 },
  cancelText: { textAlign: 'center', fontSize: 15 },
  
  menuSection: { marginBottom: 30 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, borderRadius: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  menuIconContainer: { flexDirection: 'row', alignItems: 'center' },
  menuText: { marginLeft: 15, fontSize: 16, fontWeight: '600' },
  toggleBtn: { width: 44, height: 24, borderRadius: 12, padding: 2, justifyContent: 'center' },
  toggleCircle: { width: 20, height: 20, borderRadius: 10 }
});