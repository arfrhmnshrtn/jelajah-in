import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Jalur yang benar (cukup mundur 1 langkah dengan '../' karena file ini ada di dalam folder components)
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
  
  const { isDarkMode, favoriteIds, toggleFavorite } = useAppStore();
  const isLiked = favoriteIds.includes(id);

  const themeColors = {
    bg: isDarkMode ? '#1E293B' : '#FFFFFF',
    textTitle: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: themeColors.bg }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        
        {/* Tombol Favorit di Pojok Kanan Atas Gambar */}
        <TouchableOpacity 
          style={styles.likeButton} 
          onPress={() => toggleFavorite(id)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={22} 
            color={isLiked ? "#EF4444" : "#FFFFFF"} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: themeColors.textTitle }]} numberOfLines={1}>{name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.ratingText}>4.8</Text>
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
    overflow: 'hidden',
  },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 180 },
  likeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
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