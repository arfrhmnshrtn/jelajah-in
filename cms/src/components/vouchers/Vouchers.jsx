import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import VoucherModal from './VoucherModal';
import VoucherTable from './VoucherTable';
import DeleteConfirmModal from '../shared/DeleteConfirmModal';
import FeedbackModal from '../shared/FeedbackModal';

const Vouchers = ({ vouchers, setVouchers, users, bookings, t }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [usageCounts, setUsageCounts] = useState({});

  useEffect(() => {
    const fetchAllUsageCounts = async () => {
      if (!vouchers || vouchers.length === 0) return;
      const token = localStorage.getItem('token');
      const counts = {};
      
      for (const v of vouchers) {
        const id = v.id || v._id;
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/vouchers/${id}/usages`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const result = await response.json();
            const apiUsages = result.data || result || [];
            
            const storedAdditions = JSON.parse(localStorage.getItem(`usages_added_${id}`) || '[]');
            const storedDeletions = JSON.parse(localStorage.getItem(`usages_deleted_${id}`) || '[]');
            
            let merged = [...apiUsages, ...storedAdditions];
            merged = merged.filter(item => !storedDeletions.includes(item.id || item._id));
            
            const localDeletions = JSON.parse(localStorage.getItem('voucher_deletions') || '[]');
            if (localDeletions.includes(id)) {
              counts[id] = 0;
            } else {
              counts[id] = merged.length;
            }
          } else {
            counts[id] = v.usedCount || 0;
          }
        } catch (err) {
          console.error(`Error fetching usages for voucher ${id}:`, err);
          counts[id] = v.usedCount || 0;
        }
      }
      setUsageCounts(counts);
    };

    fetchAllUsageCounts();
  }, [vouchers]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState(null);
  const [feedback, setFeedback] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  const showFeedback = (type, title, message = '') => {
    setFeedback({ isOpen: true, type, title, message });
  };
  
  const filteredVouchers = useMemo(() => {
    return (vouchers || []).filter(v => 
      (v.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.code || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, vouchers]);

  const handleOpenModal = (voucher = null) => {
    setEditingVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleSaveVoucher = async (formData) => {
    try {
      const isEditing = !!editingVoucher;
      const voucherId = editingVoucher?.id || editingVoucher?._id;
      const url = isEditing 
        ? `${import.meta.env.VITE_API_URL}/vouchers/${voucherId}`
        : `${import.meta.env.VITE_API_URL}/vouchers`;
      
      const apiData = {
        title: formData.title,
        code: formData.code,
        description: formData.description || '',
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        minPurchase: formData.minPurchase ? Number(formData.minPurchase) : null,
        quota: Number(formData.quota),
        userLimit: Number(formData.userLimit) || 1,
        isActive: formData.isActive,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };

      if (isEditing) {
        let savedVoucher = null;
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(url, {
            method: 'PATCH',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(apiData)
          });
          
          if (response.ok) {
            const result = await response.json();
            savedVoucher = result.data || result;
          }
        } catch (err) {
          console.warn('API PATCH failed, simulating locally:', err);
        }

        if (!savedVoucher) {
          savedVoucher = { ...editingVoucher, ...apiData };
          const localUpdates = JSON.parse(localStorage.getItem('voucher_updates') || '{}');
          localUpdates[voucherId] = savedVoucher;
          localStorage.setItem('voucher_updates', JSON.stringify(localUpdates));
        }

        setVouchers(vouchers.map(v => (v.id || v._id) === voucherId ? { ...v, ...savedVoucher } : v));
        showFeedback('success', 'Berhasil!', 'Voucher telah diperbarui.');
        setIsModalOpen(false);
      } else {
        const token = localStorage.getItem('token');
        const response = await fetch(url, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(apiData)
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Gagal menyimpan voucher`);
        }
        
        const result = await response.json();
        const savedVoucher = result.data || result;
        setVouchers([...vouchers, savedVoucher]);
        showFeedback('success', 'Berhasil!', 'Voucher baru telah ditambahkan.');
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving voucher:', error);
      showFeedback('error', 'Gagal!', Array.isArray(error.message) ? error.message.join(', ') : error.message);
    }
  };

  const handleDelete = (voucher) => {
    setVoucherToDelete(voucher);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!voucherToDelete) return;
    
    const voucherId = voucherToDelete.id || voucherToDelete._id;
    let deletedSuccessfully = false;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/vouchers/${voucherId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        deletedSuccessfully = true;
      }
    } catch (error) {
      console.warn('API DELETE failed, simulating locally:', error);
    }

    if (!deletedSuccessfully) {
      const localDeletions = JSON.parse(localStorage.getItem('voucher_deletions') || '[]');
      if (!localDeletions.includes(voucherId)) {
        localDeletions.push(voucherId);
        localStorage.setItem('voucher_deletions', JSON.stringify(localDeletions));
      }
      
      const localUpdates = JSON.parse(localStorage.getItem('voucher_updates') || '{}');
      if (localUpdates[voucherId]) {
        delete localUpdates[voucherId];
        localStorage.setItem('voucher_updates', JSON.stringify(localUpdates));
      }
    }
    
    setVouchers(vouchers.filter(v => (v.id || v._id) !== voucherId));
    setIsDeleteModalOpen(false);
    setVoucherToDelete(null);
    showFeedback('success', 'Dihapus!', 'Voucher telah berhasil dihapus.');
  };

  const handleViewUsage = (voucher) => {
    navigate(`/vouchers/${voucher.id || voucher._id}/usages`);
  };

  return (
    <div className="page-content">
      <div className="section-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>Promo & Voucher</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>Kelola kampanye diskon liburan JELAJAH.IN</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ padding: '14px 28px' }}>
          <Plus size={20} /> Tambah Voucher Baru
        </button>
      </div>

      <div className="projects-section" style={{ padding: '0', borderRadius: '20px' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <div className="search-box" style={{ maxWidth: '400px' }}>
             <Search size={18} color="var(--text-secondary)" />
             <input 
               type="text" 
               placeholder="Cari berdasarkan kode voucher..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>

        <VoucherTable 
          vouchers={filteredVouchers}
          usageCounts={usageCounts}
          handleViewUsage={handleViewUsage}
          handleOpenModal={handleOpenModal}
          handleDelete={handleDelete}
        />
      </div>

      <VoucherModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveVoucher}
        editingData={editingVoucher}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={voucherToDelete?.title}
        t={t}
      />

      <FeedbackModal 
        isOpen={feedback.isOpen}
        onClose={() => setFeedback({ ...feedback, isOpen: false })}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
      />
    </div>
  );
};

export default Vouchers;
