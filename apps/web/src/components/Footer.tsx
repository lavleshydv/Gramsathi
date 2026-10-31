'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, Mail, MapPin, ShieldAlert } from 'lucide-react';
import { Language, CONTENT } from '../lib/content';

interface FooterProps {
  currentLang: Language;
}

export function Footer({ currentLang }: FooterProps) {
  const t = CONTENT[currentLang].footer;
  const nav = CONTENT[currentLang].nav;

  return (
    <footer className="bg-forest-dark text-white/90 pt-16 pb-12 border-t border-forest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Multi-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-white border border-forest-light">
                <Sprout className="w-5 h-5 text-fresh stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                GramSathi AI
              </span>
            </div>

            <p className="text-xs sm:text-sm text-fresh/80 leading-relaxed max-w-sm">
              {t.desc}
            </p>

            <div className="pt-2 space-y-2 text-xs text-fresh/70">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-fresh shrink-0" />
                <span>{t.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-fresh shrink-0" />
                <span>{t.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.quickLinksTitle}
            </h4>
            <ul className="space-y-2 text-xs text-fresh/80">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.servicesTitle}
            </h4>
            <ul className="space-y-2 text-xs text-fresh/80">
              <li>
                <Link href="#services" className="hover:text-white transition-colors block">
                  Scholarship Application Preparation
                </Link>
              </li>
              <li>
                <Link href="#innovation" className="hover:text-white transition-colors block">
                  Cross-Document Evidence Reconciliation
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-white transition-colors block">
                  Income & Caste Certificate Validation
                </Link>
              </li>
              <li>
                <Link href="#accessibility" className="hover:text-white transition-colors block">
                  Indic Oral Guidance & Transcripts
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.legalTitle}
            </h4>
            <ul className="space-y-2 text-xs text-fresh/80">
              <li>
                <Link href="#privacy" className="hover:text-white transition-colors block">
                  {t.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="hover:text-white transition-colors block">
                  {t.termsOfUse}
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="hover:text-white transition-colors block">
                  DPDP Act Compliance
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Official Disclaimer Box */}
        <div className="p-5 rounded-2xl bg-forest/60 border border-white/10 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-fresh font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 shrink-0 text-fresh" />
            <span>{t.disclaimerHeading}</span>
          </div>
          <p className="text-white/80 leading-relaxed text-[11px] sm:text-xs">
            {t.disclaimer}
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-fresh/60">
          <span>{t.copyright}</span>
          <span className="text-[11px]">Designed with trust for rural digital empowerment.</span>
        </div>

      </div>
    </footer>
  );
}
