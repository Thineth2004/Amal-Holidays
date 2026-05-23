import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

interface Payment {
  payment_id: number;
  amount: number;
  payment_date: string;
  method: string;
  status: string;
  booking_id: number;
}

const Payments: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/payments');
        setPayments(Array.isArray(response.data) ? response.data : response.data.data);
      } catch (error: unknown) {
        toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getTotalRevenue = () => {
    return payments
      .filter(p => p.status === 'Completed')
      .reduce((sum, p) => sum + Number(p.amount), 0);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-transparent font-['Plus_Jakarta_Sans'] antialiased">
      <div className="px-8 pb-12 pt-4">
        {/* Control Bar */}
        <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-4 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="relative w-full lg:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-[20px]">search</span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-4 focus:ring-[#0059bb]/10 focus:border-[#0059bb] outline-none transition-all placeholder:text-slate-400"
              placeholder="Search by payment ID or booking..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-[#717786] uppercase tracking-wider">Total Revenue</div>
            <div className="text-2xl font-extrabold text-[#0059bb]">Rs. {getTotalRevenue().toLocaleString()}</div>
          </div>
        </div>

        {/* Management Table */}
        <div className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest">Payment Details</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest">Method</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0059bb]"></div>
                      Loading payments...
                    </div>
                  </td>
                </tr>
              ) : payments.filter(p => 
                p.payment_id.toString().includes(searchQuery) || 
                p.booking_id.toString().includes(searchQuery)
              ).length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-slate-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.filter(p => 
                  p.payment_id.toString().includes(searchQuery) || 
                  p.booking_id.toString().includes(searchQuery)
                ).map((payment) => (
                  <tr key={payment.payment_id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-6">
                      <div>
                        <div className="font-extrabold text-[#1b1c1c]">Payment #{payment.payment_id}</div>
                        <div className="text-sm text-[#717786] mt-1">
                          Booking ID: {payment.booking_id}
                        </div>
                        <div className="text-xs text-[#717786] mt-2">
                          {new Date(payment.payment_date).toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-[#0059bb] text-lg">
                        Rs. {Number(payment.amount).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-semibold text-[#1b1c1c]">
                        {payment.method}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!loading && payments.length > 0 && (
            <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100">
              <span className="text-xs font-bold text-[#717786] uppercase tracking-wider">
                Showing {payments.filter(p => 
                  p.payment_id.toString().includes(searchQuery) || 
                  p.booking_id.toString().includes(searchQuery)
                ).length} of {payments.length} records
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
