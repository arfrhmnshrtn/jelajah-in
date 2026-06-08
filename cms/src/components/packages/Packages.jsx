import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import PackageModal from './PackageModal';
import DeleteConfirmModal from '../shared/DeleteConfirmModal';
import FeedbackModal from '../shared/FeedbackModal';
import PackageTable from './PackageTable';
import { useAppContext } from '../../context/AppContext';

const Packages = () => {
  const { packages, setPackages, t } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [feedback, setFeedback] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  const handleViewDetail = (p) => {
    navigate(`/packages/${p.id}`);
  };

  const showFeedback = (type, title, message = '') => {
    setFeedback({ isOpen: true, type, title, message });
  };

  const handleSavePackage = async (formData) => {
    try {
      const isEditing = !!editingPackage;
      const url = isEditing 
        ? `${import.meta.env.VITE_API_URL}/packages/${editingPackage.id}`
        : `${import.meta.env.VITE_API_URL}/packages`;
      
      // Map formData to match API expected fields and sanitize price
      const apiData = {
        name: formData.name,
        location: formData.location,
        description: formData.description,
        image: formData.image,
        // Convert "Rp 3.000.000" to 3000000
        price: typeof formData.price === 'string' 
          ? (parseInt(formData.price.replace(/[^0-9]/g, '')) || 0)
          : (parseInt(formData.price) || 0)
      };

      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Internal server error`);
      }
      
      const result = await response.json();
      
      if (isEditing) {
        setPackages(packages.map(p => p.id === editingPackage.id ? { ...p, ...formData } : p));
        showFeedback('success', 'Berhasil!', 'Paket berhasil diperbarui.');
      } else {
        const newPkgData = result.data || result;
        const finalId = newPkgData.id || newPkgData.id_package || result.id || Date.now();
        
        setPackages([...packages, { ...formData, id: finalId }]);
        showFeedback('success', 'Berhasil!', 'Paket baru telah ditambahkan.');
      }
      closeModal();
    } catch (error) {
      console.error('Error saving package:', error);
      showFeedback('error', 'Gagal!', error.message);
    }
  };

  const handleEdit = (p) => {
    setEditingPackage(p);
    setIsAddModalOpen(true);
  };

  const handleDelete = (p) => {
    setPackageToDelete(p);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!packageToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/packages/${packageToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal menghapus data dari server');
      }
      
      setPackages(packages.filter(p => p.id !== packageToDelete.id));
      setIsDeleteModalOpen(false);
      setPackageToDelete(null);
      showFeedback('success', 'Terhapus!', 'Paket telah berhasil dihapus dari sistem.');
    } catch (error) {
      console.error('Error deleting package:', error);
      setIsDeleteModalOpen(false);
      setPackageToDelete(null);
      showFeedback('error', 'Gagal!', error.message);
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingPackage(null);
  };

  const filtered = packages.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.location && p.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page-content">
      <div className="section-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>{t('packages')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>Kelola katalog destinasi JELAJAH.IN</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)} style={{ padding: '14px 28px' }}>
          <Plus size={20} /> {t('dg_add_pkg')}
        </button>
      </div>

      <div className="projects-section" style={{ padding: '0', borderRadius: '20px' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <div className="search-box" style={{ maxWidth: '400px' }}>
            <Search size={18} color="var(--text-secondary)" />
            <input type="text" placeholder="Cari berdasarkan nama atau lokasi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <PackageTable 
          filteredPackages={filtered} 
          onViewDetail={handleViewDetail} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          t={t} 
        />
      </div>

      <PackageModal 
        isOpen={isAddModalOpen}
        onClose={closeModal}
        onSave={handleSavePackage}
        editingData={editingPackage}
        t={t}
      />
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={packageToDelete?.name}
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

export default Packages;
