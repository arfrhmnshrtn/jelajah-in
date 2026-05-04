import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const ActivitySection = ({ bookings, packages, t }) => {
  const activities = [
    { id: 1, title: `${t('dg_new_booking')}: ${bookings[0]?.pelanggan || 'User'}`, time: '2 min ago', type: 'success', icon: <CheckCircle2 size={14} /> },
    { id: 2, title: `Waiting payment: ${bookings[1]?.pelanggan || 'User'}`, time: '1 hr ago', type: 'warning', icon: <Clock size={14} /> },
    { id: 3, title: `Package updated: ${packages[0]?.name || 'Package'}`, time: '3 hrs ago', type: 'success', icon: <CheckCircle2 size={14} /> },
    { id: 4, title: 'Refund Booking: TRX-9821', time: '5 hrs ago', type: 'danger', icon: <AlertCircle size={14} /> },
  ];

  return (
    <div className="projects-section" style={{ padding: '20px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>{t('dg_activity')}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {activities.map(act => (
          <div key={act.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '8px', 
              backgroundColor: act.type === 'success' ? 'rgba(16,185,129,0.1)' : act.type === 'warning' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
              color: act.type === 'success' ? 'var(--success)' : act.type === 'warning' ? 'var(--warning)' : 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {act.icon}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{act.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{act.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitySection;
