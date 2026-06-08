import React from 'react';
import { Lock, Shield, ShieldCheck } from 'lucide-react';

const SecurityTab = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Kata sandi berhasil diperbarui!');
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '32px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Lock size={20} />
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Security & Password</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Kata Sandi Saat Ini</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input type="password" placeholder="••••••••" />
            </div>
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Kata Sandi Baru</label>
            <div className="input-with-icon">
              <Shield size={18} className="input-icon" />
              <input type="password" placeholder="••••••••" />
            </div>
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Konfirmasi Kata Sandi Baru</label>
            <div className="input-with-icon">
              <ShieldCheck size={18} className="input-icon" />
              <input type="password" placeholder="••••••••" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button type="submit" className="btn-primary" style={{ padding: '14px 40px', borderRadius: '14px' }}>
            Perbarui Kata Sandi
          </button>
        </div>
      </form>
    </>
  );
};

export default SecurityTab;
