import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Mail, Shield, Save } from 'lucide-react';

const UserModal = ({ isOpen, onClose, onSave, editingData, t }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER'
  });

  useEffect(() => {
    if (editingData) {
      setFormData({
        name: editingData.name || '',
        email: editingData.email || '',
        role: editingData.role || 'USER'
      });
    }
  }, [editingData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return createPortal(
    <div className="modal-overlay" style={{ zIndex: 99999 }}>
      <div className="modal-content premium-modal" style={{ maxWidth: '480px' }}>
        <div className="modal-header-premium">
          <div className="header-icon-circle">
            <User size={24} color="var(--primary)" />
          </div>
          <div>
            <h2>{editingData ? 'Update Profile' : 'Create Account'}</h2>
            <p>Perbarui informasi akun pengguna di bawah ini</p>
          </div>
          <button className="close-btn-premium" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body-premium">
            <div className="form-section">
              <label className="premium-label">IDENTITAS PENGGUNA</label>
              
              <div className="premium-input-group">
                <label>Nama Lengkap</label>
                <div className="input-with-icon-premium">
                  <User className="input-icon-p" size={18} />
                  <input 
                    type="text" 
                    placeholder="Masukkan nama pengguna..."
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="premium-input-group">
                <label>Alamat Email</label>
                <div className="input-with-icon-premium">
                  <Mail className="input-icon-p" size={18} />
                  <input 
                    type="email" 
                    placeholder="nama@contoh.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <label className="premium-label">HAK AKSES & PERAN</label>
              <div className="premium-input-group">
                <label>Level Akses</label>
                <div className="input-with-icon-premium">
                  <Shield className="input-icon-p" size={18} />
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="USER">USER - Hak Akses Standar</option>
                    <option value="ADMIN">ADMIN - Hak Akses Terbatas</option>
                    <option value="SUPERADMIN">SUPERADMIN - Akses Penuh</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer-premium">
            <button type="button" className="btn-cancel-p" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-save-p">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default UserModal;
