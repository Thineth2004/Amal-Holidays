import React from 'react';

/** * Data Constants 
 */
const INCLUSIONS = [
  { icon: 'flight_takeoff', title: 'Premium Flights', desc: 'Round-trip business class' },
  { icon: 'hotel', title: 'Luxury Stay', desc: '6 nights in a Caldera view suite' },
  { icon: 'directions_car', title: 'Private Transfers', desc: 'Airport and local luxury transit' },
  { icon: 'sailing', title: 'Curated Tours', desc: 'Sunset cruise & wine tasting' },
];

const ITINERARY = [
  { day: 1, title: 'Arrival & Acclimation', desc: 'Arrive in Santorini. Private transfer to your cliffside suite. Evening welcome dinner overlooking the caldera.' },
  { day: 2, title: 'Exploring Oia', desc: 'Guided morning walking tour of Oia\'s iconic blue domes. Afternoon at leisure. Sunset cocktail masterclass.' },
  { day: 3, title: 'Aegean Sailing', desc: 'Private luxury catamaran cruise to the volcanic hot springs. Snorkeling and onboard barbecue lunch.' },
];

const REVIEWS = [
  { id: 1, name: 'Sarah Jenkins', date: 'October 2023', initial: 'S', color: 'bg-primary-fixed text-on-primary-fixed', content: 'Absolutely breathtaking experience. Amal-Holidays took care of every single detail. The catamaran cruise was the highlight of our trip.' },
  { id: 2, name: 'Michael Chen', date: 'September 2023', initial: 'M', color: 'bg-secondary-fixed text-on-secondary-fixed', content: 'The cliffside suite exceeded our expectations. The itinerary was perfectly balanced between guided tours and free time.' },
];

