import React from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';

const FeedbackModal = ({ isOpen, onClose, type = 'success', title, message }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={48} color="#10b981" />;
      case 'error':
        return <XCircle size={48} color="#ef4444" />;
      case 'warning':
        return <AlertCircle size={48} color="#f59e0b" />;
      default:
        return <CheckCircle size={48} color="#10b981" />;
    }
  };

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
      <div className="delete-modal-content feedback-modal" style={{ 
        animation: 'modalScaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' 
      }}>
        <div className="delete-modal-icon" style={{ borderColor: 'transparent', border: 'none' }}>
          {getIcon()}
        </div>
        
        <h3 className="delete-modal-title" style={{ marginBottom: message ? '12px' : '32px' }}>
          {title}
        </h3>
        
        {message && (
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>{message}</p>
        )}

        <div className="delete-modal-actions">
          <button 
            className="delete-btn-confirm" 
            style={{ 
              backgroundColor: type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#10b981',
              minWidth: '120px'
            }} 
            onClick={onClose}
          >
            OK
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

export default FeedbackModal;
