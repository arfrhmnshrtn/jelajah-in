import React from 'react';
import { createPortal } from 'react-dom';
import { X, Shield } from 'lucide-react';
import AdminForm from './AdminForm';

const AdminModal = ({ isOpen, onClose, onSave, editingData, t }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" style={modalOverlayStyle}>
      <div className="modal-content premium-modal" style={modalContentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={iconBgStyle}>
              <Shield size={20} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary, #f8fafc)' }}>
                {editingData ? 'Edit Data Admin' : 'Tambah Admin Baru'}
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary, #cbd5e1)', margin: '2px 0 0' }}>
                Kelola hak akses administratif
              </p>
            </div>
          </div>
          <button 
            className="icon-button" 
            onClick={onClose} 
            style={closeButtonStyle}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Form */}
        <AdminForm 
          editingData={editingData} 
          onSave={onSave} 
          onClose={onClose} 
          t={t} 
        />
      </div>
    </div>,
    document.body
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 99999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(5px)',
  padding: '20px'
};

const modalContentStyle = { 
  maxWidth: '480px', 
  width: '100%', 
  backgroundColor: 'var(--card-bg, #1e293b)', 
  borderRadius: '24px', 
  border: '1px solid var(--border-color, #334155)',
  boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6)',
  animation: 'modalScaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  overflow: 'hidden'
};

const headerStyle = {
  padding: '24px',
  borderBottom: '1px solid var(--border-color, #334155)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'var(--card-bg, #1e293b)'
};

const iconBgStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  backgroundColor: 'rgba(59, 130, 246, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const closeButtonStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'var(--text-secondary, #cbd5e1)',
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: 'none'
};

export default AdminModal;
