import React, { useState, useMemo, useEffect } from 'react';
import api from '../api/axiosInstance';
import { useParams, useNavigate } from 'react-router';
import { backend_url } from '../config/config';

// Clean typing interface matching your database structure
interface TourPackage {
  id?: number;
  package_id?: number;
  title: string;
  description: string;
  duration: number;
  destination_name: string;
  image_uuids: string[]; // Assuming your backend sends an array of image UUIDs
  price: number;
  category?: string;
  available_slots: number;
  image_url?: string;
}

const CATEGORIES = ['All', 'Adventure', 'Relaxation', 'Cultural', 'Family', 'Heritage'];

const Packages: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Grabs the destination_id out of the URL string
  const navigate = useNavigate(); // Navigation engine router instance
  
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(100000); // Bumped default slider max to accommodate premium itineraries
  const [visibleCount, setVisibleCount] = useState(6); // Tracks pagination limits

  useEffect(() => {
    console.log("Fetching tour packages for destination ID:", id);
  }, [id]);

  // 1. Fetch Dynamic Data on Mount
  useEffect(() => {
    api.get('/packages/available')
      .then(res => {
        setPackages(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching packages:", err);
        setLoading(false);
      });
  }, []);

  // Visible count resets to 6 whenever filters change, handled in onChange/onClick events

  // 2. Functional Filter Engine
  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => {
      const title = pkg.title || "";
      const destination = pkg.destination_name || "";
      const category = pkg.category || "";
      const price = pkg.price || 0;

      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        destination.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === 'All' || 
        category.toLowerCase() === activeCategory.toLowerCase() ||
        title.toLowerCase().includes(activeCategory.toLowerCase()) ||
        destination.toLowerCase().includes(activeCategory.toLowerCase());

      const matchesPrice = price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchQuery, activeCategory, maxPrice, packages]);

  if (loading) return <div className="text-center py-20 mt-20 font-semibold text-[#414754]">Loading amazing destinations...</div>;

  return (
    <main className="max-w-[1280px] mt-20 mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8 w-full">

      {/* Sidebar Filters */}
      <aside className="lg:w-1/4 flex-shrink-0">
        <div className="sticky top-28 bg-white rounded-[2rem] p-6 shadow-sm border border-[#c1c6d7]/30 flex flex-col gap-8">

          {/* Search Box */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-[#1b1c1c]">Search Packages</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#414754]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(6);
                }}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-[#f6f3f2] border-transparent focus:border-[#0059bb] focus:ring-2 focus:ring-[#0059bb]/20 transition-all text-sm outline-none placeholder:text-[#414754]/70"
                placeholder="Where to?"
              />
            </div>
          </div>

          <hr className="border-[#c1c6d7]/30" />

          {/* Filter Categories */}
          <div className="flex flex-col gap-4">
            <label className="font-bold text-sm text-[#1b1c1c]">Experience Type</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisibleCount(6);
                  }}
                  className={`px-4 py-2 border rounded-full text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? 'bg-[#0059bb] text-white shadow-sm'
                      : 'border-[#717786]/30 text-[#414754] hover:border-[#717786]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-[#c1c6d7]/30" />

          {/* Functional Range Control Slider */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="font-bold text-sm text-[#1b1c1c]">Max Price</label>
              <span className="text-xs font-semibold text-[#0059bb]">Rs. {maxPrice.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="100000" 
              step="1000"
              value={maxPrice} 
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setVisibleCount(6);
              }}
              className="w-full h-2 bg-[#eae7e7] rounded-full appearance-none cursor-pointer accent-[#0059bb]"
            />
          </div>
        </div>
      </aside>

      {/* Packages Grid Rendering Section */}
      <div className="lg:w-3/4 flex flex-col gap-10">
        {filteredPackages.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPackages.slice(0, visibleCount).map((pkg) => (
                <article
                  key={pkg.package_id || pkg.id}
                  className="group flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#c1c6d7]/20 relative"
                >
                  {/* Save/Favorite Overlay Button */}
                  <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center text-[#1b1c1c] hover:text-[#b52330] hover:bg-white transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                  </button>

                  {/* Main Card Image Viewport */}
                  <div className="w-full aspect-[4/3] overflow-hidden relative bg-[#eae7e7]">
                    <img
                      src={backend_url + '/images/' + pkg.image_uuids[0]}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {pkg.available_slots === 0 && (
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        <span className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-semibold shadow-sm">Fully Booked</span>
                      </div>
                    )}
                  </div>

                  {/* Content Area Container */}
                  <div className="p-6 flex flex-col flex-grow gap-4">
                    <div className="flex items-center gap-3 text-[#414754] text-xs font-semibold">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">schedule</span> {pkg.duration} Days
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">location_on</span> {pkg.destination_name || "Sri Lanka"}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <h3 className="text-2xl font-bold text-[#1b1c1c] group-hover:text-[#0059bb] transition-colors line-clamp-1">{pkg.title}</h3>
                      <p className="text-sm text-[#414754] line-clamp-2">{pkg.description}</p>
                    </div>

                    {/* Pricing and Action Layer */}
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#c1c6d7]/20">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#414754]">From</span>
                        <span className="text-3xl font-bold text-[#1b1c1c] leading-none">Rs. {(pkg.price || 0).toLocaleString()}</span>
                      </div>
                      
                      {/* FIXED ACTIVE ROUTING ACTION BUTTON */}
                      <button 
                        onClick={() => navigate(`/packages/${pkg.package_id || pkg.id}`)}
                        className="bg-[#0059bb]/10 text-[#0059bb] hover:bg-[#0059bb] hover:text-white px-5 py-2.5 rounded-full font-bold text-sm transition-colors flex items-center gap-1 group/btn"
                      >
                        View Details
                        <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-0.5 transition-transform">visibility</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Action Button Container */}
            {filteredPackages.length > visibleCount && (
              <div className="w-full flex justify-center mt-8">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  className="bg-white border border-[#717786]/30 text-[#1b1c1c] px-8 py-3 rounded-full font-bold hover:bg-[#e5e2e1] hover:border-[#717786] transition-all shadow-sm flex items-center gap-2"
                >
                  Load More Packages
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-[#414754]">
            <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
            <p className="text-lg font-semibold">No packages found matching your criteria.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Packages;
