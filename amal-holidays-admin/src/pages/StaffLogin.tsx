import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

/**
 * Wanderlust - Staff Portal Login (Refined Scale)
 * Features: High-density management UI, glassmorphism, and secure-feel accents.
 */
const StaffLogin: React.FC = () => {
  const [adminCreds, setAdminCreds] = useState({
    workEmail: '',
    password: '',
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminCreds((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email: adminCreds.workEmail, password: adminCreds.password });
      toast.success('Successfully logged in');
      navigate('/');
    } catch (error: unknown) {
      toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed');
    }
  };


  return (
    <main className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden font-['Plus_Jakarta_Sans'] antialiased">
      <Toaster />
      
      {/* Background layer (Consistent with Wanderlust Theme) */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Alpine management backdrop"
          className="w-full h-full object-cover"
          src="https://wallpapershome.com/images/pages/pic_h/6465.jpg"
        />
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Header Text - Scaled for Desktop */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Management Portal</h1>
          <p className="text-white/80 text-sm">Authorized staff access for <span className='font-nav-md'>Amal Holidays</span></p>
        </div>
    
        {/* Glassmorphic Card - Adjusted Padding */}
        <div className="bg-white/80 backdrop-blur-3xl border border-white/40 rounded-[2rem] p-8 shadow-2xl">
          <form onSubmit={handleAdminSignIn} className="space-y-4">
            
            {/* Work Email Field */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs uppercase tracking-widest text-[#1b1c1c] block px-1">Work Email</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-[20px] group-focus-within:text-[#0059bb] transition-colors">
                  badge
                </span>
                <input 
                  name="workEmail"
                  className="w-full bg-white/50 border border-[#c1c6d7] rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#0059bb] focus:border-transparent transition-all outline-none text-sm" 
                  placeholder="admin@amalholidays.com" 
                  type="email"
                  value={adminCreds.workEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="font-bold text-xs uppercase tracking-widest text-[#1b1c1c]">Secure Password</label>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-[20px] group-focus-within:text-[#0059bb] transition-colors">
                  admin_panel_settings
                </span>
                <input 
                  name="password"
                  className="w-full bg-white/50 border border-[#c1c6d7] rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#0059bb] focus:border-transparent transition-all outline-none text-sm" 
                  placeholder="••••••••" 
                  type="password"
                  value={adminCreds.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Sign In Button - Optimized Py and Text */}
            <button 
              type="submit"
              className="w-full bg-[#1b1c1c] py-3 rounded-full text-white font-bold text-base shadow-lg hover:bg-[#0059bb] active:scale-95 transition-all mt-2"
            >
              Authorize Access
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default StaffLogin;
