import React from 'react';
import { View, Text } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';

interface MapDisplayProps {
  latitude: string;
  longitude: string;
  name: string;
  location: string;
}

export default function MapDisplay({ name }: MapDisplayProps) {
  return (
    <View style={styles.mapContainer}>
      <Text style={styles.textWarning}>
        (Peta interaktif untuk {name} hanya tersedia di aplikasi Android/iOS)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: { 
    height: 200, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F1F5F9', 
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed'
  },
  textWarning: {
    textAlign: 'center', 
    color: '#64748B',
    paddingHorizontal: 20
  }
});