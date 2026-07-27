import React, { useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { Header } from './components/layout/Header';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { HeroSection } from './components/sections/HeroSection';
import { WhyUsSection } from './components/sections/WhyUsSection';

import { RealEstateRewiredSection } from './components/sections/RealEstateRewiredSection';
import { ForAgentsSection } from './components/sections/ForAgentsSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { FeaturesSection } from './components/sections/FeaturesSection';
import { BlogSection } from './components/sections/BlogSection';
import { OutroSection } from './components/sections/OutroSection';
import { Footer } from './components/layout/Footer';

export const App: React.FC = () => {
  useLenis();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F7F6] text-[#151717] selection:bg-[#151717] selection:text-white antialiased">
      <Header onMenuToggle={() => setIsDrawerOpen(true)} />
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main>
        <HeroSection />
        <WhyUsSection />
        <RealEstateRewiredSection />
        <ForAgentsSection />
        <TestimonialsSection />
        <ServicesSection />
        <FeaturesSection />
        <BlogSection />
        <OutroSection />
      </main>

      <Footer />
    </div>
  );
};

export default App;
