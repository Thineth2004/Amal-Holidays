import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { fetchPackageById, type PackageData } from '../api/axiosInstance';
import { backend_url } from '../config/config';

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

  const handleBooking = () => {
    toast.success(`Initializing secure checkout for ${tourPackage?.title}!`);
    // Future expansion: navigate(`/checkout?package=${packageId}`);
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

  return (
    <main className="pt-32 pb-20 max-w-[1024px] mx-auto px-6 w-full">
      {/* Back button link row */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-[#414754] hover:text-[#0059bb] transition-colors mb-6"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to listings
      </button>

      {/* Main Grid Splitting Layout Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Aspect Side: Main Banner Imagery and Info Writeup */}
        <section className="lg:col-span-2 flex flex-col gap-6">
          {tourPackage.image_uuids && tourPackage.image_uuids.length > 0 ? (
            <div className={`grid gap-2 ${tourPackage.image_uuids.length >= 3 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'} rounded-2xl overflow-hidden aspect-[16/9] bg-gray-100 shadow-sm`}>
              <div className={`w-full h-full col-span-1 ${tourPackage.image_uuids.length >= 3 ? 'md:col-span-2 row-span-2' : ''}`}>
                <img 
                  src={`${backend_url}/images/${tourPackage.image_uuids[0]}`} 
                  alt={tourPackage.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              {tourPackage.image_uuids.slice(1, 5).map((uuid, index) => (
                <div key={uuid} className="hidden md:block w-full h-full">
                  <img 
                    src={`${backend_url}/images/${uuid}`} 
                    alt={`${tourPackage.title} image ${index + 2}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-sm bg-gray-100">
              <img 
                src={`${backend_url}/images/${tourPackage.image_uuids[0]}`} 
                alt={tourPackage.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1b1c1c] tracking-tight leading-tight mb-3">
              {tourPackage.title}
            </h1>
            <p className="text-xs text-[#717786] font-bold flex items-center gap-1 uppercase tracking-wider mb-6">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              Itinerary Period: {new Date(tourPackage.start_date).toLocaleDateString()} to {new Date(tourPackage.end_date).toLocaleDateString()}
            </p>
            
            <h3 className="text-xl font-bold text-[#1b1c1c] mb-2">Overview Description</h3>
            <p className="text-base text-[#414754] leading-relaxed whitespace-pre-line">
              {tourPackage.description}
            </p>
          </div>
        </section>

        {/* Right Aspect Side: Checkout Sticky Action Widget Box */}
        <aside className="bg-white border border-[#eae7e7] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-36">
          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#717786]">Price per head</span>
            <p className="text-3xl font-black text-[#1b1c1c] mt-0.5">
              Rs. {Number(tourPackage.price).toLocaleString()}
            </p>
          </div>

          {/* Allocation slots progress indicator layout strip */}
          <div className="bg-[#eae7e7]/30 border border-[#eae7e7]/60 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0059bb]">airline_seat_recline_normal</span>
              <div>
                <p className="text-xs font-bold text-[#1b1c1c]">Availability Status</p>
                <p className="text-xs text-[#717786] font-medium">{tourPackage.available_slots} slots open out of {tourPackage.capacity}</p>
              </div>
            </div>
            <span className={`h-2.5 w-2.5 rounded-full ${tourPackage.available_slots > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
          </div>

          <button 
            onClick={handleBooking}
            disabled={tourPackage.available_slots <= 0}
            className="w-full py-4 rounded-full bg-[#0059bb] hover:bg-[#004494] disabled:bg-[#717786] text-white text-base font-extrabold shadow-md transition-colors flex items-center justify-center gap-2"
          >
            {tourPackage.available_slots > 0 ? 'Instant Reservation' : 'Fully Booked'}
            <span className="material-symbols-outlined text-[20px]">bolt</span>
          </button>
          
          <p className="text-center text-[11px] text-[#717786] mt-3 font-medium">
            Free cancellation option details apply up to 72 hours beforehand.
          </p>
        </aside>

      </div>
    </main>
  );
};

export default PackageDetails;
