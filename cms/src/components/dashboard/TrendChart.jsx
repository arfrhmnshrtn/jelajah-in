import React from 'react';

const TrendChart = ({ t }) => {
  return (
    <div className="chart-container" style={{ padding: '20px' }}>
      <svg viewBox="0 0 400 150" width="100%" height="150" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="0" x2="400" y2="0" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="5,5" />
        <line x1="0" y1="50" x2="400" y2="50" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="5,5" />
        <line x1="0" y1="100" x2="400" y2="100" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="5,5" />
        <path d="M0,130 C40,120 60,140 100,100 C140,60 180,120 220,90 C260,60 300,40 340,60 C380,80 400,30 400,30 L400,150 L0,150 Z" fill="url(#chartGradient)" />
        <path d="M0,130 C40,120 60,140 100,100 C140,60 180,120 220,90 C260,60 300,40 340,60 C380,80 400,30 400,30" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="100" cy="100" r="4" fill="var(--card-bg)" stroke="var(--primary)" strokeWidth="2" />
        <circle cx="220" cy="90" r="4" fill="var(--card-bg)" stroke="var(--primary)" strokeWidth="2" />
        <circle cx="340" cy="60" r="4" fill="var(--card-bg)" stroke="var(--primary)" strokeWidth="2" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span><span>Jul</span>
      </div>
    </div>
  );
};

export default TrendChart;
