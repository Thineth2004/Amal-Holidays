import React, { useState, useEffect } from 'react';
import AddDestinationModal from '../components/AddDestinationModal';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { backend_url } from '../config/config';

interface Destination {
  destination_id: number;
  name: string;
  location: string;
  description: string;
  image_uuid: string;
  imageUrl?: string;
}

const Destinations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  const fetchDestinations = async () => {
    try {
      const response = await api.get('/api/destinations');
      const data = response.data.map((dest: Destination) => ({
        ...dest,
        imageUrl: dest.image_uuid ? `${backend_url}/api/images/${dest.image_uuid}` : undefined,
      }));
      setDestinations(data);
    } catch (error: unknown) {
      toast.error( (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch destinations');
    }
  };

  const handleSaveSuccess = (savedDestination: Destination) => {
    const destinationWithImage = {
      ...savedDestination,
      imageUrl: savedDestination.image_uuid ? `${backend_url}/api/images/${savedDestination.image_uuid}` : undefined,
    };

    if (editingDestination) {
      setDestinations(destinations.map((dest) => dest.destination_id === savedDestination.destination_id ? destinationWithImage : dest));
    } else {
      setDestinations([...destinations, destinationWithImage]);
    }

    setEditingDestination(null);
    setIsModalOpen(false);
  };

  const handleDeleteDestination = async (destinationId: number) => {
    try {
      await api.delete(`/api/destinations/${destinationId}`);
      setDestinations(destinations.filter((dest) => dest.destination_id !== destinationId));
      toast.success('Destination deleted successfully.');
    } catch (error: unknown) {
      toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to delete destination');
    }
  };

  useEffect(() => {
    const loadDestinations = async () => {
      await fetchDestinations();
    };
    loadDestinations();
  }, []);

  const handleAddSuccess = (newDestination: Destination) => {
    setDestinations([...destinations, {
      ...newDestination,
      imageUrl: `${backend_url}/api/images/${newDestination.image_uuid}`
    }]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-transparent font-['Plus_Jakarta_Sans'] antialiased">
      <AddDestinationModal 
        isOpen={isModalOpen} 
        editData={editingDestination ?? undefined}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDestination(null);
        }} 
        onSuccess={(newDest: Destination) => handleSaveSuccess(newDest)} 
      />
      <div className="px-8 pb-12 pt-4">
        {/* Integrated Control Bar - Improved Visibility */}
        <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-4 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="relative w-full lg:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-[20px]">search</span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-4 focus:ring-[#0059bb]/10 focus:border-[#0059bb] outline-none transition-all placeholder:text-slate-400"
              placeholder="Search by destination..."
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
            Add New Location
          </button>
        </div>

        {/* Management Table */}
        <div className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest">Destination Details</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {destinations
                .filter((dest) => dest.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((dest) => (
                  <tr key={dest.destination_id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-start gap-6">
                        {/* Scaled-up Image for Observation */}
                        <div className="w-48 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-200 border border-slate-200 shadow-inner">
                          {dest.imageUrl ? (
                            <img alt={dest.name} className="w-full h-full object-cover transition-transform duration-500" src={dest.imageUrl} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#717786]/30">
                              <span className="material-symbols-outlined text-3xl">landscape</span>
                            </div>
                          )}
                        </div>
                        <div className="pt-1">
                          <div className="font-extrabold text-[#1b1c1c] text-lg leading-tight">{dest.name}</div>
                          <div className="text-sm font-bold text-[#0059bb] mb-2">{dest.location}</div>
                          <p className="text-sm text-[#717786] max-w-md line-clamp-2 leading-relaxed">
                            {dest.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          title="Edit Destination"
                          onClick={() => {
                            setEditingDestination(dest);
                            setIsModalOpen(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-[#0059bb] bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-200 rounded-xl transition-all font-bold text-xs"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                          Edit
                        </button>
                        <button
                          title="Delete Destination"
                          onClick={() => handleDeleteDestination(dest.destination_id)}
                          className="flex items-center gap-2 px-4 py-2 text-red-500 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 rounded-xl transition-all font-bold text-xs"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="px-8 py-5 bg-slate-50/50 flex justify-between items-center border-t border-slate-100">
            <span className="text-xs font-bold text-[#717786] uppercase tracking-wider">
              Total Records: {destinations.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Destinations;
