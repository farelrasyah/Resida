import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const ARROW_SVG = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <path
      d="m20.78 12.531-6.75 6.75a.75.75 0 1 1-1.06-1.061l5.47-5.47H3.75a.75.75 0 1 1 0-1.5h14.69l-5.47-5.469a.75.75 0 1 1 1.06-1.061l6.75 6.75a.75.75 0 0 1 0 1.061"
      fill="currentColor"
    />
  </svg>
);

const SERVICES = [
  {
    id: '01',
    title: 'Buy',
    desc: 'Find your dream property with expert guidance and personalized support throughout the entire purchasing journey.',
    image: '/assets/images/buy.fed72bc8.jpg',
  },
  {
    id: '02',
    title: 'Sell',
    desc: 'Maximize your property value with strategic marketing and professional negotiation from experienced agents.',
    image: '/assets/images/sell.90b8e66b.jpg',
  },
  {
    id: '03',
    title: 'Rent',
    desc: 'Discover premium rental options tailored to your lifestyle with flexible terms and dedicated management.',
    image: '/assets/images/rent.6736c732.jpg',
  },
];

const ServiceRow: React.FC<{
  service: (typeof SERVICES)[0];
  index: number;
  rowRef: (el: HTMLDivElement | null) => void;
}> = ({ service, index, rowRef }) => {
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'cubic-bezier(0.22, 1, 0.36, 1)', duration: 0.8 },
    });
    tl.to(
      bgRef.current,
      { opacity: 1, scale: 1, duration: 0.8 },
      0
    )
      .to(
        titleRef.current,
        { x: -24, duration: 0.7 },
        0
      )
      .to(
        arrowRef.current,
        { x: 0, opacity: 1, duration: 0.6 },
        0.1
      )
      .to(
        underlineRef.current,
        { scaleX: 1, transformOrigin: 'left center', duration: 0.7 },
        0.15
      );
  }, []);

  const handleMouseLeave = useCallback(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'cubic-bezier(0.22, 1, 0.36, 1)', duration: 0.6 },
    });
    tl.to(
      bgRef.current,
      { opacity: 0, scale: 1.08, duration: 0.7 },
      0
    )
      .to(
        titleRef.current,
        { x: 0, duration: 0.5 },
        0
      )
      .to(
        arrowRef.current,
        { x: 20, opacity: 0, duration: 0.4 },
        0
      )
      .to(
        underlineRef.current,
        { scaleX: 0, transformOrigin: 'left center', duration: 0.4 },
        0
      );
  }, []);

  return (
    <div
      ref={rowRef}
      className="services-row"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: '34rem',
        cursor: 'pointer',
        margin: '0 -4rem',
      }}
    >
      <div
        ref={bgRef}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          scale: 1.08,
          willChange: 'transform, opacity',
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 1,
          }}
        />
        <img
          src={service.image}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
      </div>

      <div
        className="services-row-inner"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          padding: '0 4rem',
        }}
      >
        <div
          className="service-left"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3rem',
            flexShrink: 0,
            maxWidth: '38rem',
          }}
        >
          <div
            className="service-circle"
            style={{
              width: '5rem',
              height: '5rem',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: '1.6rem',
                fontWeight: 500,
                color: '#ffffff',
              }}
            >
              {service.id}
            </span>
          </div>

          <p
            className="service-desc"
            style={{
              fontSize: '2.2rem',
              lineHeight: 1.6,
              color: '#ffffff',
              maxWidth: '34rem',
              margin: 0,
            }}
          >
            {service.desc}
          </p>
        </div>

        <div
          className="service-center"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: '4rem',
          }}
        >
          <div style={{ position: 'relative' }}>
            <span
              ref={titleRef}
              className="service-title"
              style={{
                fontSize: '20rem',
                fontWeight: 300,
                lineHeight: 1,
                color: '#ffffff',
                display: 'block',
                willChange: 'transform',
              }}
            >
              {service.title}
            </span>
            <div
              ref={underlineRef}
              className="service-underline"
              style={{
                height: '3px',
                background: '#ffffff',
                width: '24rem',
                transform: 'scaleX(0)',
                transformOrigin: 'left center',
                willChange: 'transform',
              }}
            />
          </div>
        </div>

        <div
          ref={arrowRef}
          className="service-arrow"
          style={{
            width: '5rem',
            height: '5rem',
            color: '#ffffff',
            flexShrink: 0,
            transform: 'translateX(2rem)',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        >
          {ARROW_SVG}
        </div>
      </div>
    </div>
  );
};

