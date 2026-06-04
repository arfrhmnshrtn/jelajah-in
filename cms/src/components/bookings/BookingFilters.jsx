import React from 'react';
import { Search } from 'lucide-react';

const BookingFilters = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }) => {
  return (
    <div style={{ padding: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)' }}>
      <div className="search-box" style={{ flex: 1, minWidth: '300px' }}>
         <Search size={18} color="var(--text-secondary)" />
         <input 
           type="text" 
           placeholder="Cari pelanggan, ID, atau paket..." 
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
         />
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <label style={{ fontSize: '14px', fontWeight: 600 }}>Status:</label>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
        >
          <option>Semua Status</option>
          <option>Sukses</option>
          <option>Pending</option>
          <option>Dibatalkan</option>
        </select>
      </div>
    </div>
  );
};

export default BookingFilters;
