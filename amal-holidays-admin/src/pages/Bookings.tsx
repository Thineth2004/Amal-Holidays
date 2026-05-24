import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

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

interface BookingsProps {
  filterType?: 'package' | 'destination' | 'hotel' | 'driver' | 'guide';
  filterId?: number;
  onClose?: () => void;
}

const Bookings: React.FC<BookingsProps> = ({ filterType, filterId, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [breakdownBooking, setBreakdownBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        let url = '/api/bookings';
        
        // If filtering by package, destination, hotel, driver or guide
        if (filterType && filterId) {
          if (filterType === 'hotel') {
            url = `/api/hotels/${filterId}/bookings`;
          } else if (filterType === 'driver') {
            url = `/api/drivers/${filterId}/bookings`;
          } else if (filterType === 'guide') {
            url = `/api/tour-guides/${filterId}/bookings`;
          } else {
            url += `?${filterType}Id=${filterId}`;
          }
        }
        
        const response = await api.get(url);
        setBookings(Array.isArray(response.data) ? response.data : response.data.data);
      } catch (error: unknown) {
        toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [filterType, filterId]);

  const executeDeleteBooking = async () => {
    if (confirmDeleteId === null) return;

    try {
      setDeletingId(confirmDeleteId);
      await api.delete(`/api/bookings/${confirmDeleteId}`);
      setBookings(bookings.filter((booking) => booking.booking_id !== confirmDeleteId));
      toast.success('Booking deleted successfully. You can now delete the related package/destination.');
    } catch (error: unknown) {
      toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to delete booking');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const calculatePackageTotal = (b: Booking) => b.package_price ? b.package_price * b.no_of_travelers : 0;
  const calculateHotelTotal = (b: Booking) => b.hotel_price ? b.hotel_price * (b.hotel_rooms_count || 1) : 0;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-transparent font-['Plus_Jakarta_Sans'] antialiased relative">
      <ConfirmDeleteModal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={executeDeleteBooking}
        title="Delete Booking"
        message={`Are you sure you want to delete booking #${confirmDeleteId}? This action cannot be undone.`}
      />
      
      {/* Price Breakdown Modal */}
      {breakdownBooking && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-[#1b1c1c]">Price Breakdown</h3>
              <button
                onClick={() => setBreakdownBooking(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#717786]">Package ({breakdownBooking.no_of_travelers} pax)</span>
                <span className="font-bold text-[#1b1c1c]">
                  Rs. {calculatePackageTotal(breakdownBooking).toLocaleString()}
                </span>
              </div>
              
              {breakdownBooking.hotel_price && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#717786]">Hotel ({breakdownBooking.hotel_rooms_count || 1} rooms)</span>
                  <span className="font-bold text-[#1b1c1c]">
                    Rs. {calculateHotelTotal(breakdownBooking).toLocaleString()}
                  </span>
                </div>
              )}
              
              {breakdownBooking.driver_price && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#717786]">Driver</span>
                  <span className="font-bold text-[#1b1c1c]">
                    Rs. {Number(breakdownBooking.driver_price).toLocaleString()}
                  </span>
                </div>
              )}
              
              {breakdownBooking.guide_price && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#717786]">Tour Guide</span>
                  <span className="font-bold text-[#1b1c1c]">
                    Rs. {Number(breakdownBooking.guide_price).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="font-extrabold text-[#1b1c1c]">Total</span>
                <span className="font-extrabold text-[#0059bb] text-lg">
                  Rs. {Number(breakdownBooking.total_price).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-8 pb-12 pt-4">
        {/* Control Bar */}
        <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-4 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex-1 flex flex-col lg:flex-row items-center gap-4 w-full">
            <div className="relative w-full lg:w-96">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-[20px]">search</span>
              <input
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-4 focus:ring-[#0059bb]/10 focus:border-[#0059bb] outline-none transition-all placeholder:text-slate-400"
                placeholder="Search by booking ID or tourist..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {filterType && filterId && (
              <div className="px-4 py-2 bg-blue-100 border border-blue-300 rounded-lg text-sm font-semibold text-blue-800">
                Filtering by {filterType.charAt(0).toUpperCase() + filterType.slice(1)} ID: {filterId}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-bold text-[#717786] uppercase tracking-wider whitespace-nowrap">
              Total Bookings: {bookings.length}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Management Table */}
        <div className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest">Booking Details</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest">Travelers</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest">Total Price</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0059bb]"></div>
                      Loading bookings...
                    </div>
                  </td>
                </tr>
              ) : bookings.filter(b => 
                b.booking_id.toString().includes(searchQuery) || 
                b.tourist_id.toString().includes(searchQuery)
              ).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.filter(b => 
                  b.booking_id.toString().includes(searchQuery) || 
                  b.tourist_id.toString().includes(searchQuery)
                ).map((booking) => (
                  <tr key={booking.booking_id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-6">
                      <div>
                        <div className="font-extrabold text-[#1b1c1c]">Booking #{booking.booking_id}</div>
                        <div className="text-sm text-[#717786] mt-1">
                          Tourist ID: {booking.tourist_id} • Package ID: {booking.package_id}
                        </div>
                        <div className="text-xs text-[#717786] mt-2">
                          Booked: {new Date(booking.booking_date).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <div className="font-bold text-[#1b1c1c]">{booking.no_of_travelers}</div>
                        <div className="text-xs text-[#717786]">travelers</div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-[#0059bb]">Rs. {Number(booking.total_price).toLocaleString()}</div>
                      {/* Individual Pricing Info */}
                      {(filterType === 'hotel' && booking.hotel_price) && (
                        <div className="text-xs font-semibold text-slate-500 mt-1">
                          Hotel: Rs. {calculateHotelTotal(booking).toLocaleString()}
                        </div>
                      )}
                      {(filterType === 'driver' && booking.driver_price) && (
                        <div className="text-xs font-semibold text-slate-500 mt-1">
                          Driver: Rs. {Number(booking.driver_price).toLocaleString()}
                        </div>
                      )}
                      {(filterType === 'guide' && booking.guide_price) && (
                        <div className="text-xs font-semibold text-slate-500 mt-1">
                          Guide: Rs. {Number(booking.guide_price).toLocaleString()}
                        </div>
                      )}
                      
                      <button 
                        onClick={() => setBreakdownBooking(booking)}
                        className="text-[10px] uppercase tracking-wider font-bold text-[#0059bb] hover:text-[#004494] mt-2 flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">info</span>
                        Breakdown
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => setConfirmDeleteId(booking.booking_id)}
                        disabled={deletingId === booking.booking_id}
                        className="flex items-center gap-2 px-4 py-2 text-red-500 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 rounded-xl transition-all font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                      >
                        {deletingId === booking.booking_id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                            Delete
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!loading && bookings.length > 0 && (
            <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100">
              <span className="text-xs font-bold text-[#717786] uppercase tracking-wider">
                Showing {bookings.filter(b => 
                  b.booking_id.toString().includes(searchQuery) || 
                  b.tourist_id.toString().includes(searchQuery)
                ).length} of {bookings.length} records
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
