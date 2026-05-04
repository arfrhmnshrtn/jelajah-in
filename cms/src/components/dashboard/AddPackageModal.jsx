import React, { useState } from 'react';
import { X, MapPin, DollarSign, Clock } from 'lucide-react';

const AddPackageModal = ({ isOpen, onClose, onAdd, t }) => {
  const [newPackage, setNewPackage] = useState({
    name: '',
    loc: '',
    price: '',
    duration: '',
    status: 'aktif'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newPackage);
    setNewPackage({ name: '', loc: '', price: '', duration: '', status: 'aktif' });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '500px' }}>
        <div className="modal-header">
          <span>{t('m_add_pkg_title')}</span>
          <button className="icon-button" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('m_pkg_name')}</label>
            <input 
              type="text" 
              placeholder="Contoh: Paket Bunaken Diving" 
              required 
              value={newPackage.name}
              onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-group">
              <label><MapPin size={14} /> {t('m_location')}</label>
              <input 
                type="text" 
                placeholder="Contoh: Manado" 
                required 
                value={newPackage.loc}
                onChange={(e) => setNewPackage({...newPackage, loc: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label><DollarSign size={14} /> {t('m_price')}</label>
              <input 
                type="text" 
                placeholder="Contoh: Rp 3.000.000" 
                required 
                value={newPackage.price}
                onChange={(e) => setNewPackage({...newPackage, price: e.target.value})}
              />
            </div>
          </div>
          <div className="form-group">
            <label><Clock size={14} /> {t('m_duration')}</label>
            <input 
              type="text" 
              placeholder="Contoh: 3 Hari" 
              required 
              value={newPackage.duration}
              onChange={(e) => setNewPackage({...newPackage, duration: e.target.value})}
            />
          </div>
          <div className="modal-actions" style={{ marginTop: '24px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>{t('m_cancel')}</button>
            <button type="submit" className="btn-primary">{t('m_save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPackageModal;
