'use client';

import React from 'react';
import {
  GraduationCap,
  FileBadge,
  Sprout,
  HeartHandshake,
  FolderCheck,
  Compass,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Language, CONTENT } from '../lib/content';

interface ServicesProps {
  currentLang: Language;
  onOpenDemo: (serviceName?: string) => void;
}

export function ServicesSection({ currentLang, onOpenDemo }: ServicesProps) {
  const t = CONTENT[currentLang].services;

  const icons = [
    GraduationCap,
    FileBadge,
    Sprout,
    HeartHandshake,
    FolderCheck,
    Compass,
  ];

  return (
    <section id="services" className="py-20 md:py-28 bg-white border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Heading */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage border border-border-subtle text-xs font-semibold text-agri uppercase tracking-wider">
            <span>{t.eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-dark tracking-tight">
            {t.heading}
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {t.subheading}
          </p>
        </div>

        {/* 6 Clean Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {t.items.map((item, idx) => {
            const Icon = icons[idx] || GraduationCap;
            const isLive = item.isAvailable;

            return (
              <div
                key={item.title}
                className={`rounded-2xl p-6 sm:p-7 border transition-all flex flex-col justify-between space-y-6 ${
                  isLive
                    ? 'bg-warm border-border-subtle hover:border-forest/50 hover:shadow-md'
                    : 'bg-warm/50 border-border-subtle/80 opacity-90'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar with Icon and Status Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isLive ? 'bg-forest text-white' : 'bg-sage text-text-muted border border-border-subtle'
                    }`}>
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        isLive
                          ? 'bg-fresh/20 text-agri border-fresh/30'
                          : 'bg-warm text-text-muted border-border-subtle'
                      }`}
                    >
                      {isLive ? (
                        <CheckCircle2 className="w-3 h-3 text-agri" />
                      ) : (
                        <Clock className="w-3 h-3 text-text-muted" />
                      )}
                      <span>{item.status}</span>
                    </span>
                  </div>

                  {/* Title & One-sentence description */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-forest-dark tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Explore Action Button */}
                <div className="pt-4 border-t border-border-subtle">
                  {isLive ? (
                    <button
                      type="button"
                      onClick={() => onOpenDemo(item.title)}
                      className="inline-flex items-center gap-2 text-xs font-bold text-forest hover:text-forest-dark group"
                    >
                      <span>Explore Active Workflow</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] transition-transform group-hover:translate-x-1" />
                    </button>
                  ) : (
                    <span className="text-xs text-text-muted font-medium inline-flex items-center gap-1.5">
                      <span>Roadmap Stage · Integration In Progress</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

