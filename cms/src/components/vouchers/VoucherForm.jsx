import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

const VoucherForm = ({ editingData, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    maxDiscount: '',
    minPurchase: '',
    quota: '',
    userLimit: 1,
    isActive: true,
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (editingData) {
      setFormData({
        title: editingData.title || '',
        code: editingData.code || '',
        description: editingData.description || '',
        discountType: editingData.discountType || 'PERCENTAGE',
        discountValue: editingData.discountValue || '',
        maxDiscount: editingData.maxDiscount || '',
        minPurchase: editingData.minPurchase || '',
        quota: editingData.quota || '',
        userLimit: editingData.userLimit || 1,
        isActive: editingData.isActive !== undefined ? editingData.isActive : true,
        startDate: editingData.startDate ? new Date(editingData.startDate).toISOString().split('T')[0] : '',
        endDate: editingData.endDate ? new Date(editingData.endDate).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({ 
        title: '', code: '', description: '', discountType: 'PERCENTAGE', discountValue: '', 
        maxDiscount: '', minPurchase: '', quota: '', userLimit: 1, isActive: true,
        startDate: new Date().toISOString().split('T')[0], endDate: '' 
      });
    }
  }, [editingData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <div style={bodyStyle}>
        <form id="voucher-form" onSubmit={handleSubmit}>
          <div style={gridStyle}>
            <div className="form-group">
              <label style={labelStyle}>Nama Voucher</label>
              <input type="text" required placeholder="Diskon Liburan" style={inputStyle} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="form-group">
              <label style={labelStyle}>Kode Voucher</label>
              <input type="text" required placeholder="LIBURAN2026" style={{...inputStyle, textTransform: 'uppercase', fontWeight: 700}} value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Deskripsi Promo</label>
            <textarea placeholder="Tuliskan keterangan singkat mengenai promo ini..." style={{...inputStyle, height: '70px', resize: 'none'}} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div style={{...gridStyle, marginTop: '16px'}}>
            <div className="form-group">
              <label style={labelStyle}>Tipe Diskon</label>
              <select value={formData.discountType} onChange={(e) => setFormData({...formData, discountType: e.target.value})} style={inputStyle}>
                <option value="PERCENTAGE">Persentase (%)</option>
                <option value="FIXED">Nominal Tetap (Rp)</option>
              </select>
            </div>
            <div className="form-group">
              <label style={labelStyle}>Besar Diskon</label>
              <input type="number" required min="0" style={inputStyle} value={formData.discountValue} onChange={(e) => setFormData({...formData, discountValue: e.target.value})} />
            </div>
          </div>

          <div style={{...gridStyle, marginTop: '16px'}}>
            <div className="form-group">
              <label style={labelStyle}>Max. Potongan</label>
              <input type="number" placeholder="50000" style={inputStyle} value={formData.maxDiscount} onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})} />
            </div>
            <div className="form-group">
              <label style={labelStyle}>Min. Beli</label>
              <input type="number" placeholder="200000" style={inputStyle} value={formData.minPurchase} onChange={(e) => setFormData({...formData, minPurchase: e.target.value})} />
            </div>
          </div>

          <div style={{...gridStyle, marginTop: '16px'}}>
            <div className="form-group">
              <label style={labelStyle}>Kuota</label>
              <input type="number" required min="1" style={inputStyle} value={formData.quota} onChange={(e) => setFormData({...formData, quota: e.target.value})} />
            </div>
            <div className="form-group">
              <label style={labelStyle}>Batas per User</label>
              <input type="number" required min="1" style={inputStyle} value={formData.userLimit} onChange={(e) => setFormData({...formData, userLimit: e.target.value})} />
            </div>
          </div>

          <div style={{...gridStyle, marginTop: '16px'}}>
            <div className="form-group">
              <label style={labelStyle}>Tgl Mulai</label>
              <input type="date" required style={inputStyle} value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
            </div>
            <div className="form-group">
              <label style={labelStyle}>Tgl Berakhir</label>
              <input type="date" required style={inputStyle} value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '12px', backgroundColor: 'var(--input-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setFormData({...formData, isActive: !formData.isActive})}>
            <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: '2px solid #3b82f6', backgroundColor: formData.isActive ? '#3b82f6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {formData.isActive && <Check size={12} color="white" />}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Voucher Aktif</span>
          </div>
        </form>
      </div>

      {/* Footer - Sticky */}
      <div className="modal-actions" style={footerStyle}>
        <button type="button" className="btn btn-secondary" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '10px' }}>Batal</button>
        <button type="submit" form="voucher-form" className="btn btn-primary" style={{ padding: '10px 30px', borderRadius: '10px', fontWeight: 700 }}>Simpan</button>
      </div>
    </>
  );
};

const bodyStyle = {
  padding: '32px',
  overflowY: 'auto',
  flex: 1
};

const footerStyle = {
  padding: '20px 32px',
  borderTop: '1px solid var(--border-color, #334155)',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  backgroundColor: 'var(--card-bg, #1e293b)'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px'
};

const labelStyle = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-secondary, #cbd5e1)',
  marginBottom: '8px',
  display: 'block'
};

const inputStyle = {
  width: '100%',
  padding: '12px 18px',
  borderRadius: '14px',
  border: '1.5px solid var(--border-color, #334155)',
  backgroundColor: 'var(--input-bg, #0f172a)',
  color: 'var(--text-primary, #f8fafc)',
  fontSize: '14px',
  outline: 'none',
  transition: 'all 0.2s ease',
  boxSizing: 'border-box'
};

export default VoucherForm;
