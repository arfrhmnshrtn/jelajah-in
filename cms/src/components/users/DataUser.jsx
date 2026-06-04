import React, { useState } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import FeedbackModal from '../shared/FeedbackModal';
import UserModal from './UserModal';
import UserTable from './UserTable';

const DataUser = ({ users, setUsers, t }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [feedback, setFeedback] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  
  // Sorting State
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  const showFeedback = (type, title, message = '') => {
    setFeedback({ isOpen: true, type, title, message });
  };

  const handleEdit = (u) => {
    setEditingUser(u);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      
      const userId = editingUser.id || editingUser._id;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/update/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal memperbarui data pengguna');
      }
      
      setUsers(users.map(u => (u.id || u._id) === (editingUser.id || editingUser._id) ? { ...u, ...formData } : u));
      setIsEditModalOpen(false);
      showFeedback('success', 'Berhasil!', 'Data pengguna telah diperbarui.');
    } catch (error) {
      console.error('Error updating user:', error);
      showFeedback('error', 'Gagal!', error.message);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} style={{ opacity: 0.4, marginLeft: '6px', flexShrink: 0 }} />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp size={14} style={{ color: 'var(--primary)', marginLeft: '6px', flexShrink: 0 }} />
      : <ArrowDown size={14} style={{ color: 'var(--primary)', marginLeft: '6px', flexShrink: 0 }} />;
  };

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply robust case-insensitive alphabetical sorting
  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;

    let valA = '';
    let valB = '';

    if (sortField === 'id') {
      valA = String(a.id || a._id || '').toLowerCase();
      valB = String(b.id || b._id || '').toLowerCase();
    } else if (sortField === 'name') {
      valA = String(a.name || '').toLowerCase();
      valB = String(b.name || '').toLowerCase();
    } else if (sortField === 'email') {
      valA = String(a.email || '').toLowerCase();
      valB = String(b.email || '').toLowerCase();
    }

    return sortOrder === 'asc'
      ? valA.localeCompare(valB, 'id', { numeric: true })
      : valB.localeCompare(valA, 'id', { numeric: true });
  });

  return (
    <div className="page-content">
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800' }}>{t('data_user')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Kelola daftar pelanggan JELAJAH.IN</p>
      </div>

      <div className="projects-section" style={{ padding: '0' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
          <div className="search-box">
            <Search size={18} color="var(--text-secondary)" />
            <input type="text" placeholder="Cari nama pengguna..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <UserTable 
          sortedUsers={sorted} 
          onEdit={handleEdit} 
          onSort={handleSort} 
          renderSortIcon={renderSortIcon} 
          t={t} 
        />
      </div>
      <UserModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveUser}
        editingData={editingUser}
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

export default DataUser;
