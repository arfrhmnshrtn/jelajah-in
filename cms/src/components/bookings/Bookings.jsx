import React, { useState, useMemo } from 'react';
import { Download, Calendar, FileText, ChevronDown, Trash2 } from 'lucide-react';
import DeleteConfirmModal from '../shared/DeleteConfirmModal';
import FeedbackModal from '../shared/FeedbackModal';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import BookingFilters from './BookingFilters';
import BookingTable from './BookingTable';
import { useAppContext } from '../../context/AppContext';
import BookingDetailModal from './BookingDetailModal';

const Bookings = () => {
  const { bookings, setBookings, users, packages, t } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [feedback, setFeedback] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  const showFeedback = (type, title, message = '') => {
    setFeedback({ isOpen: true, type, title, message });
  };

  const enrichedBookings = useMemo(() => {
    const combined = (bookings || []).map(b => {
      const user = users.find(u => String(u.id || u._id) === String(b.userId));
      const pkg = packages.find(p => String(p.id || p._id) === String(b.packageId));
      return {
        ...b,
        user: user || b.user,
        package: pkg || b.package
      };
    });
    
    // Sort by id descending so the order is consistent and newest is on top
    return combined.sort((a, b) => {
      const idA = a.id || a._id || 0;
      const idB = b.id || b._id || 0;
      return idB - idA;
    });
  }, [bookings, users, packages]);

  const filteredBookings = useMemo(() => {
    return enrichedBookings.filter(b => {
      const matchSearch = (b.bookingCode || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          String(b.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          String(b.userId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.package?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = statusFilter === 'Semua Status' || 
                          (statusFilter === 'Sukses' && (b.status?.toUpperCase() === 'SUCCESS' || b.status?.toUpperCase() === 'SETTLEMENT' || b.status?.toUpperCase() === 'CAPTURE' || b.status?.toUpperCase() === 'PAID')) ||
                          (statusFilter === 'Pending' && b.status?.toUpperCase() === 'PENDING') ||
                          (statusFilter === 'Dibatalkan' && (b.status?.toUpperCase() === 'CANCELLED' || b.status?.toUpperCase() === 'CANCEL' || b.status?.toUpperCase() === 'EXPIRED' || b.status?.toUpperCase() === 'FAILED' || b.status?.toUpperCase() === 'DENY'));
      
      // Date filtering
      let matchDate = true;
      if (dateFrom || dateTo) {
        const bookDate = new Date(b.date);
        if (dateFrom) {
          const from = new Date(dateFrom);
          if (bookDate < from) matchDate = false;
        }
        if (dateTo) {
          const to = new Date(dateTo);
          to.setHours(23, 59, 59, 999);
          if (bookDate > to) matchDate = false;
        }
      }
      
      return matchSearch && matchStatus && matchDate;
    });
  }, [searchTerm, statusFilter, enrichedBookings, dateFrom, dateTo]);

  const handleExportExcel = () => {
    const dataToExport = filteredBookings.map(b => ({
      'ID Booking': b.bookingCode || b.id,
      'Pelanggan': b.user?.name || b.userId,
      'Paket': b.package?.name || b.packageId,
      'Tanggal': new Date(b.date).toLocaleDateString(),
      'Total Harga': b.totalPrice,
      'Status': (b.status?.toUpperCase() === 'SUCCESS' || b.status?.toUpperCase() === 'SETTLEMENT' || b.status?.toUpperCase() === 'CAPTURE' || b.status?.toUpperCase() === 'PAID') ? 'Sukses' : b.status?.toUpperCase() === 'PENDING' ? 'Pending' : 'Dibatalkan'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pemesanan");
    XLSX.writeFile(workbook, `Pemesanan_JelajahIn_${new Date().toLocaleDateString()}.xlsx`);
    setShowExportOptions(false);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Laporan Pemesanan JELAJAH.IN', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Dicetak pada: ${new Date().toLocaleString()}`, 14, 30);
    if (dateFrom || dateTo) {
      doc.text(`Periode: ${dateFrom || 'Awal'} s/d ${dateTo || 'Sekarang'}`, 14, 36);
    }

    const tableColumn = ["ID", "Pelanggan", "Paket", "Tanggal", "Total", "Status"];
    const tableRows = filteredBookings.map(b => [
      b.bookingCode || b.id,
      b.user?.name || b.userId,
      b.package?.name || b.packageId,
      new Date(b.date).toLocaleDateString(),
      b.totalPrice,
      (b.status?.toUpperCase() === 'SUCCESS' || b.status?.toUpperCase() === 'SETTLEMENT' || b.status?.toUpperCase() === 'CAPTURE' || b.status?.toUpperCase() === 'PAID') ? 'Sukses' : b.status?.toUpperCase() === 'PENDING' ? 'Pending' : 'Dibatalkan'
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] }
    });

    doc.save(`Pemesanan_JelajahIn_${new Date().toLocaleDateString()}.pdf`);
    setShowExportOptions(false);
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/booking/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ status: 'SUCCESS' })
      });

      if (!response.ok) throw new Error('Gagal memperbarui status booking');

      // Persist status update in local storage to prevent loss on browser refresh
      const localUpdates = JSON.parse(localStorage.getItem('booking_updates') || '{}');
      localUpdates[id] = { status: 'SUCCESS' };
      localStorage.setItem('booking_updates', JSON.stringify(localUpdates));

      setBookings(bookings.map(b => (b.id || b._id) === id ? { ...b, status: 'SUCCESS' } : b));
      if (selectedBooking && (selectedBooking.id || selectedBooking._id) === id) {
        setSelectedBooking({ ...selectedBooking, status: 'SUCCESS' });
      }
      setIsModalOpen(false);
      showFeedback('success', 'Status Diperbarui!', 'Pembayaran telah berhasil dikonfirmasi.');
    } catch (error) {
      console.error('Error updating booking:', error);
      showFeedback('error', 'Gagal!', error.message);
    }
  };

  const handleDelete = (booking) => {
    
  };

  const confirmDelete = async () => {
   
  };

  return (
    <div className="page-content">
      <div className="section-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800' }}>{t('booking')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Daftar pemesanan paket wisata JELAJAH.IN</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--card-bg)', padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <Calendar size={16} color="var(--primary)" />
            <input 
              type="date" 
              value={dateFrom} 
              onChange={(e) => setDateFrom(e.target.value)}
              style={{ border: 'none', background: 'none', fontSize: '13px', outline: 'none', color: 'var(--text-primary)' }}
            />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>sampai</span>
            <input 
              type="date" 
              value={dateTo} 
              onChange={(e) => setDateTo(e.target.value)}
              style={{ border: 'none', background: 'none', fontSize: '13px', outline: 'none', color: 'var(--text-primary)' }}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowExportOptions(!showExportOptions)}
            >
              <Download size={18} /> Ekspor <ChevronDown size={14} />
            </button>
            
            {showExportOptions && (
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                right: 0, 
                marginTop: '8px', 
                background: 'var(--card-bg)', 
                borderRadius: '12px', 
                boxShadow: 'var(--card-shadow)', 
                border: '1px solid var(--border-color)',
                zIndex: 1000,
                minWidth: '160px',
                overflow: 'hidden'
              }}>
                <button 
                  onClick={handleExportExcel}
                  style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', fontSize: '14px' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = 'var(--border-color)'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <Download size={16} color="#10b981" /> Excel (.xlsx)
                </button>
                <button 
                  onClick={handleExportPDF}
                  style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', fontSize: '14px' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = 'var(--border-color)'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <FileText size={16} color="#ef4444" /> PDF (.pdf)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="projects-section" style={{ padding: '0' }}>
        <BookingFilters 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          statusFilter={statusFilter} 
          setStatusFilter={setStatusFilter} 
        />

        <BookingTable 
          bookings={filteredBookings} 
          onView={handleViewDetails} 
          onDelete={handleDelete} 
          t={t} 
        />
      </div>

      <BookingDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        booking={selectedBooking} 
        onConfirmPayment={handleStatusChange} 
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

export default Bookings;



