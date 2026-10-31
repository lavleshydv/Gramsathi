'use client';

import React from 'react';
import { Mic, FileSearch, ClipboardCheck } from 'lucide-react';
import { Language, CONTENT } from '../lib/content';

interface TrustValuesProps {
  currentLang: Language;
}

export function TrustValuesSection({ currentLang }: TrustValuesProps) {
  const t = CONTENT[currentLang].trust;
  const icons = [Mic, FileSearch, ClipboardCheck];

  return (
    <section className="border-y border-border-subtle bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-subtle">
          {t.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <div
                key={item.title}
                className={`py-6 md:py-2 px-0 md:px-8 first:pl-0 last:pr-0 flex items-start gap-4`}
              >
                <div className="w-11 h-11 rounded-xl bg-sage flex items-center justify-center text-forest shrink-0 border border-border-subtle">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-forest-dark tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

