import React from 'react';
import { Bell } from 'lucide-react';

const NotificationsTab = () => {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '32px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={20} />
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Notification Preferences</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', padding: '40px', border: '2px dashed var(--border-color)', borderRadius: '24px' }}>
        <Bell size={48} style={{ color: 'var(--text-secondary)', opacity: 0.2, marginBottom: '16px' }} />
        <div style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Tidak ada preferensi notifikasi yang tersedia saat ini.</div>
      </div>
    </>
  );
};

export default NotificationsTab;
