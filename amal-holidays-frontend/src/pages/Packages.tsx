import React, { useState, useMemo } from 'react';

/**
 * Data Types & Constants
 */
interface TourPackage {
  id: number;
  title: string;
  description: string;
  duration: string;
  location: string;
  price: number;
  image: string;
  category: 'Adventure' | 'Relaxation' | 'Cultural' | 'Family';
  isBestSeller?: boolean;
}

const PACKAGES: TourPackage[] = [
  {
    id: 1,
    title: 'Aegean Serenity Retreat',
    description: 'Experience the magical sunsets of Santorini and the vibrant culture of Mykonos in this luxurious island-hopping adventure.',
    duration: '7 Days',
    location: 'Greece',
    price: 2450,
    category: 'Relaxation',
    isBestSeller: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD54lC08iLp3MXCOKIJSLmqY4NJoMQSrDGCkldJ1Vb9zwpXDH7ufujQPA4PmCK9cczuT0MbBiVNa_PepUUHlSN0Tt8ti5NviIdPrcgMpCFcE50a31tLr5HNF_JAlkdxFHpDvA41ZwtG3dkBidvaGJ20nrW-N09OC066qBStBZ8i5sqRcIRZijhHWNgG_o1puYw211nXJaUjWSWvTr86iWkkNFW8c2iro3jMG09Avsh5JoraOqpThuH2LDH5umpix3MdBEVHAT3FBri0'
  },
  {
    id: 2,
    title: 'Dubai Urban Luxury',
    description: 'Immerse yourself in opulence with five-star accommodations, desert safaris, and exclusive dining experiences in the city of the future.',
    duration: '5 Days',
    location: 'UAE',
    price: 1890,
    category: 'Adventure',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6SoNGlbVLkMglmGxRJpzXD4yjffSghSQ0AyMq8Sxb1s81MzcOP9-7VIzImWCOW6xj6jwovfwqn57eARVknTNFGesvs5iCHvSVinbHS8OJIl_xHMrcnG-BvaPvisbxLhlcHNf7vqwGEwvDF4TQvCXH4e2mH2dzHS9cEWroG3cJuuQxsbm2dmIswXyKLYiFXdRf0uNqIPNUlOEiOW5J5lDrrcGKAncCPZ6eUzFMprVWxl_SA8HO2zfVs2QfaEx6RmalCjZTgIioNSH5'
  },
  {
    id: 3,
    title: 'Essence of Honshu',
    description: 'A profound journey through Japan\'s cultural heartland, blending ancient temples, tranquil gardens, and vibrant modern cities.',
    duration: '10 Days',
    location: 'Japan',
    price: 3200,
    category: 'Cultural',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1QsLg7MJ9xz5JOvapKCYic_g5Y9qYJ4DSaPE2begATZSxbjd3IFR-aexzuxs7XWufLNmbeDm5px6eqWcD_50D_L-vFKKvLMDWRq7U169JmqKPGxRXB5-Mq7DW3NstFf9HOe3WbWzPll_5qK8LkCc32Ixg4Lu48W_q_1n3kKTgRHc57zrrVe9jFYhiobjN4tQWSnf95JCt6RvjkY3OfrszDqLunh0AtOaUoHSgBVJIeJjxBBxhsWXf8qN8_FrdFk1NZPrNfZb5c6Z-'
  },
  {
    id: 4,
    title: 'Parisian Romance',
    description: 'Indulge in the magic of the City of Light with private Seine cruises, exclusive museum tours, and Michelin-starred dining.',
    duration: '6 Days',
    location: 'France',
    price: 2100,
    category: 'Relaxation',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDc2byXtHXG6IVcHD68_VXfhCs7EIzwcw1f353RaT7m6J0FE1Vaitygg108YwE8c8gUKL30WexelrrRgBnabMCLNrcW9BIeKIEkTAtKy_aqmV_mP0lpLUT1eg3y4OUQ4JwWjK1j5ACxW0XH2xUDdD37WCm7j2Yuvj0NUECIgIEPYKH-mYsam8KIIFNw88ajzCx2PafzDgaNppNL4TC9A1KredEDU7TJ37V4JkSa7ZJN-iURsvMJNzcMFp931sifrA9LRfmLSo_Gmk6A'
  }
];

