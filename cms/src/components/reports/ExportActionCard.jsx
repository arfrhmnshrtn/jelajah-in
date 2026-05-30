import React from 'react';
import { Download, Mail } from 'lucide-react';

const ExportActionCard = ({ title, description, icon: Icon, iconClass, buttonText, onClick, isSecondary, buttonIcon: ButtonIcon, buttonBg }) => {
  return (
    <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div className={`stat-icon ${iconClass}`} style={{ width: '60px', height: '60px', marginBottom: '16px' }}><Icon size={32} /></div>
      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>{description}</p>
      <button 
        className={`btn ${isSecondary ? "btn-secondary" : (buttonBg === 'var(--success)' ? 'btn-success' : 'btn-primary')}`} 
        onClick={onClick} 
        style={{ width: '100%' }}
      >
        <ButtonIcon size={18} /> {buttonText}
      </button>
    </div>
  );
};

export default ExportActionCard;
