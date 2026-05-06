import React, { useState } from 'react';
import AddDestinationModal from '../components/AddDestinationModal';

interface Destination {
  id: number;
  name: string;
  location: string;
  tags: string[];
  description: string;
  imageUrl?: string;
}

const Destinations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock data based on your HTML structure
  const destinations: Destination[] = [
    {
      id: 1,
      name: 'Santorini',
      location: 'Greece',
      tags: ['Coastal', 'Romance'],
      description: 'Experience the breathtaking sunsets and iconic white-washed architecture overlooking the Aegean caldera.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX_2idnSwmajyDuMBC3QLopH_6tIKCjlV9Qu_Tyf3qwR1_-HknSBldgzMakbj4vJfhjKZkBkvwK1OlFu3Y9j5bWgc-pq7Tg9-thjYZgrhbvSAq1cYCtsxMLjj_n4hyjzutd3TdDJnsfdmS8OhYSfcOH079j5YTgVAiYHjVk5QtApdXDvhAeNWW3kA6BQ6TQ-_xzNgCdpSLJR2ZlpsGio1e4qdrPaT262XtPrYyEgaF0qlgROUIctmzDNfLw1YU7-lir3EUWAQrdGJs'
    },
    {
      id: 2,
      name: 'Kyoto',
      location: 'Japan',
      tags: ['Cultural', 'Serene'],
      description: 'Immerse yourself in traditional temples, tranquil gardens, and historic wooden streetscapes.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkmpKdef-Mg-ZsIOFTszYE6RL5lLLr_6eKH-VNjOZrBhBdGybCZVXbyZ4B1IUjYHdqAy4SsINddro9A3Gn9-EwO5x6EVgoen52talw96jdNcSMCNMJ4JLwpMriXOuiuTGZX2u22g8p2sf0_dG4kpjGj8K-klr6VlMh1rKZu9Y7kH0XG8881dJbhzSYJRZPJFLoL45-dv9rKuHoADM_18PjyqP8kkNFbxkXdkdqB99Jf9a9NEhXAHhczbKJQN7sUaI3KwCc1oaFaO8G'
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-transparent font-['Plus_Jakarta_Sans']">
      <AddDestinationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={() => { setIsModalOpen(false); /* refresh destinations list here */ }} />
      
      {/* Header Section */}
      <header className="px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#1b1c1c] tracking-tight">Manage Destinations</h2>
          <p className="text-[#414754] mt-1">Add, edit, or manage visibility for travel locations.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#0059bb] text-white px-6 py-3.5 rounded-full font-bold text-sm hover:scale-[1.02] transition-transform shadow-lg shadow-blue-500/20">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Destination
        </button>
      </header>

      {/* Content Area */}
      <div className="px-8 pb-12">
        
        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786]">search</span>
            <input 
              className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-md border border-white/40 rounded-full text-sm focus:border-[#0059bb] focus:ring-1 focus:ring-[#0059bb] outline-none transition-all shadow-sm" 
              placeholder="Search destinations..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Active', 'Drafts'].map((filter) => (
              <button 
                key={filter}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  filter === 'All' 
                    ? 'bg-[#0059bb] text-white shadow-md' 
                    : 'bg-white/50 text-[#414754] border border-white/50 hover:bg-white/80'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div 
              key={dest.id} 
              className="group flex flex-col rounded-[2rem] overflow-hidden border border-white/40 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 bg-white/70 backdrop-blur-xl"
            >
              {/* Image Header */}
              <div className="relative h-52 w-full bg-slate-200">
                {dest.imageUrl ? (
                  <img alt={dest.name} className="w-full h-full object-cover" src={dest.imageUrl} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#717786]/30">
                    <span className="material-symbols-outlined text-6xl">image</span>
                  </div>
                )}

                {/* Quick Edit Overlay */}
                <button className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1b1c1c] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#0059bb] shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className={`text-xl font-bold text-[#1b1c1c] `}>
                      {dest.name}, {dest.location}
                    </h3>
                    <p className="text-[11px] font-bold text-[#0059bb] uppercase tracking-widest mt-1">
                      {dest.tags.join(' • ')}
                    </p>
                  </div>
                  <button className="text-[#717786] hover:text-[#1b1c1c] transition-colors">
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </div>
                
                <p className="text-sm text-[#414754] leading-relaxed line-clamp-2 mb-6 flex-1">
                  {dest.description}
                </p>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/30 mt-auto">
                  <div className="flex items-center gap-2 text-[#717786]">
                    <span className="material-symbols-outlined text-[18px]">
                      visibility
                    </span>
                  </div>
                  <button className="text-sm font-bold text-[#0059bb] hover:underline transition-all">
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Destinations;
