'use client';

import React, { useState } from 'react';
import { Language } from '../lib/content';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { TrustValuesSection } from '../components/TrustValuesSection';
import { ProblemSolutionSection } from '../components/ProblemSolutionSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { CoreInnovationSection } from '../components/CoreInnovationSection';
import { ServicesSection } from '../components/ServicesSection';
import { AccessibilitySection } from '../components/AccessibilitySection';
import { PrivacyTrustSection } from '../components/PrivacyTrustSection';
import { FinalCTASection } from '../components/FinalCTASection';
import { Footer } from '../components/Footer';
import { ApplicationDemoModal } from '../components/ApplicationDemoModal';
import { SignInModal, CitizenUser, DEFAULT_CITIZEN } from '../components/SignInModal';

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [currentUser, setCurrentUser] = useState<CitizenUser>(DEFAULT_CITIZEN);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [demoService, setDemoService] = useState<string | undefined>(undefined);

  const toggleLanguage = () => {
    setCurrentLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleOpenDemo = (serviceName?: string) => {
    setDemoService(serviceName);
    setIsDemoOpen(true);
  };

  const handleCloseDemo = () => {
    setIsDemoOpen(false);
    setDemoService(undefined);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Refined Sticky Navigation Bar */}
      <Navbar
        currentLang={currentLang}
        currentUser={currentUser}
        onToggleLang={toggleLanguage}
        onOpenDemo={() => handleOpenDemo()}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      <main className="flex-1">
        {/* 2. Compelling Hero Section with Realistic Product Preview */}
        <HeroSection
          currentLang={currentLang}
          currentUser={currentUser}
          onOpenDemo={() => handleOpenDemo()}
        />

        {/* 3. Trust & Purpose Values Section */}
        <TrustValuesSection currentLang={currentLang} />

        {/* 4. Problem and Solution Section */}
        <ProblemSolutionSection currentLang={currentLang} />

        {/* 5. How GramSathi Works (6-Stage Timeline) */}
        <HowItWorksSection
          currentLang={currentLang}
          onOpenDemo={() => handleOpenDemo()}
        />

        {/* 6. Core Technical Innovation (Evidence-Linked Gated Drafting) */}
        <CoreInnovationSection currentLang={currentLang} />

        {/* 7. Services Section (Active Prototype vs Planned) */}
        <ServicesSection
          currentLang={currentLang}
          onOpenDemo={(serviceName) => handleOpenDemo(serviceName)}
        />

        {/* 8. Rural-First Accessibility & Spoken Audio Preview */}
        <AccessibilitySection currentLang={currentLang} />

        {/* 9. Privacy, Security & DPDP Compliance Section */}
        <PrivacyTrustSection currentLang={currentLang} />

        {/* 10. High-Impact Minimal Final CTA */}
        <FinalCTASection
          currentLang={currentLang}
          onOpenDemo={() => handleOpenDemo()}
        />
      </main>

      {/* 11. Comprehensive Multi-Column Footer with Official Disclaimer */}
      <Footer currentLang={currentLang} />

      {/* 12. Interactive Application Preparation Demo Modal with Multi-Turn Voice */}
      <ApplicationDemoModal
        isOpen={isDemoOpen}
        onClose={handleCloseDemo}
        currentLang={currentLang}
        currentUser={currentUser}
        initialService={demoService}
      />

      {/* 13. Citizen Authentication & Profile Selection Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        currentLang={currentLang}
        currentUser={currentUser}
        onSaveUser={(updated) => setCurrentUser(updated)}
      />
    </div>
  );
}
