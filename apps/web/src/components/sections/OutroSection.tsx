import React from 'react';
import { Button } from '../common/Button';

export const OutroSection: React.FC = () => {
  return (
    <section className="relative py-32 lg:py-48 w-full bg-[#151717] text-white overflow-hidden">
      {/* Background Layer */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none"
        style={{ backgroundImage: `url('/assets/images/bg.ec610793.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#151717] via-transparent to-[#151717] pointer-events-none" />

      <div className="container-main relative z-10 text-center">
        <div className="max-w-5xl mx-auto space-y-10">
          <h2 className="text-[5.4rem] lg:text-[12rem] font-bold tracking-[-0.04em] leading-[1] text-white">
            Find You. <br />
            We’ll Help You Get There.
          </h2>

          <p className="text-[1.8rem] lg:text-[2.4rem] text-white/70 font-medium max-w-3xl mx-auto">
            Ready to experience a modern, transparent real estate journey? Talk to a local expert
            today.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              variant="emerald"
              href="https://app.findrealestate.com/authentication/sign-in"
            >
              Get Started with FIND
            </Button>
            <Button variant="secondary" href="/agents">
              Contact an Agent
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
