import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const IMAGES = [
  '/assets/images/1.f6e8f2e8.jpg',
  '/assets/images/2.58bf2fb8.jpg',
  '/assets/images/3.483e04ae.jpg',
  '/assets/images/4.ea5fa732.jpg',
];

const CHEVRON_CLIP = 'polygon(0% 0%, 55% 0%, 100% 50%, 55% 100%, 0% 100%, 45% 50%)';

export const WhyUsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const chevronEls = useRef<HTMLDivElement[]>([]);

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
          headlineRef.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.6 }
        )
          .fromTo(
            chevronEls.current,
            { opacity: 0, y: 40, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12 },
            '-=0.3'
          )
          .fromTo(
            descRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5 },
            '-=0.2'
          );

        observer.unobserve(section);
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="why-us-section"
      style={{
        position: 'relative',
        zIndex: 10,
        background: '#ffffff',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-45rem',
          left: 0,
          right: 0,
          height: '45rem',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <div style={{ position: 'absolute', inset: 0 }}>
          <img
            src="/assets/images/smoke.9f683cb4.png"
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '10rem',
            background: 'linear-gradient(to top, #ffffff, transparent)',
          }}
        />
      </div>

      <div
        className="container-main"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2
          ref={headlineRef}
          className="why-us-headline"
          style={{
            fontWeight: 500,
            fontSize: '4.4rem',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#151717',
          }}
        >
          This isn't just about <span className="em">real estate.</span>
        </h2>

        <div
          className="why-us-gallery no-scrollbar"
          style={{
            display: 'flex',
            gap: '0.15rem',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: '0.5rem',
            marginBottom: '3rem',
          }}
        >
          {IMAGES.map((src, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) chevronEls.current[i] = el;
              }}
              className="why-us-chevron"
              style={{
                flex: '0 0 auto',
                width: '50vw',
                maxWidth: '13rem',
                height: '17rem',
                clipPath: CHEVRON_CLIP,
                WebkitClipPath: CHEVRON_CLIP,
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                scrollSnapAlign: 'center',
                willChange: 'transform',
              }}
            >
              <img
                src={src}
                alt=""
                className="why-us-chevron-img"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition:
                    'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), filter 0.6s ease',
                  willChange: 'transform',
                }}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <p
          ref={descRef}
          className="why-us-desc"
          style={{
            fontWeight: 500,
            fontSize: '2.2rem',
            lineHeight: 1.4,
            textAlign: 'center',
            maxWidth: '80rem',
            marginLeft: 'auto',
            marginRight: 'auto',
            color: '#151717',
          }}
        >
          It's about identity. Progress. Getting unstuck.{' '}
          You're not just looking for a place.{' '}
          <span className="em">You're looking for alignment.</span>
        </p>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .why-us-headline {
            font-size: 6.4rem !important;
            letter-spacing: -0.04em !important;
            margin-bottom: 5rem !important;
          }
          .why-us-chevron {
            width: 18rem !important;
            height: 24rem !important;
            max-width: none !important;
          }
          .why-us-gallery {
            gap: 0.2rem !important;
            overflow: visible !important;
            scroll-snap-type: none !important;
            justify-content: center !important;
            margin-bottom: 5rem !important;
          }
          .why-us-desc {
            font-size: 2.8rem !important;
            max-width: 80rem !important;
          }
        }

        @media (min-width: 1024px) {
          .why-us-headline {
            font-size: 7.2rem !important;
            margin-bottom: 6rem !important;
          }
          .why-us-chevron {
            width: 22rem !important;
            height: 28rem !important;
          }
          .why-us-gallery {
            gap: 0.25rem !important;
            margin-bottom: 6rem !important;
          }
          .why-us-desc {
            font-size: 3.2rem !important;
            max-width: 90rem !important;
          }
        }

        @media (min-width: 1400px) {
          .why-us-headline {
            font-size: 8rem !important;
            margin-bottom: 7rem !important;
          }
          .why-us-chevron {
            width: 26rem !important;
            height: 32rem !important;
          }
          .why-us-gallery {
            gap: 0.3rem !important;
            margin-bottom: 7rem !important;
          }
        }

        @media (min-width: 1800px) {
          .why-us-headline {
            font-size: 9rem !important;
            margin-bottom: 8rem !important;
          }
          .why-us-chevron {
            width: 30rem !important;
            height: 36rem !important;
          }
          .why-us-gallery {
            gap: 0.35rem !important;
            margin-bottom: 8rem !important;
          }
          .why-us-desc {
            font-size: 3.6rem !important;
            max-width: 110rem !important;
          }
        }

        @media (pointer: fine) {
          .why-us-chevron:hover .why-us-chevron-img {
            transform: scale(1.05);
            filter: brightness(1.1);
          }
        }
      `}</style>
    </section>
  );
};
