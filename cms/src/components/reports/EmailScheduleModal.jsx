import React from 'react';
import { X, CheckCircle } from 'lucide-react';

const EmailScheduleModal = ({ isOpen, onClose, onSchedule, emailStatus }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '400px' }}>
        <div className="modal-header">
          <span>Jadwal Laporan</span>
          <button className="icon-button" onClick={onClose}><X size={20} /></button>
        </div>
        {emailStatus === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '16px' }} />
            <h3>Terjadwal!</h3>
            <p>Laporan akan dikirim tanggal 1 bulan depan.</p>
          </div>
        ) : (
          <form onSubmit={onSchedule}>
             <div className="form-group">
                <label>Email Penerima</label>
                <input type="email" placeholder="manager@jelajah.in" required />
             </div>
             <div className="form-group">
                <label>Periode</label>
                <select style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                  <option>Mingguan</option>
                  <option>Bulanan</option>
                </select>
             </div>
             <div className="modal-actions" style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={emailStatus === 'sending'}>{emailStatus === 'sending' ? 'Memproses...' : 'Simpan'}</button>
             </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmailScheduleModal;
