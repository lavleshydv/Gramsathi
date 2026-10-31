'use client';

import React from 'react';
import {
  ShieldCheck,
  Lock,
  FileKey,
  EyeOff,
  Trash2,
  AlertOctagon,
  CheckCircle2,
} from 'lucide-react';
import { Language, CONTENT } from '../lib/content';

interface PrivacyTrustProps {
  currentLang: Language;
}

export function PrivacyTrustSection({ currentLang }: PrivacyTrustProps) {
  const t = CONTENT[currentLang].privacy;

  const icons = [
    FileKey,
    CheckCircle2,
    Lock,
    EyeOff,
    Trash2,
    AlertOctagon,
  ];

  return (
    <section id="privacy" className="py-20 md:py-28 bg-white border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Heading */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage border border-border-subtle text-xs font-semibold text-agri uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>{t.eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-dark tracking-tight">
            {t.heading}
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {t.subheading}
          </p>
        </div>

        {/* 6 Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {t.pillars.map((pillar, idx) => {
            const Icon = icons[idx] || ShieldCheck;
            const isAlert = idx === 5; // The "Never ask for OTPs" pillar

            return (
              <div
                key={pillar.title}
                className={`p-6 sm:p-7 rounded-2xl border transition-all space-y-3 ${
                  isAlert
                    ? 'bg-warning-light/30 border-warning/30 hover:border-warning/50'
                    : 'bg-warm border-border-subtle hover:border-forest/40 hover:bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isAlert
                    ? 'bg-warning-light text-warning-dark border border-warning/20'
                    : 'bg-sage text-forest border border-border-subtle'
                }`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>

                <h3 className="text-base font-bold text-forest-dark tracking-tight">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Notice on DPDP Act Compliance */}
        <div className="p-4 rounded-xl bg-sage/50 border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-agri shrink-0 stroke-[2.2]" />
            <span>
              Designed strictly under the statutory framework of the Digital Personal Data Protection (DPDP) Act, 2023.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-forest shrink-0">
            Encrypted AES-256 Storage
          </span>
        </div>

      </div>
    </section>
  );
}

