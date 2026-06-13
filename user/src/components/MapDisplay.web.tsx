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
  mapContainer: {},
  textWarning: {}
});