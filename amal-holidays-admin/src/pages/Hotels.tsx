import React, { useState, useEffect } from 'react';
import AddHotelModal from '../components/AddHotelModal';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { backend_url } from '../config/config';
import Bookings from './Bookings';

interface Hotel {
  hotel_id: number;
  name: string;
  location: string;
  contact_no: string;
  rating: number;
  description: string;
  image_uuid: string;
  price_per_night: number;
  imageUrl?: string;
}

const Hotels: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleSaveSuccess = (savedHotel: Hotel) => {
    const hotelWithImage = {
      ...savedHotel,
      imageUrl: savedHotel.image_uuid ? `${backend_url}/api/images/${savedHotel.image_uuid}` : undefined,
    };

    if (editingHotel) {
      setHotels(hotels.map((h) => h.hotel_id === savedHotel.hotel_id ? hotelWithImage : h));
    } else {
      setHotels([hotelWithImage, ...hotels]);
    }

    setEditingHotel(null);
    setIsModalOpen(false);
  };

  const executeDeleteHotel = async () => {
    if (confirmDeleteId === null) return;
    try {
      await api.delete(`/api/hotels/${confirmDeleteId}`);
      setHotels(hotels.filter((h) => h.hotel_id !== confirmDeleteId));
      toast.success('Hotel deleted successfully.');
    } catch (error: unknown) {
      toast.error((error as { response?: { data?: { message: string } } }).response?.data?.message || 'Failed to delete hotel');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleViewBookings = (hotelId: number) => {
    setSelectedHotelId(hotelId);
    setShowBookingsModal(true);
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await api.get('/api/hotels');
        const data = response.data.map((hotel: Hotel) => ({
          ...hotel,
          imageUrl: hotel.image_uuid ? `${backend_url}/api/images/${hotel.image_uuid}` : undefined,
        }));
        setHotels(data);
      } catch (error: unknown) {
        toast.error((error as { response?: { data?: { message: string } } }).response?.data?.message || 'Failed to fetch hotels');
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-transparent font-['Plus_Jakarta_Sans'] antialiased">
      <ConfirmDeleteModal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={executeDeleteHotel}
        title="Delete Hotel"
        message={`Are you sure you want to delete hotel #${confirmDeleteId}? This action cannot be undone.`}
      />
      {/* Bookings Modal - Using inline bookings or similar */}
      {showBookingsModal && selectedHotelId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-bold text-[#1b1c1c]">Bookings for Hotel #{selectedHotelId}</h2>
              <button
                onClick={() => {
                  setShowBookingsModal(false);
                  setSelectedHotelId(null);
                }}
                className="text-slate-600 hover:text-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <Bookings
                filterType="hotel"
                filterId={selectedHotelId}
                onClose={() => {
                  setShowBookingsModal(false);
                  setSelectedHotelId(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <AddHotelModal 
        isOpen={isModalOpen} 
        editData={editingHotel ?? undefined}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHotel(null);
        }} 
        onSuccess={handleSaveSuccess} 
      />

      <div className="px-8 pb-12 pt-4">
        <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-4 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="relative w-full lg:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-[20px]">search</span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-4 focus:ring-[#0059bb]/10 focus:border-[#0059bb] outline-none transition-all"
              placeholder="Search hotels..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#0059bb] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#004494] transition-all shadow-lg active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add New Hotel
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest">Hotel Details</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hotels
                .filter((h) => h.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((h) => (
                  <tr key={h.hotel_id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-start gap-6">
                        <div className="w-48 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-200 border border-slate-200 shadow-inner">
                          {h.imageUrl ? (
                            <img alt={h.name} className="w-full h-full object-cover" src={h.imageUrl} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#717786]/30">
                              <span className="material-symbols-outlined text-3xl">hotel</span>
                            </div>
                          )}
                        </div>
                        <div className="pt-1">
                          <div className="font-extrabold text-[#1b1c1c] text-lg leading-tight">{h.name}</div>
                          <div className="text-sm font-bold text-[#0059bb] mb-2">{h.location} • {h.rating} Stars</div>
                          <div className="text-xs text-slate-500 mb-1">Contact: {h.contact_no}</div>
                          <div className="text-sm font-bold text-green-600 mb-2">LKR {h.price_per_night}/night</div>
                          <p className="text-sm text-[#717786] max-w-md line-clamp-2 leading-relaxed">
                            {h.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right align-top">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleViewBookings(h.hotel_id)} className="flex items-center gap-2 px-4 py-2 text-amber-600 bg-white border border-slate-200 hover:bg-amber-50 rounded-xl transition-all font-bold text-xs">
                          <span className="material-symbols-outlined text-[18px]">receipt</span> Bookings
                        </button>
                        <button onClick={() => { setEditingHotel(h); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 text-[#0059bb] bg-white border border-slate-200 hover:bg-blue-50 rounded-xl transition-all font-bold text-xs">
                          <span className="material-symbols-outlined text-[18px]">edit</span> Edit
                        </button>
                        <button onClick={() => setConfirmDeleteId(h.hotel_id)} className="flex items-center gap-2 px-4 py-2 text-red-500 bg-white border border-slate-200 hover:bg-red-50 rounded-xl transition-all font-bold text-xs">
                          <span className="material-symbols-outlined text-[18px]">delete</span> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="px-8 py-5 bg-slate-50/50 flex justify-between items-center border-t border-slate-100">
            <span className="text-xs font-bold text-[#717786] uppercase tracking-wider">
              Total Hotels: {hotels.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
