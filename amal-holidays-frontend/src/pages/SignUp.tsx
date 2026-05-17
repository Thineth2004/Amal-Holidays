import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

/**
 * Horizon Ethos - Sign Up Component (Refined Scale)
 * Focus: Retaining Glassmorphism while optimizing for desktop/laptop real estate.
 */
const SignUp: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Defaulting role to 'Tourist' as this is a signup page
      await register(formData.fullName, formData.email, formData.password, 'Tourist');
      toast.success('Account created successfully!');
      navigate('/signin');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="w-full max-w-[420px] bg-white/70 backdrop-blur-2xl border border-white/30 rounded-[2rem] px-10 py-6 shadow-2xl">

          <div className="text-center mb-5">
            <h1 className="text-2xl font-bold text-[#1b1c1c] mb-1.5">Begin Your Journey</h1>
            <p className="text-sm text-[#414754]">Join <span className='font-nav-md'>Amal Holidays</span> for exclusive travel serenity</p>
          </div>

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
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-[#c1c6d7] rounded-full focus:ring-2 focus:ring-[#0059bb] focus:border-[#0059bb] transition-all outline-none text-sm disabled:opacity-50"
                  placeholder="John Doe"
                  type="text"
                  required
                  disabled={isSubmitting}
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
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-[#c1c6d7] rounded-full focus:ring-2 focus:ring-[#0059bb] focus:border-[#0059bb] transition-all outline-none text-sm disabled:opacity-50"
                  placeholder="john@horizon.com"
                  type="email"
                  required
                  disabled={isSubmitting}
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
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-[#c1c6d7] rounded-full focus:ring-2 focus:ring-[#0059bb] focus:border-[#0059bb] transition-all outline-none text-sm disabled:opacity-50"
                  placeholder="••••••••"
                  type="password"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0059bb] text-white py-3.5 rounded-full font-bold text-base shadow-lg hover:shadow-xl active:scale-[0.98] transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

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
