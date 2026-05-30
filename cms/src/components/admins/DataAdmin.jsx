import React, { useState } from 'react';
import { Search } from 'lucide-react';
import AdminTable from './AdminTable';
import AdminModalsContainer from './AdminModalsContainer';
import AdminHeader from './AdminHeader';

const DataAdmin = ({ admins, setAdmins, t }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [feedback, setFeedback] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  const showFeedback = (type, title, message = '') => setFeedback({ isOpen: true, type, title, message });

  const handleOpenModal = (admin = null) => {
    setEditingAdmin(admin);
    setIsModalOpen(true);
  };

  const handleSaveAdmin = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (editingAdmin) {
        // Edit Mode
        const updatedAdmins = admins.map(a => a.id === editingAdmin.id ? { ...a, ...formData } : a);
        setAdmins(updatedAdmins);
        localStorage.setItem('cached_admins', JSON.stringify(updatedAdmins));
        
        const localUpdates = JSON.parse(localStorage.getItem('admin_updates') || '{}');
        localUpdates[editingAdmin.id] = formData;
        localStorage.setItem('admin_updates', JSON.stringify(localUpdates));
        
        showFeedback('success', 'Berhasil!', 'Data admin telah berhasil diperbarui.');
        setIsModalOpen(false);
      } else {
        // Add Mode -> POST to /auth/register/admin
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register/admin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errList = Array.isArray(errorData.message) ? errorData.message.join(', ') : (errorData.message || 'Gagal menambahkan admin baru');
          throw new Error(errList);
        }

        const data = await response.json();
        const createdAdmin = data.user || data.data || data;
        
        const newAdmin = {
          id: createdAdmin.id || createdAdmin._id,
          name: createdAdmin.name,
          email: createdAdmin.email,
          role: createdAdmin.role === 'ADMIN' ? 'Admin' : (createdAdmin.role === 'SUPERADMIN' ? 'Superadmin' : createdAdmin.role || 'Admin'),
          status: 'aktif',
          createdAt: createdAdmin.createdAt
        };

        const updatedAdmins = [...admins, newAdmin];
        setAdmins(updatedAdmins);
        localStorage.setItem('cached_admins', JSON.stringify(updatedAdmins));
        
        const localAdditions = JSON.parse(localStorage.getItem('admin_additions') || '[]');
        localAdditions.push(newAdmin);
        localStorage.setItem('admin_additions', JSON.stringify(localAdditions));

        showFeedback('success', 'Berhasil!', 'Admin baru telah berhasil ditambahkan.');
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving admin:', error);
      showFeedback('error', 'Gagal!', error.message || 'Terjadi kesalahan saat memproses data.');
    }
  };

  const handleDelete = (a) => {
    setAdminToDelete(a);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (adminToDelete) {
      const updatedAdmins = admins.filter(a => a.id !== adminToDelete.id);
      setAdmins(updatedAdmins);
      localStorage.setItem('cached_admins', JSON.stringify(updatedAdmins));
      
      const localDeletions = JSON.parse(localStorage.getItem('admin_deletions') || '[]');
      localDeletions.push(adminToDelete.id);
      localStorage.setItem('admin_deletions', JSON.stringify(localDeletions));
      
      showFeedback('success', 'Berhasil!', 'Data admin telah berhasil dihapus.');
    }
    setIsDeleteModalOpen(false);
    setAdminToDelete(null);
  };

  const filtered = (admins || []).filter(a => (a.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (a.email || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="page-content">
      <AdminHeader 
        onAddClick={() => handleOpenModal()} 
        t={t} 
      />

      <div className="projects-section" style={{ padding: '0', borderRadius: '20px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
          <div className="search-box" style={{ maxWidth: '400px' }}>
            <Search size={18} color="var(--text-secondary)" />
            <input type="text" placeholder="Cari nama admin..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <AdminTable 
          filteredAdmins={filtered} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
          t={t} 
        />
      </div>

      <AdminModalsContainer
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleSaveAdmin={handleSaveAdmin}
        editingAdmin={editingAdmin}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        confirmDelete={confirmDelete}
        adminToDelete={adminToDelete}
        feedback={feedback}
        setFeedback={setFeedback}
        t={t}
      />
    </div>
  );
};

export default DataAdmin;
