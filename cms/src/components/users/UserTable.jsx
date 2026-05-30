import React from 'react';
import { Edit } from 'lucide-react';

const UserTable = ({ sortedUsers, onEdit, onSort, renderSortIcon, t }) => {
  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => onSort('id')}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                ID {renderSortIcon('id')}
              </div>
            </th>
            <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => onSort('name')}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {t('st_name')} {renderSortIcon('name')}
              </div>
            </th>
            <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => onSort('email')}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {t('st_email')} {renderSortIcon('email')}
              </div>
            </th>
            <th>{t('m_role')}</th>
            <th style={{ textAlign: 'center' }}>{t('m_join_date')}</th>
            <th style={{ textAlign: 'center' }}>{t('t_action')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map(u => (
            <tr key={u.id || u._id}>
              <td style={{ fontWeight: 600, color: 'var(--primary)' }}>#{u.id || u._id}</td>
              <td>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`} 
                    alt={u.name} 
                    style={{ width: '32px', height: '32px', borderRadius: '50%' }} 
                  />
                  <div style={{ fontWeight: 600 }}>{u.name}</div>
                </div>
              </td>
              <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
              <td>{u.role}</td>
              <td style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }) : (u.joinDate || '-')}
              </td>
              <td style={{ textAlign: 'center' }}>
                <div className="action-buttons" style={{ justifyContent: 'center' }}>
                  <button 
                    className="action-btn edit" 
                    title="Edit" 
                    onClick={() => onEdit(u)}
                  >
                    <Edit size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {sortedUsers.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                Tidak ada data pengguna ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
