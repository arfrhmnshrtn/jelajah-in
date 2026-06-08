import React from 'react';
import { HelpCircle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, icon: Icon = HelpCircle, color = 'var(--primary)' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 3500 }}>
      <div className="delete-modal-content">
        <div className="delete-modal-icon" style={{ borderColor: color, color: color }}>
          <Icon size={48} />
        </div>
        
        <h3 className="delete-modal-title">
          {title}
        </h3>
        
        {message && (
          <p className="delete-modal-subtitle">{message}</p>
        )}

        <div className="delete-modal-actions">
          <button 
            className="delete-btn-confirm" 
            style={{ backgroundColor: color }}
            onClick={onConfirm}
          >
            {confirmText || 'Ya, Lanjutkan'}
          </button>
          <button className="delete-btn-cancel" onClick={onClose}>
            {cancelText || 'Batal'}
          </button>
        </div>
        
        <button className="delete-modal-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
