import React, { useState, useEffect } from 'react';

const PackageForm = ({ editingData, onSave, onClose, t }) => {
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
  }, [editingData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        <div className="form-group">
          <label style={labelStyle}>
            {t('m_pkg_name')}
          </label>
          <input 
            type="text" 
            required 
            placeholder="Contoh: Paket Wisata Bali"
            style={inputStyle}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label style={labelStyle}>
            {t('m_location')}
          </label>
          <input 
            type="text" 
            required 
            placeholder="Contoh: Denpasar, Bali"
            style={inputStyle}
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '20px' }}>
        <label style={labelStyle}>
          {t('m_price')}
        </label>
        <input 
          type="text" 
          required 
          placeholder="Contoh: Rp 2.500.000"
          style={inputStyle}
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
        />
      </div>

      <div className="form-group" style={{ marginTop: '20px' }}>
        <label style={labelStyle}>
          {t('m_pkg_desc')}
        </label>
        <textarea 
          style={textareaStyle}
          required 
          placeholder="Masukkan deskripsi lengkap paket wisata..."
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        ></textarea>
      </div>

      <div className="form-group" style={{ marginTop: '20px' }}>
        <label style={labelStyle}>
          {t('m_pkg_image')} (URL)
        </label>
        <input 
          type="text" 
          placeholder="https://example.com/image.jpg"
          required 
          style={inputStyle}
          value={formData.image}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
        />
      </div>

      <div className="modal-actions" style={modalActionsStyle}>
        <button type="button" className="btn btn-secondary" onClick={onClose} style={{ padding: '12px 24px', borderRadius: '12px' }}>{t('m_cancel')}</button>
        <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px', borderRadius: '12px' }}>{t('m_save')}</button>
      </div>
    </form>
  );
};

const labelStyle = { 
  fontSize: '13px', 
  fontWeight: 600, 
  color: 'var(--text-secondary)', 
  marginBottom: '8px', 
  display: 'block' 
};

const inputStyle = { 
  width: '100%', 
  padding: '12px 16px', 
  borderRadius: '14px', 
  border: '1.5px solid var(--border-color)', 
  backgroundColor: 'var(--input-bg)', 
  color: 'var(--text-primary)', 
  fontSize: '14px', 
  outline: 'none', 
  boxSizing: 'border-box' 
};

const textareaStyle = { 
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
};

const modalActionsStyle = { 
  marginTop: '32px', 
  display: 'flex', 
  gap: '12px', 
  justifyContent: 'flex-end', 
  borderTop: '1px solid var(--border-color)', 
  paddingTop: '24px' 
};

export default PackageForm;
