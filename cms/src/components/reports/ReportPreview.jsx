import React from 'react';

const ReportPreview = ({ data, reportType, dateFrom, dateTo }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="projects-section printable-report" style={{ marginBottom: '24px', overflow: 'hidden' }}>
      <div style={{ padding: '20px', backgroundColor: 'rgba(99,102,241,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
        <span style={{ fontWeight: 700, fontSize: '16px' }}>Pratinjau Laporan: {reportType}</span>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Periode: {dateFrom} - {dateTo}</div>
      </div>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              {Object.keys(data[0]).filter(k => k !== 'id').map(key => (
                <th key={key}>{key === 'qty' ? 'Kuantitas' : key === 'trend' ? 'Tren' : key === 'reviews' ? 'Ulasan' : key === 'conversion' ? 'Konversi' : key === 'visitors' ? 'Pengunjung' : key === 'growth' ? 'Pertumbuhan' : key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {Object.entries(row).filter(([k]) => k !== 'id').map(([key, val], i) => (
                  <td key={i}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportPreview;
