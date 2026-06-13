import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

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
        <Marker
          coordinate={{ 
            latitude: parseFloat(latitude), 
            longitude: parseFloat(longitude) 
          }}
          title={name}
          description={location}
        />
        
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: { height: 200, borderRadius: 16, overflow: 'hidden', marginTop: 10 },
  map: { width: '100%', height: '100%' }
});
