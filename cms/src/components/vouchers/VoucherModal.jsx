import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import VoucherForm from './VoucherForm';

const VoucherModal = ({ isOpen, onClose, onSave, editingData }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="voucher-modal-overlay" style={overlayStyle}>
      <div className="voucher-modal-content package-form-modal" style={modalContentStyle}>
        {/* Header - Sticky */}
        <div className="modal-header" style={headerStyle}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {editingData ? 'Edit Voucher' : 'Tambah Voucher Baru'}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Lengkapi detail informasi promo JELAJAH.IN</p>
          </div>
          <button className="icon-button" onClick={onClose} style={closeBtnStyle}><X size={18} /></button>
        </div>
        
        {/* Body Form */}
        <VoucherForm 
          editingData={editingData} 
          onSave={onSave} 
          onClose={onClose} 
        />
      </div>
    </div>,
    document.body
  );
};

// Styles
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  backdropFilter: 'blur(10px)',
  zIndex: 99999,
};

const modalContentStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '640px',
  width: '95%',
  backgroundColor: 'var(--card-bg, #1e293b)',
  borderRadius: '28px',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '80vh',
  boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.8)',
  border: '1px solid var(--border-color, #334155)',
  overflow: 'hidden',
  animation: 'modalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
};

const headerStyle = {
  padding: '24px 32px',
  borderBottom: '1px solid var(--border-color, #334155)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'var(--card-bg, #1e293b)'
};

const closeBtnStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'var(--text-secondary)',
  backgroundColor: 'transparent',
  border: 'none',
  transition: 'all 0.2s ease'
};

// Animasi CSS
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes modalFadeIn {
    from { opacity: 0; transform: translate(-50%, -45%) scale(0.95); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
`;
document.head.appendChild(styleSheet);

export default VoucherModal;
