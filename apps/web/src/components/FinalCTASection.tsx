'use client';

import React from 'react';
import { ArrowRight, ChevronRight, Sprout, ShieldCheck } from 'lucide-react';
import { Language, CONTENT } from '../lib/content';

interface FinalCTAProps {
  currentLang: Language;
  onOpenDemo: () => void;
}

export function FinalCTASection({ currentLang, onOpenDemo }: FinalCTAProps) {
  const t = CONTENT[currentLang].cta;

  return (
    <section className="py-20 md:py-28 bg-forest text-white relative overflow-hidden">
      {/* Subtle Restrained Geometric / Agricultural Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-white/20" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border border-white/20" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-fresh text-xs font-semibold uppercase tracking-wider border border-white/10">
          <Sprout className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>GRAMSATHI AI PLATFORM</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
          {t.heading}
        </h2>

        <p className="text-base sm:text-lg text-fresh/90 max-w-2xl mx-auto leading-relaxed">
          {t.subheading}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onOpenDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-sm font-bold text-forest bg-white hover:bg-sage transition-all shadow-lg active:scale-95"
          >
            <span>{t.primaryButton}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <a
            href="/#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold text-white/90 bg-white/10 hover:bg-white/20 transition-colors border border-white/15"
          >
            <span>{t.secondaryButton}</span>
            <ChevronRight className="w-4 h-4 text-fresh stroke-[2]" />
          </a>
        </div>

        <div className="pt-4 flex items-center justify-center gap-2 text-xs text-fresh/80">
          <ShieldCheck className="w-4 h-4 stroke-[2]" />
          <span>Independent public assistance · Verified document provenance · DPDP 2023 compliant</span>
        </div>

      </div>
    </section>
  );
}

