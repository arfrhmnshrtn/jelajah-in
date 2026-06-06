import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';

const VoucherTable = ({ vouchers, usageCounts, handleViewUsage, handleOpenModal, handleDelete }) => {
  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th style={{ textAlign: 'center', paddingLeft: '24px' }}>Nama / Kode</th>
            <th style={{ textAlign: 'center' }}>Diskon</th>
            <th style={{ textAlign: 'center' }}>Tipe</th>
            <th style={{ textAlign: 'center' }}>Kuota</th>
            <th style={{ textAlign: 'center' }}>Terpakai</th>
            <th style={{ textAlign: 'center' }}>Periode</th>
            <th style={{ textAlign: 'center' }}>Status</th>
            <th style={{ textAlign: 'center', paddingRight: '24px' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {(vouchers || []).map(v => (
            <tr key={v.id || v._id}>
              <td style={{ textAlign: 'center', paddingLeft: '24px' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '14px' }}>{v.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--primary)', letterSpacing: '1px', fontWeight: 600 }}>{v.code}</div>
              </td>
              <td style={{ textAlign: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                  {v.discountType === 'PERCENTAGE' ? `${v.discountValue}%` : `Rp ${new Intl.NumberFormat('id-ID').format(v.discountValue)}`}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-home)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  {v.discountType === 'PERCENTAGE' ? 'Persentase' : 'Nominal'}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}><span style={{ fontSize: '13px', fontWeight: 500 }}>{v.quota}</span></td>
              <td style={{ textAlign: 'center' }}>
                <button 
                  onClick={() => handleViewUsage(v)}
                  style={{ fontSize: '12px', background: 'var(--bg-home)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600 }}
                >
                  {usageCounts[v.id || v._id] !== undefined ? usageCounts[v.id || v._id] : (v.usedCount || 0)} Kali
                </button>
              </td>
              <td style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {v.startDate ? new Date(v.startDate).toLocaleDateString('id-ID') : '-'} - {v.endDate ? new Date(v.endDate).toLocaleDateString('id-ID') : '-'}
                </div>
              </td>
              <td style={{ textAlign: 'center' }}>
                <span className={`badge ${new Date() < new Date(v.endDate) ? 'success' : 'cancelled'}`}>
                  {new Date() < new Date(v.endDate) ? 'Aktif' : 'Berakhir'}
                </span>
              </td>
              <td style={{ textAlign: 'center', paddingRight: '24px' }}>
                <div className="action-buttons" style={{ justifyContent: 'center' }}>
                   <button className="action-btn view" title="Lihat Detail & Penggunaan" onClick={() => handleViewUsage(v)}><Eye size={16} /></button>
                   <button className="action-btn edit" title="Edit" onClick={() => handleOpenModal(v)}><Edit size={16} /></button>
                   <button className="action-btn delete" title="Delete" onClick={() => handleDelete(v)}><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoucherTable;
