import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '../common/Button';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const bgCloudRef = useRef<HTMLDivElement>(null);
  const midCloudRef = useRef<HTMLDivElement>(null);
  const houseRef = useRef<HTMLDivElement>(null);
  const houseCompositeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // Parallax on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // 1. Sky (z: 1) - Moves extremely slow or scale slightly
      if (backRef.current) {
        tl.to(backRef.current, { scale: 1.05, ease: 'none', willChange: 'transform' }, 0);
      }

      // 2. Background Cloud (z: 2) - Slow translation
      if (bgCloudRef.current) {
        tl.to(bgCloudRef.current, { y: '-10%', x: '-5%', ease: 'none', willChange: 'transform' }, 0);
      }

      // 3. Middle Cloud (z: 3) - Medium translation
      if (midCloudRef.current) {
        tl.to(midCloudRef.current, { y: '-20%', x: '10%', ease: 'none', willChange: 'transform' }, 0);
      }

      // 4. Headline / Content (z: 4) - Stays relatively stable (slow up) to be occluded
      if (contentRef.current) {
        tl.to(contentRef.current, { y: isMobile ? '-10%' : '-15%', ease: 'none', willChange: 'transform' }, 0);
      }

      // 5. Building (z: 5) - Moves up fast to occlude the text
      const houseY = isMobile ? '-30%' : '-45%';
      if (houseRef.current) {
        tl.to(houseRef.current, { y: houseY, ease: 'none', willChange: 'transform' }, 0);
      }
      if (houseCompositeRef.current) {
        tl.to(houseCompositeRef.current, { y: houseY, ease: 'none', willChange: 'transform' }, 0);
      }

      // 7. Bottom Fog (z: 7) - STATIC (No animation added here)
      // The overlap smoke is also static and matches exactly.

    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="hero-section desktop-height"
      style={{
        position: 'relative',
        height: '350vh', // Mobile height
        marginTop: '-8.4rem',
        zIndex: 1,
      }}
    >
      {/* Sticky viewport container */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
          
          {/* 1. Sky (z-index: 1) */}
          <div ref={backRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, pointerEvents: 'none' }}>
            <img
              src="/assets/images/back.f53e9773.jpg"
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }}
            />
          </div>

          {/* 2. Background Cloud (z-index: 2) */}
          <div
            ref={bgCloudRef}
            className="hero-cloud-1"
            style={{
              position: 'absolute',
              top: '33.7rem',
              left: '-57.2rem',
              width: '70.2rem',
              height: '29.8rem',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          >
            <img src="/assets/images/cloud.c8800fa9.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* 3. Middle Cloud (z-index: 3) */}
          <div
            ref={midCloudRef}
            className="hero-cloud-2"
            style={{
              position: 'absolute',
              top: '46.1rem',
              right: '-51.5rem',
              width: '58.5rem',
              height: '24.8rem',
              zIndex: 3,
              pointerEvents: 'none'
            }}
          >
            <img src="/assets/images/cloud.c8800fa9.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
          </div>

          {/* 4. Headline & CTA (z-index: 4) */}
          {/* Wrapped in a relative container so it respects z-index within this stacking context */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 4,
            }}
          >
            <div
              ref={contentRef}
              className="hero-content"
              style={{
                position: 'relative',
                display: 'grid',
                alignItems: 'center',
                height: '100%',
                paddingBottom: '15rem',
              }}
            >
              <div className="container-main" style={{ textAlign: 'center' }}>
                <div>
                  <h1 className="hero-title" style={{
                    fontWeight: 700,
                    fontSize: '5.4rem',
                    lineHeight: '100%',
                    letterSpacing: '-0.02em',
                    textAlign: 'center',
                    color: '#151717',
                    margin: 0,
                  }}>
                    Find What Moves You
                  </h1>
                </div>

                <p className="hero-text" style={{
                  margin: '1.5rem 0 0',
                  fontWeight: 500,
                  fontSize: '1.6rem',
                  lineHeight: '150%',
                  textAlign: 'center',
                  color: '#151717',
                  textWrap: 'balance',
                }}>
                  <span className="em">Expert </span>
                  agents. Real guidance.{' '}
                  <span className="em">A clear path to find what's next.</span>
                </p>

                <div className="hero-actions" style={{ margin: '3rem 0 0', display: 'flex', justifyContent: 'center' }}>
                  <Button variant="primary" href="/search">Find Properties</Button>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Building (z-index: 5) */}
          <div
            ref={houseRef}
            className="hero-house"
            style={{
              position: 'absolute',
              top: '60vh',
              left: 0,
              right: 0,
              height: '33.4rem',
              zIndex: 5,
              transformOrigin: 'bottom center',
              pointerEvents: 'none'
            }}
          >
            <img
              src="/assets/images/house.8ed9b3db.png"
              alt="FIND Real Estate"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Composite Mask (Duplicate Building) (z-index: 5) */}
          <div className="hero-composite" style={{ zIndex: 5, pointerEvents: 'none' }}>
            <div
              ref={houseCompositeRef}
              className="hero-house"
              style={{
                position: 'absolute',
                top: '60vh',
                left: 0,
                right: 0,
                height: '33.4rem',
                transformOrigin: 'bottom center'
              }}
            >
              <img
                src="/assets/images/house.8ed9b3db.png"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* 7. Bottom Fog (z-index: 7) - COMPLETELY STATIC */}
          <div
            className="hero-smoke"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '45rem',
              zIndex: 7,
              transform: 'translateY(70%)',
              pointerEvents: 'none'
            }}
          >
            <img
              src="/assets/images/smoke.9f683cb4.png"
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
            />
          </div>

        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .hero-section.desktop-height { height: 500vh !important; }
          .hero-house { height: 170.8rem !important; }
          .hero-cloud-1 { top: 25% !important; left: -33.72rem !important; width: 112.4rem !important; height: 47.7rem !important; }
          .hero-cloud-2 { top: 20% !important; right: -33.72rem !important; width: 93.6rem !important; height: 39.7rem !important; }
          .hero-smoke { height: 62rem !important; }
          .hero-overlay { height: 30.9rem !important; }
          .hero-content { padding-bottom: 22.8rem !important; }
          .hero-title { font-size: 14rem !important; }
          .hero-text { font-size: 3.2rem !important; margin: 2rem 0 0 !important; line-height: 130% !important; }
          .hero-actions { margin: 4rem 0 0 !important; }
        }
      `}</style>
    </section>
  );
};
