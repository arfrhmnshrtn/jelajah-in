import React from 'react';
import { Shield, Edit, Trash2 } from 'lucide-react';

const AdminTable = ({ filteredAdmins, onEdit, onDelete, t }) => {
  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th style={{ paddingLeft: '24px' }}>{t('st_name')}</th>
            <th>{t('st_email')}</th>
            <th>{t('m_role')}</th>
            <th style={{ textAlign: 'center' }}>Status</th>
            <th style={{ textAlign: 'center', paddingRight: '24px' }}>{t('t_action')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdmins.map(a => (
            <tr key={a.id}>
              <td style={{ paddingLeft: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=6366f1&color=fff`} 
                    alt={a.name} 
                    style={{ width: '32px', height: '32px', borderRadius: '50%' }} 
                  />
                  <div style={{ fontWeight: 600 }}>{a.name}</div>
                </div>
              </td>
              <td style={{ color: 'var(--text-secondary)' }}>{a.email}</td>
              <td>
                <span style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Shield size={14} color="var(--primary)" /> {a.role}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <span className={`badge ${a.status === 'aktif' ? 'success' : 'cancelled'}`}>
                  {a.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                </span>
              </td>
              <td style={{ paddingRight: '24px' }}>
                <div className="action-buttons" style={{ justifyContent: 'center' }}>
                  <button 
                    className="action-btn edit" 
                    title="Edit" 
                    onClick={() => onEdit(a)}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="action-btn delete" 
                    title="Delete" 
                    onClick={() => onDelete(a)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filteredAdmins.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                Tidak ada data admin ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
