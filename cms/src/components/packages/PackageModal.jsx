import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import PackageForm from './PackageForm';

const PackageModal = ({ isOpen, onClose, onSave, editingData, t }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" style={overlayStyle}>
      <div className="modal-content package-form-modal" style={modalContentStyle}>
        <div className="modal-header" style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '18px', fontWeight: 700 }}>
            {editingData ? t('m_edit_pkg_title') : t('m_add_pkg_title')}
          </span>
          <button className="icon-button" onClick={onClose}><X size={20} /></button>
        </div>
        <PackageForm 
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

// Center modal overlay and layout styling
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(5px)',
  zIndex: 99999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modalContentStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '640px',
  width: '90%',
  backgroundColor: 'var(--card-bg)',
  borderRadius: '24px',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '90vh',
  boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.5)',
  border: '1px solid var(--border-color)',
  overflow: 'hidden',
  animation: 'modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
};

export default PackageModal;
