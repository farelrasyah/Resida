import React from 'react';
import { Button } from '../common/Button';

export const OutroSection: React.FC = () => {
  return (
    <section className="relative py-32 lg:py-48 w-full bg-[#151717] text-white overflow-hidden">
      {/* Background Layer */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none"
        style={{ backgroundImage: `url('/assets/images/resida_outro_bg.png')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#151717] via-transparent to-[#151717] pointer-events-none" />

      <div className="container-main relative z-10 text-center">
        <div className="max-w-5xl mx-auto space-y-10">
          <h2 className="text-[5.4rem] lg:text-[12rem] font-bold tracking-[-0.04em] leading-[1] text-white">
            Mulai Kelola RT. <br />
            Kami Bantu Sepenuhnya.
          </h2>

          <p className="text-[1.8rem] lg:text-[2.4rem] text-white/70 font-medium max-w-3xl mx-auto">
            Siap beralih ke manajemen RT/RW yang modern dan transparan? Gabung dengan RESIDA hari ini.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              variant="emerald"
              href="/dashboard"
            >
              Masuk Dashboard
            </Button>
            <Button variant="secondary" href="/about">
              Hubungi Dukungan
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
