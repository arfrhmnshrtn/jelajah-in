import React, { useState } from 'react';
import { 
  CreditCard, 
  Ticket, 
  Users, 
  TrendingUp, 
  Plus
} from 'lucide-react';
import TrendChart from './dashboard/TrendChart';
import StatCard from './dashboard/StatCard';
import RecentBookings from './dashboard/RecentBookings';
import ActivitySection from './dashboard/ActivitySection';
import AddPackageModal from './dashboard/AddPackageModal';

const Dashboard = ({ packages, setPackages, bookings, setBookings, t }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddPackage = (newPkg) => {
    const id = packages.length + 1;
    setPackages([...packages, { id, ...newPkg }]);
    setIsAddModalOpen(false);
    alert('Paket berhasil ditambahkan!');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <div>
          <h1>{t('dg_summary')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>{t('dg_welcome')}</p>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button className="btn-primary" onClick={() => setIsAddModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={18} /> {t('dg_add_pkg')}
            </button>
          </div>
        </div>
      </div>

      <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '-40px', padding: '0 24px' }}>
        <StatCard 
          title={t('dg_total_booking')} 
          value="482" 
          subtitle="12 New today" 
          icon={CreditCard} 
          iconClass="purple" 
        />
        <StatCard 
          title={t('dg_active_ticket')} 
          value="56" 
          subtitle="Departing today" 
          icon={Ticket} 
          iconClass="blue" 
          subtitleColor="var(--primary)" 
        />
        <StatCard 
          title={t('dg_revenue')} 
          value="Rp 127M" 
          subtitle="+15.4% from last mo" 
          icon={TrendingUp} 
          iconClass="indigo" 
        />
        <StatCard 
          title={t('dg_active_user')} 
          value="2.4k" 
          subtitle="+240 this mo" 
          icon={Users} 
          iconClass="indigo" 
        />
      </div>

      <div className="page-content" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <RecentBookings bookings={bookings} t={t} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="projects-section" style={{ padding: '20px' }}>
             <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>{t('dg_trend')}</h3>
             <TrendChart t={t} />
          </div>

          <ActivitySection bookings={bookings} packages={packages} t={t} />
        </div>
      </div>

      <AddPackageModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddPackage} 
        t={t} 
      />
    </div>
  );
};

export default Dashboard;

