import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import api, { type HotelData, type StaffData } from '../api/axiosInstance';
import { backend_url } from '../config/config';
import toast from 'react-hot-toast';

interface HotelServicesState {
  packageId: number | string;
  price: number;
  durationDays: number;
}

const HotelServices: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as HotelServicesState | undefined;

  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [drivers, setDrivers] = useState<StaffData[]>([]);
  const [guides, setGuides] = useState<StaffData[]>([]);

  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
  const [hotelRooms, setHotelRooms] = useState<number>(1);
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<number | null>(null);

  useEffect(() => {
    if (!state?.packageId) {
      toast.error('No package selected.');
      navigate(-1);
      return;
    }

    const fetchData = async () => {
      try {
        const [hotelsRes, driversRes, guidesRes] = await Promise.all([
          api.get('/hotels'),
          api.get('/drivers'),
          api.get('/tour-guides')
        ]);
        setHotels(hotelsRes.data);
        setDrivers(driversRes.data);
        setGuides(guidesRes.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error('Failed to load optional services.');
      }
    };
    fetchData();
  }, [state, navigate]);

  if (!state) return null;

  const getHotelCost = () => {
    if (!selectedHotel) return 0;
    const hotel = hotels.find(h => h.hotel_id === selectedHotel);
    if (!hotel) return 0;
    return hotel.price_per_night * hotelRooms * state.durationDays;
  };

  const getDriverCost = () => {
    if (!selectedDriver) return 0;
    const driver = drivers.find(d => d.user_id === selectedDriver);
    if (!driver) return 0;
    return driver.price_per_day * state.durationDays;
  };

  const getGuideCost = () => {
    if (!selectedGuide) return 0;
    const guide = guides.find(g => g.user_id === selectedGuide);
    if (!guide) return 0;
    return guide.price_per_day * state.durationDays;
  };

  const packageCost = Number(state.price);
  const totalCost = packageCost + getHotelCost() + getDriverCost() + getGuideCost();

  const handleProceed = () => {
    navigate('/checkout', {
      state: {
        packageId: state.packageId,
        hotel_id: selectedHotel,
        hotel_rooms: selectedHotel ? hotelRooms : undefined,
        hotel_cost: getHotelCost(),
        driver_id: selectedDriver,
        driver_cost: getDriverCost(),
        tour_guide_id: selectedGuide,
        tour_guide_cost: getGuideCost(),
        total_price: totalCost
      }
    });
  };

  return (
    <main className="max-w-[1280px] mx-auto px-6 pt-[100px] pb-32">
      <h1 className="text-4xl font-extrabold text-[#1b1c1c] mb-2">Enhance Your Trip (Optional)</h1>
      <p className="text-[#717786] mb-10">Select a hotel, driver, or tour guide to make your experience perfect.</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 flex flex-col gap-12">
          
          {/* Hotels Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2"><span className="material-symbols-outlined text-[#0059bb]">hotel</span> Select a Hotel</h2>
              {selectedHotel && <button onClick={() => setSelectedHotel(null)} className="text-sm font-bold text-red-500 hover:text-red-700">Clear</button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hotels.map(hotel => (
                <div 
                  key={hotel.hotel_id} 
                  onClick={() => setSelectedHotel(hotel.hotel_id)}
                  className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${selectedHotel === hotel.hotel_id ? 'border-[#0059bb] bg-blue-50/50 shadow-md' : 'border-slate-200 hover:border-blue-300 bg-white'}`}
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                      {hotel.image_uuid ? <img src={`${backend_url}/images/${hotel.image_uuid}`} className="w-full h-full object-cover" alt={hotel.name} /> : null}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{hotel.name}</h3>
                      <p className="text-xs text-slate-500 mb-2">{hotel.location} • {hotel.rating} Stars</p>
                      <p className="font-bold text-[#0059bb]">Rs. {hotel.price_per_night}/night</p>
                    </div>
                  </div>
                  {selectedHotel === hotel.hotel_id && (
                    <div className="mt-4 pt-4 border-t border-[#0059bb]/20">
                      <label className="text-sm font-bold text-[#1b1c1c] mr-4">Rooms:</label>
                      <input 
                        type="number" min="1" max="10" 
                        value={hotelRooms} 
                        onChange={(e) => setHotelRooms(Number(e.target.value))}
                        className="border border-slate-300 rounded p-1 w-16 text-center"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Drivers Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2"><span className="material-symbols-outlined text-[#0059bb]">directions_car</span> Select a Driver</h2>
              {selectedDriver && <button onClick={() => setSelectedDriver(null)} className="text-sm font-bold text-red-500 hover:text-red-700">Clear</button>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {drivers.map(driver => (
                <div 
                  key={driver.user_id} 
                  onClick={() => setSelectedDriver(driver.user_id)}
                  className={`border-2 rounded-2xl p-4 cursor-pointer text-center transition-all ${selectedDriver === driver.user_id ? 'border-[#0059bb] bg-blue-50/50 shadow-md' : 'border-slate-200 hover:border-blue-300 bg-white'}`}
                >
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-slate-200 mb-3 border-2 border-white shadow">
                    {driver.image_uuid ? <img src={`${backend_url}/images/${driver.image_uuid}`} className="w-full h-full object-cover" alt={driver.name} /> : null}
                  </div>
                  <h3 className="font-bold text-[#1b1c1c]">{driver.name}</h3>
                  <p className="font-bold text-[#0059bb] text-sm mt-1">Rs. {driver.price_per_day}/day</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Guides Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2"><span className="material-symbols-outlined text-[#0059bb]">tour</span> Select a Tour Guide</h2>
              {selectedGuide && <button onClick={() => setSelectedGuide(null)} className="text-sm font-bold text-red-500 hover:text-red-700">Clear</button>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {guides.map(guide => (
                <div 
                  key={guide.user_id} 
                  onClick={() => setSelectedGuide(guide.user_id)}
                  className={`border-2 rounded-2xl p-4 cursor-pointer text-center transition-all ${selectedGuide === guide.user_id ? 'border-[#0059bb] bg-blue-50/50 shadow-md' : 'border-slate-200 hover:border-blue-300 bg-white'}`}
                >
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-slate-200 mb-3 border-2 border-white shadow">
                    {guide.image_uuid ? <img src={`${backend_url}/images/${guide.image_uuid}`} className="w-full h-full object-cover" alt={guide.name} /> : null}
                  </div>
                  <h3 className="font-bold text-[#1b1c1c]">{guide.name}</h3>
                  <p className="font-bold text-[#0059bb] text-sm mt-1">Rs. {guide.price_per_day}/day</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sticky Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-[120px] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-xl font-bold mb-6">Cost Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Package Cost</span>
                  <span className="font-medium">Rs. {packageCost.toLocaleString()}</span>
                </div>
                {selectedHotel && (
                  <div className="flex justify-between text-sm text-[#0059bb]">
                    <span>Hotel ({hotelRooms} room{hotelRooms > 1 ? 's' : ''})</span>
                    <span className="font-medium">+ Rs. {getHotelCost().toLocaleString()}</span>
                  </div>
                )}
                {selectedDriver && (
                  <div className="flex justify-between text-sm text-[#0059bb]">
                    <span>Driver ({state.durationDays} days)</span>
                    <span className="font-medium">+ Rs. {getDriverCost().toLocaleString()}</span>
                  </div>
                )}
                {selectedGuide && (
                  <div className="flex justify-between text-sm text-[#0059bb]">
                    <span>Tour Guide ({state.durationDays} days)</span>
                    <span className="font-medium">+ Rs. {getGuideCost().toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 mb-8 flex justify-between items-center">
                <span className="text-lg font-bold text-[#1b1c1c]">Total</span>
                <span className="text-2xl font-bold text-[#1b1c1c]">Rs. {totalCost.toLocaleString()}</span>
              </div>

              <button 
                onClick={handleProceed}
                className="w-full py-4 bg-[#0059bb] text-white rounded-full font-bold text-lg hover:bg-[#004494] transition-colors shadow-lg active:scale-95"
              >
                Proceed to Checkout
              </button>
              <div className="text-center mt-4">
                <button onClick={() => navigate('/checkout', { state: { packageId: state.packageId, total_price: packageCost } })} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                  Skip & go to checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HotelServices;
