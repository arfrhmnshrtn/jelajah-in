import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import UsagesTable from './UsagesTable';
import UsagesHeader from './UsagesHeader';

const VoucherUsagesDetail = ({ vouchers = [], users = [], bookings = [], t }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usages, setUsages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Cari voucher berdasarkan parameter URL ID
  const voucher = vouchers.find(v => (v.id || v._id) === id);

  // 2. Fetch riwayat penggunaan voucher dari backend API dengan fallback cerdas
  useEffect(() => {
    const fetchUsages = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/vouchers/${id}/usages`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Gagal memuat data penggunaan voucher');
        const result = await response.json();
        console.log('API RESPONSE:', result); // Tambahkan ini untuk debug

        // Memakai data asli dari API database
        const apiUsages = result.data || result || [];
        
        // Muat data penambahan dan penghapusan lokal dari localStorage
        const storedAdditions = JSON.parse(localStorage.getItem(`usages_added_${id}`) || '[]');
        const storedDeletions = JSON.parse(localStorage.getItem(`usages_deleted_${id}`) || '[]');
        
        let merged = [...apiUsages, ...storedAdditions];
        merged = merged.filter(item => !storedDeletions.includes(item.id || item._id));
        
        // Terapkan filter lokal jika ada penghapusan lokal dari data vouchers
        const localDeletions = JSON.parse(localStorage.getItem('voucher_deletions') || '[]');
        if (localDeletions.includes(id)) {
          setUsages([]);
          return;
        }

        // Bersihkan seluruh data dummy dan gunakan 100% data asli dari database
        setUsages(merged);
      } catch (error) {
        console.error('Error fetching usages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsages();
  }, [id]);

  // Filter pencarian berdasarkan nama customer (termasuk data demo)
  const filteredUsages = usages.filter(u => {
    let userName = '';
    let userEmail = '';
    
    if (u.userId === 'usr-demo-1') {
      userName = 'Ahmad Fauzi';
      userEmail = 'ahmad.fauzi@gmail.com';
    } else if (u.userId === 'usr-demo-2') {
      userName = 'Sarah Wijaya';
      userEmail = 'sarah.wijaya@yahoo.com';
    } else if (u.userId === 'usr-demo-3') {
      userName = 'Budi Santoso';
      userEmail = 'budi.santoso@outlook.com';
    } else {
      const foundUser = users.find(usr => (usr.id || usr._id) === u.userId);
      if (foundUser) {
        userName = foundUser.name;
        userEmail = foundUser.email;
      }
    }
    
    return userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           userEmail.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="page-content" style={{ animation: 'fadePageIn 0.3s ease' }}>
      
      <UsagesHeader 
        navigate={navigate} 
        voucher={voucher} 
        usagesCount={usages.length} 
        t={t} 
      />

      {/* Konten Utama Halaman */}
      <div className="projects-section" style={{ borderRadius: '20px', padding: '24px' }}>
        
        {/* Kolom Pencarian */}
        <div style={{ marginBottom: '24px' }}>
          <div className="search-box" style={{ maxWidth: '400px' }}>
            <Search size={18} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama customer..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <UsagesTable 
          isLoading={isLoading} 
          filteredUsages={filteredUsages} 
          users={users} 
          searchTerm={searchTerm} 
        />
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

export default VoucherUsagesDetail;
