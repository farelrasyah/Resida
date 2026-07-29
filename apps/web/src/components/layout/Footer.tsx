import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#151717] text-white pt-24 pb-16 border-t border-white/10">
      <div className="container-main">
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20 border-b border-white/10">
          {/* Col 1: Brand & Newsletter */}
          <div className="lg:col-span-5 space-y-8">
            <a href="/" className="inline-block" aria-label="RESIDA">
              <span className="text-[2.6rem] font-black tracking-tighter text-white">
                RESIDA.
              </span>
            </a>

            <p className="text-[1.6rem] text-white/70 max-w-md leading-[1.6]">
              RESIDA adalah platform administrasi digital yang memudahkan pengurus dan warga RT/RW dalam mengelola iuran, kas, dan data kependudukan secara transparan dan aman.
            </p>

            {/* Newsletter Input */}
            <form onSubmit={handleSubscribe} className="space-y-4 pt-2">
              <span className="text-[1.2rem] font-semibold text-white/80 uppercase tracking-wider block">
                Berlangganan Update Sistem
              </span>
              <div className="relative max-w-md flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email Anda"
                  required
                  className="w-full bg-white/10 text-white placeholder-white/40 text-[1.4rem] rounded-full py-4 pl-6 pr-14 border border-white/20 focus:outline-none focus:border-white/60 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 p-2.5 rounded-full bg-white text-[#151717] hover:bg-[#004D40] hover:text-white transition-colors cursor-pointer"
                  aria-label="Submit Newsletter"
                >
                  {subscribed ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>
              {subscribed && (
                <p className="text-[1.4rem] text-emerald-400">Terima kasih telah berlangganan!</p>
              )}
            </form>
          </div>

          {/* Col 2: Nav Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
            {/* Properties */}
            <div className="space-y-6">
              <h3 className="text-[1.2rem] font-semibold uppercase tracking-wider text-white/40">
                Menu Utama
              </h3>
              <ul className="space-y-4 text-[1.4rem] text-white/70">
                <li>
                  <a href="/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/residents" className="hover:text-white transition-colors">
                    Data Warga
                  </a>
                </li>
                <li>
                  <a href="/reports/summary" className="hover:text-white transition-colors">
                    Laporan Kas
                  </a>
                </li>
                <li>
                  <a href="/payments" className="hover:text-white transition-colors">
                    Bayar Iuran
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h3 className="text-[1.2rem] font-semibold uppercase tracking-wider text-white/40">
                Layanan
              </h3>
              <ul className="space-y-4 text-[1.4rem] text-white/70">
                <li>
                  <a href="/login" className="hover:text-white transition-colors">
                    Bantuan Pengguna
                  </a>
                </li>
                <li>
                  <a href="/reports/monthly" className="hover:text-white transition-colors">
                    Panduan Aplikasi
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:text-white transition-colors">
                    Hubungi Dukungan
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="hover:text-white transition-colors">
                    Status Sistem
                  </a>
                </li>
              </ul>
            </div>

            {/* Company & Legal */}
            <div className="space-y-6">
              <h3 className="text-[1.2rem] font-semibold uppercase tracking-wider text-white/40">
                Perusahaan & Legal
              </h3>
              <ul className="space-y-4 text-[1.4rem] text-white/70">
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Blog & Berita
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:text-white transition-colors">
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:text-white transition-colors">
                    Syarat & Ketentuan
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-[1.2rem] text-white/40">
          <p>© {new Date().getFullYear()} RESIDA. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-4">
            <span>Sistem Administrasi RT Digital Terbaik</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
