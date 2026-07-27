import React from 'react';

export const WhyUsSection: React.FC = () => {
  return (
    <section 
      style={{ padding: '4rem 0', position: 'relative', zIndex: 10 }} 
      className="why-us-section bg-white"
    >
      {/* Overlap Smoke and Gradient moved here to perfectly mask the hard seam */}
      <div className="hero-overlap" style={{ position: 'absolute', top: '-45rem', left: 0, right: 0, height: '45rem', pointerEvents: 'none', zIndex: 1 }}>
        {/* Smoke Image */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '100%' }}>
          <img
            src="/assets/images/smoke.9f683cb4.png"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
          />
        </div>
        {/* Gradient Blend into White */}
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '10rem',
          background: 'linear-gradient(to top, #ffffff, transparent)'
        }} />
      </div>

      <div className="container-main">
        <div className="assymetric-row">
          {/* Left Column — label + image (hidden mobile) */}
          <div className="assymetric-col-left desktop-only">
            <div style={{ fontWeight: 600, fontSize: '2rem', lineHeight: 1.4 }}>
              Why FIND
            </div>
            <div style={{
              position: 'relative',
              aspectRatio: '976 / 688',
              marginTop: '4rem',
              overflow: 'hidden',
            }}>
              <img
                src="/assets/images/1.e7a1ff18.jpg"
                alt="Why FIND Real Estate"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column — title + description */}
          <div className="assymetric-col-right">
            <div>
              <h2 style={{
                fontWeight: 500,
                fontSize: '4.4rem',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>
                This isn't just about real estate.
              </h2>
            </div>
            <div>
              <p style={{
                fontWeight: 500,
                fontSize: '2.2rem',
                lineHeight: 1.3,
              }}>
                It's about identity. Progress. Getting unstuck. You're not just looking for a place. You're looking for alignment. That's what we help you find.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .why-us-section { padding: 10rem 0 !important; }
          .why-us-section h2 { font-size: 7.2rem !important; letter-spacing: -0.04em !important; }
          .why-us-section .why-us-desc { font-size: 4.4rem !important; line-height: 1.15 !important; letter-spacing: -0.02em !important; }
        }
      `}</style>
    </section>
  );
};
