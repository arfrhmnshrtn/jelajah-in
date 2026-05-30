import React from 'react';
import { Plus } from 'lucide-react';

const AdminHeader = ({ onAddClick, t }) => {
  return (
    <div className="section-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '800' }}>{t('data_admin')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Daftar hak akses administratif JELAJAH.IN</p>
      </div>
      <button 
        className="btn btn-primary" 
        onClick={onAddClick} 
        style={{ padding: '12px 24px', borderRadius: '12px', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 600 }}
      >
        <Plus size={18} /> Tambah Admin
      </button>
    </div>
  );
};

export default AdminHeader;
