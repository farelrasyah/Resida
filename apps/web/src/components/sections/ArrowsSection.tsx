import React from 'react';

const ArrowIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <path
      d="m20.78 12.531-6.75 6.75a.75.75 0 1 1-1.06-1.061l5.47-5.47H3.75a.75.75 0 1 1 0-1.5h14.69l-5.47-5.469a.75.75 0 1 1 1.06-1.061l6.75 6.75a.75.75 0 0 1 0 1.061"
      fill="currentColor"
    />
  </svg>
);

export const ArrowsSection: React.FC = () => {
  return (
    <section style={{ overflow: 'hidden' }}>
      <div className="container-main">
        {/* Title */}
        <div style={{
          fontWeight: 500,
          fontSize: '4.4rem',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          marginBottom: '4rem',
        }} className="arrows-title">
          <span className="em">Kelola </span>lebih baik
        </div>

        {/* Arrows row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          overflow: 'hidden',
        }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                flex: '0 0 auto',
                width: '8rem',
                height: '8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#151717',
              }}
              className="arrows-arrow"
            >
              <ArrowIcon />
            </div>
          ))}
        </div>

        {/* Text below arrows */}
        <div style={{
          fontWeight: 500,
          fontSize: '2.2rem',
          lineHeight: 1.3,
          marginTop: '4rem',
        }} className="arrows-text">
          Administrasi RT, <span className="em">Digital.</span>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .arrows-title { font-size: 7.2rem !important; letter-spacing: -0.04em !important; margin-bottom: 8rem !important; }
          .arrows-arrow { width: 16rem !important; height: 16rem !important; }
          .arrows-text { font-size: 3.2rem !important; margin-top: 8rem !important; }
        }
      `}</style>
    </section>
  );
};
