import React, { useMemo } from 'react';
import { 
  CreditCard, 
  Ticket, 
  Users, 
  TrendingUp
} from 'lucide-react';
import TrendChart from './TrendChart';
import StatCard from './StatCard';
import RecentBookings from './RecentBookings';
import ActivitySection from './ActivitySection';
import { useAppContext } from '../../context/AppContext';

const Dashboard = () => {
  const { packages, setPackages, bookings, setBookings, users, t } = useAppContext();
  const todayStr = useMemo(() => new Date().toDateString(), []);

  // 1. Total Pemesanan
  const totalBookingValue = bookings.length;
  const newToday = useMemo(() => {
    return bookings.filter(b => b.date && new Date(b.date).toDateString() === todayStr).length;
  }, [bookings, todayStr]);
  const totalBookingSubtitle = `${newToday} ${t('dg_new_today')}`;

  // 2. Tiket Aktif
  const activeTickets = useMemo(() => {
    return bookings.filter(b => b.status?.toUpperCase() === 'SUCCESS' || b.status?.toUpperCase() === 'SETTLEMENT' || b.status?.toUpperCase() === 'CAPTURE' || b.status?.toUpperCase() === 'PAID');
  }, [bookings]);
  const activeTicketsValue = activeTickets.length;
  
  const departingToday = useMemo(() => {
    return activeTickets.filter(b => b.date && new Date(b.date).toDateString() === todayStr).length;
  }, [activeTickets, todayStr]);
  const activeTicketsSubtitle = `${departingToday} ${t('dg_departing_today')}`;

  // 3. Total Pendapatan
  const totalRevenue = useMemo(() => {
    return bookings
      .filter(b => b.status?.toUpperCase() === 'SUCCESS' || b.status?.toUpperCase() === 'SETTLEMENT' || b.status?.toUpperCase() === 'CAPTURE' || b.status?.toUpperCase() === 'PAID')
      .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);
  }, [bookings]);

  const formatRevenue = (value) => {
    if (value >= 1_000_000_000) {
      return `Rp ${(value / 1_000_000_000).toFixed(1).replace('.0', '')}M`; // Miliar
    }
    if (value >= 1_000_000) {
      return `Rp ${(value / 1_000_000).toFixed(1).replace('.0', '')}JT`; // Juta
    }
    if (value >= 1_000) {
      return `Rp ${(value / 1_000).toFixed(1).replace('.0', '')}RB`; // Ribu
    }
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  const totalRevenueValue = formatRevenue(totalRevenue);

  // Revenue MoM Trend Calculation
  const revenueTrendSubtitle = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const thisMonthRevenue = bookings
      .filter(b => {
        const s = b.status?.toUpperCase();
        const isSuccess = s === 'SUCCESS' || s === 'SETTLEMENT' || s === 'CAPTURE' || s === 'PAID';
        if (!isSuccess || !b.date) return false;
        const d = new Date(b.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

    const lastMonthRevenue = bookings
      .filter(b => {
        const s = b.status?.toUpperCase();
        const isSuccess = s === 'SUCCESS' || s === 'SETTLEMENT' || s === 'CAPTURE' || s === 'PAID';
        if (!isSuccess || !b.date) return false;
        const d = new Date(b.date);
        return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
      })
      .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

    if (lastMonthRevenue === 0) {
      return thisMonthRevenue > 0 ? `+100% ${t('dg_from_last_month')}` : `0% ${t('dg_from_last_month')}`;
    }

    const pctChange = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    const prefix = pctChange >= 0 ? '+' : '';
    return `${prefix}${pctChange.toFixed(1)}% ${t('dg_from_last_month')}`;
  }, [bookings, t]);

  // 4. Pengguna Aktif
  const activeUsersCount = users.length;
  const activeUsersValue = activeUsersCount >= 1000 ? `${(activeUsersCount / 1000).toFixed(1).replace('.0', '')}k` : activeUsersCount;

  // New users joined this month
  const newUsersThisMonth = useMemo(() => {
    const now = new Date();
    return users.filter(u => {
      const dateStr = u.createdAt || u.joinDate;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, [users]);

  const activeUsersSubtitle = `+${newUsersThisMonth} ${t('dg_this_month')}`;

  // Enrich bookings dynamically with User and Package references
  const enrichedBookings = useMemo(() => {
    return (bookings || []).map(b => {
      const user = users.find(u => String(u.id || u._id) === String(b.userId));
      const pkg = packages.find(p => String(p.id || p._id) === String(b.packageId));
      return {
        ...b,
        user: user || b.user,
        package: pkg || b.package
      };
    });
  }, [bookings, users, packages]);

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <div>
          <h1>{t('dashboard')}</h1>
          <p style={{ color: 'var(--primary)', fontSize: '15px', marginTop: '4px', fontWeight: '500' }}>{t('dg_welcome')}</p>
        </div>
      </div>

      <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '-40px', padding: '0 24px' }}>
        <StatCard 
          title={t('dg_total_booking')} 
          value={totalBookingValue} 
          subtitle={totalBookingSubtitle} 
          icon={CreditCard} 
          iconClass="purple" 
        />
        <StatCard 
          title={t('dg_active_ticket')} 
          value={activeTicketsValue} 
          subtitle={activeTicketsSubtitle} 
          icon={Ticket} 
          iconClass="blue" 
          subtitleColor="var(--primary)" 
        />
        <StatCard 
          title={t('dg_revenue')} 
          value={totalRevenueValue} 
          subtitle={revenueTrendSubtitle} 
          icon={TrendingUp} 
          iconClass="indigo" 
        />
        <StatCard 
          title={t('dg_active_user')} 
          value={activeUsersValue} 
          subtitle={activeUsersSubtitle} 
          icon={Users} 
          iconClass="indigo" 
        />
      </div>

      <div className="page-content" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <RecentBookings bookings={enrichedBookings} t={t} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="projects-section" style={{ padding: '20px' }}>
             <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>{t('dg_trend_users') || 'Tren Pendaftaran Pengguna'}</h3>
             <TrendChart users={users} t={t} />
          </div>

          <ActivitySection bookings={enrichedBookings} packages={packages} t={t} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
