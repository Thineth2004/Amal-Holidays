import React, { useState, useEffect } from 'react';
import AddPackageModal from '../components/AddPackageModal';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { backend_url } from '../config/config';

interface Package {
  package_id: number;
  title: string;
  description: string;
  price: number;
  available_slots: number;
  destination_id: number;
  start_date: string;
  end_date: string;
  capacity: number;
  image_uuids: string[];
  imageUrl?: string;
}

const Packages: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.get('/api/packages/all');
        const data = response.data.map((pkg: Package) => ({
          ...pkg,
          imageUrl: pkg.image_uuids && pkg.image_uuids.length > 0 
            ? `${backend_url}/api/images/${pkg.image_uuids[0]}` 
            : undefined
        }));
        setPackages(data);
      } catch (error: unknown) {
        toast.error( (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch packages');
      }
    };

    fetchPackages();
  }, []);

  const handleSaveSuccess = (savedPkg: Package) => {
    const pkgWithImage = {
      ...savedPkg,
      imageUrl: savedPkg.image_uuids && savedPkg.image_uuids.length > 0 
        ? `${backend_url}/api/images/${savedPkg.image_uuids[0]}` 
        : undefined
    };

    if (editingPackage) {
      setPackages(packages.map(p => p.package_id === savedPkg.package_id ? pkgWithImage : p));
    } else {
      setPackages([...packages, pkgWithImage]);
    }
    setEditingPackage(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-transparent font-['Plus_Jakarta_Sans'] antialiased">
      <AddPackageModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingPackage(null);
        }} 
        onSuccess={handleSaveSuccess} 
        editData={editingPackage}
      />
      <div className="px-8 pb-12 pt-4">
        {/* Integrated Control Bar - Improved Visibility */}
        <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-4 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="relative w-full lg:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-[20px]">search</span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-4 focus:ring-[#0059bb]/10 focus:border-[#0059bb] outline-none transition-all placeholder:text-slate-400"
              placeholder="Search by package..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              setEditingPackage(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#0059bb] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#004494] transition-all shadow-lg active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add New Package
          </button>
        </div>

        {/* Management Table */}
        <div className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest">Package Details</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#717786] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {packages.filter(pkg => pkg.title.toLowerCase().includes(searchQuery.toLowerCase())).map((pkg) => (
                <tr key={pkg.package_id} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-start gap-6">
                      {/* Scaled-up Image for Observation */}
                      <div className="w-48 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-200 border border-slate-200 shadow-inner">
                        {pkg.imageUrl ? (
                          <img alt={pkg.title} className="w-full h-full object-cover transition-transform duration-500" src={pkg.imageUrl} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#717786]/30">
                            <span className="material-symbols-outlined text-3xl">inventory_2</span>
                          </div>
                        )}
                      </div>
                      <div className="pt-1">
                        <div className="font-extrabold text-[#1b1c1c] text-lg leading-tight">{pkg.title}</div>
                        <div className="text-sm font-bold text-[#0059bb] mb-2">Rs. {Number(pkg.price).toLocaleString()} • {pkg.capacity} Capacity</div>
                        <p className="text-sm text-[#717786] max-w-md line-clamp-2 leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        title="Edit Package"
                        onClick={() => {
                          setEditingPackage(pkg);
                          setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-[#0059bb] bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-200 rounded-xl transition-all font-bold text-xs"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                        Edit
                      </button>
                      <button
                        title="Delete Package"
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
              Total Records: {packages.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;
