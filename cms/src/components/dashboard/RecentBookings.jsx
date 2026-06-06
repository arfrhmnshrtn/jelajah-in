import React from 'react';
import { Eye, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecentBookings = ({ bookings, t }) => {
  const navigate = useNavigate();
  
  // Take the 5 latest bookings
  const latestBookings = [...(bookings || [])].reverse().slice(0, 5);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="projects-section" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to right, rgba(99, 102, 241, 0.03), transparent)' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px' }}>{t('dg_latest_booking')}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Aktivitas pemesanan paket terbaru</p>
        </div>
        <button 
          onClick={() => navigate('/bookings')}
          style={{ 
            fontSize: '13px', 
            fontWeight: 700, 
            color: 'var(--primary)', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          Lihat Semua <ChevronRight size={16} />
        </button>
      </div>

      <div className="table-responsive">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: 'var(--bg-secondary)' }}>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Pelanggan & Paket</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'center' }}>Total</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {latestBookings.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Tidak ada data pemesanan terbaru.
                </td>
              </tr>
            ) : (
              latestBookings.map((book) => (
                <tr key={book.id || book._id} className="table-row-hover" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '10px', 
                        background: 'var(--primary-light)', 
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '14px'
                      }}>
                        {(book.user?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{book.user?.name || `User ID: ${book.userId}`}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '1px' }}>{book.package?.name || 'Paket Liburan'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '14px' }}>
                      {formatCurrency(book.totalPrice)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {book.bookingCode}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <span className={`badge ${(book.status?.toUpperCase() === 'SUCCESS' || book.status?.toUpperCase() === 'SETTLEMENT' || book.status?.toUpperCase() === 'CAPTURE' || book.status?.toUpperCase() === 'PAID') ? 'success' : book.status?.toUpperCase() === 'PENDING' ? 'pending' : 'cancelled'}`} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700 }}>
                      {(book.status?.toUpperCase() === 'SUCCESS' || book.status?.toUpperCase() === 'SETTLEMENT' || book.status?.toUpperCase() === 'CAPTURE' || book.status?.toUpperCase() === 'PAID') ? 'Sukses' : book.status?.toUpperCase() === 'PENDING' ? 'Pending' : 'Batal'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button 
                      className="action-btn view" 
                      onClick={() => navigate('/bookings')}
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '8px', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings;
