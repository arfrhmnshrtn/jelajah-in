import React from 'react';
import { ArrowLeft, Ticket } from 'lucide-react';

const UsagesHeader = ({ navigate, voucher, usagesCount, t }) => {
  return (
    <>
      {/* Header Halaman */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <button 
            onClick={() => navigate('/vouchers')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--primary)', 
              fontSize: '14px', 
              fontWeight: 600, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              cursor: 'pointer',
              padding: 0,
              marginBottom: '12px'
            }}
          >
            <ArrowLeft size={16} /> Kembali ke Voucher
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Ticket size={28} color="var(--primary)" />
            <h1 style={{ fontSize: '26px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
              Riwayat Penggunaan Voucher
            </h1>
          </div>
          
          {voucher && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', marginTop: '6px', marginBottom: 0 }}>
              Menampilkan nama-nama pengguna voucher: <strong style={{ color: 'var(--primary)' }}>{voucher.title}</strong> ({voucher.code})
            </p>
          )}
        </div>
      </div>

      {/* Bagian Statistik Ringkas */}
      {voucher && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={statCardStyle}>
            <span style={statLabelStyle}>TIPE POTONGAN</span>
            <span style={statValueStyle}>
              {voucher.discountType === 'PERCENTAGE' ? 'Persentase (%)' : 'Nominal Tetap (Rp)'}
            </span>
          </div>
          <div style={statCardStyle}>
            <span style={statLabelStyle}>NILAI DISKON</span>
            <span style={{ ...statValueStyle, color: 'var(--primary)' }}>
              {voucher.discountType === 'PERCENTAGE' ? `${voucher.discountValue}%` : `Rp ${new Intl.NumberFormat('id-ID').format(voucher.discountValue)}`}
            </span>
          </div>
          <div style={statCardStyle}>
            <span style={statLabelStyle}>TOTAL PENGGUNA</span>
            <span style={statValueStyle}>{usagesCount} Orang</span>
          </div>
        </div>
      )}
    </>
  );
};

const statCardStyle = {
  backgroundColor: 'var(--card-bg)',
  border: '1px solid var(--border-color)',
  borderRadius: '16px',
  padding: '16px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  boxShadow: 'var(--card-shadow)'
};

const statLabelStyle = {
  fontSize: '10px',
  fontWeight: 700,
  color: 'var(--text-secondary)',
  letterSpacing: '1px'
};

const statValueStyle = {
  fontSize: '16px',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

export default UsagesHeader;
