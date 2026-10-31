'use client';

import React, { useState } from 'react';
import {
  Landmark,
  Mic,
  CloudUpload,
  FileSearch,
  Scale,
  FileCheck,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Language, CONTENT } from '../lib/content';

interface HowItWorksProps {
  currentLang: Language;
  onOpenDemo: () => void;
}

export function HowItWorksSection({ currentLang, onOpenDemo }: HowItWorksProps) {
  const t = CONTENT[currentLang].howItWorks;
  const [activeStep, setActiveStep] = useState(0);

  const icons = [
    Landmark,
    Mic,
    CloudUpload,
    FileSearch,
    Scale,
    FileCheck,
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage border border-border-subtle text-xs font-semibold text-agri uppercase tracking-wider">
            <span>{t.eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-dark tracking-tight">
            {t.heading}
          </h2>
          <p className="text-base text-text-secondary leading-relaxed">
            {t.subheading}
          </p>
        </div>

        {/* 6-Stage Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {t.steps.map((step, index) => {
            const Icon = icons[index] || Landmark;
            const isSelected = activeStep === index;

            return (
              <div
                key={step.number}
                onClick={() => setActiveStep(index)}
                className={`cursor-pointer rounded-2xl p-6 border transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-sage/40 border-forest shadow-md'
                    : 'bg-warm border-border-subtle hover:border-agri/40 hover:bg-white'
                }`}
              >
                {/* Step Top Bar */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-forest text-white' : 'bg-white text-agri border border-border-subtle group-hover:border-forest/40'
                  }`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className={`text-xs font-extrabold tracking-wider ${
                    isSelected ? 'text-forest' : 'text-text-muted'
                  }`}>
                    STAGE {step.number}
                  </span>
                </div>

                {/* Step Content */}
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-forest-dark tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Active Indicator bar */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 transition-all ${
                  isSelected ? 'bg-forest' : 'bg-transparent'
                }`} />
              </div>
            );
          })}
        </div>

        {/* Interactive Step Detail Card */}
        <div className="bg-sage/50 rounded-2xl p-6 sm:p-8 border border-border-subtle max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-agri tracking-wider uppercase">
              Selected Stage: {t.steps[activeStep].number} — {t.steps[activeStep].title}
            </span>
            <p className="text-sm text-text-secondary max-w-xl">
              {t.steps[activeStep].desc} Experience this phase directly in our interactive sandbox demo.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenDemo}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-forest hover:bg-forest-light transition-all shadow-sm shrink-0 active:scale-95"
          >
            <span>Try Stage {t.steps[activeStep].number} in Demo</span>
            <ArrowRight className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

      </div>
    </section>
  );
}

