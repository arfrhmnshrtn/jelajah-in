import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  const { 
    isAuthenticated, isSidebarCollapsed, theme, userProfile, handleLogout, t, 
    toggleSidebar, toggleTheme, handleLogin 
  } = useAppContext();

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
                onLogout={handleLogout}
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
