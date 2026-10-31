'use client';

import React from 'react';
import {
  XCircle,
  CheckCircle2,
  FileQuestion,
  Languages,
  AlertOctagon,
  HelpCircle,
  MessageSquareText,
  FileCheck2,
  GitBranch,
  ShieldAlert,
  FileSpreadsheet,
} from 'lucide-react';
import { Language, CONTENT } from '../lib/content';

interface ProblemSolutionProps {
  currentLang: Language;
}

export function ProblemSolutionSection({ currentLang }: ProblemSolutionProps) {
  const t = CONTENT[currentLang].problemSolution;

  const problemIcons = [
    FileQuestion,
    AlertOctagon,
    Languages,
    ShieldAlert,
    HelpCircle,
  ];

  const solutionIcons = [
    MessageSquareText,
    FileCheck2,
    FileSpreadsheet,
    GitBranch,
    CheckCircle2,
  ];

  return (
    <section className="py-20 md:py-28 bg-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage border border-border-subtle text-xs font-semibold text-agri uppercase tracking-wider">
            <span>CHALLENGE & RESOLUTION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-dark tracking-tight leading-tight">
            {t.heading}
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {t.subheading}
          </p>
        </div>

        {/* Split Grid: Reality Today vs GramSathi Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Problems */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border-subtle shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border-subtle">
                <div className="w-9 h-9 rounded-lg bg-error-light/60 flex items-center justify-center text-error shrink-0">
                  <XCircle className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-forest-dark">
                    {t.problemTitle}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Administrative friction points in current systems
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {t.problems.map((prob, idx) => {
                  const Icon = problemIcons[idx] || XCircle;
                  return (
                    <div key={prob.title} className="flex items-start gap-3.5 group">
                      <div className="w-8 h-8 rounded-lg bg-warm flex items-center justify-center text-text-muted shrink-0 border border-border-subtle mt-0.5 group-hover:border-error/40 transition-colors">
                        <Icon className="w-4 h-4 text-error/80" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-forest-dark">
                          {prob.title}
                        </h4>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {prob.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle text-xs text-text-muted">
              Result: Up to 35% of eligible rural applications face delay or statutory rejection.
            </div>
          </div>

          {/* Right Column: Solution */}
          <div className="bg-sage/40 rounded-2xl p-6 sm:p-8 border border-agri/20 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border-subtle">
                <div className="w-9 h-9 rounded-lg bg-forest flex items-center justify-center text-white shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-fresh stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-forest-dark">
                    {t.solutionTitle}
                  </h3>
                  <p className="text-xs text-agri font-medium">
                    {t.solutionHeadline}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {t.solutions.map((sol, idx) => {
                  const Icon = solutionIcons[idx] || CheckCircle2;
                  return (
                    <div key={sol.title} className="flex items-start gap-3.5 group">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-agri shrink-0 border border-agri/20 shadow-xs mt-0.5 group-hover:border-forest transition-colors">
                        <Icon className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-forest-dark">
                          {sol.title}
                        </h4>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {sol.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-agri/20 text-xs font-semibold text-agri">
              Result: Zero silent errors, audited evidence, and reviewable draft submissions.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

