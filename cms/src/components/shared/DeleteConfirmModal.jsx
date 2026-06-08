import React from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName, t }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 99999, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: 'rgba(0, 0, 0, 0.7)', 
      backdropFilter: 'blur(4px)',
      padding: '20px'
    }}>
      <div className="delete-modal-content" style={{ 
        animation: 'modalScaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' 
      }}>
        <div className="delete-modal-icon">
          <AlertCircle size={48} />
        </div>
        
        <h3 className="delete-modal-title">
          {t('delete_confirm_title') || 'Are you sure you want to delete this product?'}
        </h3>
        
        {itemName && (
          <p className="delete-modal-subtitle">"{itemName}"</p>
        )}

        <div className="delete-modal-actions">
          <button className="delete-btn-confirm" onClick={onConfirm}>
            {t('yes_sure') || "Yes, I'm sure"}
          </button>
          <button className="delete-btn-cancel" onClick={onClose}>
            {t('no_cancel') || 'No, cancel'}
          </button>
        </div>
        
        <button className="delete-modal-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default DeleteConfirmModal;