const PackageDetails: React.FC = () => {
  return (
    <main className="max-w-[1280px] mx-auto px-6 pt-[100px] pb-20">

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-[#1b1c1c] mb-2">Serene Santorini: Premium Island Escape</h1>
        <div className="flex items-center gap-6 text-sm text-[#414754]">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[#0059bb] text-[18px]">location_on</span>
            <span>Santorini, Greece</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[#8d4b00] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="font-bold text-[#1b1c1c]">4.9</span>
            <span>(128 Reviews)</span>
          </div>
        </div>
      </header>

      {/* Gallery */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] mb-12 rounded-[2rem] overflow-hidden">
        <div className="md:col-span-2 h-full overflow-hidden">
          <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDywNqqpvG0a68WZuwm6MfQAIJ5QWwg15POmKkzO5ujN6u-x0-nOlzgtXaTVpxn5jHrNcjCjUAlhBc582ZjpjzkfJ46kSgrjHzwKLmgoWJ-Un07XNs2sP2dpoNxmG3YYD80OdCJ1lYPuxThRajTjdsVNAqdXcKZ8Pyfnbttui5bcVsAbQwfJV4BGWqmRJW8YkLxJ0_ZCaabtIg4bqHps82SKjyxDgL1OwOeKP-IA_8kyrvWKooSe2Vjcsxuh42QaXB2tteCTXasX1oK" alt="Santorini View" />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-2 h-full">
          <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCe0fPTtCCd76GjAE5oaXLrO0nAqHaRGfcs6HUNysKU5sRLpghvvHwkcjnY6ORx5RsFV1g439nGOA21xT3WUsKB-0hmMu0ix6KWUb6zf7_owmBs00-XkOhA1GkoFL63aW0yK1fFBfdYYhhiBsu0lDYMLAdQhKXTEvMVPfl3_jHi6t6Ag4nx5DVNA8RqpO7w9n_43lYLyN1d-oVIB8JOsGknExjaowFEJ6QwUsrI90HzUkmF5oZ6WwzpzwmUJ3Q3vGkJE49oNuYsgFh" alt="Pool" />
          <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQBR-NL1ckfuTOhUNX0nVgevfoquHMLqDTSKLfkd76JQf7cJ1f_dWa9KDPhS5CrmM8hNMWMqWnS6CqHDrsHuLscYP8o9hCZ9ZKnWHtuHFBcuh5HJbc5kcm5AfC97q6n73RolWRYjTh7d_bG6gtJ1uHu3hCTbJMK4NTWn9ZOuRVNnyORJ7N3l5Rnldxq6Wf2JC9YNsOniMOnyNJNGl147DlJIeET8pbjd3mD_PDPZB0r5fRK0RZ5Kmf52P8bIJEplwV1cMhoAHZAqtF" alt="Dining" />
        </div>
        <div className="hidden md:block relative overflow-hidden">
          <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXUXPddTPYuvatdy5raOMKLgIQ_bfb6LKiZHLCS9C0a4QWyXrzyac6mH1ryZZ_N46SgZU8-jH14V3QT6nVIFpZrKjmy3YSXGgD6-dmpconF7uPXlOlO9LHglEbDVoKsibhvEJTBMFhVlo6xy7LIYwxt7do7YTtCBGE8oiBggHH37soy0YoQrrpLL6negLxWY5UJ6xoHOEdy40wHPsmZLOiDqdi6-bbtLtRbEm2rQh1pbcFTD1CyqBElcfwW8hyIejuy3lRJKP4s52p" alt="Room" />
          <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-black px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">grid_view</span> Show all photos
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

        {/* Content Column */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          <section>
            <h2 className="text-3xl font-bold text-[#1b1c1c] mb-4">About this experience</h2>
            <p className="text-lg text-[#414754] leading-relaxed">
              Immerse yourself in the breathtaking beauty of Santorini with our exclusive 7-day retreat.
              Designed for those seeking both relaxation and refined exploration, this package combines
              luxury cliffside accommodations with curated experiences.
            </p>
          </section>

          <hr className="border-[#c1c6d7]/30" />

          <section>
            <h2 className="text-2xl font-bold mb-6">What's included</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {INCLUSIONS.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-full text-[#0059bb]">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-[#414754]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-[#c1c6d7]/30" />

          <section>
            <h2 className="text-2xl font-bold mb-6">Detailed Itinerary</h2>
            <div className="flex flex-col gap-2 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-200">
              {ITINERARY.map((item, i) => (
                <div key={i} className="relative pl-12 pb-6">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-[#0059bb] flex items-center justify-center z-10">
                    {i === 0 && <div className="w-2 h-2 rounded-full bg-[#0059bb]"></div>}
                  </div>
                  <h3 className="font-bold text-[#1b1c1c] mb-1">Day {item.day}: {item.title}</h3>
                  <p className="text-sm text-[#414754]">{item.desc}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 text-[#0059bb] font-bold hover:underline">View full 7-day itinerary</button>
          </section>
        </div>

        {/* Sticky Booking Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-[120px]">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 shadow-xl rounded-2xl overflow-hidden">
              <div className="p-8">
                <div className="mb-8">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold">$3,250</span>
                    <span className="text-slate-500 font-medium mb-1">/ person</span>
                  </div>
                  <p className="text-sm text-slate-400 line-through mt-1">Was $3,800</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-500/20 transition-all">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">Check-in</label>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-[18px]">calendar_today</span>
                        <span className="text-sm font-semibold">Sep 12, 2024</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-500/20 transition-all">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">Check-out</label>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-[18px]">calendar_month</span>
                        <span className="text-sm font-semibold">Sep 19, 2024</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-500/20 transition-all flex justify-between items-center">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">Travelers</label>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-[18px]">group</span>
                        <span className="text-sm font-semibold">2 Adults</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">$3,250 x 2 adults</span>
                    <span className="font-medium">$6,500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Seasonal discount</span>
                    <span className="text-green-600 font-medium">-$550</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-base font-bold">Total</span>
                    <span className="text-2xl font-bold">$5,950</span>
                  </div>
                  <p className="text-[11px] text-center text-slate-400 mt-2 italic">Price includes all taxes and private transfers</p>
                </div>

                <button className="w-full bg-[#007BFF] hover:bg-blue-600 text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  Book Your Escape
                </button>
                <p className="text-center text-xs text-slate-500 mt-4 font-medium flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  No payment required at this step
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20 pt-10 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-10">
          <span className="material-symbols-outlined text-[#8d4b00] text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <h2 className="text-3xl font-bold">4.9 out of 5</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {REVIEWS.map((review) => (
            <div key={review.id} className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${review.color}`}>
                  {review.initial}
                </div>
                <div>
                  <h4 className="font-bold">{review.name}</h4>
                  <p className="text-sm text-slate-500">{review.date}</p>
                </div>
              </div>
              <p className="text-[#414754] leading-relaxed">{review.content}</p>
            </div>
          ))}
        </div>
        <button className="mt-10 border border-slate-300 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition-colors">
          Show all 128 reviews
        </button>
      </section>
    </main>
  );
};

export default PackageDetails;
