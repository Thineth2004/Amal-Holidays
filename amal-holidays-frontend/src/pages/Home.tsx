import React, { useState, useEffect, useRef, useMemo } from 'react';
import toast from 'react-hot-toast';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const allDestinations = useMemo(() => [
    'Bora Bora, French Polynesia',
    'Maldives, South Asia',
    'Dubai, UAE',
    'Machu Picchu, Peru',
    'Kyoto, Japan',
    'Venice, Italy',
    'London, UK',
    'Agra, India',
    'Santorini, Greece',
    'Bali, Indonesia',
    'Swiss Alps, Switzerland'
  ], []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 0) {
      const filtered = allDestinations.filter(d =>
        d.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      toast.success(`Searching for adventures in ${searchQuery}...`);
    } else {
      toast.error('Please enter a destination to search.');
    }
    console.log('Searching for:', searchQuery);
    setShowSuggestions(false);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center px-gutter bg-surface-container-lowest">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            className="w-full h-full object-cover"
            data-alt="Stunning sunset over a calm ocean with a picturesque wooden pier extending into the water, warm golden and pink hues in the sky"
            src="/images/hero-bg.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-surface-container-lowest/10"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col gap-md text-white">
          <h1 className="font-headline-xl text-headline-xl text-white drop-shadow-lg">
            Discover Your Next <br /> Extraordinary Holiday
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 drop-shadow-md max-w-2xl mx-auto">
            Experience Sri Lanka's most breathtaking destinations with our curated premium travel packages designed for pure serenity.
          </p>
        </div>

        {/* Omni-Search Bar (Glassmorphic) */}
        <div className="relative z-20 w-full max-w-3xl mx-auto mt-8" ref={suggestionRef}>
          <form
            onSubmit={handleSearch}
            className="bg-white/70 backdrop-blur-[20px] border border-white rounded-full shadow-[0px_8px_32px_rgba(0,0,0,0.1)] flex items-center"
          >
            <div className="flex-1 flex items-center justify-between pl-6 pr-4 py-2 rounded-full transition-colors w-full group">
              <div className="flex items-center gap-sm py-2 flex-1">
                <span className="material-symbols-outlined text-outline">location_on</span>
                <div className="flex flex-col flex-1">
                  <input
                    id="destination"
                    type="text"
                    autoComplete="off"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Where to?"
                    className="bg-transparent border-none outline-none text-xl text-on-surface placeholder:text-on-surface-variant/40 w-full"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary text-on-primary p-4 rounded-full flex items-center justify-center hover:scale-105 hover:shadow-md active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>
                  search
                </span>
              </button>
            </div>
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2rem] shadow-2xl overflow-hidden py-4 z-30">
              {suggestions.map((dest, index) => (
                <button
                  key={index}
                  onClick={() => { setSearchQuery(dest); setShowSuggestions(false); }}
                  className="w-full text-left px-8 py-4 hover:bg-black/5 flex items-center gap-4 transition-colors"
                >
                  <span className="material-symbols-outlined text-outline">history</span>
                  <span className="font-medium text-on-surface">{dest}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-container-max mx-auto px-gutter py-lg flex flex-col gap-lg">
        <div className="flex flex-col gap-xs">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Featured Destinations</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Explore our hand-picked locations for your perfect getaway.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[500px]">

          {/* Large Main Slot */}
          <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer shadow-[0px_6px_16px_rgba(0,0,0,0.06)]">
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="/images/placeholders/1.jpeg"
              alt="Destination 1"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            <div className="absolute bottom-3 left-5 p-4 text-white">
              <h3 className="font-label-bold text-2xl drop-shadow-md">Randenigala</h3>
            </div>
          </div>

          {/* Narrow vertical slot */}
          <div className="row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer shadow-[0px_6px_16px_rgba(0,0,0,0.06)]">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="/images/placeholders/2.jpeg" alt="Destination 2" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <h3 className="font-label-bold text-lg drop-shadow-md">Kandy</h3>
            </div>
          </div>

          {/* Small horizontal slot */}
          <div className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-[0px_6px_16px_rgba(0,0,0,0.06)]">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="/images/placeholders/3.jpeg" alt="Destination 3" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <h3 className="font-label-bold text-lg drop-shadow-md">Nuwara Eliya</h3>
            </div>
          </div>
          
          {/* Small horizontal slot */}
          <div className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-[0px_6px_16px_rgba(0,0,0,0.06)]">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="/images/placeholders/4.jpeg" alt="Destination 4" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <h3 className="font-label-bold text-lg drop-shadow-md">Matale</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tours */}
      <section className=" w-full">
        <div className="max-w-container-max mx-auto px-gutter py-lg flex flex-col gap-lg">
          <div className="flex flex-col gap-xs">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Popular Tours</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Top-rated experiences tailored for unforgettable memories.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">

            {/* Tour Card 1 */}
            <div className="flex flex-col gap-xs group cursor-pointer">
              <div className="aspect-[4/3] rounded-lg overflow-hidden relative shadow-[0px_6px_16px_rgba(0,0,0,0.06)]">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  data-alt="Beautiful view of the Taj Mahal at sunrise, glowing softly against a misty pink and orange sky, serene reflecting pool in foreground"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2ZIlAXAbhQhGNC6rh3WLF6iPYtGoqWTfjz_wUe3FRO9rE4zTolUnjvmhhlI45mTspzzwb8lpmmTQqN3ezXRUz6WobW5rvxdzxIIE7Kp98k3uPN7Tj0pjYSGx-UBYhuhUcoM-lfYYCO9JDjC0QY_Jpwz407aX9O3oReq6ycmYzeV_noVQ1zuP-gN6OoqBO-WYTalYOoijoY1472QEbvZVXskaf_6i-fYacVUD3uCZRn3c__gA5q36YSYos_GfruutxB-BANN-ir54o"
                />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-on-surface text-sm">favorite</span>
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-label-bold text-label-bold text-on-surface truncate pr-4">Golden Triangle Splendor</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="material-symbols-outlined text-sm" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-body-sm text-body-sm">4.9</span>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">India • 7 Days</p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="font-label-bold text-label-bold text-on-surface">$1,299</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">/ person</span>
                </div>
              </div>
            </div>

            {/* Tour Card 2 */}
            <div className="flex flex-col gap-xs group cursor-pointer">
              <div className="aspect-[4/3] rounded-lg overflow-hidden relative shadow-[0px_6px_16px_rgba(0,0,0,0.06)]">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  data-alt="Classic view of the London Eye and Big Ben across the river Thames at twilight, city lights reflecting in the water"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr8qCczGtlh91-Yq9zBzrwK12s7VF3wq01VOzW5hSzft40japq75v5MaXYfSRKO6uxM7HHOOTy5nRgiFoQc-vBHxmJe43A4Ade98yEgSXlC06kP-_hKOxfaTX3GTsNUUIqoPM5QNeV_WlrhiOXWLUUzhghGwJX84nG9WqCJulzjrbSmOxJKLJTzICz4TaKyQxNMuuuzBUy9ft0-TdrnlIisjG9_U0xXA6Q9jvYj-BTO0b2dd3BBVzFWBEcyLxUcSkEFMkaDeoiPwXs"
                />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-on-surface text-sm">favorite</span>
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-label-bold text-label-bold text-on-surface truncate pr-4">Classic London Walk</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="material-symbols-outlined text-sm" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-body-sm text-body-sm">4.8</span>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">United Kingdom • 4 Days</p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="font-label-bold text-label-bold text-on-surface">$850</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">/ person</span>
                </div>
              </div>
            </div>

            {/* Tour Card 3 */}
            <div className="flex flex-col gap-xs group cursor-pointer">
              <div className="aspect-[4/3] rounded-lg overflow-hidden relative shadow-[0px_6px_16px_rgba(0,0,0,0.06)]">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  data-alt="Beautiful canal in Venice, Italy with gondolas floating on calm water, historic colorful buildings lining the narrow waterway"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7jfv1DIOVKhqPiwghxeCBO4AnR43YXPHsjjtbHQBckINrGWO1X3ZjrQsnXPZwe81OPOtcme_bpjXS1UX2E4VZ0lzpkLQbSw0iuX6rLuIb4esxq4IxZOpDzqT1qJGk1AhbhHrfUdGZbG6e-anPIJ58MWhq-yof3xM-NeyeDa6wKReTQ4ziDfqoTThCZVd2WGtQVG88vIR-zA8Mxlwibfs6u_LTv1T82B9lvM9UwyQ8G_aGShfzjYg2MPqRHVxabjXtNZ2o1NwNbCE3"
                />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-on-surface text-sm">favorite</span>
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-label-bold text-label-bold text-on-surface truncate pr-4">Venetian Romance</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="material-symbols-outlined text-sm" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-body-sm text-body-sm">5.0</span>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Italy • 5 Days</p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="font-label-bold text-label-bold text-on-surface">$1,420</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">/ person</span>
                </div>
              </div>
            </div>

            {/* Tour Card 4 */}
            <div className="flex flex-col gap-xs group cursor-pointer">
              <div className="aspect-[4/3] rounded-lg overflow-hidden relative shadow-[0px_6px_16px_rgba(0,0,0,0.06)]">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  data-alt="Breathtaking view of a bamboo forest path in Kyoto, Japan, tall green bamboo stalks creating a serene tunnel effect"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgIkoykHomVtZ6G3S0FyGoiN6YIOQN4IWwh0FRoAg3wLAw_Mo_5BdHUrcNb1_pZSB2GTGJtP2iQOKz6cUOduHZ52oNhbCFUztgGEuaWOeprn7ERx00oeMCtlgqQd4fETwvSMj_mT-SsFcvggPXpJ8LT0E8YAuvr3Yo5hY-iT5L9tsVv5n-Ac-ruHzUtctOV3H2qti2TBIAox2N8S49rgIe8a4Kxqsj-6EMPFZhTtBvT6nATvZfU8MPUjCP6CN0vysMyiG4UYWbNRI3"
                />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-on-surface text-sm">favorite</span>
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-label-bold text-label-bold text-on-surface truncate pr-4">Kyoto Zen Gardens</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="material-symbols-outlined text-sm" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-body-sm text-body-sm">4.9</span>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Japan • 10 Days</p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="font-label-bold text-label-bold text-on-surface">Rs.4,000</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">/ person</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-container-max mx-auto px-gutter py-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg text-center">
          <div className="flex flex-col items-center gap-sm">
            <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-2 shadow-sm">
              <span className="material-symbols-outlined text-[32px]">support_agent</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface">24/7 Expert Support</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">Our travel concierges are available around the clock to ensure your journey is seamless.</p>
          </div>
          <div className="flex flex-col items-center gap-sm">
            <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-2 shadow-sm">
              <span className="material-symbols-outlined text-[32px]">verified</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Curated Quality</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">Every destination and accommodation is personally vetted to meet our premium standards.</p>
          </div>
          <div className="flex flex-col items-center gap-sm">
            <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-2 shadow-sm">
              <span className="material-symbols-outlined text-[32px]">eco</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Sustainable Travel</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">We partner with eco-conscious providers to minimize our footprint and preserve beauty.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home
