import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
  ComposedChart, Line,
} from 'recharts';
import html2pdf from 'html2pdf.js';

// ─── Interfaces ────────────────────────────────────────────────
interface Booking {
  booking_id: number;
  booking_date: string;
  travel_date: string;
  no_of_travelers: number;
  status: string;
  tourist_id: number;
  package_id: number;
  total_price: number;
  package_price?: number;
  hotel_price?: number;
  hotel_rooms_count?: number;
  driver_price?: number;
  guide_price?: number;
}

interface Payment {
  payment_id: number;
  amount: number;
  payment_date: string;
  method: string;
  status: string;
  booking_id: number;
}

interface User {
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  created_at: string;
}

interface Hotel {
  hotel_id: number;
  name: string;
  location: string;
  rating: number;
  price_per_night: number;
}

interface Package {
  package_id: number;
  title: string;
  price: number;
  available_slots: number;
  capacity: number;
  start_date: string;
  end_date: string;
}

interface Destination {
  destination_id: number;
  name: string;
  location: string;
}

interface Inquiry {
  inquiry_id: number;
  name: string;
  subject: string;
  status: 'Pending' | 'Reviewed';
  created_at: string;
}

// ─── Color Palette ─────────────────────────────────────────────
const COLORS = {
  primary: '#0059bb',
  primaryLight: '#d8e2ff',
  secondary: '#b52330',
  tertiary: '#8d4b00',
  success: '#16a34a',
  warning: '#f59e0b',
  error: '#ba1a1a',
  surface: '#fcf9f8',
  outline: '#717786',
  onBg: '#1b1c1c',
};

const CHART_COLORS = ['#0059bb', '#b52330', '#8d4b00', '#16a34a', '#7c3aed', '#0891b2'];
const STATUS_PIE = ['#f59e0b', '#16a34a', '#ef4444'];

// ─── Helpers ───────────────────────────────────────────────────
const normalize = (data: unknown): unknown[] =>
  Array.isArray(data) ? data : (data as { data?: unknown[] })?.data ?? [];

const monthName = (m: number) =>
  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m];

const formatCurrency = (v: number) => `Rs. ${v.toLocaleString()}`;

// ─── Stat Card ─────────────────────────────────────────────────
const StatCard: React.FC<{
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  trend?: { value: string; up: boolean } | null;
}> = ({ icon, label, value, sub, color = COLORS.primary, trend }) => (
  <div className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5">
    <div className="flex items-start justify-between mb-3">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${color}14` }}
      >
        <span className="material-symbols-outlined text-[22px]" style={{ color }}>
          {icon}
        </span>
      </div>
      {trend && (
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${
            trend.up ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">
            {trend.up ? 'trending_up' : 'trending_down'}
          </span>
          {trend.value}
        </span>
      )}
    </div>
    <div className="text-2xl font-extrabold text-[#1b1c1c] tracking-tight">{value}</div>
    <div className="text-xs font-bold text-[#717786] uppercase tracking-wider mt-1">{label}</div>
    {sub && <div className="text-[11px] text-[#717786] mt-1.5">{sub}</div>}
  </div>
);

// ─── Chart Card ────────────────────────────────────────────────
const ChartCard: React.FC<{
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden ${className}`}>
    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <span className="material-symbols-outlined text-[20px] text-[#0059bb]">{icon}</span>
      <h3 className="text-sm font-bold text-[#1b1c1c] tracking-tight">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ─── Custom Tooltip ────────────────────────────────────────────
