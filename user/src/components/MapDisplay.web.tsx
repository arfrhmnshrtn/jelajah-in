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
    <View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {},
  textWarning: {}
});