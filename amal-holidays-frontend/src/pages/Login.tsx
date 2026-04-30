import React, { useState } from 'react';

/**
 * Wanderlust - Log In Component (Desktop Optimized)
 * Features: Alpine aesthetic, glassmorphism form card, and social auth buttons.
 */
const LogIn: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { type, value } = e.target;
    const field = type === 'email' ? 'email' : 'password';
    setCredentials((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', credentials);
  };

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

      {/* Login Form Container - Reduced max-width for better desktop focus */}
      <div className="relative z-10 w-full max-w-[400px] px-6">
        {/* Padding reduced from p-12 to p-8 */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/30 rounded-[2rem] p-8 shadow-2xl">
          
          <div className="mb-8 text-center">
            {/* Scaled from 3xl to 2xl */}
            <h1 className="text-2xl font-bold text-[#1b1c1c] mb-1.5">Welcome Back</h1>
            <p className="text-sm text-[#414754]">Continue your journey to <span className='font-nav-md'>Amal Holidays</span></p>
          </div>

          {/* space-y-6 reduced to space-y-4 */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs uppercase tracking-wide text-[#1b1c1c] block px-1">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#717786] text-lg">mail</span>
                <input
                  className="w-full bg-white/50 border border-[#c1c6d7] rounded-full py-3 pl-11 pr-4 focus:ring-2 focus:ring-[#0059bb] focus:border-transparent transition-all outline-none text-sm"
                  placeholder="name@example.com"
                  type="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  required
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
                  className="w-full bg-white/50 border border-[#c1c6d7] rounded-full py-3 pl-11 pr-4 focus:ring-2 focus:ring-[#0059bb] focus:border-transparent transition-all outline-none text-sm"
                  placeholder="••••••••"
                  type="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* CTA Button - py-4 reduced to py-3, text-lg to text-base */}
            <button
              type="submit"
              className="w-full bg-[#0059bb] py-3 rounded-full text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all mt-2"
            >
              Log In
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

export default LogIn;
