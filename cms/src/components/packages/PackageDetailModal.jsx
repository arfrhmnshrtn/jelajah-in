import React from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Tag } from 'lucide-react';

const PackageDetailModal = ({ isOpen, onClose, packageData, t }) => {
  if (!isOpen || !packageData) return null;

  return createPortal(
    <div className="modal-overlay" style={overlayStyle}>
      <div className="modal-content" style={modalContentStyle}>
        {/* Banner Image */}
        <div style={{ position: 'relative', height: '240px', width: '100%', overflow: 'hidden', flexShrink: 0 }}>
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
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8))' 
          }} />
          
          <button 
            onClick={onClose} 
            style={{ 
              position: 'absolute', 
              top: '16px', 
              right: '16px', 
              backgroundColor: 'rgba(0, 0, 0, 0.5)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '50%', 
              width: '36px', 
              height: '36px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer',
              transition: 'all 0.2s',
              backdropFilter: 'blur(4px)',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X size={20} />
          </button>
          
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
            <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0', letterSpacing: '-0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{packageData.name}</h2>
          </div>
        </div>

        <div style={{ padding: '28px', backgroundColor: 'var(--card-bg)', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', flexShrink: 0, alignItems: 'start' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '14px 18px', 
              borderRadius: '16px', 
              backgroundColor: 'var(--bg-home)', 
              border: '1px solid var(--border-color)'
            }}>
              <MapPin size={20} style={{ color: 'var(--indigo)' }} />
              <div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('m_location') || 'Lokasi'}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{packageData.location || '-'}</div>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '14px 18px', 
              borderRadius: '16px', 
              backgroundColor: 'var(--bg-home)', 
              border: '1px solid var(--border-color)'
            }}>
              <Tag size={20} style={{ color: 'var(--success)' }} />
              <div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('m_price') || 'Harga Paket'}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{packageData.price || '-'}</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '8px', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px', flexShrink: 0 }}>
              {t('m_pkg_desc') || 'Deskripsi Paket'}
            </h3>
            <div style={{ 
              fontSize: '14px', 
              color: 'var(--text-secondary)', 
              lineHeight: '1.7', 
              whiteSpace: 'pre-wrap', 
              overflowY: 'auto',
              paddingRight: '8px',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-home)',
              textAlign: 'left',
              flex: 1,
              minHeight: '180px'
            }}>
              {packageData.description || 'Tidak ada deskripsi untuk paket ini.'}
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', flexShrink: 0 }}>
            <button 
              className="btn btn-secondary" 
              onClick={onClose} 
              style={{ padding: '12px 30px', borderRadius: '12px' }}
            >
              {t('m_finish') || 'Selesai'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};


const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(5px)',
  zIndex: 99999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modalContentStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '600px',
  width: '95%',
  height: '650px', 
  maxHeight: '90vh',
  backgroundColor: 'var(--card-bg)',
  borderRadius: '24px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.5)',
  border: '1px solid var(--border-color)',
  overflow: 'hidden',
  animation: 'modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
};

export default PackageDetailModal;
