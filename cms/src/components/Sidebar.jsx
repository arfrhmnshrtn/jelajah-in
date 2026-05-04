import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Package, 
  CreditCard,
  Ticket,
  Settings, 
  LogOut,
  ChevronDown
} from 'lucide-react';

const Sidebar = ({ isCollapsed, onLogout, t }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleUserMenu = () => {
    if (!isCollapsed) {
      setIsUserMenuOpen(!isUserMenuOpen);
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header" style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '24px 0' : '24px' }}>
        {isCollapsed ? 'J' : 'JELAJAH.IN'}
      </div>
      
      <div className="sidebar-menu">
        <NavLink 
          to="/" 
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <div className="sidebar-item-content">
            <Home size={18} />
            {!isCollapsed && <span className="menu-text">{t('dashboard')}</span>}
          </div>
        </NavLink>
        
        {/* Menu Dropdown Pengguna */}
        <div className="sidebar-menu-item-wrapper">
          <div 
            className={`sidebar-item has-submenu ${isUserMenuOpen ? 'open' : ''}`} 
            onClick={toggleUserMenu}
          >
            <div className="sidebar-item-content">
              <Users size={18} />
              {!isCollapsed && <span className="menu-text">{t('users')}</span>}
            </div>
            {!isCollapsed && <ChevronDown size={14} className="chevron" style={{ transform: isUserMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />}
          </div>
          
          {!isCollapsed && (
            <div 
              className="sidebar-submenu" 
              style={{ paddingLeft: '20px', overflow: 'hidden', maxHeight: isUserMenuOpen ? '200px' : '0', transition: 'max-height 0.3s ease' }}
            >
              <NavLink 
                to="/data-user" 
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                {t('data_user')}
              </NavLink>
              <NavLink 
                to="/data-admin" 
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                {t('data_admin')}
              </NavLink>
            </div>
          )}
        </div>
        
        <NavLink 
          to="/packages" 
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <div className="sidebar-item-content">
            <Package size={18} />
            {!isCollapsed && <span className="menu-text">{t('packages')}</span>}
          </div>
        </NavLink>

        <NavLink 
          to="/bookings" 
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <div className="sidebar-item-content">
            <CreditCard size={18} />
            {!isCollapsed && <span className="menu-text">{t('booking')}</span>}
          </div>
        </NavLink>

        <NavLink 
          to="/vouchers" 
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <div className="sidebar-item-content">
            <Ticket size={18} />
            {!isCollapsed && <span className="menu-text">{t('promo')}</span>}
          </div>
        </NavLink>



        <NavLink 
          to="/setting" 
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <div className="sidebar-item-content">
            <Settings size={18} />
            {!isCollapsed && <span className="menu-text">{t('settings')}</span>}
          </div>
        </NavLink>
        
        <div style={{ marginTop: 'auto', paddingBottom: '20px' }}>
          <a href="#" className="sidebar-item logout" onClick={(e) => { e.preventDefault(); onLogout(); }}>
            <div className="sidebar-item-content">
              <LogOut size={18} />
              {!isCollapsed && <span className="menu-text">{t('logout')}</span>}
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
