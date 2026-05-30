import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const PackageModal = ({ isOpen, onClose, onSave, editingData, t }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    description: '',
    image: '',
    status: 'aktif'
  });

  useEffect(() => {
    if (editingData) {
      setFormData(editingData);
    } else {
      setFormData({ name: '', location: '', price: '', description: '', image: '', status: 'aktif' });
    }
  }, [editingData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

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
        <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                {t('m_pkg_name')}
              </label>
              <input 
                type="text" 
                required 
                placeholder="Contoh: Paket Wisata Bali"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                {t('m_location')}
              </label>
              <input 
                type="text" 
                required 
                placeholder="Contoh: Denpasar, Bali"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
              {t('m_price')}
            </label>
            <input 
              type="text" 
              required 
              placeholder="Contoh: Rp 2.500.000"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
          </div>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
              {t('m_pkg_desc')}
            </label>
            <textarea 
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                borderRadius: '14px', 
                border: '1.5px solid var(--border-color)', 
                backgroundColor: 'var(--input-bg)', 
                color: 'var(--text-primary)', 
                minHeight: '120px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                lineHeight: '1.6',
                boxSizing: 'border-box'
              }}
              required 
              placeholder="Masukkan deskripsi lengkap paket wisata..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
              {t('m_pkg_image')} (URL)
            </label>
            <input 
              type="text" 
              placeholder="https://example.com/image.jpg"
              required 
              style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
            />
          </div>

          <div className="modal-actions" style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ padding: '12px 24px', borderRadius: '12px' }}>{t('m_cancel')}</button>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px', borderRadius: '12px' }}>{t('m_save')}</button>
          </div>
        </form>
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
