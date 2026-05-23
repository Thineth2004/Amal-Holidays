import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { fetchDestinations, type DestinationData } from '../api/axiosInstance';
import { backend_url } from '../config/config';

const Home = () => {
  const [destinations, setDestinations] = useState<DestinationData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<DestinationData[]>([]);
  const suggestionRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();

  // Load live DB destinations on mount
  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await fetchDestinations();
        setDestinations(data);
      } catch (err) {
        console.error("Failed to load destinations for home screen landing layout:", err);
      }
    };
    loadDestinations();
  }, []);

  // Sync suggestion filtering against live backend records
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length > 0) {
      const filtered = destinations.filter(d =>
        d.name.toLowerCase().includes(value.toLowerCase()) ||
        d.location.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Close suggestions card if clicked outside form context bounds
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form handle submit router transition engine
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter a destination to search.');
      return;
    }

    // Attempt to locate matching target destination row
    const exactMatch = destinations.find(
      d => d.name.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    if (exactMatch) {
      toast.success(`Heading to ${exactMatch.name}...`);
      navigate(`/destinations/${exactMatch.destination_id}/packages`);
    } else {
      // Fallback: Redirect to central browse catalogue layout filtered by search string
      toast.success(`Searching destinations for "${searchQuery}"...`);
      navigate('/destinations');
    }
    setShowSuggestions(false);
  };

  return (
    <main>
      {/* Hero Header Context Banner Row */}
      <section className="relative h-screen flex flex-col justify-center items-center px-6 bg-slate-900">
        {/* Background Image Banner Canvas */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            className="w-full h-full object-cover opacity-75"
            src="https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1600"
            alt="Amal Holidays Sri Lanka Premium Experience Cover View"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white/10"></div>
        </div>

        {/* Content Callouts */}
        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col gap-4 text-white">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-xl tracking-tight leading-tight">
            Discover Your Next <br /> Extraordinary Holiday
          </h1>
          <p className="text-lg md:text-xl font-medium text-white/90 drop-shadow-md max-w-2xl mx-auto mt-2">
            Experience Sri Lanka's most breathtaking destinations with our curated premium travel packages designed for pure serenity.
          </p>
        </div>

        {/* Omni-Search Bar (Glassmorphic Interface Block) */}
        <div className="relative z-20 w-full max-w-3xl mx-auto mt-10" ref={suggestionRef}>
          <form
            onSubmit={handleSearch}
            className="bg-white/80 backdrop-blur-[20px] border border-white/40 rounded-full shadow-[0px_12px_40px_rgba(0,0,0,0.15)] flex items-center p-1"
          >
            <div className="flex-1 flex items-center justify-between pl-6 pr-2 py-1 rounded-full w-full group">
              <div className="flex items-center gap-3 py-2 flex-1">
                <span className="material-symbols-outlined text-[#717786]">location_on</span>
                <input
                  id="destination"
                  type="text"
                  autoComplete="off"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Where to? (e.g. Sigiriya, Ella, Galle...)"
                  className="bg-transparent border-none outline-none text-xl text-[#1b1c1c] placeholder:text-[#717786]/60 w-full font-medium"
                />
              </div>
              <button
                type="submit"
                className="bg-[#0059bb] text-white p-4 rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#004494] active:scale-95 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  search
                </span>
              </button>
            </div>
          </form>

          {/* Autocomplete Suggestions Dropdown Panel */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl overflow-hidden py-2 z-30 max-h-72 overflow-y-auto">
              {suggestions.map((dest) => (
                <button
                  key={dest.destination_id}
                  onClick={() => { 
                    setSearchQuery(dest.name); 
                    setShowSuggestions(false); 
                    navigate(`/destinations/${dest.destination_id}/packages`);
                  }}
                  className="w-full text-left px-6 py-3.5 hover:bg-black/5 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#717786] group-hover:text-[#0059bb]">travel_explore</span>
                    <div>
                      <span className="font-bold text-[#1b1c1c] block">{dest.name}</span>
                      <span className="text-xs text-[#717786]">{dest.location}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#0059bb] bg-[#0059bb]/10 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    View Packages
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Destinations Dynamic Grid Map Layout */}
      <section className="max-w-[1280px] mx-auto px-6 py-20 flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl font-extrabold tracking-tight text-[#1b1c1c]">Featured Destinations</h2>
          <p className="text-[#414754] text-base">Explore our hand-picked native locations for your perfect paradise getaway.</p>
        </div>

        {destinations.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0059bb]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 min-h-[500px]">
            {/* Slot 1: Large Main Hero Slot Card (First Row Item index 0) */}
            {destinations[0] && (
              <div 
                onClick={() => navigate(`/destinations/${destinations[0].destination_id}/packages`)}
                className="sm:col-span-2 sm:row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer shadow-[0px_6px_16px_rgba(0,0,0,0.06)] min-h-[300px]"
              >
                <img
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  src={destinations[0].image_url || "/images/placeholders/1.jpeg"}
                  alt={destinations[0].name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 p-4 text-white">
                  <span className="text-xs font-bold tracking-widest uppercase text-white/70 block mb-1">{destinations[0].location}</span>
                  <h3 className="font-extrabold text-3xl drop-shadow-md">{destinations[0].name}</h3>
                </div>
              </div>
            )}

            {/* Slot 2: Narrow Vertical Track Slot (Index 1) */}
            {destinations[1] && (
              <div 
                onClick={() => navigate(`/destinations/${destinations[1].destination_id}/packages`)}
                className="sm:row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer shadow-[0px_6px_16px_rgba(0,0,0,0.06)] min-h-[240px]"
              >
                <img className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" src={destinations[1].image_url || "/images/placeholders/2.jpeg"} alt={destinations[1].name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 p-2 text-white">
                  <h3 className="font-bold text-xl drop-shadow-md">{destinations[1].name}</h3>
                </div>
              </div>
            )}

            {/* Slot 3: Small Horizontal Blocks (Index 2) */}
            {destinations[2] && (
              <div 
                onClick={() => navigate(`/destinations/${destinations[2].destination_id}/packages`)}
                className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-[0px_6px_16px_rgba(0,0,0,0.06)] min-h-[150px]"
              >
                <img className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" src={destinations[2].image_url || "/images/placeholders/3.jpeg"} alt={destinations[2].name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 p-2 text-white">
                  <h3 className="font-bold text-lg drop-shadow-md">{destinations[2].name}</h3>
                </div>
              </div>
            )}
            
            {/* Slot 4: Small Horizontal Blocks (Index 3) */}
            {destinations[3] && (
              <div 
                onClick={() => navigate(`/destinations/${destinations[3].destination_id}/packages`)}
                className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-[0px_6px_16px_rgba(0,0,0,0.06)] min-h-[150px]"
              >
                <img className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" src={destinations[3].image_url || "/images/placeholders/4.jpeg"} alt={destinations[3].name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 p-2 text-white">
                  <h3 className="font-bold text-lg drop-shadow-md">{destinations[3].name}</h3>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Popular Tours Section Block */}
      <section className="bg-[#eae7e7]/20 w-full py-20 border-t border-b border-[#eae7e7]/60">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-4xl font-extrabold text-[#1b1c1c] tracking-tight">Popular Hotspot Deals</h2>
            <p className="text-[#414754] text-base">Top-rated live experiences dynamically mapped from active database itineraries.</p>
          </div>

          {destinations.length === 0 ? (
            <div className="text-center text-[#717786] py-10">Syncing tours catalogs...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.slice(0, 4).map((dest) => (
                <div 
                  key={dest.destination_id}
                  onClick={() => navigate(`/destinations/${dest.destination_id}/packages`)}
                  className="flex flex-col bg-white rounded-xl overflow-hidden group cursor-pointer shadow-[0px_4px_12px_rgba(0,0,0,0.04)] border border-[#eae7e7]/40 hover:shadow-[0px_12px_24px_rgba(0,0,0,0.08)] transition-all"
                >
                  <div className="aspect-[4/3] overflow-hidden relative bg-gray-100">
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={dest.image_uuid ? `${backend_url}/images/${dest.image_uuid}` : "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=600"}
                      alt={dest.name}
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[#0059bb] text-sm font-bold">star</span>
                      <span className="text-xs font-bold ml-0.5 text-[#1b1c1c]">{dest.rating || 4.9}</span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <span className="text-[10px] font-bold tracking-widest text-[#717786] uppercase mb-1">{dest.category || 'Adventure'}</span>
                    <h3 className="font-extrabold text-[#1b1c1c] text-lg line-clamp-1 group-hover:text-[#0059bb] transition-colors">{dest.name} Journey</h3>
                    <p className="text-xs text-[#717786] mt-0.5 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {dest.location}
                    </p>
                    
                    <div className="mt-4 pt-3 border-t border-[#eae7e7]/60 flex items-center justify-between">
                      <span className="text-xs text-[#414754] font-medium">Starting from</span>
                      <span className="font-extrabold text-[#1b1c1c] text-base">
                        Rs. {Number(dest.priceFrom || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Benefits Section */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#0059bb]/10 flex items-center justify-center text-[#0059bb] mb-2 shadow-sm">
              <span className="material-symbols-outlined text-[32px]">support_agent</span>
            </div>
            <h3 className="text-xl font-bold text-[#1b1c1c]">24/7 Island Support</h3>
            <p className="text-sm text-[#414754] max-w-xs leading-relaxed">
              Our Sri Lankan travel concierges are available around the clock to ensure your journey is flawless.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#0059bb]/10 flex items-center justify-center text-[#0059bb] mb-2 shadow-sm">
              <span className="material-symbols-outlined text-[32px]">verified</span>
            </div>
            <h3 className="text-xl font-bold text-[#1b1c1c]">Curated Quality</h3>
            <p className="text-sm text-[#414754] max-w-xs leading-relaxed">
              Every heritage site and boutique villa option is personally vetted to meet our premium standards.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#0059bb]/10 flex items-center justify-center text-[#0059bb] mb-2 shadow-sm">
              <span className="material-symbols-outlined text-[32px]">eco</span>
            </div>
            <h3 className="text-xl font-bold text-[#1b1c1c]">Sustainable Eco Travel</h3>
            <p className="text-sm text-[#414754] max-w-xs leading-relaxed">
              We partner with local eco-conscious providers to minimize our carbon footprint and preserve Sri Lanka's raw beauty.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
