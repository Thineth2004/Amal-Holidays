import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { fetchPackageById, type PackageData } from '../api/axiosInstance';
import { backend_url } from '../config/config';
import { useAuth } from '../hooks/useAuth';

const INCLUSIONS = [
  { icon: 'flight_takeoff', title: 'Premium Flights', desc: 'Round-trip flights included' },
  { icon: 'hotel', title: 'Luxury Stay', desc: 'Handpicked accommodation' },
  { icon: 'directions_car', title: 'Private Transfers', desc: 'Airport and local luxury transit' },
  { icon: 'sailing', title: 'Curated Tours', desc: 'Guided experiences & activities' },
];

const PackageDetails: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();

  const [tourPackage, setTourPackage] = useState<PackageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!packageId) return;

    const loadDetails = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPackageById(packageId);
        setTourPackage(data);
        setError(null);
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'response' in err) {
          setError((err as { response: { data: { message: string } } }).response.data.message);
        } else {
          setError('Failed to download package details.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [packageId]);

  const { isAuthenticated } = useAuth();

  const handleBooking = () => {
    if (!tourPackage) return;

    if (!isAuthenticated) {
      toast('Please sign in to continue to checkout.', { icon: '🔒' });
      navigate('/signin', { state: { from: `/packages/${packageId}` } });
      return;
    }

    toast.success(`Initializing secure checkout for ${tourPackage.title}!`);
    navigate('/checkout', { state: { packageId: tourPackage.package_id } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0059bb]"></div>
      </div>
    );
  }

  if (error || !tourPackage) {
    return (
      <div className="max-w-xl mx-auto mt-40 text-center px-6">
        <div className="bg-red-50 text-red-600 rounded-xl border border-red-200 p-6">
          <p className="font-bold">{error || 'Package could not be resolved.'}</p>
        </div>
        <button onClick={() => navigate(-1)} className="mt-4 text-[#0059bb] font-bold text-sm underline">
          Go Back
        </button>
      </div>
    );
  }

  const images = tourPackage.image_uuids.map(uuid => `${backend_url}/images/${uuid}`)

  const startDate = new Date(tourPackage.start_date);
  const endDate = new Date(tourPackage.end_date);
  const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <main className="max-w-[1280px] mx-auto px-6 pt-[100px] pb-20">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-[#414754] hover:text-[#0059bb] transition-colors mb-6"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to listings
      </button>

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1b1c1c] mb-3 leading-tight">
          {tourPackage.title}
        </h1>
        <div className="flex items-center gap-6 text-sm text-[#414754] flex-wrap">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[#0059bb] text-[18px]">calendar_today</span>
            <span>
              {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} –{' '}
              {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[#0059bb] text-[18px]">schedule</span>
            <span>{durationDays} days</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="material-symbols-outlined text-[#8d4b00] text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="font-bold text-[#1b1c1c]">4.9</span>
            <span>(128 Reviews)</span>
          </div>
        </div>
      </header>

      {/* Gallery – 5-image grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[380px] md:h-[480px] mb-12 rounded-[2rem] overflow-hidden">
        {/* Main large image */}
        <div className="md:col-span-2 h-full overflow-hidden">
          <img
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            src={images[0]}
            alt={tourPackage.title}
          />
        </div>

        {/* Middle column – 2 stacked */}
        {images.length >= 3 && (
          <div className="hidden md:grid grid-rows-2 gap-2 h-full">
            <div className="overflow-hidden">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                src={images[1]}
                alt={`${tourPackage.title} 2`}
              />
            </div>
            <div className="overflow-hidden">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                src={images[2]}
                alt={`${tourPackage.title} 3`}
              />
            </div>
          </div>
        )}

        {/* Right column – 2 stacked with "show all" overlay */}
        {images.length >= 5 && (
          <div className="hidden md:grid grid-rows-2 gap-2 h-full">
            <div className="overflow-hidden">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                src={images[3]}
                alt={`${tourPackage.title} 4`}
              />
            </div>
            <div className="overflow-hidden">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                src={images[4]}
                alt={`${tourPackage.title} 5`}
              />
            </div>
          </div>
        )}
      </section>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

        {/* ── Content Column ────────────────────────────────── */}
        <div className="lg:col-span-8 flex flex-col gap-12">

          {/* About */}
          <section>
            <h2 className="text-3xl font-bold text-[#1b1c1c] mb-4">About this experience</h2>
            <p className="text-lg text-[#414754] leading-relaxed whitespace-pre-line">
              {tourPackage.description}
            </p>
          </section>

          <hr className="border-[#c1c6d7]/30" />

          {/* What's included */}
          <section>
            <h2 className="text-2xl font-bold mb-6">What's included</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {INCLUSIONS.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2.5 rounded-full text-[#0059bb] flex-shrink-0">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1b1c1c]">{item.title}</h3>
                    <p className="text-sm text-[#414754]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-[#c1c6d7]/30" />

          {/* Trip Timeline */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Trip Timeline</h2>
            <div className="flex flex-col gap-0 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-200">
              {[
                { label: 'Departure', date: startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }), icon: 'flight_takeoff' },
                { label: `${durationDays}-Day Journey`, date: `${durationDays} days of curated exploration`, icon: 'explore' },
                { label: 'Return', date: endDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }), icon: 'flight_land' },
              ].map((step, i) => (
                <div key={i} className="relative pl-12 pb-8">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-[#0059bb] flex items-center justify-center z-10">
                    {i === 0 && <div className="w-2 h-2 rounded-full bg-[#0059bb]"></div>}
                  </div>
                  <h3 className="font-bold text-[#1b1c1c] mb-0.5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#0059bb]">{step.icon}</span>
                    {step.label}
                  </h3>
                  <p className="text-sm text-[#414754]">{step.date}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Sticky Booking Sidebar ────────────────────────── */}
        <div className="lg:col-span-4">
          <div className="sticky top-[120px]">
            <div className="bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden">
              <div className="p-8">

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-[#1b1c1c]">
                      Rs. {Number(tourPackage.price).toLocaleString()}
                    </span>
                    <span className="text-slate-500 font-medium mb-1">/ person</span>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-4 mb-8">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0059bb] mb-1">Start Date</label>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-[18px]">calendar_today</span>
                        <span className="text-sm font-semibold text-[#1b1c1c]">
                          {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0059bb] mb-1">End Date</label>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-[18px]">calendar_month</span>
                        <span className="text-sm font-semibold text-[#1b1c1c]">
                          {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0059bb] mb-1">Availability</label>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-[18px]">airline_seat_recline_normal</span>
                        <span className="text-sm font-semibold text-[#1b1c1c]">{tourPackage.available_slots} slots open</span>
                      </div>
                    </div>
                    <span
                      className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${tourPackage.available_slots > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
                    ></span>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Price per person</span>
                    <span className="font-medium text-[#1b1c1c]">Rs. {Number(tourPackage.price).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Duration</span>
                    <span className="font-medium text-[#1b1c1c]">{durationDays} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total capacity</span>
                    <span className="font-medium text-[#1b1c1c]">{tourPackage.capacity} persons</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-base font-bold text-[#1b1c1c]">Total</span>
                    <span className="text-2xl font-bold text-[#1b1c1c]">Rs. {Number(tourPackage.price).toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-center text-slate-400 mt-2 italic">Price includes all taxes and transfers</p>
                </div>

                {/* CTA */}
                <button
                  onClick={handleBooking}
                  disabled={tourPackage.available_slots <= 0}
                  className="w-full bg-[#0059bb] hover:bg-[#004494] disabled:bg-slate-400 text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                >
                  {tourPackage.available_slots > 0 ? 'Book Your Escape' : 'Fully Booked'}
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                </button>

                <p className="text-center text-xs text-slate-500 mt-4 font-medium flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  Free cancellation up to 72 hours before departure
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Reviews section */}
      <section className="mt-20 pt-10 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-10">
          <span
            className="material-symbols-outlined text-[#8d4b00] text-[32px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <h2 className="text-3xl font-bold text-[#1b1c1c]">4.9 out of 5</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            { id: 1, name: 'Sarah Jenkins', date: 'October 2023', initial: 'S', color: 'bg-blue-100 text-blue-700', content: 'Absolutely breathtaking experience. Every detail was meticulously taken care of. Highly recommend to anyone looking for a premium travel experience.' },
            { id: 2, name: 'Michael Chen', date: 'September 2023', initial: 'M', color: 'bg-emerald-100 text-emerald-700', content: 'The accommodations exceeded our expectations. The itinerary was perfectly balanced between guided tours and free time to explore at our own pace.' },
          ].map((review) => (
            <div key={review.id} className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 ${review.color}`}>
                  {review.initial}
                </div>
                <div>
                  <h4 className="font-bold text-[#1b1c1c]">{review.name}</h4>
                  <p className="text-sm text-slate-500">{review.date}</p>
                </div>
              </div>
              <p className="text-[#414754] leading-relaxed">{review.content}</p>
            </div>
          ))}
        </div>
        <button className="mt-10 border border-slate-300 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition-colors text-[#1b1c1c]">
          Show all 128 reviews
        </button>
      </section>

    </main>
  );
};

export default PackageDetails;
