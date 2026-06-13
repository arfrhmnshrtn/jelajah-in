import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../../store/useAppStore';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import axiosClient from '../../api/axiosClient';

export default function ProfileScreen({ navigation }: any) {
  const { isDarkMode, toggleDarkMode, currentUser, logout } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  
  // State Input Form Edit Profil
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editPassword, setEditPassword] = useState('');
  const [editPicUrl, setEditPicUrl] = useState(currentUser?.profilePictureUrl || '');

  // State untuk Pop-up Logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    text: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    border: isDarkMode ? '#334155' : '#E2E8F0',
    danger: '#EF4444', 
  };

  const profileImage = editPicUrl 
    ? { uri: editPicUrl } 
    : { uri: currentUser?.profilePictureUrl || `https://ui-avatars.com/api/?name=${currentUser?.name || 'G'}&background=38BDF8&color=fff&size=150` };

  // FUNGSI MEMBUKA GALERI FOTO
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setEditPicUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!editName || !editEmail) {
      alert("Nama Lengkap dan Email wajib diisi!");
      return;
    }

    const updatedUserStorage = {
      ...currentUser,
      name: editName,
      email: editEmail,
      profilePictureUrl: editPicUrl
    };

    try {
      useAppStore.setState({ currentUser: updatedUserStorage as any });
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserStorage));
      
      setEditPassword('');
      setIsEditing(false);
    } catch (err) {
      console.log("Gagal menyimpan ke memori lokal:", err);
    }

    if (currentUser && currentUser.token) {
      try {
        const formData = new FormData();
        formData.append('name', editName);
        formData.append('email', editEmail);
        formData.append('_method', 'PATCH');

        if (editPassword.trim() !== '') {
          formData.append('password', editPassword);
        }

        if (editPicUrl && editPicUrl.startsWith('file://')) {
          let filename = editPicUrl.split('/').pop() || 'profile.jpg';
          let match = /\.(\w+)$/.exec(filename);
          let type = match ? `image/${match[1]}` : `image/jpeg`;

          formData.append('avatar', {
            uri: editPicUrl,
            name: filename,
            type: type,
          } as any); 
        }

        await axiosClient.post('/auth/update', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        alert("Profil berhasil diperbarui di Memori Lokal dan Server.");

      } catch (error: any) {
        console.log('Server offline:', error.message);
        alert("Profil berhasil diperbarui secara lokal (Server offline).");
      }
    } else {
      alert("Profil berhasil diperbarui secara lokal.");
    }
  };

  // Fungsi eksekusi saat tombol keluar ditekan di Pop-up
  const handleConfirmLogout = async () => {
    setShowLogoutModal(false); 
    await AsyncStorage.removeItem('userData'); 
    logout(); 
    navigation.replace('Login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* Header Profil */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={profileImage} style={styles.avatar} />
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
            
            <Text style={{ color: theme.textSub, marginBottom: 20, textAlign: 'center', fontSize: 13 }}>
              Ubah data di bawah ini untuk memperbarui profil akun Anda.
            </Text>

            <InputField label="Nama Lengkap" iconName="person-outline" value={editName} onChangeText={setEditName} placeholder="Masukkan nama kamu" />
            
            <InputField label="Alamat Email" iconName="mail-outline" value={editEmail} onChangeText={setEditEmail} placeholder="Masukkan email aktif" keyboardType="email-address" />
            
            <InputField label="Password Baru (Kosongkan jika tidak diganti)" iconName="lock-closed-outline" value={editPassword} onChangeText={setEditPassword} placeholder="Minimal 6 karakter" secureTextEntry={true} />
            
            <CustomButton title="SIMPAN PERUBAHAN" onPress={handleSave} iconName="save-outline" />
            
            <TouchableOpacity onPress={() => { setIsEditing(false); setEditName(currentUser?.name || ''); setEditEmail(currentUser?.email || ''); setEditPassword(''); setEditPicUrl(currentUser?.profilePictureUrl || ''); }} style={styles.cancelBtn}>
              <Text style={[styles.cancelText, { color: theme.textSub }]}>Batal Edit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* MENU UTAMA */
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

            <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('History')}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="receipt-outline" size={24} color="#38BDF8" />
                <Text style={[styles.menuText, { color: theme.text }]}>Riwayat Transaksi</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSub} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card, marginTop: 30 }]} onPress={() => setShowLogoutModal(true)}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                <Text style={[styles.menuText, { color: '#EF4444', fontWeight: 'bold' }]}>Keluar Akun</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSub} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* POP-UP MODAL LOGOUT */}
      <Modal visible={showLogoutModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            <View style={styles.iconCircle}>
              <Ionicons name="log-out" size={36} color={theme.danger} />
            </View>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Keluar Akun?</Text>
            <Text style={[styles.modalMessage, { color: theme.textSub }]}>
              Apakah kamu yakin ingin keluar dari akun ini? Kamu harus login kembali untuk masuk.
            </Text>
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity style={[styles.modalButtonBase, styles.modalCancelButton]} onPress={() => setShowLogoutModal(false)}>
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButtonBase, styles.modalConfirmButton, { backgroundColor: theme.danger }]} onPress={handleConfirmLogout}>
                <Text style={styles.modalConfirmText}>Ya, Keluar</Text>
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
  toggleCircle: { width: 20, height: 20, borderRadius: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { width: '100%', borderRadius: 24, padding: 30, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 15 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(239, 68, 68, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: '800', marginBottom: 10 },
  modalMessage: { fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 30 },
  modalButtonGroup: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButtonBase: { flex: 1, paddingVertical: 14, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  modalCancelButton: { backgroundColor: '#F1F5F9', marginRight: 10 },
  modalCancelText: { color: '#64748B', fontSize: 16, fontWeight: 'bold' },
  modalConfirmButton: { marginLeft: 10 },
  modalConfirmText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});