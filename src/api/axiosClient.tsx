import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Ganti dengan URL https yang didapat dari terminal ngrok
// Pastikan tidak ada slash (/) di akhir URL
const BASE_URL = 'https://ba83-103-59-45-37.ngrok-free.app/api'; 

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // 2. Tambahkan header ini agar request API tidak nyangkut di halaman peringatan ngrok
    'ngrok-skip-browser-warning': 'true', 
  },
});

// Interceptor untuk menyisipkan Token JWT
axiosClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;