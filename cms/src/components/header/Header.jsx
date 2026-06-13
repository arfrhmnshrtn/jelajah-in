import React, { useState } from 'react';
import { Menu, Bell, Sun, Moon, Package, User, CreditCard, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar, theme, toggleTheme, userProfile, onLogout, t }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const nama = localStorage.getItem('nama');
  // const role = localStorage.getItem('role');

  return (
    <div className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <Menu size={20} />
        </button>
      </div>
      
      <div className="header-right">
        <button className="icon-button" onClick={toggleTheme} title={t('theme_toggle')} style={{ position: 'relative' }}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        

        
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
            }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              paddingLeft: '16px', 
              borderLeft: '1px solid var(--border-color)',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{nama}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Administrator</div>
            </div>
            <img 
              src={userProfile.avatar} 
              alt="User Profile" 
              className="profile-avatar"
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: showProfileMenu ? 'scale(1.05) rotate(5deg)' : 'scale(1)',
                border: showProfileMenu ? '2px solid var(--primary)' : '2px solid transparent'
              }}
            />
            <ChevronDown 
              size={14} 
              style={{ 
                color: 'var(--text-secondary)', 
                transition: 'transform 0.2s ease', 
                transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0)' 
              }} 
            />
          </div>

          {showProfileMenu && (
            <>
              {/* Click-outside backdrop overlay to close it when clicking anywhere else */}
              <div 
                style={{ position: 'fixed', inset: 0, zIndex: 998 }} 
                onClick={() => setShowProfileMenu(false)} 
              />
              
              {/* Premium Profile Dropdown */}
              <div className="premium-profile-dropdown" style={{ 
                position: 'absolute', 
                top: '130%', 
                right: 0, 
                width: '240px', 
                background: 'var(--card-bg)', 
                borderRadius: '16px', 
                boxShadow: 'var(--card-shadow)', 
                border: '1px solid var(--border-color)',
                zIndex: 999,
                overflow: 'hidden',
                animation: 'slideDown 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                padding: '8px'
              }}>
                {/* User Info Header */}
                <div style={{ padding: '12px 12px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '8px' }}>
                  <img 
                    src={userProfile.avatar} 
                    alt="User Profile" 
                    style={{ width: '42px', height: '42px', borderRadius: '12px', border: '1.5px solid var(--primary)' }}
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{nama}</div>
                    <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin</div>
                  </div>
                </div>

                {/* Dropdown Menu Items */}
                <div 
                  className="dropdown-item" 
                  onClick={() => { setShowProfileMenu(false); navigate('/setting'); }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Settings size={16} style={{ color: 'var(--primary)' }} />
                  <span>{t('settings') || 'Pengaturan Akun'}</span>
                </div>

                <div 
                  className="dropdown-item" 
                  onClick={() => { setShowProfileMenu(false); onLogout(); }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--danger)',
                    transition: 'all 0.2s ease',
                    marginTop: '4px'
                  }}
                >
                  <LogOut size={16} />
                  <span>{t('logout') || 'Keluar'}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;



