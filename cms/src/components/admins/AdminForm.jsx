import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, ToggleLeft, ToggleRight } from 'lucide-react';

const AdminForm = ({ editingData, onSave, onClose, t }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Admin',
    status: 'aktif'
  });

  useEffect(() => {
    if (editingData) {
      setFormData({
        name: editingData.name || '',
        email: editingData.email || '',
        password: '',
        role: editingData.role || 'Admin',
        status: editingData.status || 'aktif'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'Admin',
        status: 'aktif'
      });
    }
  }, [editingData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Nama Lengkap */}
        <div className="premium-input-group">
          <label style={labelStyle}>Nama Lengkap</label>
          <div style={inputContainerStyle}>
            <User size={18} style={{ color: 'var(--text-secondary, #cbd5e1)', marginRight: '12px' }} />
            <input 
              type="text" 
              placeholder="Masukkan nama admin..."
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={inputStyle}
            />
          </div>
        </div>

        {/* Alamat Email */}
        <div className="premium-input-group">
          <label style={labelStyle}>Alamat Email</label>
          <div style={inputContainerStyle}>
            <Mail size={18} style={{ color: 'var(--text-secondary, #cbd5e1)', marginRight: '12px' }} />
            <input 
              type="email" 
              placeholder="nama@contoh.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              style={inputStyle}
            />
          </div>
        </div>

        {/* Kata Sandi (Hanya saat Tambah Admin) */}
        {!editingData && (
          <div className="premium-input-group">
            <label style={labelStyle}>Kata Sandi</label>
            <div style={inputContainerStyle}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary, #cbd5e1)', marginRight: '12px' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <input 
                type="password" 
                placeholder="Min. 6 karakter..."
                value={formData.password || ''}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required={!editingData}
                minLength={6}
                style={inputStyle}
              />
            </div>
          </div>
        )}

        {/* Level Akses */}
        <div className="premium-input-group">
          <label style={labelStyle}>Level Akses</label>
          <div style={inputContainerStyle}>
            <Shield size={18} style={{ color: 'var(--text-secondary, #cbd5e1)', marginRight: '12px' }} />
            <select 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              style={selectStyle}
            >
              <option value="Superadmin" style={optionStyle}>Superadmin - Akses Penuh</option>
              <option value="Admin" style={optionStyle}>Admin - Akses Terbatas</option>
              <option value="Editor" style={optionStyle}>Editor - Penulis & Konten</option>
            </select>
          </div>
        </div>

        {/* Status Akun */}
        <div 
          style={statusToggleContainerStyle}
          onClick={() => setFormData({...formData, status: formData.status === 'aktif' ? 'nonaktif' : 'aktif'})}
        >
          <div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #f8fafc)', display: 'block' }}>Status Admin Aktif</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary, #cbd5e1)' }}>Nonaktifkan untuk membekukan sementara</span>
          </div>
          <div>
            {formData.status === 'aktif' ? (
              <ToggleRight size={32} color="#10b981" />
            ) : (
              <ToggleLeft size={32} color="var(--text-secondary, #cbd5e1)" />
            )}
          </div>
        </div>
      </div>

      <div style={footerStyle}>
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onClose}
          style={{ padding: '10px 24px', borderRadius: '12px' }}
        >
          Batal
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          style={{ padding: '10px 28px', borderRadius: '12px', fontWeight: 700 }}
        >
          Simpan
        </button>
      </div>
    </form>
  );
};

const labelStyle = { 
  fontSize: '13px', 
  fontWeight: 600, 
  color: 'var(--text-secondary, #cbd5e1)', 
  marginBottom: '8px', 
  display: 'block' 
};

const inputContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'var(--input-bg, #0f172a)',
  borderRadius: '14px',
  border: '1.5px solid var(--border-color, #334155)',
  padding: '0 16px',
  height: '48px'
};

const inputStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'var(--text-primary, #f8fafc)',
  fontSize: '14px',
  width: '100%'
};

const selectStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'var(--text-primary, #f8fafc)',
  fontSize: '14px',
  width: '100%',
  cursor: 'pointer'
};

const optionStyle = { 
  backgroundColor: 'var(--input-bg, #0f172a)', 
  color: 'var(--text-primary, #f8fafc)' 
};

const statusToggleContainerStyle = {
  marginTop: '10px',
  padding: '16px',
  backgroundColor: 'rgba(255,255,255,0.03)',
  borderRadius: '16px',
  border: '1.5px dashed var(--border-color, #334155)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer'
};

const footerStyle = {
  marginTop: '32px',
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end',
  borderTop: '1px solid var(--border-color, #334155)',
  paddingTop: '20px'
};

export default AdminForm;
