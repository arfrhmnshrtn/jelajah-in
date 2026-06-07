import React from 'react';
import { User, Mail, Globe, ShieldCheck } from 'lucide-react';

const AccountTab = ({ formData, language, setLanguage, handleSave, t }) => {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '32px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={20} />
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>{t('st_personal_info')}</h3>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {t('st_name')}
            </label>
            <div className="input-with-icon">
               <User size={18} className="input-icon" />
               <input 
                type="text" 
                name="name"
                value={formData.name} 
                readOnly
                style={{ background: 'var(--bg-home)', cursor: 'not-allowed' }}
               />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {t('st_email')}
            </label>
            <div className="input-with-icon">
               <Mail size={18} className="input-icon" />
               <input 
                type="email" 
                name="email"
                value={formData.email} 
                readOnly
                style={{ background: 'var(--bg-home)', cursor: 'not-allowed' }}
               />
            </div>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
            {t('st_language')}
          </label>
          <div className="input-with-icon">
            <Globe size={18} className="input-icon" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px 16px 12px 48px', 
                borderRadius: '14px', 
                border: '1.5px solid var(--border-color)', 
                backgroundColor: 'var(--input-bg)', 
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: 500,
                outline: 'none',
                appearance: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div style={{ padding: '20px', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: '32px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={24} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#10b981', marginBottom: '4px' }}>{t('st_security')}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{t('st_security_desc')}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button type="submit" className="btn-primary" style={{ padding: '14px 40px', borderRadius: '14px' }}>
            {t('st_save')}
          </button>
        </div>
      </form>
    </>
  );
};

export default AccountTab;
