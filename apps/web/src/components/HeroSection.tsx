'use client';

import React from 'react';
import {
  FileText,
  FileCheck,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Language, CONTENT } from '../lib/content';
import { CitizenUser } from './SignInModal';

interface HeroSectionProps {
  currentLang: Language;
  currentUser?: CitizenUser;
  onOpenDemo: () => void;
}

export function HeroSection({ currentLang, currentUser, onOpenDemo }: HeroSectionProps) {
  const t = CONTENT[currentLang].hero;
  const p = t.preview;
  const isHi = currentLang === 'hi';

  const displayedUser = currentUser?.isAuthenticated && currentUser.name
    ? (isHi ? `नमस्ते, ${currentUser.name} जी` : `Namaste, ${currentUser.name} Ji`)
    : p.welcomeUser;

  const displayedLocation = currentUser?.village && currentUser?.district
    ? `${currentUser.village}, ${currentUser.district}`
    : p.location;

  const displayedName = currentUser?.name || p.field1.val;

  return (
    <section id="home" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-warm">
      {/* Subtle Agricultural Background Geometry (Restrained, no loud gradients) */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-sage blur-3xl" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] rounded-full bg-fresh/10 blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Narrative & Action */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage border border-border-subtle">
              <span className="w-2 h-2 rounded-full bg-agri" />
              <span className="text-xs font-semibold tracking-wider text-forest-dark uppercase">
                {t.eyebrow}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-forest-dark tracking-tight leading-[1.15]">
              {t.headline}
            </h1>

            {/* Supporting Subtext */}
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl">
              {t.subtext}
            </p>

            {/* Call to Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={onOpenDemo}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-forest hover:bg-forest-light transition-all shadow-sm active:scale-95"
              >
                <span>{t.primaryCta}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <a
                href="/#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-forest bg-white border border-border-subtle hover:bg-sage transition-colors"
              >
                <span>{t.secondaryCta}</span>
                <ChevronRight className="w-4 h-4 text-agri stroke-[2]" />
              </a>
            </div>

            {/* Trust Statement */}
            <div className="pt-3 flex items-center gap-2.5 text-xs text-text-secondary">
              <ShieldCheck className="w-4 h-4 text-agri stroke-[2.2] shrink-0" />
              <span>{t.trustStatement}</span>
            </div>
          </div>

          {/* Right Column: Realistic Application-Assistance Dashboard */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Product Preview Card */}
              <div className="bg-white rounded-2xl border border-border-subtle shadow-xl shadow-forest/5 overflow-hidden">
                
                {/* Application App Bar */}
                <div className="bg-forest px-5 py-4 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-fresh font-bold text-xs">
                      GS
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white/95">
                        {displayedUser}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-fresh/90 font-medium">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{displayedLocation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-medium text-fresh border border-white/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-fresh" />
                    <span>{p.welcomeBadge}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 space-y-5 bg-white">
                  
                  {/* Scheme Header & Progress */}
                  <div className="bg-sage/60 rounded-xl p-4 border border-border-subtle space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-semibold tracking-wider text-agri uppercase">
                          Target Scheme
                        </span>
                        <h3 className="text-base font-bold text-forest-dark leading-tight mt-0.5">
                          {p.schemeTitle}
                        </h3>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {p.schemeDept}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-forest">
                          {p.progressPercent}
                        </span>
                        <span className="block text-[10px] text-text-muted font-medium">
                          Readiness
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-border-subtle h-2 rounded-full overflow-hidden">
                      <div className="bg-forest h-full rounded-full transition-all duration-500 w-[80%]" />
                    </div>
                  </div>

                  {/* Document Checklist Snippet */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center justify-between">
                      <span>{p.checklistTitle}</span>
                      <span className="text-[11px] text-text-secondary font-normal">2 of 3 Confirmed</span>
                    </div>

                    <div className="space-y-2">
                      {/* Doc 1: Aadhaar */}
                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-border-subtle bg-warm text-xs">
                        <div className="flex items-center gap-2.5">
                          <FileCheck className="w-4 h-4 text-agri stroke-[2.2]" />
                          <div>
                            <span className="font-semibold text-text-main block">{p.doc1.name}</span>
                            <span className="text-[10px] text-text-muted">{p.doc1.size}</span>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-agri px-2 py-0.5 rounded bg-fresh/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{p.doc1.status}</span>
                        </span>
                      </div>

                      {/* Doc 2: Marksheet */}
                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-border-subtle bg-warm text-xs">
                        <div className="flex items-center gap-2.5">
                          <FileCheck className="w-4 h-4 text-agri stroke-[2.2]" />
                          <div>
                            <span className="font-semibold text-text-main block">{p.doc2.name}</span>
                            <span className="text-[10px] text-text-muted">{p.doc2.size}</span>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-agri px-2 py-0.5 rounded bg-fresh/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{p.doc2.status}</span>
                        </span>
                      </div>

                      {/* Doc 3: Income Certificate with Review Required */}
                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-warning/30 bg-warning-light/40 text-xs">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-warning stroke-[2.2]" />
                          <div>
                            <span className="font-semibold text-text-main block">{p.doc3.name}</span>
                            <span className="text-[10px] text-text-muted">{p.doc3.size}</span>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-warning-dark px-2 py-0.5 rounded bg-warning-light border border-warning/20">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{p.doc3.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Extracted Field Provenance Preview */}
                  <div className="pt-2 border-t border-border-subtle space-y-2">
                    <span className="text-xs font-bold text-text-main uppercase tracking-wider block">
                      {p.extractedTitle}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-sage/50 border border-border-subtle">
                        <span className="text-[10px] text-text-muted block">{p.field1.key}</span>
                        <span className="font-semibold text-forest-dark block">{displayedName}</span>
                        <span className="text-[9px] text-agri block mt-0.5">{p.field1.source}</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-sage/50 border border-border-subtle">
                        <span className="text-[10px] text-text-muted block">{p.field2.key}</span>
                        <span className="font-semibold text-forest-dark block">{p.field2.val}</span>
                        <span className="text-[9px] text-agri block mt-0.5">{p.field2.source}</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-sage/50 border border-border-subtle">
                        <span className="text-[10px] text-text-muted block">{p.field3.key}</span>
                        <span className="font-semibold text-forest-dark block">{p.field3.val}</span>
                        <span className="text-[9px] text-agri block mt-0.5">{p.field3.source}</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlighted Conflict Callout (Core Innovation Showcase) */}
                  <div className="p-3.5 rounded-xl bg-warning-light/60 border border-warning/40 space-y-2">
                    <div className="flex items-center gap-2 text-warning-dark font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-warning stroke-[2.5]" />
                      <span>{p.reviewWarningTitle}</span>
                    </div>
                    <p className="text-[11px] text-text-main leading-relaxed">
                      {p.reviewWarningText}
                    </p>
                    <button
                      type="button"
                      onClick={onOpenDemo}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-forest hover:text-forest-dark underline underline-offset-2"
                    >
                      <span>{p.confirmCta}</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

