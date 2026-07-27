import React from 'react';
import { Button } from '../common/Button';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      title: 'Buy',
      description:
        'Buy smarter with expert agents backed by mortgage, legal, and appraisal pros—dialed in to get you the best deal, fast. We’ve done this over 10,000 times, and we know what wins.',
      image: '/assets/images/buy.fed72bc8.jpg',
      link: '/search?mode=buy',
    },
    {
      title: 'Sell',
      description:
        'Sell fast, sell high. Your listing gets pro staging, strategic pricing, constant open houses, and agents who never stop working until the right buyer signs.',
      image: '/assets/images/sell.90b8e66b.jpg',
      link: '/sell',
    },
    {
      title: 'Rent',
      description:
        'Access hidden rentals before they hit the market through agents who know every landlord in town. With decades of NYC experience, we unlock the best deals you won’t find online.',
      image: '/assets/images/rent.6736c732.jpg',
      link: '/search?mode=rent',
    },
  ];

  return (
    <section className="py-24 lg:py-40 bg-[#F7F7F6] border-t border-[#151717]/10 overflow-hidden">
      <div className="container-main">
        <div className="mb-16">
          <div className="text-[1.4rem] font-semibold uppercase tracking-wider text-[#151717]/50 mb-4">
            Tailored Real Estate Solutions
          </div>
          <h2 className="text-[4.4rem] lg:text-[7.2rem] font-medium leading-[1] tracking-[-0.04em] text-[#151717]">
            How FIND Can Help You.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-[#151717]/10 flex flex-col justify-between"
            >
              <div className="relative h-72 lg:h-80 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 rounded-full bg-white/90 text-[#151717] text-[1.4rem] font-semibold shadow-xs">
                    {item.title}
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                <p className="text-[1.6rem] text-[#151717]/70 leading-[1.5] font-medium">
                  {item.description}
                </p>

                <div>
                  <Button variant="secondary" href={item.link} className="w-full">
                    Explore {item.title}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
