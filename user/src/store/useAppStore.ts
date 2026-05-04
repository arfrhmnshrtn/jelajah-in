import { create } from 'zustand';

// 1. Definisikan tipe data User (sekarang ada profilePictureUrl)
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  profilePictureUrl?: string; // Tambahan untuk foto beneran
}

// 2. Definisikan cetak biru Store
interface AppState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // State Auth Nyata
  registeredUsers: User[];
  currentUser: User | null;
  register: (user: Omit<User, 'id'>) => void; // Register tanpa ID
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  
  // State Favorit
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  
  // State Profile
  updateProfile: (data: Partial<Omit<User, 'id' | 'email'>>) => void; // Update hanya Nama & Foto
}

// 3. Buat Store-nya
export const useAppStore = create<AppState>((set, get) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  registeredUsers: [],
  currentUser: null,

  // Fungsi Register (Buat ID unik otomatis)
  register: (newUser) => set((state) => ({
    registeredUsers: [...state.registeredUsers, { ...newUser, id: Date.now().toString() }]
  })),

  // Fungsi Login
  login: (email, password) => {
    const user = get().registeredUsers.find(u => u.email === email && u.password === password);
    if (user) {
      set({ currentUser: user });
      return true;
    }
    return false;
  },

  logout: () => set({ currentUser: null }),

  favoriteIds: [],
  toggleFavorite: (id) => set((state) => ({
    favoriteIds: state.favoriteIds.includes(id)
      ? state.favoriteIds.filter(favId => favId !== id)
      : [...state.favoriteIds, id]
  })),

  // Fungsi Update Profil Nyata (Hanya Nama & Foto yang bisa diubah untuk mockup)
  updateProfile: (data) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, ...data } : null
  })),
}));