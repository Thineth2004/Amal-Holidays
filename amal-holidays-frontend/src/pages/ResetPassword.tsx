import React, { useState } from 'react';
import toast from 'react-hot-toast';

/**
 * Wanderlust - Password Reset Component (Desktop Refined)
 * Features: High-density Glassmorphism UI, scaled for laptop/desktop views.
 */
const PasswordReset: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Password reset request submitted successfully!');
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Alpine landscape"
          className="w-full h-full object-cover"
          src="/images/reset-password-bg.jpg"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Form Container - Optimized Max-Width */}
      <div className="relative z-10 w-full max-w-[400px] px-6">
        {/* Adjusted padding from p-12 to p-8 */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/30 rounded-[2rem] p-8 shadow-2xl">
          
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#1b1c1c] mb-1.5">Reset Password</h1>
            <p className="text-sm text-[#414754]">
              Verify your identity to secure your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs uppercase tracking-wide text-[#1b1c1c] block px-1">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-lg">mail</span>
                <input
                  name="email"
                  className="w-full bg-white/50 border border-[#c1c6d7] rounded-full py-3 pl-11 pr-4 focus:ring-2 focus:ring-[#0059bb] focus:border-transparent transition-all outline-none text-sm"
                  placeholder="name@example.com"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Verification Code Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="font-bold text-xs uppercase tracking-wide text-[#1b1c1c]">Verification Code</label>
                <a className="text-[10px] font-bold text-[#0059bb] hover:underline uppercase tracking-tighter" href="#">Resend Code</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-lg">dialpad</span>
                <input
                  name="code"
                  className="w-full bg-white/50 border border-[#c1c6d7] rounded-full py-3 pl-11 pr-4 focus:ring-2 focus:ring-[#0059bb] focus:border-transparent transition-all outline-none text-sm"
                  placeholder="6-digit code"
                  type="text"
                  maxLength={6}
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs uppercase tracking-wide text-[#1b1c1c] block px-1">New Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-lg">lock</span>
                <input
                  name="newPassword"
                  className="w-full bg-white/50 border border-[#c1c6d7] rounded-full py-3 pl-11 pr-4 focus:ring-2 focus:ring-[#0059bb] focus:border-transparent transition-all outline-none text-sm"
                  placeholder="••••••••"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* CTA Button - Scaled py-3 for desktop precision */}
            <button
              type="submit"
              className="w-full bg-[#0059bb] py-3 rounded-full text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all mt-2"
            >
              Confirm Reset
            </button>

            <div className="mt-6 text-center">
              <a className="text-xs font-bold text-[#414754] hover:text-[#0059bb] uppercase tracking-wide transition-colors inline-flex items-center gap-1.5" href="/signin">
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Back to Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default PasswordReset;
