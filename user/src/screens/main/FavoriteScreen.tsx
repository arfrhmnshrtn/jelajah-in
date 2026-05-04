import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import DestinationCard from '../../components/DestinationCard';

export default function FavoriteScreen() {
  const { favoriteIds } = useAppStore();
  
  // Data ini harusnya sama dengan yang ada di Home
  const allDestinations = [
    { id: '1', name: 'Gunung Bromo', location: 'Jawa Timur', distance: '12 km', price: 'Rp 350.000', image: 'https://images.unsplash.com/photo-1603417774163-1f1981180de0?auto=format&fit=crop&w=600&q=80' },
    { id: '2', name: 'Pantai Kuta', location: 'Bali', distance: '5 km', price: 'Rp 50.000', image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=600&q=80' },
    // ... tambahkan data lainnya ...
  ];

  // Filter data yang hanya ada di favoriteIds
  const favoriteData = allDestinations.filter(dest => favoriteIds.includes(dest.id));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wisata Favoritmu</Text>
      {favoriteData.length > 0 ? (
        <FlatList
          data={favoriteData}
          renderItem={({ item }) => (
            <DestinationCard {...item} onPress={() => {}} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
        />
      ) : (
        <Text style={styles.empty}>Belum ada wisata yang disukai.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: '#F8FAFC' },
  title: { fontSize: 24, fontWeight: 'bold', marginLeft: 20, marginBottom: 20 },
  empty: { textAlign: 'center', marginTop: 50, color: '#94A3B8' }
});