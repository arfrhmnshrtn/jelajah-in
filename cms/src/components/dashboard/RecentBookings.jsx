import React from 'react';
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';

const RecentBookings = ({ bookings, t }) => {
  const activeBookings = bookings.slice(0, 4).map(b => ({
    id: b.id,
    name: b.pelanggan,
    package: b.paket,
    amount: b.total,
    statusClass: b.status,
    statusText: b.status === 'success' ? t('t_success') : b.status === 'pending' ? t('t_pending') : t('t_cancelled')
  }));

  return (
    <div className="projects-section" style={{ padding: '0' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{t('dg_latest_booking')}</h3>
        <button className="icon-button"><MoreVertical size={18} /></button>
      </div>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>{t('t_customer')} / {t('packages')}</th>
              <th style={{ textAlign: 'center' }}>Total</th>
              <th style={{ textAlign: 'center' }}>{t('t_status')}</th>
              <th style={{ textAlign: 'center' }}>{t('t_action')}</th>
            </tr>
          </thead>
          <tbody>
            {activeBookings.map(book => (
              <tr key={book.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{book.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{book.package}</div>
                </td>
                <td style={{ fontWeight: 700, textAlign: 'center' }}>{book.amount}</td>
                <td style={{ textAlign: 'center' }}><span className={`badge ${book.statusClass}`}>{book.statusText}</span></td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn view" title="View"><Eye size={16} /></button>
                    <button className="action-btn edit" title="Edit"><Edit size={16} /></button>
                    <button className="action-btn delete" title="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings;
