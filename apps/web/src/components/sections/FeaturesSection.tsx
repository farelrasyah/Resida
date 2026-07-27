import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

interface FeatureCardData {
  title: string;
  description: string;
  image: string;
  details: string[];
}

export const FeaturesSection: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureCardData | null>(null);

  const features: FeatureCardData[] = [
    {
      title: 'Mortgage Services',
      description:
        'Helping you secure your dream home with flexible mortgage options, competitive interest rates, and accelerated approval pipelines.',
      image: '/assets/images/mortgage-services.e92904b1.jpg',
      details: [
        'Custom fixed and adjustable rate mortgage solutions',
        'Jumbo loan pre-approval for high-net-worth buyers',
        'Direct connection to top private and institutional lenders',
        'Comprehensive rate lock protection guarantees',
      ],
    },
    {
      title: 'Property Management',
      description:
        'Professional management services designed to protect your assets, ensure maximum occupancy, and deliver high cap-rate returns.',
      image: '/assets/images/property-management.7a9cbb34.jpg',
      details: [
        'Rigorous tenant screening and lease administration',
        '24/7 emergency maintenance and facilities supervision',
        'Automated rent collection and digital financial reporting',
        'Regular preventative building inspections',
      ],
    },
    {
      title: 'Construction & Development',
      description:
        'Turnkey development services ranging from architectural design and gut renovation to ground-up luxury construction.',
      image: '/assets/images/development.0de63e1b.jpg',
      details: [
        'Full architectural planning and city zoning compliance',
        'General contracting and sub-contractor oversight',
        'Interior design, materials sourcing, and staging',
        'Value-add renovation strategies to boost resale yield',
      ],
    },
  ];

  return (
    <>
      <section className="py-24 lg:py-40 bg-[#F7F7F6] border-t border-[#151717]/10 overflow-hidden">
        <div className="container-main">
          <div className="assymetric-row items-center mb-16">
            <div className="assymetric-col-left">
              <div className="text-[1.4rem] font-semibold uppercase tracking-wider text-[#151717]/50 mb-4">
                Full-Service Ecosystem
              </div>
              <h2 className="text-[4.4rem] lg:text-[7.2rem] font-medium leading-[1] tracking-[-0.04em] text-[#151717]">
                Support Beyond <br className="hidden lg:block" />
                Buying and Selling.
              </h2>
            </div>

            <div className="assymetric-col-right">
              <p className="text-[1.8rem] lg:text-[2.2rem] text-[#151717]/70 font-medium leading-[1.4] mb-8">
                The real estate market never stands still — and neither do we. Our team of specialists
                offers continued support beyond the initial transaction to help you build generational
                wealth.
              </p>
              <div>
                <Button variant="primary" href="/services">
                  Discover Our Services
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl overflow-hidden border border-[#151717]/10 flex flex-col justify-between"
              >
                <div className="relative h-64 lg:h-72 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-[2.4rem] font-medium text-[#151717]">{item.title}</h3>
                    <p className="text-[1.6rem] text-[#151717]/70 font-medium leading-[1.5]">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#151717]/10">
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedFeature(item)}
                      className="w-full"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedFeature && (
        <Modal
          isOpen={!!selectedFeature}
          onClose={() => setSelectedFeature(null)}
          title={selectedFeature.title}
          imageSrc={selectedFeature.image}
          description={selectedFeature.description}
          details={selectedFeature.details}
        />
      )}
    </>
  );
};