export const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const rowsRef = useRef<HTMLDivElement[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const tl = gsap.timeline({
          defaults: { ease: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        });

        tl.fromTo(
          labelRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 }
        )
          .fromTo(
            headingRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6 },
            '-=0.3'
          )
          .fromTo(
            rowsRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
            '-=0.2'
          )
          .fromTo(
            ctaRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5 },
            '-=0.1'
          );

        observer.unobserve(section);
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="services-section"
      style={{
        background: '#141414',
        padding: '12rem 4.8rem',
        width: '100%',
      }}
    >
        <div
          className="services-header"
          style={{
            display: 'grid',
            gridTemplateColumns: '32% 68%',
            minHeight: '40rem',
            alignItems: 'flex-start',
            padding: '4rem 0 0',
          }}
        >
          <span
            ref={labelRef}
            className="services-label"
            style={{
              fontSize: '1.8rem',
              fontWeight: 500,
              color: '#ffffff',
              letterSpacing: '0.02em',
            }}
          >
            Services
          </span>

          <h2
            ref={headingRef}
            className="services-heading"
            style={{
              fontWeight: 500,
              fontSize: '6rem',
              lineHeight: 0.92,
              color: '#ffffff',
              margin: 0,
            }}
          >
            How FIND<br />
            <span style={{ color: '#B8B8B8' }}>Can Help You</span>
          </h2>
        </div>

        <div className="services-divider" style={{ height: '1px', background: 'rgba(255,255,255,0.12)' }} />

        <div className="services-list">
          {SERVICES.map((service, i) => (
            <React.Fragment key={service.id}>
              <ServiceRow
                service={service}
                index={i}
                rowRef={(el) => {
                  if (el) rowsRef.current[i] = el;
                }}
              />
              {i < SERVICES.length - 1 && (
                <div
                  className="services-row-divider"
                  style={{ height: '1px', background: 'rgba(255,255,255,0.12)', margin: '0 -4rem' }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div
          ref={ctaRef}
          className="services-cta"
          style={{
            paddingTop: '14rem',
            paddingBottom: '6rem',
          }}
        >
          <p
            className="services-cta-text"
            style={{
              fontSize: '4.8rem',
              fontWeight: 500,
              lineHeight: 1.02,
              color: '#ffffff',
              maxWidth: '82rem',
              margin: '0 0 5rem 0',
            }}
          >
            Our certified agents guide you through every stage of real estate
            <span style={{ color: '#B8B8B8' }}>
              {' '}with expert knowledge and reliable support.
            </span>
          </p>

          <a
            href="/join"
            className="services-cta-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1.2rem',
              padding: '1.4rem 2.8rem',
              borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#ffffff',
              fontSize: '1.4rem',
              fontWeight: 500,
              textDecoration: 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span
              className="cta-button-bg"
              style={{
                position: 'absolute',
                inset: 0,
                background: '#ffffff',
                transform: 'scaleX(0)',
                transformOrigin: 'left center',
                transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                borderRadius: '100px',
              }}
            />
            <span
              className="cta-button-text"
              style={{
                position: 'relative',
                zIndex: 1,
                transition: 'color 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              Get Started with FIND
            </span>
            <span
              className="cta-button-icon"
              style={{
                position: 'relative',
                zIndex: 1,
                width: '2.4rem',
                height: '2.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {ARROW_SVG}
            </span>
          </a>
        </div>

      <style>{`
        .services-row {
          will-change: transform;
        }
        .service-underline {
          width: 24rem !important;
        }

        .services-cta-button {
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1) !important;
        }
        .services-cta-button:hover .cta-button-bg {
          transform: scaleX(1) !important;
        }
        .services-cta-button:hover .cta-button-text {
          color: #141414 !important;
        }
        .services-cta-button:hover .cta-button-icon {
          transform: translateX(4px) !important;
        }
        .services-cta-button:hover .cta-button-icon svg {
          fill: #141414 !important;
        }

        @media (min-width: 1200px) {
          .services-section { padding: 14rem 0 !important; }
          .services-container { padding: 0 8rem !important; }
          .services-header { min-height: 46rem !important; padding: 10rem 0 0 !important; }
          .services-heading { font-size: 7.2rem !important; }
          .services-divider { margin: 0 -8rem !important; }
          .services-row { height: 34rem !important; margin: 0 -8rem !important; }
          .services-row-inner { padding: 0 8rem !important; }
          .services-row-divider { margin: 0 -8rem !important; }
          .service-left { max-width: 42rem !important; gap: 3rem !important; }
          .service-desc { font-size: 2.2rem !important; max-width: 34rem !important; }
          .service-title { font-size: 20rem !important; }
          .service-center { padding-left: 6rem !important; }
          .service-arrow { width: 15rem !important; height: 15rem !important; }
          .service-underline { width: 32rem !important; }
          .services-cta-text { font-size: 5.6rem !important; }
          .services-cta { padding-top: 14rem !important; padding-bottom: 10rem !important; }
          .services-cta-button { padding: 1.8rem 3.6rem !important; font-size: 1.6rem !important; }
        }

        @media (min-width: 1600px) {
          .services-heading { font-size: 8rem !important; }
        }

        @media (max-width: 1024px) {
          .services-header {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
            min-height: 26rem !important;
            padding: 5rem 0 0 !important;
          }
          .services-heading { font-size: 4.8rem !important; }
          .services-divider { margin: 0 -3rem !important; }
          .services-row { height: 28rem !important; margin: 0 -3rem !important; }
          .services-row-inner { padding: 0 3rem !important; }
          .services-row-divider { margin: 0 -3rem !important; }
          .service-left { max-width: 30rem !important; gap: 2.4rem !important; }
          .service-circle { width: 4rem !important; height: 4rem !important; }
          .service-desc { font-size: 1.8rem !important; max-width: 26rem !important; }
          .service-title { font-size: 14rem !important; }
          .service-center { padding-left: 3rem !important; }
          .service-arrow { width: 10rem !important; height: 10rem !important; }
          .services-cta-text { font-size: 3.6rem !important; }
          .services-cta-button { padding: 1.2rem 2.4rem !important; font-size: 1.2rem !important; }
          .services-container { padding: 0 3rem !important; }
          .services-cta { padding-top: 10rem !important; }
        }

        @media (max-width: 768px) {
          .services-header { min-height: 20rem !important; padding: 4rem 0 0 !important; }
          .services-heading { font-size: 3.6rem !important; }
          .services-divider { margin: 0 -2rem !important; }
          .services-row { height: auto !important; min-height: 24rem !important; margin: 0 -2rem !important; }
          .services-row-inner {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 3rem 2rem !important;
            gap: 2rem !important;
          }
          .services-row-divider { margin: 0 -2rem !important; }
          .service-left { max-width: none !important; gap: 2rem !important; }
          .service-circle { width: 3.6rem !important; height: 3.6rem !important; }
          .service-desc { font-size: 1.6rem !important; max-width: none !important; }
          .service-center { padding-left: 0 !important; width: 100% !important; }
          .service-title { font-size: 10rem !important; }
          .service-arrow { width: 6rem !important; height: 6rem !important; }
          .services-cta-text { font-size: 2.4rem !important; max-width: none !important; }
          .services-cta { padding-top: 6rem !important; padding-bottom: 4rem !important; }
          .services-container { padding: 0 2rem !important; }
          .services-section { padding: 6rem 0 !important; }
          .services-cta-button { padding: 1rem 2rem !important; font-size: 1.2rem !important; }
          .services-cta-button .cta-button-icon { width: 2rem !important; height: 2rem !important; }
          .service-underline { width: 18rem !important; }
        }
      `}</style>
    </section>
  );
};
