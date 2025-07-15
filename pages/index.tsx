'use client';

import HeroSection from './components/landing/HeroSection';
import FeaturesSection from './components/landing/FeaturesSection';
import PreviewNotesSection from './components/landing/PreviewNotesSection';
import CTASection from './components/landing/CTASection';
import Footer from './components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen text-gray-800">
      <section id="hero">
        <HeroSection />
      </section>

      <section id="features">
        <FeaturesSection />
      </section>

      <section id="preview">
        <PreviewNotesSection />
      </section>

      <section id="cta">
        <CTASection />
      </section>

      <Footer />
    </div>
  );
}
