import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

/**
 * Wanderlust - Log In Component (Desktop Optimized)
 * Features: Alpine aesthetic, glassmorphism form card, and social auth buttons.
 */
const Login: React.FC = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  // FIX: Read explicitly from the input's "name" property
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(credentials.email, credentials.password);
      toast.success('Login successful!');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0059bb]"></div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          src="/images/login-bg.jpg"
          alt="Tropical beach sunrise"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-[400px] px-6">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/30 rounded-[2rem] p-8 shadow-2xl">
          
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#1b1c1c] mb-1.5">Welcome Back</h1>
            <p className="text-sm text-[#414754]">Continue your journey to <span className='font-nav-md'>Amal Holidays</span></p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs uppercase tracking-wide text-[#1b1c1c] block px-1">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-lg">mail</span>
                <input
                  name="email" // Added explicit name property
                  className="w-full bg-white/50 border border-[#c1c6d7] rounded-full py-3 pl-11 pr-4 focus:ring-2 focus:ring-[#0059bb] focus:border-transparent transition-all outline-none text-sm disabled:opacity-50"
                  placeholder="name@example.com"
                  type="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="font-bold text-xs uppercase tracking-wide text-[#1b1c1c]">Password</label>
                <a className="text-[10px] font-bold text-[#0059bb] hover:underline uppercase tracking-tighter" href="/password-reset">Forgot?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-lg">lock</span>
                <input
                  name="password" // Added explicit name property
                  className="w-full bg-white/50 border border-[#c1c6d7] rounded-full py-3 pl-11 pr-4 focus:ring-2 focus:ring-[#0059bb] focus:border-transparent transition-all outline-none text-sm disabled:opacity-50"
                  placeholder="••••••••"
                  type="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0059bb] py-3 rounded-full text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Logging In...' : 'Log In'}
            </button>

            <p className="text-center text-sm text-[#414754] pt-2">
              Don't have an account? <a className="text-[#0059bb] font-bold hover:underline ml-1" href="/signup">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;