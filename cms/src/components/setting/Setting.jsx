import React, { useState, useEffect } from 'react';
import { Camera, Lock, Moon, Sun, User, Mail, Globe, Palette, Save, LogOut } from 'lucide-react';
import FeedbackModal from '../shared/FeedbackModal';
import AccountTab from './AccountTab';
import SecurityTab from './SecurityTab';
import { useAppContext } from '../../context/AppContext';

const Setting = () => {
  const { userProfile, setUserProfile, language, setLanguage, theme, setTheme, t, handleLogout } = useAppContext();
  const [activeTab, setActiveTab] = useState('account');
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email || localStorage.getItem('email') || 'admin1@gmail.com'
  });

  useEffect(() => {
    setFormData({
      name: userProfile.name || '',
      email: userProfile.email || localStorage.getItem('email') || 'admin1@gmail.com'
    });
  }, [userProfile]);

  const [feedback, setFeedback] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  const showFeedback = (type, title, message = '') => {
    setFeedback({ isOpen: true, type, title, message });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUserProfile(prev => ({ ...prev, name: formData.name }));
    showFeedback('success', 'Berhasil!', 'Pengaturan akun Anda telah berhasil diperbarui.');
  };

  return (
    <div className="page-content">
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>{t('st_title')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{t('st_subtitle')}</p>
      </div>

      <div className="settings-grid">
        {/* Sidebar Settings */}
        <div className="settings-card" style={{ padding: '24px' }}>
          <div className="profile-section">
            <div className="profile-img-container">
              <img 
                src={userProfile.avatar} 
                alt="Profile" 
              />
              <div className="camera-overlay">
                <Camera size={18} />
              </div>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{formData.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>{t('data_admin')}</p>
          </div>

          <div style={{ marginTop: '32px' }}>
            <div className={`settings-nav-item ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>
              <User size={18} />
              <span>Account Settings</span>
            </div>
            <div className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
              <Lock size={18} />
              <span>Security & Password</span>
            </div>

          </div>
        </div>

        {/* Main Settings Content */}
        <div className="settings-card">
          {activeTab === 'account' && (
            <AccountTab 
              formData={formData} 
              language={language} 
              setLanguage={setLanguage} 
              handleSave={handleSave} 
              t={t} 
            />
          )}

          {activeTab === 'security' && <SecurityTab />}
        </div>
      </div>
      <FeedbackModal 
        isOpen={feedback.isOpen}
        onClose={() => setFeedback({ ...feedback, isOpen: false })}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
      />
    </div>
  );
};

export default Setting;
