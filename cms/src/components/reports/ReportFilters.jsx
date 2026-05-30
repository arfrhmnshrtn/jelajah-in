import React from 'react';
import { Calendar, TrendingUp } from 'lucide-react';

const ReportFilters = ({ dateFrom, setDateFrom, dateTo, setDateTo, reportType, setReportType, onGenerate, showPreview }) => {
  return (
    <div className="report-filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '24px', backgroundColor: 'var(--card-bg)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
      <div className="filter-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
          <Calendar size={14} /> Dari Tanggal
        </label>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
      </div>
      <div className="filter-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
          <Calendar size={14} /> Sampai Tanggal
        </label>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
      </div>
      <div className="filter-group" style={{ marginLeft: 'auto' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Tipe Laporan</label>
        <select 
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', minWidth: '220px' }}
        >
          <option>Ringkasan Penjualan</option>
          <option>Performa Produk</option>
          <option>Demografi Pengunjung</option>
        </select>
      </div>
      <button className="btn btn-primary" onClick={onGenerate} style={{ marginTop: 'auto', height: '44px' }}>
        <TrendingUp size={18} /> {showPreview ? 'Sembunyikan Pratinjau' : 'Tampilkan Pratinjau'}
      </button>
    </div>
  );
};

export default ReportFilters;
