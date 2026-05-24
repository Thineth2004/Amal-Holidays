import React, { useState, useEffect } from 'react';
import AddStaffModal from '../components/AddStaffModal';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { backend_url } from '../config/config';
import Bookings from '../pages/Bookings';

interface Staff {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  price_per_day: number;
  image_uuid: string;
  imageUrl?: string;
}

interface StaffPageProps {
  role: 'Driver' | 'Guide';
  title: string;
  endpoint: string;
}

const StaffPage: React.FC<StaffPageProps> = ({ role, title, endpoint }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);

  const handleSaveSuccess = (savedStaff: Staff) => {
    const staffWithImage = {
      ...savedStaff,
      imageUrl: savedStaff.image_uuid ? `${backend_url}/api/images/${savedStaff.image_uuid}` : undefined,
    };

    if (editingStaff) {
      setStaffList(staffList.map((s) => s.user_id === savedStaff.user_id ? staffWithImage : s));
    } else {
      setStaffList([staffWithImage, ...staffList]);
    }
    setEditingStaff(null);
    setIsModalOpen(false);
  };

  const handleDeleteStaff = async (staffId: number) => {
    try {
      await api.delete(`/api/${endpoint}/${staffId}`);
      setStaffList(staffList.filter((s) => s.user_id !== staffId));
      toast.success(`${title} deleted successfully.`);
    } catch (error: unknown) {
      toast.error((error as { response?: { data?: { message: string } } }).response?.data?.message || `Failed to delete ${title.toLowerCase()}`);
    }
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await api.get(`/api/${endpoint}`);
        const data = response.data.map((s: Staff) => ({
          ...s,
          imageUrl: s.image_uuid ? `${backend_url}/api/images/${s.image_uuid}` : undefined,
        }));
        setStaffList(data);
      } catch (error: unknown) {
        toast.error((error as { response?: { data?: { message: string } } }).response?.data?.message || `Failed to fetch ${title.toLowerCase()}`);
      }
    };

    fetchStaff();
  }, [endpoint, title]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-transparent font-['Plus_Jakarta_Sans'] antialiased">
      {showBookingsModal && selectedStaffId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-bold text-[#1b1c1c]">Bookings for {title} #{selectedStaffId}</h2>
              <button
                onClick={() => {
                  setShowBookingsModal(false);
                  setSelectedStaffId(null);
                }}
                className="text-slate-600 hover:text-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <Bookings
                filterType={endpoint === 'drivers' ? 'driver' : 'guide'}
                filterId={selectedStaffId}
                onClose={() => {
                  setShowBookingsModal(false);
                  setSelectedStaffId(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
      <AddStaffModal 
        isOpen={isModalOpen} 
        editData={editingStaff ?? undefined}
        role={role}
        endpoint={endpoint}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStaff(null);
        }} 
        onSuccess={handleSaveSuccess} 
      />

      <div className="px-8 pb-12 pt-4">
        <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-4 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="relative w-full lg:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-[20px]">search</span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-4 focus:ring-[#0059bb]/10 focus:border-[#0059bb] outline-none"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#0059bb] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#004494] transition-all shadow-lg active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add New {title}
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest">{title} Details</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList
                .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((s) => (
                  <tr key={s.user_id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-start gap-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 border border-slate-200">
                          {s.imageUrl ? (
                            <img alt={s.name} className="w-full h-full object-cover" src={s.imageUrl} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#717786]/30">
                              <span className="material-symbols-outlined text-3xl">person</span>
                            </div>
                          )}
                        </div>
                        <div className="pt-2">
                          <div className="font-extrabold text-[#1b1c1c] text-lg leading-tight">{s.name}</div>
                          <div className="text-sm text-[#717786] mb-1">{s.email} • {s.phone}</div>
                          <div className="text-sm font-bold text-green-600">LKR {s.price_per_day}/day</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right align-top">
                      <div className="flex items-center justify-end gap-3 mt-4">
                        <button onClick={() => { setSelectedStaffId(s.user_id); setShowBookingsModal(true); }} className="flex items-center gap-2 px-4 py-2 text-amber-600 bg-white border border-slate-200 hover:bg-amber-50 rounded-xl transition-all font-bold text-xs">
                          <span className="material-symbols-outlined text-[18px]">receipt</span> Bookings
                        </button>
                        <button onClick={() => { setEditingStaff(s); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 text-[#0059bb] bg-white border border-slate-200 hover:bg-blue-50 rounded-xl transition-all font-bold text-xs">
                          <span className="material-symbols-outlined text-[18px]">edit</span> Edit
                        </button>
                        <button onClick={() => handleDeleteStaff(s.user_id)} className="flex items-center gap-2 px-4 py-2 text-red-500 bg-white border border-slate-200 hover:bg-red-50 rounded-xl transition-all font-bold text-xs">
                          <span className="material-symbols-outlined text-[18px]">delete</span> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
