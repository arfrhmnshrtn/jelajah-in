import { create } from 'zustand';

// 1. Definisikan tipe data User
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  profilePictureUrl?: string; 
  token?: string;
}

// 2. Definisikan tipe data Tiket untuk Riwayat Pemesanan
export interface Ticket {
  id: string;
  destinationName: string;
  location: string;
  image: string;
  pax: number;
  totalPrice: number;
  bookingDate: string;
}

// 3. Definisikan cetak biru Store
interface AppState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // State Auth Nyata
  registeredUsers: User[];
  currentUser: User | null;
  register: (user: Omit<User, 'id'>) => void;
  login: (userData: User) => void;
  logout: () => void;
  
  // State Favorit
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  
  // State Profile
  updateProfile: (data: Partial<Omit<User, 'id' | 'email'>>) => void;

  // State Tiket (Riwayat Pemesanan) Baru
  myTickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'bookingDate'>) => void;
}

// 4. Buat Store-nya
export const useAppStore = create<AppState>((set, get) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  registeredUsers: [],
  currentUser: null,

  // Fungsi Register
  register: (newUser) => set((state) => ({
    registeredUsers: [...state.registeredUsers, { ...newUser, id: Date.now().toString() }]
  })),

  // Fungsi Login
  // GANTI JADI INI:
  login: (userData) => set({ currentUser: userData }),

  logout: () => set({ currentUser: null }),

  // State & Fungsi Favorit
  favoriteIds: [],
  toggleFavorite: (id) => set((state) => ({
    favoriteIds: state.favoriteIds.includes(id)
      ? state.favoriteIds.filter(favId => favId !== id)
      : [...state.favoriteIds, id]
  })),

  // Fungsi Update Profil
  updateProfile: (data) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, ...data } : null
  })),

  // State & Fungsi Tiket Baru
  myTickets: [],
  addTicket: (newTicket) => set((state) => {
    // Membuat tiket baru dengan ID unik dan tanggal pemesanan saat ini
    const completeTicket: Ticket = {
      ...newTicket,
      id: `TIX-${Date.now()}`,
      bookingDate: new Date().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    };
    // Masukkan tiket baru ke posisi paling atas (terbaru)
    return { myTickets: [completeTicket, ...state.myTickets] };
  }),
}));