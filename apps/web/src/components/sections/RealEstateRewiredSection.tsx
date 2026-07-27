import React from 'react';
import { Button } from '../common/Button';

export const RealEstateRewiredSection: React.FC = () => {
  const items = [
    { title: 'Talk to a Real Human.', desc: 'We match you with an expert who actually listens.' },
    { title: 'Get Clarity.', desc: "We define what you really need, not just what's available." },
    { title: 'Move Forward.', desc: 'We find what fits — and make it happen.' },
  ];

  return (
    <section style={{ padding: '4rem 0' }} className="rewired-section">
      <div className="container-main">
        <div className="assymetric-row">
          {/* Left Column */}
          <div className="assymetric-col-left">
            <h2 style={{
              fontWeight: 500,
              fontSize: '4.4rem',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }} className="rewired-title">
              Real Estate, <span className="em">Rewired.</span>
            </h2>
          </div>

          {/* Right Column — list + button */}
          <div className="assymetric-col-right">
            {/* Label */}
            <div style={{
              fontWeight: 500,
              fontSize: '2.2rem',
              lineHeight: 1.15,
              marginBottom: '3rem',
            }} className="rewired-label">
              How it works
            </div>

            {/* List items */}
            <div>
              {items.map((item, idx) => (
                <div
                  key={idx}
                  data-index={`0${idx + 1}`}
                  style={{
                    borderTop: '1px solid rgba(21,23,23,.07)',
                    padding: '3rem 0',
                    fontWeight: 500,
                    fontSize: '2.2rem',
                    lineHeight: 1.15,
                  }}
                  className="rewired-list-item"
                >
                  <div style={{
                    fontSize: '1.4rem',
                    fontWeight: 500,
                    lineHeight: 1.5,
                    color: '#b3b3b3',
                    marginBottom: '1rem',
                  }}>
                    0{idx + 1}
                  </div>
                  <div>
                    {item.title} <span className="em">{item.desc}</span>
                  </div>
                </div>
              ))}
              <div style={{ borderBottom: '1px solid rgba(21,23,23,.07)' }} />
            </div>

            {/* CTA */}
            <div style={{ marginTop: '3rem' }} className="rewired-controls">
              <Button variant="primary" href="/join">Join The Movement</Button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .rewired-section { padding: 15rem 0 !important; }
          .rewired-title { font-size: 7.2rem !important; letter-spacing: -0.04em !important; }
          .rewired-label { font-size: 3.2rem !important; line-height: 1.3 !important; letter-spacing: -0.01em !important; }
          .rewired-list-item { font-size: 3.2rem !important; }
          .rewired-controls { margin-top: 4rem !important; }
        }
      `}</style>
    </section>
  );
};
