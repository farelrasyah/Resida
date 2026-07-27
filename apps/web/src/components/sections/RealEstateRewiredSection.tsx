import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Button } from '../common/Button';

const STEPS = [
  {
    title: 'Talk to a Real Human.',
    desc: 'We match you with an expert who actually listens.',
  },
  {
    title: 'Get Clarity.',
    desc: "We define what you really need, not just what's available.",
  },
  {
    title: 'Move Forward.',
    desc: 'We find what fits — and make it happen.',
  },
];

export const RealEstateRewiredSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const stepsLabelRef = useRef<HTMLDivElement>(null);
  const stepEls = useRef<HTMLDivElement[]>([]);

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
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.6 }
        )
          .fromTo(
            ctaRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.4 },
            '-=0.2'
          )
          .fromTo(
            stepsLabelRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.4 },
            '-=0.1'
          )
          .fromTo(
            stepEls.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.15 },
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
      className="rewired-section"
      style={{
        position: 'relative',
        zIndex: 10,
        background: '#ffffff',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="container-main" style={{ width: '100%' }}>
        <div className="rewired-grid">
          <div className="rewired-left">
            <h2
              ref={headlineRef}
              className="rewired-headline"
              style={{
                fontWeight: 500,
                fontSize: '3.6rem',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                color: '#151717',
              }}
            >
              Real Estate,<br />
              <span className="em">Rewired.</span>
            </h2>

            <div
              ref={ctaRef}
              className="rewired-cta"
              style={{ marginTop: '1.5rem' }}
            >
              <Button
                variant="primary"
                href="/join"
                className="rewired-cta-button"
              >
                Join The Movement
              </Button>
            </div>
          </div>

          <div className="rewired-right">
            <div
              ref={stepsLabelRef}
              className="rewired-steps-label"
              style={{
                fontWeight: 500,
                fontSize: '2.4rem',
                lineHeight: 1.3,
                color: '#151717',
                marginBottom: '3rem',
              }}
            >
              Steps:
            </div>

            <div className="rewired-steps-list">
              {STEPS.map((step, i) => (
                <div key={i}>
                  <div
                    ref={(el) => {
                      if (el) stepEls.current[i] = el;
                    }}
                    className="rewired-step-item"
                    style={{
                      display: 'flex',
                      gap: '2rem',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span
                      className="rewired-step-num"
                      style={{
                        fontSize: '1.6rem',
                        fontWeight: 500,
                        lineHeight: 1.5,
                        color: '#b3b3b3',
                        flexShrink: 0,
                        width: '3rem',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <div className="rewired-step-content" style={{ flex: 1 }}>
                      <span
                        className="rewired-step-title"
                        style={{
                          fontWeight: 500,
                          fontSize: '2.4rem',
                          lineHeight: 1.15,
                          color: '#151717',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {step.title}{' '}
                      </span>
                      <span
                        className="rewired-step-desc"
                        style={{
                          fontWeight: 500,
                          fontSize: '2.4rem',
                          lineHeight: 1.5,
                          color: '#b3b3b3',
                        }}
                      >
                        {step.desc}
                      </span>
                    </div>
                  </div>

                  {i < STEPS.length - 1 && (
                    <div
                      className="rewired-step-divider"
                      style={{
                        height: '1px',
                        background: 'rgba(21,23,23,0.08)',
                        margin: '1.5rem 0 1.5rem 5rem',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .rewired-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        .rewired-left {
          display: flex;
          flex-direction: column;
        }

        .rewired-cta-button {
          padding: 1.2rem 2.4rem !important;
          font-size: 1.4rem !important;
        }

        @media (min-width: 768px) {
          .rewired-grid {
            grid-template-columns: 0.7fr 1.3fr !important;
            gap: 2.5rem !important;
          }
          .rewired-headline {
            font-size: 4.8rem !important;
            letter-spacing: -0.04em !important;
          }
          .rewired-cta {
            margin-top: 2rem !important;
          }
          .rewired-cta-button {
            padding: 1.6rem 3.2rem !important;
            font-size: 1.6rem !important;
          }
          .rewired-right {
            padding-top: 3rem !important;
          }
          .rewired-steps-label {
            font-size: 2.6rem !important;
            margin-bottom: 3rem !important;
          }
          .rewired-step-num {
            width: 3.5rem !important;
            font-size: 1.8rem !important;
          }
          .rewired-step-item {
            gap: 2.2rem !important;
          }
          .rewired-step-title {
            font-size: 2.8rem !important;
          }
          .rewired-step-desc {
            font-size: 2.8rem !important;
          }
          .rewired-step-divider {
            margin: 1.5rem 0 1.5rem 5.7rem !important;
          }
        }

        @media (min-width: 1024px) {
          .rewired-grid {
            grid-template-columns: 0.75fr 1.25fr !important;
            gap: 3rem !important;
          }
          .rewired-headline {
            font-size: 5.2rem !important;
          }
          .rewired-cta {
            margin-top: 2rem !important;
          }
          .rewired-cta-button {
            padding: 1.6rem 3.2rem !important;
            font-size: 1.6rem !important;
          }
          .rewired-right {
            padding-top: 4rem !important;
          }
          .rewired-steps-label {
            font-size: 2.8rem !important;
            margin-bottom: 3.5rem !important;
          }
          .rewired-step-num {
            width: 3.5rem !important;
            font-size: 2rem !important;
          }
          .rewired-step-item {
            gap: 2.4rem !important;
          }
          .rewired-step-title {
            font-size: 3rem !important;
          }
          .rewired-step-desc {
            font-size: 3rem !important;
          }
          .rewired-step-divider {
            margin: 1.5rem 0 1.5rem 5.9rem !important;
          }
        }

        @media (min-width: 1400px) {
          .rewired-grid {
            grid-template-columns: 0.8fr 1.2fr !important;
            gap: 3.5rem !important;
          }
          .rewired-headline {
            font-size: 6rem !important;
          }
          .rewired-cta {
            margin-top: 2rem !important;
          }
          .rewired-cta-button {
            padding: 1.8rem 3.6rem !important;
            font-size: 1.8rem !important;
          }
          .rewired-right {
            padding-top: 5rem !important;
          }
          .rewired-steps-label {
            font-size: 3.2rem !important;
            margin-bottom: 4rem !important;
          }
          .rewired-step-num {
            width: 3.5rem !important;
            font-size: 2.2rem !important;
          }
          .rewired-step-item {
            gap: 2.6rem !important;
          }
          .rewired-step-title {
            font-size: 3.4rem !important;
          }
          .rewired-step-desc {
            font-size: 3.4rem !important;
          }
          .rewired-step-divider {
            margin: 2rem 0 2rem 6.1rem !important;
          }
        }

        @media (min-width: 1800px) {
          .rewired-grid {
            grid-template-columns: 0.8fr 1.2fr !important;
            gap: 4rem !important;
          }
          .rewired-headline {
            font-size: 6.4rem !important;
          }
          .rewired-cta {
            margin-top: 2rem !important;
          }
          .rewired-cta-button {
            padding: 2rem 4rem !important;
            font-size: 2rem !important;
          }
          .rewired-right {
            padding-top: 5.5rem !important;
          }
          .rewired-steps-label {
            font-size: 3.6rem !important;
            margin-bottom: 4rem !important;
          }
          .rewired-step-num {
            width: 4rem !important;
            font-size: 2.4rem !important;
          }
          .rewired-step-item {
            gap: 2.8rem !important;
          }
          .rewired-step-title {
            font-size: 3.8rem !important;
          }
          .rewired-step-desc {
            font-size: 3.8rem !important;
          }
          .rewired-step-divider {
            margin: 2rem 0 2rem 6.8rem !important;
          }
        }
      `}</style>
    </section>
  );
};
