import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (value: string): string | null => {
    if (!value.trim()) return 'Email wajib diisi.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Format email tidak valid.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message || 'Email atau password tidak sesuai.');
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Gagal terhubung ke server.');
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="w-full min-h-screen bg-white flex flex-col md:flex-row font-['Instrument_Sans'] animate-in fade-in duration-500">
      
      {/* Left Form Section */}
      <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 xl:p-32 flex flex-col relative z-10 bg-white min-h-screen justify-between">
        <div className="flex justify-center md:justify-start">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity" aria-label="RESIDA">
            <span className="text-[3.2rem] font-black tracking-tighter text-[#151717]">
              RESIDA.
            </span>
          </Link>
        </div>

        <div className="w-full max-w-[420px] mx-auto my-12 flex flex-col items-center md:items-start justify-center flex-1">
          <h1 className="text-[3.8rem] md:text-[4.6rem] font-bold leading-[1.1] mb-8 tracking-tight text-[#151717] text-center md:text-left w-full" style={{ fontFamily: 'var(--font-primary)' }}>
            Selamat Datang di<br />RESIDA
          </h1>
          
          {errorMessage && (
            <div className="w-full mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-[1.4rem] font-medium animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} className="shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            <div className="flex flex-col relative">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(null); }}
                onBlur={() => setEmailError(validateEmail(email))}
                placeholder="Email"
                required
                className={`w-full bg-[#F4F4F4] text-[#151717] rounded-[100px] px-10 py-[1.9rem] text-[1.6rem] font-medium placeholder:text-[#888] focus:outline-none focus:ring-[2px] focus:bg-white transition-all duration-300 ease-out ${
                  emailError ? 'ring-[2px] ring-red-500 bg-red-50' : 'focus:ring-[#151717]'
                }`}
              />
              {emailError && (
                <span className="text-red-600 text-[1.3rem] font-medium mt-2 ml-4">{emailError}</span>
              )}
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

          <div className="mt-14 w-full text-center md:text-left space-y-2">
            <p className="text-[1.4rem] font-medium text-neutral-500">
              Default Login — <span className="font-mono text-neutral-400">admin@resida.com</span>
            </p>
            <p className="text-[1.4rem] font-medium text-neutral-500">
              Password — <span className="font-mono text-neutral-400">password</span>
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
            alt="Resida Dashboard" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out hover:scale-[1.03]"
          />
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
