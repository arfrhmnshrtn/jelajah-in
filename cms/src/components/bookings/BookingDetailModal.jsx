import React from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2 } from 'lucide-react';

const BookingDetailModal = ({ isOpen, onClose, booking, onConfirmPayment }) => {
  if (!isOpen || !booking) return null;

  return createPortal(
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="modal-content booking-detail-modal" style={{ width: '100%', maxWidth: '500px', animation: 'modalScaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        <div className="modal-header">
          <span style={{ fontSize: '18px', fontWeight: 700 }}>Detail Pemesanan</span>
          <button className="icon-button" onClick={onClose}><X size={20} /></button>
        </div>
        <div style={{ padding: '10px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
               <div className="form-group">
                 <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Pelanggan</label>
                 <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{booking.user?.name || `User ID: ${booking.userId}`}</div>
               </div>
               <div className="form-group">
                 <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Status</label>
                 <div>
                    <span className={`badge ${(booking.status?.toUpperCase() === 'SUCCESS' || booking.status?.toUpperCase() === 'SETTLEMENT' || booking.status?.toUpperCase() === 'CAPTURE' || booking.status?.toUpperCase() === 'PAID') ? 'success' : booking.status?.toUpperCase() === 'PENDING' ? 'pending' : 'cancelled'}`} style={{ textTransform: 'capitalize' }}>
                        {(booking.status?.toUpperCase() === 'SUCCESS' || booking.status?.toUpperCase() === 'SETTLEMENT' || booking.status?.toUpperCase() === 'CAPTURE' || booking.status?.toUpperCase() === 'PAID') ? 'Sukses' : booking.status?.toUpperCase() === 'PENDING' ? 'Pending' : 'Dibatalkan'}
                    </span>
                 </div>
               </div>
               <div className="form-group">
                 <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Paket Wisata</label>
                 <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{booking.package?.name || `Package ID: ${booking.packageId}`}</div>
               </div>
               <div className="form-group">
                 <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Total Pembayaran</label>
                 <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '20px' }}>
                   {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(booking.totalPrice)}
                 </div>
               </div>
            </div>
            
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--input-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
               <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Informasi Tambahan</div>
               <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', color: 'var(--text-primary)' }}>
                 <CheckCircle2 size={18} color="#10b981" /> 
                 <span>Kode Booking: <strong style={{ letterSpacing: '0.5px' }}>{booking.bookingCode}</strong></span>
               </div>
            </div>
         </div>
          <div className="modal-actions" style={{ marginTop: '28px', display: 'flex', gap: '12px', justifyContent: 'flex-end', height: '42px', alignItems: 'center' }}>
            <button className="btn btn-secondary" onClick={onClose} style={{ padding: '10px 24px', borderRadius: '12px' }}>Tutup</button>
            {booking.status?.toUpperCase() === 'PENDING' ? (
              <button className="btn btn-primary" onClick={() => onConfirmPayment(booking.id || booking._id)} style={{ padding: '10px 28px', borderRadius: '12px', fontWeight: 700, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>Konfirmasi Bayar</button>
             ) : (booking.status?.toUpperCase() === 'SUCCESS' || booking.status?.toUpperCase() === 'SETTLEMENT' || booking.status?.toUpperCase() === 'CAPTURE' || booking.status?.toUpperCase() === 'PAID') ? (
              <button className="btn" disabled style={{ padding: '10px 28px', borderRadius: '12px', fontWeight: 700, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', cursor: 'not-allowed', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Pembayaran Sukses</button>
            ) : (
              <button className="btn" disabled style={{ padding: '10px 28px', borderRadius: '12px', fontWeight: 700, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'not-allowed', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Pembayaran Batal</button>
            )}
          </div>
      </div>
    </div>,
    document.body
  );
};

export default BookingDetailModal;
