import React, { useState } from 'react';
import toast from 'react-hot-toast';

/**
 * Horizon Ethos - Sign Up Component (Refined Scale)
 * Focus: Retaining Glassmorphism while optimizing for desktop/laptop real estate.
 */
const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Account creation requested! (API integration coming soon)');
  };

  return (
    <div className="bg-[#fcf9f8] font-['Plus_Jakarta_Sans'] text-[#1b1c1c] min-h-screen flex flex-col relative overflow-x-hidden antialiased">

      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          src="/images/signup-bg.jpg"
          alt="Tropical beach sunrise"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-6 pt-20">
        {/* Adjusted padding from p-12 to p-10 and max-width refinement */}
        <div className="w-full max-w-[420px] bg-white/70 backdrop-blur-2xl border border-white/30 rounded-[2rem] px-10 py-6 shadow-2xl">

          <div className="text-center mb-5">
            {/* Scaled down from text-4xl to text-2xl */}
            <h1 className="text-2xl font-bold text-[#1b1c1c] mb-1.5">Begin Your Journey</h1>
            <p className="text-sm text-[#414754]">Join <span className='font-nav-md'>Amal Holidays</span> for exclusive travel serenity</p>
          </div>

          {/* Adjusted space-y-6 to space-y-4 for tighter vertical flow */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="block font-bold text-xs text-[#1b1c1c] ml-4 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-lg">person</span>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-[#c1c6d7] rounded-full focus:ring-2 focus:ring-[#0059bb] focus:border-[#0059bb] transition-all outline-none text-sm"
                  placeholder="John Doe"
                  type="text"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block font-bold text-xs text-[#1b1c1c] ml-4 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-lg">mail</span>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-[#c1c6d7] rounded-full focus:ring-2 focus:ring-[#0059bb] focus:border-[#0059bb] transition-all outline-none text-sm"
                  placeholder="john@horizon.com"
                  type="email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block font-bold text-xs text-[#1b1c1c] ml-4 uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-lg">lock</span>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-[#c1c6d7] rounded-full focus:ring-2 focus:ring-[#0059bb] focus:border-[#0059bb] transition-all outline-none text-sm"
                  placeholder="••••••••"
                  type="password"
                  required
                />
              </div>
            </div>

            {/* Action Button - Scaled py-4 to py-3 */}
            <button
              type="submit"
              className="w-full bg-[#0059bb] text-white py-3.5 rounded-full font-bold text-base shadow-lg hover:shadow-xl active:scale-[0.98] transition-all mt-2"
            >
              Create Account
            </button>
          </form>

          {/* Adjusted margin top from mt-12 to mt-8 */}
          <p className="text-center mt-6 text-sm text-[#414754]">
            Already have an account?
            <a className="text-[#0059bb] font-bold hover:underline ml-1" href="/signin">Sign In</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
