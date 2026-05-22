import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { fetchDestinations, type DestinationData } from '../api/axiosInstance'; 

const FILTERS = ['All', 'Adventure', 'Relaxation', 'Cultural', 'Heritage'];

const Destinations: React.FC = () => {
  const [destinations, setDestinations] = useState<DestinationData[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // 2. Initialize the navigate function

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDestinations();
        setDestinations(data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to connect to the server.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredDestinations = destinations.filter((dest) => {
    const matchesCategory = activeFilter === 'All' || dest.category === activeFilter;
    const matchesSearch = 
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="flex-grow pt-32 pb-20 max-w-[1280px] mx-auto px-6 w-full">

      {/* Header & Filter Bar */}
      <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-[#1b1c1c] mb-2">Discover Your Next Escape</h1>
          <p className="text-lg text-[#414754] max-w-2xl">
            Curated destinations offering unparalleled experiences, from serene scenic valleys to ancient world heritages.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto md:items-end">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-[20px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-[#c1c6d7] bg-white text-[#1b1c1c] focus:border-[#0059bb] focus:ring-1 focus:ring-[#0059bb] outline-none transition-all placeholder:text-[#c1c6d7] shadow-sm"
              placeholder="Search destinations or locations..."
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#717786] hover:text-black font-bold"
              >
                clear
              </button>
            )}
          </div>
          
          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full font-bold border text-sm whitespace-nowrap transition-all ${
                  activeFilter === filter
                    ? 'bg-[#0059bb] text-white shadow-sm'
                    : 'border-[#c1c6d7] text-[#414754] hover:bg-[#e5e2e1]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0059bb]"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-10 bg-red-50 text-red-600 rounded-xl border border-red-200">
          <p className="font-bold">{error}</p>
        </div>
      )}

      {/* Grid Layout Cards */}
      {!isLoading && !error && (
        <>
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-20 bg-[#eae7e7]/30 rounded-xl border border-dashed border-[#c1c6d7]">
              <span className="material-symbols-outlined text-5xl text-[#717786] mb-2">travel_explore</span>
              <p className="text-xl font-bold text-[#1b1c1c]">No destinations found</p>
              <p className="text-[#414754] text-sm mt-1">Try resetting your filter chips or search keywords.</p>
            </div>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((dest) => (
                <article
                  key={dest.destination_id}
                  onClick={() => navigate(`/destinations/${dest.destination_id}/packages`)} // 3. Make whole card clickable (optional)
                  className="flex flex-col bg-white rounded-lg shadow-[0_6px_16px_rgba(0,0,0,0.06)] overflow-hidden group hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={dest.image_url || 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=600'} 
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-[#0059bb] text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm">
                      {dest.category}
                    </div>
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[16px] text-[#b15f00]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-xs font-bold text-[#1b1c1c]">{dest.rating}</span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-6 flex flex-col flex-grow bg-white">
                    <div className="flex justify-between items-start mb-1">
                      <h2 className="text-2xl font-bold text-[#1b1c1c]">{dest.name}</h2>
                      <span className="text-sm text-[#414754] mt-1 font-semibold whitespace-nowrap">
                        from Rs. {Number(dest.priceFrom).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-[#717786] font-medium flex items-center gap-0.5 mb-3">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {dest.location}
                    </p>
                    <p className="text-sm text-[#414754] mb-6 flex-grow line-clamp-2">
                      {dest.description}
                    </p>
                    
                    {/* 4. Wire up button explicit click router navigation */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents double navigating if the article wrapper also has an onClick
                        navigate(`/destinations/${dest.destination_id}/packages`);
                      }}
                      className="w-full py-3 rounded-full bg-[#eae7e7] text-[#1b1c1c] font-bold group-hover:bg-[#0059bb] group-hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      View Packages
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
};

export default Destinations;