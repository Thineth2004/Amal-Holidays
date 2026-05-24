import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

interface Inquiry {
  inquiry_id: number;
  name: string;
  contact: string;
  subject: string;
  content: string;
  status: 'Pending' | 'Reviewed';
  created_at: string;
}

const Inquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchInquiries = async () => {
    try {
      const response = await api.get('/api/inquiries');
      setInquiries(response.data);
    } catch (error: unknown) {
      toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch inquiries');
    }
  };

  const handleMarkAsReviewed = async (id: number) => {
    try {
      await api.patch(`/api/inquiries/${id}/review`);
      toast.success('Inquiry marked as reviewed');
      setInquiries(inquiries.map((inquiry) => 
        inquiry.inquiry_id === id ? { ...inquiry, status: 'Reviewed' } : inquiry
      ));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      toast.error('Failed to update inquiry status');
    }
  };

  useEffect(() => {
    const loadInquiries = async () => {
      await fetchInquiries();
    };
    loadInquiries();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-transparent font-['Plus_Jakarta_Sans'] antialiased">
      <div className="px-8 pb-12 pt-4">
        {/* Integrated Control Bar */}
        <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-4 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="relative w-full lg:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-[20px]">search</span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-4 focus:ring-[#0059bb]/10 focus:border-[#0059bb] outline-none transition-all placeholder:text-slate-400"
              placeholder="Search by subject, name, or contact..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Management Table */}
        <div className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest">Inquiry Details</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries
                .filter((inquiry) => 
                  inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  inquiry.contact.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((inquiry) => (
                  <tr key={inquiry.inquiry_id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-start gap-4">
                        <div className="pt-1">
                          <div className="flex items-center gap-3">
                            <div className="font-extrabold text-[#1b1c1c] text-lg leading-tight">{inquiry.subject}</div>
                            {inquiry.status === 'Pending' ? (
                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700">Pending</span>
                            ) : (
                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-700">Reviewed</span>
                            )}
                          </div>
                          <div className="text-sm font-bold text-[#0059bb] mb-2">{inquiry.name} • {inquiry.contact}</div>
                          <p className="text-sm text-[#717786] max-w-2xl leading-relaxed whitespace-pre-wrap">
                            {inquiry.content}
                          </p>
                          <div className="text-xs text-slate-400 mt-2 font-medium">
                            Received: {new Date(inquiry.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6 text-right align-top">
                      <div className="flex items-center justify-end gap-3">
                        {inquiry.status === 'Pending' && (
                          <button
                            title="Mark as Reviewed"
                            onClick={() => handleMarkAsReviewed(inquiry.inquiry_id)}
                            className="flex items-center gap-2 px-4 py-2 text-emerald-600 bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 rounded-xl transition-all font-bold text-xs"
                          >
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                            Mark as Reviewed
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="px-8 py-5 bg-slate-50/50 flex justify-between items-center border-t border-slate-100">
            <span className="text-xs font-bold text-[#717786] uppercase tracking-wider">
              Total Inquiries: {inquiries.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inquiries;
