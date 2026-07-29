import React from 'react';
import { Button } from '../common/Button';

export const ForAgentsSection: React.FC = () => {
  return (
    <section style={{ padding: '6rem 0', background: '#ffffff' }} className="for-agents-section">
      <div className="container-main">
        <div className="assymetric-row">
          {/* Left Column — hidden on mobile */}
          <div className="assymetric-col-left desktop-only">
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              width: '100%',
              height: '100%',
              paddingTop: '60rem',
            }}>
              <div style={{
                width: '80%',
                aspectRatio: '976 / 688',
                overflow: 'hidden',
              }}>
                <img
                  src="/assets/images/resida_managers.png"
                  alt="For Agents"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>
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
              Pendataan Cerdas. <span className="em">Hidup Tenang.</span>
            </div>

            {/* Image (shown on both mobile and desktop within right col) */}
            <div style={{
              aspectRatio: '976 / 688',
              overflow: 'hidden',
            }}>
              <img
                src="/assets/images/resida_office_desk.png"
                alt="Administrasi Digital"
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
              Di RESIDA, administrasi RT tidak lagi menjadi beban bulanan.{' '}
              <span className="em">
                Kami menyediakan platform digital terpadu untuk pengurus dan warga, sehingga pencatatan kas, iuran, dan histori kependudukan menjadi jauh lebih transparan dan efisien. Warga dapat mengakses laporan secara langsung, sementara pengurus dapat fokus pada hal-hal yang benar-benar penting—membangun kerukunan lingkungan.
              </span>
            </div>

            {/* Controls */}
            <div style={{
              marginTop: '3rem',
              display: 'flex',
              gap: '1rem',
              flexDirection: 'column',
            }} className="for-agents-controls">
              <Button variant="primary" href="/dashboard">Mulai Kelola RT</Button>
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
