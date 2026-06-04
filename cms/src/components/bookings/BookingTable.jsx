import React from 'react';
import { Eye, Trash2 } from 'lucide-react';

const BookingTable = ({ bookings, onView, onDelete, t }) => {
  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>ID {t('booking')}</th>
            <th>{t('t_customer')}</th>
            <th>{t('packages')}</th>
            <th style={{ textAlign: 'center' }}>Tanggal</th>
            <th style={{ textAlign: 'center' }}>Total</th>
            <th style={{ textAlign: 'center' }}>{t('t_status')}</th>
            <th style={{ textAlign: 'center' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(book => (
            <tr key={book.id || book._id}>
              <td><span style={{ fontWeight: 700, color: 'var(--primary)' }}>{book.bookingCode || book.id || book._id}</span></td>
              <td>
                <div style={{ fontWeight: 600 }}>{book.user?.name || `User ID: ${book.userId}`}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{book.user?.email || ''}</div>
              </td>
              <td>{book.package?.name || `Package ID: ${book.packageId}`}</td>
              <td style={{ textAlign: 'center' }}>
                {new Date(book.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
              </td>
              <td style={{ fontWeight: 700, textAlign: 'center' }}>
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(book.totalPrice)}
              </td>
              <td style={{ textAlign: 'center' }}>
                <span className={`badge ${(book.status?.toUpperCase() === 'SUCCESS' || book.status?.toUpperCase() === 'SETTLEMENT' || book.status?.toUpperCase() === 'CAPTURE' || book.status?.toUpperCase() === 'PAID') ? 'success' : book.status?.toUpperCase() === 'PENDING' ? 'pending' : 'cancelled'}`}>
                  {(book.status?.toUpperCase() === 'SUCCESS' || book.status?.toUpperCase() === 'SETTLEMENT' || book.status?.toUpperCase() === 'CAPTURE' || book.status?.toUpperCase() === 'PAID') ? 'Sukses' : book.status?.toUpperCase() === 'PENDING' ? 'Pending' : 'Batal'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="action-btn view" title="View" onClick={() => onView(book)}><Eye size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
