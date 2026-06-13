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
  mapContainer: {},
  map: {}
});
