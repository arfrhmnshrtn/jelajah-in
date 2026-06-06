import React, { useMemo } from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const ActivitySection = ({ bookings = [], packages = [], t }) => {
  const activities = useMemo(() => {
    // Sort bookings by date descending (most recent first)
    const sorted = [...bookings]
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 4); // Show top 4 activities

    if (sorted.length === 0) {
      return [];
    }

    return sorted.map((b, index) => {
      const userName = b.user?.name || `Pelanggan #${String(b.userId || '').slice(-4)}`;
      const packageName = b.package?.name || 'Paket Wisata';
      const statusUpper = b.status?.toUpperCase();
      const isSuccess = statusUpper === 'SUCCESS' || statusUpper === 'SETTLEMENT' || statusUpper === 'CAPTURE' || statusUpper === 'PAID';
      const isCancelled = statusUpper === 'CANCELLED' || statusUpper === 'CANCEL' || statusUpper === 'EXPIRED' || statusUpper === 'FAILED' || statusUpper === 'DENY';

      let title = '';
      let type = 'warning';
      let icon = <Clock size={14} />;

      // Language check for bilingual rendering
      const isEn = t('dg_trend') === 'Trend Analysis';

      if (isSuccess) {
        title = isEn 
          ? `Payment Success: ${userName} - ${packageName}`
          : `Pembayaran Berhasil: ${userName} - ${packageName}`;
        type = 'success';
        icon = <CheckCircle2 size={14} />;
      } else if (isCancelled) {
        title = isEn
          ? `Booking Cancelled: ${userName} - ${packageName}`
          : `Booking Dibatalkan: ${userName} - ${packageName}`;
        type = 'danger';
        icon = <AlertCircle size={14} />;
      } else {
        title = isEn
          ? `Waiting Payment: ${userName} - ${packageName}`
          : `Menunggu Pembayaran: ${userName} - ${packageName}`;
        type = 'warning';
        icon = <Clock size={14} />;
      }

      // Calculate time difference
      const timeDiff = new Date() - new Date(b.date);
      let timeText = isEn ? 'Just now' : 'Baru saja';
      
      if (timeDiff > 0) {
        const minutes = Math.floor(timeDiff / (1000 * 60));
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (days > 0) {
          timeText = isEn ? `${days}d ago` : `${days} hari lalu`;
        } else if (hours > 0) {
          timeText = isEn ? `${hours}h ago` : `${hours} jam lalu`;
        } else if (minutes > 0) {
          timeText = isEn ? `${minutes}m ago` : `${minutes} menit lalu`;
        }
      } else {
        // Future booking date
        timeText = new Date(b.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      }

      return {
        id: b.id || b._id || index,
        title,
        time: timeText,
        type,
        icon
      };
    });
  }, [bookings, t]);

  return (
    <div className="projects-section" style={{ padding: '20px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>{t('dg_activity')}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {activities.length === 0 ? (
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '10px 0', textAlign: 'center' }}>
            {t('dg_trend') === 'Trend Analysis' ? 'No recent activity.' : 'Tidak ada riwayat aktivitas.'}
          </div>
        ) : (
          activities.map(act => (
            <div key={act.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '28px', 
                height: '28px', 
                borderRadius: '8px', 
                backgroundColor: act.type === 'success' ? 'rgba(16,185,129,0.1)' : act.type === 'warning' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                color: act.type === 'success' ? 'var(--success)' : act.type === 'warning' ? 'var(--warning)' : 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {act.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-word', lineHeight: '1.4' }}>{act.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{act.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivitySection;
