import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import ConfirmModal from './components/shared/ConfirmModal';
import Sidebar from './components/sidebar/Sidebar';
import Header from './components/header/Header';
import Dashboard from './components/dashboard/Dashboard';

import DataUser from './components/users/DataUser';
import DataAdmin from './components/admins/DataAdmin';
import Packages from './components/packages/Packages';
import Bookings from './components/bookings/Bookings';
import Vouchers from './components/vouchers/Vouchers';
import VoucherUsagesDetail from './components/vouchers/VoucherUsagesDetail';
import PackageDetail from './components/packages/PackageDetail';
import Setting from './components/setting/Setting';
import Notifications from './components/notifications/Notifications';
import Login from './components/login/Login';
import { AppProvider, useAppContext } from './context/AppContext';

function AppContent() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { 
    isAuthenticated, isSidebarCollapsed, theme, userProfile, handleLogout, t, 
    toggleSidebar, toggleTheme, handleLogin 
  } = useAppContext();

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
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
            <Sidebar isCollapsed={isSidebarCollapsed} onLogout={confirmLogout} t={t} />
            <div className="main-content">
              <Header 
                toggleSidebar={toggleSidebar} 
                theme={theme} 
                toggleTheme={toggleTheme} 
                userProfile={userProfile} 
                onLogout={confirmLogout}
                t={t}
              />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/data-user" element={<DataUser />} />
                <Route path="/data-admin" element={<DataAdmin />} />
                <Route path="/packages" element={<Packages />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/vouchers" element={<Vouchers />} />
                <Route path="/packages/:id" element={<PackageDetail />} />
                <Route path="/vouchers/:id/usages" element={<VoucherUsagesDetail />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/notifications" element={<Notifications t={t} />} />
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <ConfirmModal
              isOpen={showLogoutConfirm}
              onClose={() => setShowLogoutConfirm(false)}
              onConfirm={() => {
                setShowLogoutConfirm(false);
                handleLogout();
              }}
              title="Konfirmasi Keluar"
              message="Apakah Anda yakin ingin keluar dari akun ini?"
              confirmText="Ya, Keluar"
              cancelText="Batal"
              icon={LogOut}
              color="var(--danger)"
            />
          </>
        )}
      </div>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
