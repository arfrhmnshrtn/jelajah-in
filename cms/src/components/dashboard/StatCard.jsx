import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, iconClass, subtitleColor }) => {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="stat-title">{title}</div>
          <div className="stat-value">{value}</div>
          <div className="stat-subtitle" style={subtitleColor ? { color: subtitleColor } : {}}>{subtitle}</div>
        </div>
        <div className={`stat-icon ${iconClass}`}><Icon size={20} /></div>
      </div>
    </div>
  );
};

export default StatCard;
