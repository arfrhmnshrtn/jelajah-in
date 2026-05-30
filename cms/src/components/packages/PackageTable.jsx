import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

const PackageTable = ({ filteredPackages, onViewDetail, onEdit, onDelete, t }) => {
  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th style={{ textAlign: 'center', paddingLeft: '24px' }}>ID</th>
            <th style={{ textAlign: 'center' }}>{t('m_pkg_name')}</th>
            <th style={{ textAlign: 'center' }}>{t('m_pkg_desc')}</th>
            <th style={{ textAlign: 'center' }}>{t('m_price')}</th>
            <th style={{ textAlign: 'center' }}>{t('m_location')}</th>
            <th style={{ textAlign: 'center' }}>Foto</th>
            <th style={{ textAlign: 'center', paddingRight: '24px' }}>{t('t_action')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredPackages.map(p => (
            <tr key={p.id}>
              <td style={{ textAlign: 'center', paddingLeft: '24px', fontWeight: 700, color: 'var(--primary)', fontSize: '13px' }}>#{p.id}</td>
              <td style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
              </td>
              <td style={{ textAlign: 'center', minWidth: '280px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '350px', margin: '0 auto', textAlign: 'left' }}>
                  {p.description ? (
                    p.description.length > 80 
                      ? `${p.description.slice(0, 80)}...` 
                      : p.description
                  ) : '-'}
                </div>
              </td>
              <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-primary)' }}>
                {p.price}
              </td>
              <td style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '13px' }}>
                  {p.location}
                </div>
              </td>
              <td style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src={p.image || 'https://via.placeholder.com/60'} 
                    alt={p.name} 
                    style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover', border: '2px solid var(--border-color)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }} 
                  />
                </div>
              </td>
              <td style={{ textAlign: 'center', paddingRight: '24px' }}>
                <div className="action-buttons" style={{ justifyContent: 'center' }}>
                  <button 
                    className="action-btn view" 
                    title={t('t_detail') || 'Detail'} 
                    onClick={() => onViewDetail(p)}
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    className="action-btn edit" 
                    title="Edit" 
                    onClick={() => onEdit(p)}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="action-btn delete" 
                    title="Delete" 
                    onClick={() => onDelete(p)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filteredPackages.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                Tidak ada data paket ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PackageTable;
