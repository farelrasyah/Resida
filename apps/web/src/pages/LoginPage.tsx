import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => setIsLoading(false), 1500);
  };


  return (
    <div className="w-full min-h-screen bg-white flex flex-col md:flex-row font-['Instrument_Sans'] animate-in fade-in duration-500">
      
      {/* Left Form Section */}
      <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 xl:p-32 flex flex-col relative z-10 bg-white min-h-screen justify-between">
        <div className="flex justify-center md:justify-start">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity" aria-label="FIND Real Estate">
            <svg style={{ width: '12rem', height: '3.4rem', color: '#151717' }} fill="none" viewBox="0 0 975 280" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M836.06 1.01c77.3 0 139.94 62.69 139.94 140C976 218.33 913.35 281 836.06 281H702.61V1.01zm-52.82 80.17v119.44h44.58a59.5 59.5 0 0 0 42.21-17.5 59.7 59.7 0 0 0-42.2-101.94z" />
              <path fill="currentColor" d="M595.45 183.2V1h80.14v279.99H556.68l-73.33-152.93V281H403.2V1h110.33z" />
              <path fill="currentColor" d="M376.19 280.99h-141l61.26-140.29L235.2 1h141v279.99Z" />
              <path fill="currentColor" d="M244.55 81.28H81.14v59.42h101.02v80.17H81.14v60.12H1V1h207.91z" />
            </svg>
          </Link>
        </div>

        <div className="w-full max-w-[420px] mx-auto my-12 flex flex-col items-center md:items-start justify-center flex-1">
          <h1 className="text-[3.8rem] md:text-[4.6rem] font-bold leading-[1.1] mb-12 tracking-tight text-[#151717] text-center md:text-left w-full" style={{ fontFamily: 'var(--font-primary)' }}>
            Welcome back<br />to FIND
          </h1>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            <div className="flex flex-col relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full bg-[#F4F4F4] text-[#151717] rounded-[100px] px-10 py-[1.9rem] text-[1.6rem] font-medium placeholder:text-[#888] focus:outline-none focus:ring-[2px] focus:ring-[#151717] focus:bg-white transition-all duration-300 ease-out"
              />
            </div>

            <div className="flex flex-col relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-[#F4F4F4] text-[#151717] rounded-[100px] px-10 py-[1.9rem] text-[1.6rem] font-medium placeholder:text-[#888] focus:outline-none focus:ring-[2px] focus:ring-[#151717] focus:bg-white transition-all duration-300 ease-out pr-20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#151717] transition-colors focus:outline-none focus:ring-[2px] focus:ring-[#151717] rounded-full p-2"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-[#151717] text-white rounded-[100px] py-[2rem] text-[1.7rem] font-medium transition-all duration-500 cubic-bezier(0.22, 1, 0.36, 1) hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] active:scale-[0.97] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-4 group"
            >
              {isLoading ? (
                <span className="w-7 h-7 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <span className="relative overflow-hidden inline-block h-[2.5rem]">
                  <span className="block transition-transform duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:-translate-y-full">Sign In</span>
                  <span className="absolute top-full left-0 block transition-transform duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:-translate-y-full">Sign In</span>
                </span>
              )}
            </button>
          </form>

          <div className="mt-14 w-full text-center md:text-left">
            <p className="text-[1.6rem] font-medium text-[#151717]">
              Don't have an account?{' '}
              <a href="#" className="font-bold hover:underline underline-offset-[6px] decoration-2 transition-all">
                Sign up
              </a>
            </p>
          </div>
        </div>
        
        <div>
          {/* Footer spacer for flex-between */}
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden md:block md:w-1/2 p-3 md:p-5 relative bg-white h-screen">
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-[#e5e5e5] shadow-lg">
          <div className="absolute inset-0 bg-black/10 z-10 transition-opacity duration-700 hover:bg-black/0" />
          <img 
            src="/assets/images/development.0de63e1b.jpg" 
            alt="Luxury Property by FIND" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out hover:scale-[1.03]"
          />
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
