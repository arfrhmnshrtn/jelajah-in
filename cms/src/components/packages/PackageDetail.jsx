import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Tag, Info, Shield, Sparkles } from 'lucide-react';

const PackageDetail = ({ packages = [], t }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to find in the passed props first
    const found = packages.find(p => String(p.id || p._id) === String(id));
    if (found) {
      setPackageData(found);
      setIsLoading(false);
    } else {
      // Fallback: If page is refreshed directly, fetch from API
      const fetchSingle = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/packages`);
          if (response.ok) {
            const result = await response.json();
            const list = Array.isArray(result.data) ? result.data : [];
            const pkg = list.find(p => String(p.id || p._id) === String(id));
            if (pkg) {
              setPackageData(pkg);
            }
          }
        } catch (error) {
          console.error("Error fetching package details:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSingle();
    }
  }, [id, packages]);

  if (isLoading) {
    return (
      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', animation: 'fadePageIn 0.3s ease' }}>
        <div className="spinner" style={spinnerStyle}></div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '16px', fontSize: '15px', fontWeight: 600 }}>Memuat detail paket wisata...</p>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="page-content" style={{ padding: '40px', textAlign: 'center', animation: 'fadePageIn 0.3s ease' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '40px 24px', backgroundColor: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
          <Info size={48} style={{ color: 'var(--primary)', opacity: 0.6, marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Detail Paket Tidak Ditemukan</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Paket yang Anda cari tidak tersedia atau telah dihapus.</p>
          <button className="btn btn-primary" onClick={() => navigate('/packages')} style={{ width: '100%', borderRadius: '12px' }}>
            Kembali ke Daftar Paket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content" style={{ animation: 'fadePageIn 0.3s ease', paddingBottom: '40px' }}>
      
      {/* Header and Back Button */}
      <div style={{ marginBottom: '24px' }}>
        <button 
          onClick={() => navigate('/packages')}
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
            marginBottom: '12px',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
        >
          <ArrowLeft size={16} /> Kembali ke Daftar Paket
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={28} color="var(--primary)" />
          <h1 style={{ fontSize: '26px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
            Detail Informasi Paket
          </h1>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '28px' }}>
        
        {/* Left Column: Image and Specs Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Banner Image Card */}
          <div className="package-image-card" style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderRadius: '24px', 
            border: '1px solid var(--border-color)', 
            overflow: 'hidden',
            boxShadow: 'var(--card-shadow)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <div style={{ position: 'relative', height: '280px', width: '100%', overflow: 'hidden' }}>
              <img 
                src={packageData.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'} 
                alt={packageData.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7))' 
              }} />
              <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px', color: 'white' }}>
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: '700', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px', 
                  backgroundColor: 'var(--primary)', 
                  padding: '4px 10px', 
                  borderRadius: '6px', 
                  display: 'inline-block',
                  marginBottom: '10px'
                }}>
                  #{packageData.id}
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0', letterSpacing: '-0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  {packageData.name}
                </h2>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'start' }}>
              <div className="package-spec-item" style={specCardStyle}>
                <MapPin size={20} style={{ color: 'var(--indigo)' }} />
                <div>
                  <div style={specLabelStyle}>{t('m_location') || 'Lokasi'}</div>
                  <div style={specValueStyle}>{packageData.location || '-'}</div>
                </div>
              </div>
              <div className="package-spec-item" style={specCardStyle}>
                <Tag size={20} style={{ color: 'var(--success)' }} />
                <div>
                  <div style={specLabelStyle}>{t('m_price') || 'Harga Paket'}</div>
                  <div style={specValueStyle}>{packageData.price || '-'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee / Info Board */}
          <div className="package-guarantee-card" style={{ 
            padding: '20px 24px', 
            backgroundColor: 'var(--card-bg)', 
            borderRadius: '24px', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: 'var(--card-shadow)'
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContext: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={24} style={{ color: 'var(--indigo)' }} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>JELAJAH.IN Perlindungan</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Semua transaksi dan pemesanan paket wisata dilindungi dengan sistem garansi kami.</p>
            </div>
          </div>

        </div>

        {/* Right Column: Detailed Description Card */}
        <div className="package-desc-card" style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderRadius: '24px', 
          border: '1px solid var(--border-color)', 
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--card-shadow)'
        }}>
          <h3 className="package-desc-title" style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            {t('m_pkg_desc') || 'Deskripsi Paket Wisata'}
          </h3>
          
          <div className="package-desc-text" style={{ 
            fontSize: '15px', 
            color: 'var(--text-secondary)', 
            lineHeight: '1.8', 
            whiteSpace: 'pre-wrap', 
            textAlign: 'left',
            flex: 1,
            marginBottom: '32px'
          }}>
            {packageData.description || 'Tidak ada deskripsi untuk paket ini.'}
          </div>

          <div className="package-desc-actions" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate('/packages')} 
              style={{ padding: '12px 36px', borderRadius: '12px', fontWeight: 700 }}
            >
              Kembali
            </button>
          </div>
        </div>

      </div>

      {/* Style Tambahan untuk Animasi Halaman */}
      <style>{`
        @keyframes fadePageIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// Styling Object
const specCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '14px 18px',
  borderRadius: '16px',
  backgroundColor: 'var(--bg-home)',
  border: '1px solid var(--border-color)'
};

const specLabelStyle = {
  fontSize: '11px',
  fontWeight: '600',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const specValueStyle = {
  fontSize: '14px',
  fontWeight: '700',
  color: 'var(--text-primary)',
  marginTop: '2px'
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '3.5px solid rgba(99, 102, 241, 0.1)',
  borderTopColor: 'var(--primary)',
  borderRadius: '50%',
  animation: 'spinnerRotate 0.8s linear infinite'
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spinnerRotate {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default PackageDetail;
