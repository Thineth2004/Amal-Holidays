import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface StaffBooking {
  booking_id: number;
  booking_date: string;
  travel_date: string;
  no_of_travelers: number;
  status: string;
  tourist_name: string;
  tourist_email: string;
  package_title: string;
  total_price: number;
  driver_price?: number;
  guide_price?: number;
  assigned_date?: string;
  package_id?: number;
}


const formatCurrency = (v: number) => `Rs. ${v.toLocaleString()}`;

const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<StaffBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.user_id) return;
      
      try {
        setLoading(true);
        const endpoint = user.role === 'Guide' 
          ? `/api/tour-guides/${user.user_id}/bookings`
          : `/api/drivers/${user.user_id}/bookings`;
          
        const response = await api.get(endpoint);
        setBookings(Array.isArray(response.data) ? response.data : response.data.data || []);
      } catch (error: unknown) {
        toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch your assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const upcomingBookings = bookings.filter(b => new Date(b.travel_date) >= new Date());
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
  
  const totalEarnings = bookings.reduce((sum, b) => {
    if (user?.role === 'Guide') return sum + Number(b.guide_price || 0);
    if (user?.role === 'Driver') return sum + Number(b.driver_price || 0);
    return sum;
  }, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#0059bb] animate-spin" />
          </div>
          <p className="text-sm font-semibold text-[#717786] animate-pulse">Loading assignments…</p>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter(b => 
    b.package_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.tourist_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.booking_id.toString().includes(searchQuery)
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-transparent font-['Plus_Jakarta_Sans'] antialiased">
      <div className="px-8 pb-12 pt-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-headline-lg text-[#1b1c1c]">Welcome back, {user?.name}</h1>
            <p className="text-sm text-[#717786] mt-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                {user?.role === 'Guide' ? 'tour' : 'directions_car'}
              </span>
              {user?.role} Dashboard
            </p>
          </div>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm flex items-center gap-3">
             <span className="material-symbols-outlined text-[#0059bb]">calendar_today</span>
             <span className="text-sm font-bold text-[#1b1c1c]">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#0059bb14] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#0059bb]">assignment</span>
              </div>
              <span className="text-xs font-bold text-[#717786] uppercase tracking-wider">Total Assigned</span>
            </div>
            <div className="text-2xl font-extrabold text-[#1b1c1c]">{bookings.length}</div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600">event_upcoming</span>
              </div>
              <span className="text-xs font-bold text-[#717786] uppercase tracking-wider">Upcoming Tours</span>
            </div>
            <div className="text-2xl font-extrabold text-[#1b1c1c]">{upcomingBookings.length}</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
              </div>
              <span className="text-xs font-bold text-[#717786] uppercase tracking-wider">Confirmed</span>
            </div>
            <div className="text-2xl font-extrabold text-[#1b1c1c]">{confirmedBookings.length}</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-600">payments</span>
              </div>
              <span className="text-xs font-bold text-[#717786] uppercase tracking-wider">Total Earnings</span>
            </div>
            <div className="text-2xl font-extrabold text-[#1b1c1c]">{formatCurrency(totalEarnings)}</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="relative w-full sm:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-[20px]">search</span>
            <input
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-4 focus:ring-[#0059bb]/10 focus:border-[#0059bb] outline-none transition-all placeholder:text-slate-400"
              placeholder="Search by package, tourist, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-sm font-semibold text-[#717786]">
            Showing {filteredBookings.length} assignments
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-[11px] font-bold text-[#717786] uppercase tracking-widest">Tour Details</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#717786] uppercase tracking-widest">Tourist Info</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#717786] uppercase tracking-widest">Travel Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#717786] uppercase tracking-widest">Your Earning</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#717786] uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No assignments found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.booking_id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-[#1b1c1c] text-sm">{booking.package_title || `Package #${booking.package_id}`}</div>
                        <div className="text-xs text-[#717786] mt-1">Booking #{booking.booking_id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-[#1b1c1c] text-sm">{booking.tourist_name}</div>
                        <div className="text-xs text-[#717786] mt-0.5">{booking.tourist_email}</div>
                        <div className="text-xs font-semibold text-[#0059bb] mt-1">{booking.no_of_travelers} Travelers</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-slate-400">event</span>
                        <span className="text-sm font-semibold text-[#1b1c1c]">{new Date(booking.travel_date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-extrabold text-[#16a34a]">
                        {formatCurrency(Number((user?.role === 'Guide' ? booking.guide_price : booking.driver_price) || 0))}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-block px-3 py-1 border rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
