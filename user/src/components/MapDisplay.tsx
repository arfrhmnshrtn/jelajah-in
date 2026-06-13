import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';

interface MapDisplayProps {
  latitude: string;
  longitude: string;
  name: string;
  location: string;
}

export default function MapDisplay({ latitude, longitude, name, location }: MapDisplayProps) {
  return (
    <View>
        <MapView
        style={styles.map}
        initialRegion={{
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {},
  map: {}
});
