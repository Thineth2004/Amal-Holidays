import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { fetchPackageById, createBooking, createPayment, type PackageData } from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import { backend_url } from '../config/config';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const maybeAxiosError = error as { response?: { data?: { message?: string } } };
    return maybeAxiosError.response?.data?.message ?? 'Checkout failed.';
  }

  return 'Checkout failed.';
};

const Checkout: React.FC = () => {
  interface CheckoutLocationState {
    packageId: number | string;
    hotel_id?: number;
    hotel_rooms?: number;
    hotel_cost?: number;
    driver_id?: number;
    driver_cost?: number;
    tour_guide_id?: number;
    tour_guide_cost?: number;
    total_price?: number;
  }

  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as CheckoutLocationState | undefined;
  const { isAuthenticated } = useAuth();

  const [pkg, setPkg] = useState<PackageData | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!state?.packageId) {
      toast.error('No package selected for checkout.');
      navigate(-1);
      return;
    }

    const load = async () => {
      try {
        const data = await fetchPackageById(state.packageId);
        setPkg(data);
      } catch {
        toast.error('Failed to load package for checkout.');
        navigate(-1);
      }
    };

    load();
  }, [state, navigate]);

  useEffect(() => {
    if (!pkg) return;
    if (!isAuthenticated) {
      toast('Please sign in to complete booking', { icon: '🔒' });
      navigate('/signin', { state: { from: `/packages/${pkg.package_id}` } });
      return;
    }

    const doCheckout = async () => {
      try {
        setStatus('processing');
        setMessage('Creating booking...');

        const bookingResp = await createBooking({
          package_id: Number(pkg.package_id),
          no_of_travelers: 1,
          travel_date: pkg.start_date,
          hotel_id: state?.hotel_id,
          hotel_rooms: state?.hotel_rooms,
          hotel_cost: state?.hotel_cost,
          driver_id: state?.driver_id,
          driver_cost: state?.driver_cost,
          tour_guide_id: state?.tour_guide_id,
          tour_guide_cost: state?.tour_guide_cost,
          total_price: state?.total_price
        });

        const booking = bookingResp.data;

        setMessage('Processing payment (simulated)...');

        // Simulate card processing delay
        await new Promise((resolve) => setTimeout(resolve, 2500));

        const amount = Number(booking.total_price ?? pkg.price);
        await createPayment({ booking_id: booking.booking_id, amount, payment_method: 'Credit Card' });

        setStatus('success');
        setMessage('Checkout complete. Thank you!');
        toast.success('Checkout complete — booking confirmed.');

        setTimeout(() => navigate(`/packages/${pkg.package_id}`), 2000);
      } catch (err: unknown) {
        setStatus('error');
        const messageText = getErrorMessage(err);
        setMessage(messageText);
        toast.error(messageText);
      }
    };

    // start the flow automatically when page loads
    doCheckout();
  }, [pkg, isAuthenticated, navigate, state]);

  return (
    <main className="min-h-screen flex items-center justify-center py-28 px-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-2">Checkout</h1>
          <p className="text-sm text-slate-500 mb-6">Secure checkout — automatic processing (demo)</p>

          {pkg && (
            <div className="flex gap-4 items-center mb-6">
              <img src={`${backend_url}/images/${pkg.image_uuids[0]}`} alt="pkg" className="w-28 h-20 object-cover rounded-md" />
              <div>
                <h2 className="font-bold text-lg">{pkg.title}</h2>
                <p className="text-sm text-slate-600">Rs. {Number(state?.total_price || pkg.price).toLocaleString()} — 1 traveller</p>
                {(state?.hotel_id || state?.driver_id || state?.tour_guide_id) && (
                  <p className="text-xs text-[#0059bb] font-semibold mt-1">Includes optional services</p>
                )}
              </div>
            </div>
          )}

          <div className="border rounded-md p-6 text-center">
            {status === 'processing' && (
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0059bb]"></div>
                <p className="text-sm font-semibold">{message}</p>
                <p className="text-xs text-slate-400">Simulating card authorization and network operations.</p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl">✅</div>
                <p className="text-lg font-bold">{message}</p>
                <p className="text-sm text-slate-500">You will receive a confirmation email shortly.</p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-3xl">❌</div>
                <p className="text-lg font-bold">{message}</p>
                <button onClick={() => navigate(-1)} className="mt-3 text-sm text-[#0059bb] underline">Return</button>
              </div>
            )}

            {status === 'idle' && (
              <div className="text-sm text-slate-500">Preparing checkout...</div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
};

export default Checkout;
