import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  // 1. Minta izin akses lokasi ke pengguna
  let { status } = await Location.requestForegroundPermissionsAsync();
  
  if (status !== 'granted') {
    return { error: 'Izin akses lokasi ditolak' };
  }

  // 2. Ambil koordinat (Latitude & Longitude)
  let location = await Location.getCurrentPositionAsync({});
  
  // 3. Reverse Geocode (Ubah koordinat jadi nama kota/alamat)
  let address = await Location.reverseGeocodeAsync({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });

  if (address.length > 0) {
    const { city, region, country } = address[0];
    return {
      display: `${city || region}, ${country}`,
      coords: location.coords
    };
  }

  return { error: 'Gagal mendeteksi alamat' };
};