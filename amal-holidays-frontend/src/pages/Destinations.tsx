import React, { useState } from 'react';

/**
 * Data Types & Constants
 */
interface Destination {
  id: number;
  title: string;
  priceFrom: number;
  rating: number;
  description: string;
  image: string;
  category: string;
}

const DESTINATIONS: Destination[] = [
  {
    id: 1,
    title: 'The Maldives',
    priceFrom: 2400,
    rating: 4.9,
    category: 'Beachfront',
    description: 'Experience ultimate luxury in private overwater villas surrounded by crystal-clear Indian Ocean waters.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYiOuPcnOFhipOVUunla3KEoH06n0gcd8-k5fl7LrzwaCXk9-0dW3lwRU6VXDvENx3NoY_sPez0Cye7Ob4tNULLazw77QLrkUmq5wqtH-CPSIxIy2ErV9w9cvOdWzUuAGMJ2hIGjBnx_LYhpS6mk8U71KhgS771LyIljMUrLBcGQ9qnJTh5eohtlphJTWy1BtSKUPvLUeX1VLkBB8121OlZGbC-UILkW4n2g4i1oYqHQJOtl-YrmRXOzSjLnmJFncFCO2sja_hrFil'
  },
  {
    id: 2,
    title: 'Swiss Alps',
    priceFrom: 1850,
    rating: 4.8,
    category: 'Mountains',
    description: 'World-class skiing resorts and breathtaking alpine scenery for the perfect winter getaway.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY7wWp-MX1fUi19I2DCSWTkUSW5MBLuA6O2BKMg0freoCiROFhIklLRskoUTN91xaXrd_cu3B2fpR6h2Y6317fYv5tmhVSZdBBlXS0ZX6SsyT2efbAP7QO4mCQYIbswZRStvpfxV34IVIVxlEVPeGwn92Nj_6zgYDv_MC-PkepIG25I6czzlsIHU7ycXI8ZbkZEzeyziO5EwhQUjvorjz_q81pnoEGmwwCJljVRYQnbstC3cDlnT078IXur6ABXZwBAYT8MRxJb6oK'
  },
  {
    id: 3,
    title: 'Kyoto, Japan',
    priceFrom: 2100,
    rating: 4.9,
    category: 'Culture & City',
    description: 'Immerse yourself in rich cultural heritage, tranquil zen gardens, and spectacular seasonal colors.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsyleG04qshLlKm_P1dN5dAH-TjVNtkMPnPCTzGzqfJ5JmBa8TXKfYmg3-lsUI48m9uUw14QqYE5Pcq8KSRmriqio69hfamhSWJ3n_NAr4VrwVBnQ8kBmb3L4anOf9qNo-s67ntmA9q-AI7sWMbdYwxo7eLxA5VH3Q0SGcTFmXelrrUIEUkQgRFvGjq6F-aNvG0qBg1CrVhIUjv9xG8Wljyrh0qYiBUOBn7nHVPJPPCjcwHkNPW5JpQL1N38zcHT32bFUAY6RAqGhl'
  },
  {
    id: 4,
    title: 'Santorini',
    priceFrom: 1600,
    rating: 4.7,
    category: 'Beachfront',
    description: 'Iconic white-washed architecture, stunning sunsets, and Mediterranean charm on cliffside villages.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBakv1qIHayBAOP1hMJJdf7Jq1pW3W0QlO5xOYippz0Xl6mOYaVH8vgp2g46k6aCf9v0KDU2abIBYssAa2HCh6xicUWoeqFKFW_XNbLmwDBwdjQ4fGiw6BnOZWPJ1ThOL4u6QlRYdiVYd2Bzaz1iY9c4AZ1iEJifcF5EriI0zuAgH4RVsA92MSX92Jmh8UzPueT249L1pmwIms1fJxmz8fQqOXGO7gAwehqscwHdcfv1F3WrmQ8LOlbTE7mgkPLJbA27gwCuV8ja_1v'
  },
  {
    id: 5,
    title: 'Machu Picchu',
    priceFrom: 1950,
    rating: 4.9,
    category: 'Mountains',
    description: 'Journey through history to the breathtaking lost city of the Incas hidden high in the Andes.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDr5kQ8T7aDz_IHDFHq2X-XssODhIgbzsHZFh-9DIYkroEoYYkgWmrvBjcAyYVmFTf4aludfGZEBTveOPTc33K5WkWqy3BGmtPhoYLhqi6GgItzuTeWXOKbmXqZryjYs-UMOqByX0sg2IwQxHWVV1RUxQQjC9UwQVhrhVHWDFefqbdl3_okvRSw6XI37cBJeGtRi6fDmKi7zOqyiFSRLyL_37RZQerszzuHq3zICFpT-ivivNi-axMafVBu0q9E3Auwx2TjTPPKJYam'
  },
  {
    id: 6,
    title: 'Serengeti',
    priceFrom: 3200,
    rating: 4.9,
    category: 'Adventure',
    description: 'Embark on the ultimate safari adventure to witness incredible wildlife and the great migration.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIdNnlFzTZhd7HGPN-WjQS2-29RL-c4S7hLjSpr1qTJ4bJLG7VrBl6SF09nWeZewOfQEpqI8LoJKTfFR0bFK6XefVQgOc4kkEQvRdBQEVUukveoN7E9jfVevkqUtTbXLRUWTDmcw5GjFOQ0hpOMgt6OfoRABs42XkiRRQLXGzMKefu7F37jiO5V-RE8Xx4nLY9UaZicljR7yYSVL9Dsyw9d19Rav0nPIBl5u9AZJcjbsHXqlv_SqEh0bkGHNanwpuQRI4U1xR8i8oN'
  }
];

