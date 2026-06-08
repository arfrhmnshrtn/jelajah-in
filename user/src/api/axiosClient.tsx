import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Murni 100% menarik dari .env tanpa cadangan hardcode!
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://ba83-103-59-45-37.ngrok-free.app/api';

// Alarm otomatis: Muncul di terminal kalau .env lupa diisi atau cache belum dibersihkan


const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Penangkal wajib ngrok
    'ngrok-skip-browser-warning': 'true', 
  },
});

// Interceptor (Satpam Otomatis) untuk menyisipkan Token JWT
axiosClient.interceptors.request.use(
  async (config) => {
    // Sesuaikan dengan key yang dipakai saat LoginScreen ('userData')
    const storedData = await AsyncStorage.getItem('userData');
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token; 

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;