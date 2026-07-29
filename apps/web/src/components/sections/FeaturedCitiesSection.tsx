import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { Container } from '../common/Container';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export const FeaturedCitiesSection: React.FC = () => {
  const cities = [
    {
      name: 'New York City',
      tagline: 'Manhattan, Brooklyn & Queens',
      activeListings: '1,420 Listings',
      avgPrice: '$1.45M Avg',
      image: '/assets/images/resida_complex.png',
      badge: 'High Demand',
    },
    {
      name: 'Philadelphia Metro',
      tagline: 'Center City, Main Line & Rittenhouse',
      activeListings: '860 Listings',
      avgPrice: '$520K Avg',
      image: '/assets/images/resida_dashboard_laptop.png',
      badge: 'Best Value',
    },
    {
      name: 'Miami & South Florida',
      tagline: 'Brickell, Miami Beach & Fort Lauderdale',
      activeListings: '1,150 Listings',
      avgPrice: '$1.85M Avg',
      image: '/assets/images/resida_community_meeting.png',
      badge: 'Trending',
    },
    {
      name: 'Los Angeles Metro',
      tagline: 'Beverly Hills, Santa Monica & West Hollywood',
      activeListings: '940 Listings',
      avgPrice: '$2.30M Avg',
      image: '/assets/images/resida_mobile_payment.png',
      badge: 'Luxury Core',
    },
  ];

  return (
    <section className="py-24 sm:py-36 bg-[#F7F7F6] overflow-hidden">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-3">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#004D40]/10 text-[#004D40] text-xs font-semibold uppercase tracking-wider">
              Top Metropolitan Markets
            </span>
            <h2 className="text-4xl sm:text-6xl font-serif-display font-medium text-[#151717] tracking-tight">
              Featured <span className="italic font-normal">Destinations.</span>
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#5C6060] max-w-md">
            Explore active residential and commercial opportunities across America's most dynamic urban ecosystems.
          </p>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1.5, spaceBetween: 24 },
            768: { slidesPerView: 2.2, spaceBetween: 28 },
            1024: { slidesPerView: 3.2, spaceBetween: 32 },
          }}
          className="pb-16"
        >
          {cities.map((city, idx) => (
            <SwiperSlide key={idx}>
              <a
                href={`/search?location=${encodeURIComponent(city.name)}`}
                className="group relative block h-[480px] rounded-3xl overflow-hidden shadow-xl border border-[#E4E6E6] transition-transform duration-500 hover:-translate-y-2"
              >
                {/* Image Background */}
                <img
                  src={city.image}
                  alt={city.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                {/* Top Badge */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/30">
                    {city.badge}
                  </span>
                </div>

                {/* Top Right Action Arrow */}
                <div className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-white group-hover:text-[#151717] transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10 space-y-3">
                  <div className="flex items-center gap-2 text-white/80 text-xs font-medium uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{city.tagline}</span>
                  </div>

                  <h3 className="text-3xl font-serif-display font-medium text-white">
                    {city.name}
                  </h3>

                  <div className="flex items-center gap-4 pt-2 text-xs font-medium text-white/90 border-t border-white/20">
                    <span>{city.activeListings}</span>
                    <span>•</span>
                    <span>{city.avgPrice}</span>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
};