const FILTERS = ['All', 'Beachfront', 'Mountains', 'Culture'];

const Destinations: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <main className="flex-grow pt-32 pb-20 max-w-[1280px] mx-auto px-6 w-full">

      {/* Header & Filter Bar */}
      <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-[#1b1c1c] mb-2">Discover Your Next Escape</h1>
          <p className="text-lg text-[#414754] max-w-2xl">
            Curated destinations offering unparalleled experiences, from serene beaches to majestic mountains.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto md:items-end">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-[20px]">search</span>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 rounded-full border border-[#c1c6d7] bg-white text-[#1b1c1c] focus:border-[#0059bb] focus:ring-1 focus:ring-[#0059bb] outline-none transition-all placeholder:text-[#c1c6d7] shadow-sm"
              placeholder="Search destinations..."
            />
          </div>
          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full font-bold border text-sm whitespace-nowrap transition-all ${activeFilter === filter
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

      {/* Destinations Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DESTINATIONS.map((dest) => (
          <article
            key={dest.id}
            className="flex flex-col bg-white rounded-lg shadow-[0_6px_16px_rgba(0,0,0,0.06)] overflow-hidden group hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <img
                src={dest.image}
                alt={dest.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-[#b15f00]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-xs font-bold text-[#1b1c1c]">{dest.rating}</span>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col flex-grow bg-white">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold text-[#1b1c1c]">{dest.title}</h2>
                <span className="text-sm text-[#414754] mt-1 font-medium">from ${dest.priceFrom.toLocaleString()}</span>
              </div>
              <p className="text-sm text-[#414754] mb-6 flex-grow line-clamp-2">
                {dest.description}
              </p>
              <button className="w-full py-3 rounded-full bg-[#eae7e7] text-[#1b1c1c] font-bold group-hover:bg-[#0059bb] group-hover:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                View Packages
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Load More Button */}
      <div className="mt-20 flex justify-center">
        <button className="px-8 py-3 rounded-full border border-[#717786] text-[#1b1c1c] font-bold hover:bg-[#e5e2e1] transition-colors shadow-sm">
          Load More Destinations
        </button>
      </div>
    </main>
  );
};

export default Destinations;
