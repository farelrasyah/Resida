import React from 'react';
import { Button } from '../common/Button';

export const ForAgentsSection: React.FC = () => {
  return (
    <section style={{ padding: '6rem 0' }} className="for-agents-section">
      <div className="container-main">
        <div className="assymetric-row">
          {/* Left Column — hidden on mobile */}
          <div className="assymetric-col-left desktop-only">
            {/* Image */}
            <div style={{
              aspectRatio: '976 / 688',
              overflow: 'hidden',
              marginTop: '4rem',
            }}>
              <img
                src="/assets/images/1.52131ac7.jpg"
                alt="For Agents"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="assymetric-col-right">
            {/* Above text (heading) */}
            <div style={{
              fontWeight: 500,
              fontSize: '3rem',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
            }} className="for-agents-above">
              Don't Rent Your Career. <span className="em">Own It.</span>
            </div>

            {/* Image (shown on both mobile and desktop within right col) */}
            <div style={{
              aspectRatio: '976 / 688',
              overflow: 'hidden',
            }}>
              <img
                src="/assets/images/2.41633fa6.jpg"
                alt="Own Your Real Estate Career"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>

            {/* Below text */}
            <div style={{
              fontWeight: 500,
              fontSize: '2.2rem',
              lineHeight: 1.4,
            }} className="for-agents-below">
              At FIND, our agents don't just work for the brand—they own a part of it.{' '}
              <span className="em">
                We give top performers real equity, so they're invested in more than just your
                transaction—they're invested in your outcome.
              </span>
            </div>

            {/* Controls */}
            <div style={{
              marginTop: '3rem',
              display: 'flex',
              gap: '1rem',
              flexDirection: 'column',
            }} className="for-agents-controls">
              <Button variant="primary" href="/join">Join The Movement</Button>
              <Button variant="secondary" href="/agents">Learn More</Button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .for-agents-section { padding: 15rem 0 !important; }
          .for-agents-above { font-size: 7.2rem !important; letter-spacing: -0.04em !important; }
          .for-agents-below { font-size: 3.2rem !important; line-height: 1.3 !important; letter-spacing: -0.01rem !important; }
          .for-agents-controls { flex-direction: row !important; gap: 1.2rem !important; margin-top: 4rem !important; }
        }
      `}</style>
    </section>
  );
};
