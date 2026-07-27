import React from 'react';
import { Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote:
        'We bought our penthouse in SoHo 3 weeks faster than expected. The pricing transparency and instant tour bookings were unlike any traditional broker we had worked with in New York.',
      author: 'Sarah & David K.',
      role: 'Homeowners in SoHo, NYC',
    },
    {
      quote:
        'Selling our brownstone in Park Slope was completely stress-free. The FIND advisory team staged the listing, ran private open houses, and closed 7% over asking price.',
      author: 'Marcus Vance',
      role: 'Seller in Park Slope, Brooklyn',
    },
    {
      quote:
        'Accessing pre-market rental inventory before it hit public aggregators gave us an unbelievable deal in Rittenhouse Square. Zero surprise broker fees!',
      author: 'Elena & Michael R.',
      role: 'Renters in Philadelphia',
    },
  ];

  return (
    <section className="py-24 lg:py-40 bg-[#151717] text-white overflow-hidden">
      <div className="container-main">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="text-[1.4rem] font-semibold uppercase tracking-wider text-white/50 mb-4">
            Verified Client Reviews
          </div>
          <h2 className="text-[4.4rem] lg:text-[7.2rem] font-medium leading-[1] tracking-[-0.04em] mb-6">
            Don’t Take Our Word for It.
          </h2>
          <p className="text-[1.8rem] lg:text-[2.2rem] text-white/60 font-medium">
            Over 10,000 buyers, sellers, and renters have transformed how they move with FIND.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="p-10 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-1.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-[1.8rem] font-serif-display leading-[1.5] text-white/90">
                  "{item.quote}"
                </blockquote>
              </div>

              <div className="pt-6 border-t border-white/10">
                <h3 className="text-[1.8rem] font-semibold text-white">{item.author}</h3>
                <p className="text-[1.4rem] text-white/50">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