const CATEGORIES = ['All', 'Adventure', 'Relaxation', 'Cultural', 'Family'];

const Packages: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter Logic
  const filteredPackages = useMemo(() => {
    return PACKAGES.filter(pkg => {
      const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || pkg.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <main className="max-w-[1280px] mt-20 mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8 w-full">

      {/* Sidebar Filters */}
      <aside className="lg:w-1/4 flex-shrink-0">
        <div className="sticky top-28 bg-white rounded-[2rem] p-6 shadow-sm border border-[#c1c6d7]/30 flex flex-col gap-8">

          {/* Search */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-[#1b1c1c]">Search Packages</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#414754]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-[#f6f3f2] border-transparent focus:border-[#0059bb] focus:ring-2 focus:ring-[#0059bb]/20 transition-all text-sm outline-none placeholder:text-[#414754]/70"
                placeholder="Where to?"
              />
            </div>
          </div>

          <hr className="border-[#c1c6d7]/30" />

          {/* Categories */}
          <div className="flex flex-col gap-4">
            <label className="font-bold text-sm text-[#1b1c1c]">Experience Type</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 border rounded-full text-xs font-semibold transition-all ${activeCategory === cat
                    ? 'bg-[#0059bb] text-white shadow-sm'
                    : ' border-[#717786]/30 text-[#414754] hover:border-[#717786]'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-[#c1c6d7]/30" />

          {/* Price Range Mockup */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="font-bold text-sm text-[#1b1c1c]">Price Range</label>
              <span className="text-xs font-semibold text-[#0059bb]">$500 - $3000+</span>
            </div>
            <div className="relative h-2 bg-[#eae7e7] rounded-full mt-2">
              <div className="absolute left-[20%] right-[30%] h-full bg-[#0059bb] rounded-full"></div>
              <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#0059bb] rounded-full shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
              <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#0059bb] rounded-full shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Packages Grid */}
      <div className="lg:w-3/4 flex flex-col gap-10">
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPackages.map((pkg) => (
              <article
                key={pkg.id}
                className="group flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#c1c6d7]/20 relative"
              >
                <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center text-[#1b1c1c] hover:text-[#b52330] hover:bg-white transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                </button>

                <div className="w-full aspect-[4/3] overflow-hidden relative bg-[#eae7e7]">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {pkg.isBestSeller && (
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#1b1c1c] shadow-sm">Best Seller</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow gap-4">
                  <div className="flex items-center gap-3 text-[#414754] text-xs font-semibold">
                    <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> {pkg.duration}</div>
                    <span>•</span>
                    <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> {pkg.location}</div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-bold text-[#1b1c1c] group-hover:text-[#0059bb] transition-colors line-clamp-1">{pkg.title}</h3>
                    <p className="text-sm text-[#414754] line-clamp-2">{pkg.description}</p>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#c1c6d7]/20">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#414754]">From</span>
                      <span className="text-3xl font-bold text-[#1b1c1c] leading-none">${pkg.price.toLocaleString()}</span>
                    </div>
                    <button className="bg-[#0059bb]/10 text-[#0059bb] hover:bg-[#0059bb] hover:text-white px-5 py-2.5 rounded-full font-bold text-sm transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-[#414754]">
            <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
            <p className="text-lg font-semibold">No packages found matching your criteria.</p>
          </div>
        )}

        {/* Load More Action */}
        <div className="w-full flex justify-center mt-8">
          <button className="bg-white border border-[#717786]/30 text-[#1b1c1c] px-8 py-3 rounded-full font-bold hover:bg-[#e5e2e1] hover:border-[#717786] transition-all shadow-sm flex items-center gap-2">
            Load More Packages
            <span className="material-symbols-outlined text-[20px]">expand_more</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default Packages;
