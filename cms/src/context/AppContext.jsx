import React, { createContext, useState, useEffect, useContext } from 'react';
import { translations } from '../translations';

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'id';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isLogged') === 'true';
  });

  const t = (key) => {
    return translations[language][key] || key;
  };

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      name: 'Panji Sual',
      email: localStorage.getItem('email') || 'admin1@gmail.com',
      avatar: 'https://ui-avatars.com/api/?name=Panji+Sual&background=6366f1&color=fff'
    };
  });

  const [packages, setPackages] = useState(() => {
    const saved = localStorage.getItem('cached_packages');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/packages`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const result = await response.json();
      const loadedPackages = Array.isArray(result.data) ? result.data : [];
      setPackages(loadedPackages);
      localStorage.setItem('cached_packages', JSON.stringify(loadedPackages));
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('cached_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('cached_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [vouchers, setVouchers] = useState(() => {
    const saved = localStorage.getItem('cached_vouchers');
    return saved ? JSON.parse(saved) : [];
  });

  const [admins, setAdmins] = useState(() => {
    const saved = localStorage.getItem('cached_admins');
    return saved ? JSON.parse(saved) : [];
  });

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isLogged');
    localStorage.removeItem('token');
    localStorage.removeItem('nama');
    localStorage.removeItem('email');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('cached_packages');
    localStorage.removeItem('cached_users');
    localStorage.removeItem('cached_bookings');
    localStorage.removeItem('cached_vouchers');
    localStorage.removeItem('cached_admins');
    localStorage.removeItem('admin_deletions');
    localStorage.removeItem('admin_updates');
    localStorage.removeItem('admin_additions');
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const result = await response.json();
      const loadedUsers = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
      setUsers(loadedUsers);
      localStorage.setItem('cached_users', JSON.stringify(loadedUsers));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/booking`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const result = await response.json();
      
      let loadedBookings = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
      
      const localUpdates = JSON.parse(localStorage.getItem('booking_updates') || '{}');
      loadedBookings = loadedBookings.map(b => {
        const id = b.id || b._id;
        if (localUpdates[id]) {
          return { ...b, ...localUpdates[id] };
        }
        return b;
      });

      setBookings(loadedBookings);
      localStorage.setItem('cached_bookings', JSON.stringify(loadedBookings));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchVouchers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/vouchers/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const result = await response.json();
      let loadedVouchers = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
      
      const localDeletions = JSON.parse(localStorage.getItem('voucher_deletions') || '[]');
      const localUpdates = JSON.parse(localStorage.getItem('voucher_updates') || '{}');
      
      loadedVouchers = loadedVouchers.filter(v => !localDeletions.includes(v.id || v._id));
      loadedVouchers = loadedVouchers.map(v => {
        const id = v.id || v._id;
        if (localUpdates[id]) {
          return { ...v, ...localUpdates[id] };
        }
        return v;
      });
      
      setVouchers(loadedVouchers);
      localStorage.setItem('cached_vouchers', JSON.stringify(loadedVouchers));
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/admins`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const result = await response.json();
      const loadedAdmins = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
      
      const formattedAdmins = loadedAdmins.map(admin => ({
        id: admin.id || admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role === 'ADMIN' ? 'Admin' : (admin.role === 'SUPERADMIN' ? 'Superadmin' : admin.role || 'Admin'),
        status: admin.status || 'aktif',
        createdAt: admin.createdAt
      }));
      
      const localDeletions = JSON.parse(localStorage.getItem('admin_deletions') || '[]');
      const localUpdates = JSON.parse(localStorage.getItem('admin_updates') || '{}');
      const localAdditions = JSON.parse(localStorage.getItem('admin_additions') || '[]');
      
      let finalAdmins = [...formattedAdmins, ...localAdditions];
      finalAdmins = finalAdmins.filter(a => !localDeletions.includes(a.id || a._id));
      finalAdmins = finalAdmins.map(a => {
        const id = a.id || a._id;
        if (localUpdates[id]) {
          return { ...a, ...localUpdates[id] };
        }
        return a;
      });
      
      setAdmins(finalAdmins);
      localStorage.setItem('cached_admins', JSON.stringify(finalAdmins));
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
      fetchBookings();
      fetchVouchers();
      fetchAdmins();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (userData) => {
    const user = userData?.data?.user || userData;
    if (user && user.name) {
      const emailValue = user.email || 'admin1@gmail.com';
      setUserProfile({
        name: user.name,
        email: emailValue,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`
      });
      localStorage.setItem('email', emailValue);
    }
    setIsAuthenticated(true);
    sessionStorage.setItem('isLogged', 'true');

    setTimeout(() => {
      fetchUsers();
      fetchBookings();
      fetchVouchers();
      fetchAdmins();
    }, 50);
  };

  const value = {
    isSidebarCollapsed, setIsSidebarCollapsed, toggleSidebar,
    theme, setTheme, toggleTheme,
    language, setLanguage, t,
    isAuthenticated, setIsAuthenticated, handleLogin, handleLogout,
    userProfile, setUserProfile,
    packages, setPackages, fetchPackages,
    users, setUsers, fetchUsers,
    bookings, setBookings, fetchBookings,
    vouchers, setVouchers, fetchVouchers,
    admins, setAdmins, fetchAdmins
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
