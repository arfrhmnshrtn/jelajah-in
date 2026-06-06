import React, { useMemo, useState } from 'react';

const TrendChart = ({ users = [], t }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const trendData = useMemo(() => {
    const monthsId = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const isEn = t('dg_trend') === 'Trend Analysis';
    const months = isEn ? monthsEn : monthsId;

    // Dimulai dari Bulan Mei 2026 ke depan
    const startYear = 2026;
    const startMonth = 4; // Mei (0-indexed dalam JavaScript Date)
    const last7Months = [];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(startYear, startMonth + i, 1);
      last7Months.push({
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        name: `${months[d.getMonth()]} ${d.getFullYear()}`,
        shortName: months[d.getMonth()],
        count: 0
      });
    }

    // Hitung jumlah pendaftaran pengguna berdasarkan createdAt / joinDate
    users.forEach(u => {
      const dateStr = u.createdAt || u.joinDate;
      if (!dateStr) return;
      const uDate = new Date(dateStr);
      const uMonth = uDate.getMonth();
      const uYear = uDate.getFullYear();
      
      const match = last7Months.find(m => m.monthIndex === uMonth && m.year === uYear);
      if (match) {
        match.count += 1;
      }
    });

    return last7Months;
  }, [users, t]);

  const maxVal = useMemo(() => {
    const max = Math.max(...trendData.map(d => d.count), 0);
    return max > 0 ? max : 5; // Default ke 5 jika semua nol agar garis grafik terlihat cantik
  }, [trendData]);

  // Kalkulasi koordinat titik SVG
  const points = useMemo(() => {
    return trendData.map((d, index) => {
      const x = (index / 6) * 400;
      // Map counts [0, maxVal] to [130, 20]
      const y = 130 - (d.count / maxVal) * 110;
      return { x, y };
    });
  }, [trendData, maxVal]);

  // Bentuk kurva spline bezier yang halus
  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const cpX1 = points[i - 1].x + 25;
      const cpY1 = points[i - 1].y;
      const cpX2 = points[i].x - 25;
      const cpY2 = points[i].y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
    }
    return d;
  }, [points]);

  const areaPathD = useMemo(() => {
    if (pathD === '') return '';
    return `${pathD} L 400 150 L 0 150 Z`;
  }, [pathD]);

  return (
    <div className="chart-container" style={{ padding: '20px', position: 'relative' }}>
      <svg viewBox="0 0 400 150" width="100%" height="150" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Garis Grid Penunjuk */}
        <line x1="0" y1="20" x2="400" y2="20" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="5,5" />
        <line x1="0" y1="75" x2="400" y2="75" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="5,5" />
        <line x1="0" y1="130" x2="400" y2="130" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="5,5" />
        
        {/* Isian Area Gradasi */}
        {areaPathD && <path d={areaPathD} fill="url(#chartGradient)" />}
        
        {/* Garis Kurva Utama */}
        {pathD && <path d={pathD} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />}
        
        {/* Titik Lingkaran Visual */}
        {points.map((p, idx) => (
          <circle 
            key={`vis-${idx}`} 
            cx={p.x} 
            cy={p.y} 
            r={hoveredIdx === idx ? "6" : "4"} 
            fill={hoveredIdx === idx ? "var(--primary)" : "var(--card-bg)"} 
            stroke="var(--primary)" 
            strokeWidth="2" 
            style={{ transition: 'all 0.15s ease' }}
          />
        ))}

        {/* Lingkaran Transparan untuk Area Hover yang Lebih Mudah Dihit-test */}
        {points.map((p, idx) => (
          <circle 
            key={`hit-${idx}`} 
            cx={p.x} 
            cy={p.y} 
            r="16" 
            fill="transparent" 
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          />
        ))}
      </svg>
      
      {/* Label Nama Bulan di Bawah Grafik */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
        {trendData.map((d, idx) => (
          <span key={idx}>{d.shortName}</span>
        ))}
      </div>

      {/* Tooltip Kursor yang Elegan */}
      {hoveredIdx !== null && (
        <div style={{
          position: 'absolute',
          left: `${(points[hoveredIdx].x / 400) * 100}%`,
          top: `${(points[hoveredIdx].y / 150) * 100}%`,
          transform: 'translate(-50%, -125%)',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          color: '#f8fafc',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 700,
          border: '1.5px solid var(--primary)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 100,
          animation: 'tooltipFadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{trendData[hoveredIdx].name}</div>
          <div style={{ color: 'var(--primary)', marginTop: '2px', fontSize: '13px' }}>{trendData[hoveredIdx].count} Pendaftar</div>
        </div>
      )}

      {/* Animasi Transisi Tooltip */}
      <style>{`
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: translate(-50%, -115%); }
          to { opacity: 1; transform: translate(-50%, -125%); }
        }
      `}</style>
    </div>
  );
};

export default TrendChart;
