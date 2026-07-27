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
            <a href="/" className="inline-block" aria-label="FIND Real Estate">
              <svg
                className="h-9 w-auto text-white"
                fill="none"
                viewBox="0 0 975 280"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M836.06 1.01c77.3 0 139.94 62.69 139.94 140C976 218.33 913.35 281 836.06 281H702.61V1.01zm-52.82 80.17v119.44h44.58a59.5 59.5 0 0 0 42.21-17.5 59.7 59.7 0 0 0-42.2-101.94z"
                />
                <path
                  fill="currentColor"
                  d="M595.45 183.2V1h80.14v279.99H556.68l-73.33-152.93V281H403.2V1h110.33z"
                />
                <path
                  fill="currentColor"
                  d="M376.19 280.99h-141l61.26-140.29L235.2 1h141v279.99Z"
                />
                <path
                  fill="currentColor"
                  d="M244.55 81.28H81.14v59.42h101.02v80.17H81.14v60.12H1V1h207.91z"
                />
              </svg>
            </a>

            <p className="text-[1.6rem] text-white/70 max-w-md leading-[1.6]">
              FIND Real Estate is a full-service tech-enabled brokerage delivering transparency, speed,
              and local expertise for buying, selling, and renting.
            </p>

            {/* Newsletter Input */}
            <form onSubmit={handleSubscribe} className="space-y-4 pt-2">
              <span className="text-[1.2rem] font-semibold text-white/80 uppercase tracking-wider block">
                Subscribe to Market Reports
              </span>
              <div className="relative max-w-md flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
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
                <p className="text-[1.4rem] text-emerald-400">Thank you for subscribing!</p>
              )}
            </form>
          </div>

          {/* Col 2: Nav Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
            {/* Properties */}
            <div className="space-y-6">
              <h3 className="text-[1.2rem] font-semibold uppercase tracking-wider text-white/40">
                Properties
              </h3>
              <ul className="space-y-4 text-[1.4rem] text-white/70">
                <li>
                  <a href="/search?location=NYC" className="hover:text-white transition-colors">
                    NYC Listings
                  </a>
                </li>
                <li>
                  <a href="/search?location=Philly" className="hover:text-white transition-colors">
                    Philly Homes
                  </a>
                </li>
                <li>
                  <a href="/search?location=Miami" className="hover:text-white transition-colors">
                    Miami Condos
                  </a>
                </li>
                <li>
                  <a href="/search?type=new" className="hover:text-white transition-colors">
                    New Construction
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h3 className="text-[1.2rem] font-semibold uppercase tracking-wider text-white/40">
                Services
              </h3>
              <ul className="space-y-4 text-[1.4rem] text-white/70">
                <li>
                  <a href="/services/buy" className="hover:text-white transition-colors">
                    Buying Advisory
                  </a>
                </li>
                <li>
                  <a href="/services/sell" className="hover:text-white transition-colors">
                    Selling Strategy
                  </a>
                </li>
                <li>
                  <a href="/services/rent" className="hover:text-white transition-colors">
                    Rental Placement
                  </a>
                </li>
                <li>
                  <a href="/services/mortgage" className="hover:text-white transition-colors">
                    Mortgage Services
                  </a>
                </li>
              </ul>
            </div>

            {/* Company & Legal */}
            <div className="space-y-6">
              <h3 className="text-[1.2rem] font-semibold uppercase tracking-wider text-white/40">
                Company & Legal
              </h3>
              <ul className="space-y-4 text-[1.4rem] text-white/70">
                <li>
                  <a href="/agents" className="hover:text-white transition-colors">
                    Our Agents
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-white transition-colors">
                    Blog & News
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-[1.2rem] text-white/40">
          <p>© {new Date().getFullYear()} FIND Real Estate LLC. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span>Equal Housing Opportunity</span>
            <span>•</span>
            <span>Licensed Real Estate Broker</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