const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs font-bold text-[#717786] uppercase tracking-wider mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-[#717786] capitalize">{p.name}:</span>
          <span className="font-bold text-[#1b1c1c]">
            {p.name.toLowerCase().includes('revenue') || p.name.toLowerCase().includes('amount')
              ? formatCurrency(p.value)
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Close export dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Fetch all data ──────────────────────────────────────────
  const fetchDashboardData = useCallback(async (mountedObj: { current: boolean }) => {
    try {
      const [bRes, pRes, uRes, hRes, pkRes, dRes, iRes] = await Promise.allSettled([
        api.get('/api/bookings'),
        api.get('/api/payments'),
        api.get('/api/auth/users/all'),
        api.get('/api/hotels'),
        api.get('/api/packages/all'),
        api.get('/api/destinations'),
        api.get('/api/inquiries'),
      ]);

      if (!mountedObj.current) return;

      if (bRes.status === 'fulfilled') setBookings(normalize(bRes.value.data) as Booking[]);
      if (pRes.status === 'fulfilled') setPayments(normalize(pRes.value.data) as Payment[]);
      if (uRes.status === 'fulfilled') setUsers(normalize(uRes.value.data) as User[]);
      if (hRes.status === 'fulfilled') setHotels(normalize(hRes.value.data) as Hotel[]);
      if (pkRes.status === 'fulfilled') setPackages(normalize(pkRes.value.data) as Package[]);
      if (dRes.status === 'fulfilled') setDestinations(normalize(dRes.value.data) as Destination[]);
      if (iRes.status === 'fulfilled') setInquiries(normalize(iRes.value.data) as Inquiry[]);
    } catch {
      if (mountedObj.current) toast.error('Failed to load dashboard data');
    }
  }, []);

  useEffect(() => {
    const mountedObj = { current: true };
    const load = async () => {
      await fetchDashboardData(mountedObj);
      if (mountedObj.current) setLoading(false);
    };
    load();
    return () => { mountedObj.current = false; };
  }, [fetchDashboardData]);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchDashboardData({ current: true });
    setLoading(false);
  };

  // ── Computed Stats ──────────────────────────────────────────
  const totalRevenue = payments
    .filter((p) => p.status === 'Completed')
    .reduce((s, p) => s + Number(p.amount), 0);

  const pendingRevenue = payments
    .filter((p) => p.status === 'Pending')
    .reduce((s, p) => s + Number(p.amount), 0);

  const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed').length;
  const pendingBookings = bookings.filter((b) => b.status === 'Pending').length;
  const cancelledBookings = bookings.filter((b) => b.status === 'Cancelled').length;

  const activeUsers = users.filter((u) => u.status === 'Active').length;
  const pendingInquiries = inquiries.filter((i) => i.status === 'Pending').length;

  const avgBookingValue = bookings.length
    ? bookings.reduce((s, b) => s + Number(b.total_price), 0) / bookings.length
    : 0;

  // ── Chart Data ──────────────────────────────────────────────

  // Revenue by month (area chart)
  const revenueByMonth = (() => {
    const map: Record<string, number> = {};
    payments
      .filter((p) => p.status === 'Completed')
      .forEach((p) => {
        const d = new Date(p.payment_date);
        const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
        map[key] = (map[key] || 0) + Number(p.amount);
      });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, revenue]) => {
        const [y, m] = key.split('-');
        return { month: `${monthName(Number(m))} ${y}`, revenue };
      });
  })();

  // Booking status (donut)
  const bookingStatusData = [
    { name: 'Pending', value: pendingBookings },
    { name: 'Confirmed', value: confirmedBookings },
    { name: 'Cancelled', value: cancelledBookings },
  ].filter((d) => d.value > 0);

  // Users by role (bar)
  const usersByRole = (() => {
    const map: Record<string, number> = {};
    users.forEach((u) => { map[u.role] = (map[u.role] || 0) + 1; });
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .map(([role, count]) => ({ role, count }));
  })();

  // Payment methods (pie)
  const paymentMethods = (() => {
    const map: Record<string, number> = {};
    payments.forEach((p) => { map[p.method] = (map[p.method] || 0) + 1; });
    return Object.entries(map).map(([method, count]) => ({ name: method, value: count }));
  })();

  // Monthly bookings vs revenue (composed)
  const monthlyComparison = (() => {
    const bMap: Record<string, number> = {};
    const rMap: Record<string, number> = {};
    bookings.forEach((b) => {
      const d = new Date(b.booking_date);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
      bMap[key] = (bMap[key] || 0) + 1;
    });
    payments
      .filter((p) => p.status === 'Completed')
      .forEach((p) => {
        const d = new Date(p.payment_date);
        const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
        rMap[key] = (rMap[key] || 0) + Number(p.amount);
      });
    const allKeys = [...new Set([...Object.keys(bMap), ...Object.keys(rMap)])].sort();
    return allKeys.map((key) => {
      const [y, m] = key.split('-');
      return {
        month: `${monthName(Number(m))} ${y}`,
        bookings: bMap[key] || 0,
        revenue: rMap[key] || 0,
      };
    });
  })();

  // Inquiry status (donut)
  const inquiryStatusData = [
    { name: 'Pending', value: inquiries.filter((i) => i.status === 'Pending').length },
    { name: 'Reviewed', value: inquiries.filter((i) => i.status === 'Reviewed').length },
  ].filter((d) => d.value > 0);

  // Top packages by booking count
  const topPackages = (() => {
    const map: Record<number, number> = {};
    bookings.forEach((b) => { map[b.package_id] = (map[b.package_id] || 0) + 1; });
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([pkgId, count]) => {
        const pkg = packages.find((p) => p.package_id === Number(pkgId));
        return { name: pkg?.title || `Package #${pkgId}`, bookings: count, price: pkg?.price || 0 };
      });
  })();

  // ── Export Functions ────────────────────────────────────────
  const exportCSV = () => {
    const rows: string[][] = [];
    rows.push(['AMAL HOLIDAYS — DASHBOARD REPORT']);
    rows.push([`Generated: ${new Date().toLocaleString()}`]);
    rows.push([]);

    rows.push(['=== KEY METRICS ===']);
    rows.push(['Metric', 'Value']);
    rows.push(['Total Revenue', totalRevenue.toString()]);
    rows.push(['Pending Revenue', pendingRevenue.toString()]);
    rows.push(['Total Bookings', bookings.length.toString()]);
    rows.push(['Confirmed Bookings', confirmedBookings.toString()]);
    rows.push(['Pending Bookings', pendingBookings.toString()]);
    rows.push(['Cancelled Bookings', cancelledBookings.toString()]);
    rows.push(['Active Users', activeUsers.toString()]);
    rows.push(['Total Users', users.length.toString()]);
    rows.push(['Total Packages', packages.length.toString()]);
    rows.push(['Total Hotels', hotels.length.toString()]);
    rows.push(['Total Destinations', destinations.length.toString()]);
    rows.push(['Pending Inquiries', pendingInquiries.toString()]);
    rows.push(['Total Inquiries', inquiries.length.toString()]);
    rows.push(['Average Booking Value', avgBookingValue.toFixed(2)]);
    rows.push([]);

    rows.push(['=== REVENUE BY MONTH ===']);
    rows.push(['Month', 'Revenue']);
    revenueByMonth.forEach((r) => rows.push([r.month, r.revenue.toString()]));
    rows.push([]);

    rows.push(['=== USERS BY ROLE ===']);
    rows.push(['Role', 'Count']);
    usersByRole.forEach((u) => rows.push([u.role, u.count.toString()]));
    rows.push([]);

    rows.push(['=== PAYMENT METHODS ===']);
    rows.push(['Method', 'Count']);
    paymentMethods.forEach((m) => rows.push([m.name, m.value.toString()]));
    rows.push([]);

    rows.push(['=== TOP PACKAGES ===']);
    rows.push(['Package', 'Bookings', 'Price']);
    topPackages.forEach((p) => rows.push([p.name, p.bookings.toString(), p.price.toString()]));
    rows.push([]);

    rows.push(['=== ALL BOOKINGS ===']);
    rows.push(['Booking ID', 'Booking Date', 'Travel Date', 'Travelers', 'Status', 'Total Price', 'Package ID', 'Tourist ID']);
    bookings.forEach((b) =>
      rows.push([
        b.booking_id.toString(), b.booking_date, b.travel_date,
        b.no_of_travelers.toString(), b.status, b.total_price.toString(),
        b.package_id.toString(), b.tourist_id.toString(),
      ])
    );
    rows.push([]);

    rows.push(['=== ALL PAYMENTS ===']);
    rows.push(['Payment ID', 'Amount', 'Date', 'Method', 'Status', 'Booking ID']);
    payments.forEach((p) =>
      rows.push([
        p.payment_id.toString(), p.amount.toString(), p.payment_date,
        p.method, p.status, p.booking_id.toString(),
      ])
    );
    rows.push([]);

    rows.push(['=== ALL USERS ===']);
    rows.push(['User ID', 'Name', 'Email', 'Role', 'Status', 'Created At']);
    users.forEach((u) =>
      rows.push([
        u.user_id.toString(), u.name, u.email, u.role, u.status, u.created_at,
      ])
    );

    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amal-holidays-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV report downloaded!');
    setExportOpen(false);
  };

  const exportPDF = () => {
    setExportOpen(false);
    const element = document.getElementById('dashboard-print-area');
    if (!element) return;
    
    const printHidden = element.querySelectorAll('.print\\:hidden');
    printHidden.forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });

    const opt = {
      margin:       0.2,
      filename:     `amal-holidays-dashboard-${new Date().toISOString().slice(0, 10)}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a3', orientation: 'landscape' as const }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      printHidden.forEach((el) => {
        (el as HTMLElement).style.display = '';
      });
      toast.success('PDF report downloaded!');
    });
  };

  // ── Loading State ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#0059bb] animate-spin" />
          </div>
          <p className="text-sm font-semibold text-[#717786] animate-pulse">Loading analytics…</p>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div id="dashboard-print-area" className="flex-1 flex flex-col min-w-0 bg-transparent font-['Plus_Jakarta_Sans'] antialiased">
      <div className="px-8 pb-12 pt-4">
        {/* ─── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-headline-lg text-[#1b1c1c]">Dashboard</h1>
            <p className="text-sm text-[#717786] mt-1">
              Welcome back — here's your business overview
            </p>
          </div>
          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-[#717786] hover:border-[#0059bb] hover:text-[#0059bb] transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Refresh
            </button>
            <div className="relative" ref={exportRef}>
              <button
                onClick={() => setExportOpen(!exportOpen)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0059bb] rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:bg-[#004a9e] transition-all duration-200"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
              {exportOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-md shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={exportCSV}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#1b1c1c] hover:bg-slate-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px] text-green-600">table_chart</span>
                    Export as CSV
                  </button>
                  <div className="border-t border-slate-100" />
                  <button
                    onClick={exportPDF}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#1b1c1c] hover:bg-slate-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px] text-red-500">picture_as_pdf</span>
                    Print / Save PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── KPI Stat Cards ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon="account_balance"
            label="Total Revenue"
            value={formatCurrency(totalRevenue)}
            sub={`${formatCurrency(pendingRevenue)} pending`}
            color={COLORS.success}
            trend={null}
          />
          <StatCard
            icon="event_available"
            label="Total Bookings"
            value={bookings.length}
            sub={`${confirmedBookings} confirmed · ${pendingBookings} pending`}
            color={COLORS.primary}
          />
          <StatCard
            icon="group"
            label="Active Users"
            value={activeUsers}
            sub={`${users.length} total users`}
            color="#7c3aed"
          />
          <StatCard
            icon="inventory_2"
            label="Packages"
            value={packages.length}
            sub={`${packages.reduce((s, p) => s + p.available_slots, 0)} slots available`}
            color={COLORS.tertiary}
          />
          <StatCard
            icon="hotel"
            label="Hotels"
            value={hotels.length}
            sub={hotels.length ? `Avg rating: ${(hotels.reduce((s, h) => s + h.rating, 0) / hotels.length).toFixed(1)}★` : 'No hotels'}
            color="#0891b2"
          />
          <StatCard
            icon="explore"
            label="Destinations"
            value={destinations.length}
            color="#059669"
          />
          <StatCard
            icon="contact_support"
            label="Pending Inquiries"
            value={pendingInquiries}
            sub={`${inquiries.length} total inquiries`}
            color={pendingInquiries > 0 ? COLORS.warning : COLORS.success}
          />
          <StatCard
            icon="paid"
            label="Avg Booking Value"
            value={formatCurrency(Math.round(avgBookingValue))}
            color={COLORS.primary}
          />
        </div>

        {/* ─── Charts Row 1 ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <ChartCard title="Revenue Trend" icon="trending_up" className="lg:col-span-2">
            {revenueByMonth.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: COLORS.outline }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.outline }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke={COLORS.primary} strokeWidth={2.5} fill="url(#revenueGradient)" name="Revenue" dot={{ r: 4, fill: COLORS.primary, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-sm text-[#717786]">
                No revenue data available
              </div>
            )}
          </ChartCard>

          <ChartCard title="Booking Status" icon="donut_large">
            {bookingStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {bookingStatusData.map((_, i) => (
                      <Cell key={i} fill={STATUS_PIE[i % STATUS_PIE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: unknown, name: unknown) => [`${value} bookings`, `${name}`]}
                    contentStyle={{
                      background: 'rgba(255,255,255,0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '13px',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={10}
                    formatter={(value: string) => (
                      <span className="text-xs font-semibold text-[#414754]">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-sm text-[#717786]">
                No bookings data
              </div>
            )}
          </ChartCard>
        </div>

        {/* ─── Charts Row 2 ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Users by Role" icon="groups">
            {usersByRole.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usersByRole} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: COLORS.outline }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="role" tick={{ fontSize: 12, fill: COLORS.onBg, fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Users" radius={[0, 8, 8, 0]} barSize={28}>
                    {usersByRole.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-sm text-[#717786]">
                No user data
              </div>
            )}
          </ChartCard>

          <ChartCard title="Payment Methods" icon="credit_card">
            {paymentMethods.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {paymentMethods.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: unknown, name: unknown) => [`${value} payments`, `${name}`]}
                    contentStyle={{
                      background: 'rgba(255,255,255,0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '13px',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={10}
                    formatter={(value: string) => (
                      <span className="text-xs font-semibold text-[#414754]">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-sm text-[#717786]">
                No payment data
              </div>
            )}
          </ChartCard>
        </div>

        {/* ─── Charts Row 3 ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <ChartCard title="Monthly Bookings vs Revenue" icon="bar_chart" className="lg:col-span-2">
            {monthlyComparison.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={monthlyComparison} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: COLORS.outline }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: COLORS.outline }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: COLORS.outline }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar yAxisId="left" dataKey="bookings" name="Bookings" fill={COLORS.primaryLight} radius={[6, 6, 0, 0]} barSize={32} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke={COLORS.secondary} strokeWidth={2.5} dot={{ r: 4, fill: COLORS.secondary, strokeWidth: 2, stroke: '#fff' }} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-sm text-[#717786]">
                No comparison data
              </div>
            )}
          </ChartCard>

          <ChartCard title="Inquiry Status" icon="help_center">
            {inquiryStatusData.length > 0 ? (
              <div>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={inquiryStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill={COLORS.warning} />
                      <Cell fill={COLORS.success} />
                    </Pie>
                    <Tooltip
                      formatter={(value: unknown, name: unknown) => [`${value}`, `${name}`]}
                      contentStyle={{
                        background: 'rgba(255,255,255,0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '13px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-2">
                  {inquiryStatusData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: i === 0 ? COLORS.warning : COLORS.success }} />
                      <span className="text-xs font-semibold text-[#414754]">{d.name}: {d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-sm text-[#717786]">
                No inquiry data
              </div>
            )}
          </ChartCard>
        </div>

        {/* ─── Recent Activity Tables ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Bookings */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-[#0059bb]">event_available</span>
                <h3 className="text-sm font-bold text-[#1b1c1c] tracking-tight">Recent Bookings</h3>
              </div>
              <span className="text-xs text-[#717786] font-semibold">Last {Math.min(5, bookings.length)}</span>
            </div>
            <div className="divide-y divide-slate-100">
              {bookings
                .sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime())
                .slice(0, 5)
                .map((b) => (
                  <div key={b.booking_id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors">
                    <div>
                      <div className="text-sm font-bold text-[#1b1c1c]">Booking #{b.booking_id}</div>
                      <div className="text-xs text-[#717786] mt-0.5">
                        {new Date(b.booking_date).toLocaleDateString()} · {b.no_of_travelers} traveler{b.no_of_travelers > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[#0059bb]">{formatCurrency(Number(b.total_price))}</span>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === 'Confirmed'
                            ? 'bg-green-100 text-green-700'
                            : b.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              {bookings.length === 0 && (
                <div className="px-6 py-8 text-center text-sm text-[#717786]">No bookings yet</div>
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-[#0059bb]">payments</span>
                <h3 className="text-sm font-bold text-[#1b1c1c] tracking-tight">Recent Payments</h3>
              </div>
              <span className="text-xs text-[#717786] font-semibold">Last {Math.min(5, payments.length)}</span>
            </div>
            <div className="divide-y divide-slate-100">
              {payments
                .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
                .slice(0, 5)
                .map((p) => (
                  <div key={p.payment_id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors">
                    <div>
                      <div className="text-sm font-bold text-[#1b1c1c]">Payment #{p.payment_id}</div>
                      <div className="text-xs text-[#717786] mt-0.5">
                        {new Date(p.payment_date).toLocaleDateString()} · {p.method}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[#0059bb]">{formatCurrency(Number(p.amount))}</span>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : p.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              {payments.length === 0 && (
                <div className="px-6 py-8 text-center text-sm text-[#717786]">No payments yet</div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Top Performing ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Packages */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-[#0059bb]">workspace_premium</span>
              <h3 className="text-sm font-bold text-[#1b1c1c] tracking-tight">Top Packages by Bookings</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {topPackages.map((p, i) => (
                <div key={p.name} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold text-white ${
                      i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-700' : 'bg-slate-300'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="text-sm font-bold text-[#1b1c1c] truncate">{p.name}</div>
                    <div className="text-xs text-[#717786]">{formatCurrency(p.price)} per person</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-[#0059bb]">{p.bookings}</div>
                    <div className="text-[10px] text-[#717786] uppercase font-bold tracking-wider">bookings</div>
                  </div>
                </div>
              ))}
              {topPackages.length === 0 && (
                <div className="px-6 py-8 text-center text-sm text-[#717786]">No booking data for packages</div>
              )}
            </div>
          </div>

          {/* Hotel Ratings */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-[#0059bb]">star</span>
              <h3 className="text-sm font-bold text-[#1b1c1c] tracking-tight">Hotel Ratings</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {[...hotels]
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5)
                .map((h) => (
                  <div key={h.hotel_id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-[#0059bb14] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px] text-[#0059bb]">hotel</span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="text-sm font-bold text-[#1b1c1c] truncate">{h.name}</div>
                      <div className="text-xs text-[#717786]">{h.location}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className="material-symbols-outlined text-[16px]"
                            style={{ color: star <= h.rating ? '#f59e0b' : '#e2e8f0' }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-[#717786] ml-1">{h.rating}</span>
                    </div>
                  </div>
                ))}
              {hotels.length === 0 && (
                <div className="px-6 py-8 text-center text-sm text-[#717786]">No hotels data</div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Footer ──────────────────────────────────────────── */}
        <div className="mt-8 text-center text-xs text-[#717786] print:mt-4">
          <p>Amal Holidays Admin Dashboard · Data refreshed at {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
