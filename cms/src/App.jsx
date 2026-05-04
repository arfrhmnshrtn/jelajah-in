import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

import DataUser from './components/DataUser';
import DataAdmin from './components/DataAdmin';
import Packages from './components/Packages';
import Bookings from './components/Bookings';
import Vouchers from './components/Vouchers';
import Setting from './components/Setting';
import Notifications from './components/Notifications';
import Login from './components/Login';
import { translations } from './translations';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'id';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isLogged') === 'true';
  });

  const t = (key) => {
    return translations[language][key] || key;
  };

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      name: 'Panji Sual',
      avatar: 'https://ui-avatars.com/api/?name=Panji+Sual&background=6366f1&color=fff'
    };
  });

  // Global State for Data Persistence
  const [packages, setPackages] = useState([
    { id: 1, name: 'Bali Adventure', loc: 'Bali', price: 'Rp 2.500.000', duration: '3 Hari', desc: 'Jelajahi keindahan alam dan budaya Bali yang eksotis.', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=200&q=80', status: 'aktif' },
    { id: 2, name: 'Labuan Bajo Sailing', loc: 'NTT', price: 'Rp 5.200.000', duration: '4 Hari', desc: 'Berlayar menikmati gugusan pulau Komodo yang menakjubkan.', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ca1?auto=format&fit=crop&w=200&q=80', status: 'aktif' },
    { id: 3, name: 'Yogya Culture', loc: 'Yogyakarta', price: 'Rp 1.200.000', duration: '2 Hari', desc: 'Wisata sejarah ke Borobudur dan Prambanan yang megah.', image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=200&q=80', status: 'aktif' },
    { id: 4, name: 'Raja Ampat Diving', loc: 'Papua', price: 'Rp 8.500.000', duration: '5 Hari', desc: 'Surga bawah laut terbaik dunia ada di Raja Ampat.', image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=200&q=80', status: 'nonaktif' },
  ]);

  const [bookings, setBookings] = useState([
    { id: 'BOOK-001', pelanggan: 'Andi Pratama', email: 'andi@example.com', paket: 'Bali Adventure', tanggal: '2024-04-10', total: 'Rp 2.500.000', status: 'success', phone: '08123456789' },
    { id: 'BOOK-002', pelanggan: 'Siti Aminah', email: 'siti@example.com', paket: 'Labuan Bajo Trip', tanggal: '2024-04-09', total: 'Rp 5.200.000', status: 'pending', phone: '08234567890' },
    { id: 'BOOK-003', pelanggan: 'Budi Santoso', email: 'budi@example.com', paket: 'Yogya Culture', tanggal: '2024-04-08', total: 'Rp 1.200.000', status: 'success', phone: '08345678901' },
    { id: 'BOOK-004', pelanggan: 'Dewi Lestari', email: 'dewi@example.com', paket: 'Raja Ampat', tanggal: '2024-04-07', total: 'Rp 8.500.000', status: 'cancelled', phone: '08456789012' },
    { id: 'BOOK-005', pelanggan: 'Eko Wijaya', email: 'eko@example.com', paket: 'Bromo Sunrise', tanggal: '2024-04-06', total: 'Rp 1.800.000', status: 'success', phone: '08567890123' },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'Andi Pratama', email: 'andi@example.com', role: 'Pelanggan', status: 'aktif', joinDate: '2024-01-15' },
    { id: 2, name: 'Siti Aminah', email: 'siti@example.com', role: 'Pelanggan', status: 'aktif', joinDate: '2024-02-10' },
    { id: 3, name: 'Budi Santoso', email: 'budi@example.com', role: 'Pelanggan', status: 'nonaktif', joinDate: '2023-11-20' },
    { id: 4, name: 'Dewi Lestari', email: 'dewi@example.com', role: 'Pelanggan', status: 'aktif', joinDate: '2024-03-05' },
  ]);

  const [admins, setAdmins] = useState([
    { id: 1, name: 'Panji Sual', email: 'panji@gmail.com', role: 'Superadmin', status: 'aktif' },
    { id: 2, name: 'Budi Admin', email: 'budi.admin@jelajah.in', role: 'Admin', status: 'aktif' },
    { id: 3, name: 'Siti Editor', email: 'siti.editor@jelajah.in', role: 'Editor', status: 'aktif' },
  ]);

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
    if (userData && userData.name) {
      setUserProfile({
        ...userProfile,
        name: userData.name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6366f1&color=fff`
      });
    }
    setIsAuthenticated(true);
    localStorage.setItem('isLogged', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isLogged');
  };

  return (
    <Router>
      <div className={`app-container ${theme}`}>
        {!isAuthenticated ? (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} t={t} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <>
            <Sidebar isCollapsed={isSidebarCollapsed} onLogout={handleLogout} t={t} />
            <div className="main-content">
              <Header 
                toggleSidebar={toggleSidebar} 
                theme={theme} 
                toggleTheme={toggleTheme} 
                userProfile={userProfile} 
                t={t}
              />
              <Routes>
                <Route path="/" element={<Dashboard packages={packages} setPackages={setPackages} bookings={bookings} setBookings={setBookings} t={t} />} />
                <Route path="/data-user" element={<DataUser users={users} setUsers={setUsers} t={t} />} />
                <Route path="/data-admin" element={<DataAdmin admins={admins} setAdmins={setAdmins} t={t} />} />
                <Route path="/packages" element={<Packages packages={packages} setPackages={setPackages} t={t} />} />
                <Route path="/bookings" element={<Bookings bookings={bookings} setBookings={setBookings} t={t} />} />
                <Route path="/vouchers" element={<Vouchers t={t} />} />
                <Route path="/setting" element={<Setting userProfile={userProfile} setUserProfile={setUserProfile} language={language} setLanguage={setLanguage} t={t} />} />
                <Route path="/notifications" element={<Notifications t={t} />} />
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
