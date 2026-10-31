'use client';

import React from 'react';
import {
  FileText,
  FileCheck,
  GitCompare,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Lock,
  Layers,
  Database,
  Eye,
  Check,
} from 'lucide-react';
import { Language, CONTENT } from '../lib/content';

interface CoreInnovationProps {
  currentLang: Language;
}

export function CoreInnovationSection({ currentLang }: CoreInnovationProps) {
  const t = CONTENT[currentLang].innovation;
  const d = t.diagram;

  return (
    <section id="innovation" className="py-20 md:py-28 bg-warm border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest text-white text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-fresh stroke-[2.2]" />
            <span>{t.eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest-dark tracking-tight leading-tight">
            {t.heading}
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {t.subheading}
          </p>
        </div>

        {/* Linear Pipeline Flow Bar */}
        <div className="bg-white rounded-2xl p-5 border border-border-subtle shadow-xs">
          <span className="text-xs font-bold text-text-muted tracking-wider uppercase block mb-3">
            {t.workflowLabel}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {t.steps.map((st, i) => (
              <div
                key={st}
                className="p-3 rounded-xl bg-sage/40 border border-border-subtle text-center flex flex-col items-center justify-center space-y-1"
              >
                <span className="w-5 h-5 rounded-full bg-forest text-white text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-xs font-semibold text-forest-dark">
                  {st}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sophisticated Architectural Diagram (HTML/CSS/SVG) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-border-subtle shadow-md space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
            <div>
              <h3 className="text-lg font-bold text-forest-dark">
                Evidence-Linked Reconciliation & Gated Draft Generation
              </h3>
              <p className="text-xs text-text-secondary">
                How independent document inputs are matched, reconciled, and audited before entering the official draft
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage text-agri font-semibold text-xs border border-border-subtle">
              <ShieldCheck className="w-4 h-4 stroke-[2]" />
              <span>Deterministic State Machine</span>
            </span>
          </div>

          {/* Diagram Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Step A: Independent Documents */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                Source Document Ingestion
              </span>

              {/* Doc 1 */}
              <div className="p-4 rounded-xl border border-border-subtle bg-warm space-y-2 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-forest stroke-[2]" />
                    <span className="text-xs font-bold text-forest-dark">{d.docA}</span>
                  </div>
                  <span className="text-[10px] font-medium text-text-muted">Hash Verified</span>
                </div>
                <div className="p-2 rounded bg-white border border-border-subtle text-xs font-mono text-forest">
                  {d.fieldA}
                </div>
                <div className="text-[10px] text-text-muted">
                  Bounding Box: [x:120, y:210, w:240, h:35] · Conf: 0.98
                </div>
              </div>

              {/* Doc 2 */}
              <div className="p-4 rounded-xl border border-border-subtle bg-warm space-y-2 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-forest stroke-[2]" />
                    <span className="text-xs font-bold text-forest-dark">{d.docB}</span>
                  </div>
                  <span className="text-[10px] font-medium text-text-muted">Hash Verified</span>
                </div>
                <div className="p-2 rounded bg-white border border-border-subtle text-xs font-mono text-agri">
                  {d.fieldB}
                </div>
                <div className="text-[10px] text-text-muted">
                  Bounding Box: [x:85, y:140, w:260, h:38] · Conf: 0.94
                </div>
              </div>
            </div>

            {/* Reconciliation Core */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                {d.reconcileTitle}
              </span>

              <div className="p-5 rounded-2xl bg-warning-light/50 border border-warning/40 space-y-4">
                <div className="flex items-center gap-2 text-warning-dark font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-warning stroke-[2.2] shrink-0" />
                  <span>{d.conflictFlag}</span>
                </div>

                <p className="text-xs text-text-main leading-relaxed">
                  Both records refer to the applicant name attribute, but differ by a middle initial.
                </p>

                <div className="p-2.5 rounded-lg bg-white border border-warning/30 text-xs flex items-center justify-between">
                  <span className="text-text-secondary">{d.stateLabel}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-warning-light text-warning-dark">
                    BLOCKED FROM DRAFT
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-white border border-agri/30 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-agri uppercase tracking-wider block">
                    Citizen Action
                  </span>
                  <p className="font-semibold text-forest-dark text-xs">
                    {d.userAction}
                  </p>
                  <span className="text-[10px] text-text-muted block">
                    Audit Log: Actor = APPLICANT, Method = EXPLICIT_CONFIRMATION
                  </span>
                </div>
              </div>
            </div>

            {/* Step C: Verified Draft */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                Controlled Draft Controller
              </span>

              <div className="p-5 rounded-2xl bg-sage border border-agri/30 space-y-4">
                <div className="flex items-center gap-2 text-forest font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-agri stroke-[2.2] shrink-0" />
                  <span>{d.draftStatus}</span>
                </div>

                <div className="space-y-2 bg-white p-4 rounded-xl border border-border-subtle text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                    <span className="text-text-muted">Target Scheme:</span>
                    <span className="font-bold text-forest-dark">Post-Matric 2026</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                    <span className="text-text-muted">Applicant Name:</span>
                    <span className="font-semibold text-forest">Yash Sharma</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                    <span className="text-text-muted">Evidence Provenance:</span>
                    <span className="font-mono text-[10px] text-agri">2 Linked Docs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Submission Readiness:</span>
                    <span className="font-bold text-agri">100% Validated</span>
                  </div>
                </div>

                <div className="text-[11px] text-text-secondary leading-relaxed">
                  Draft is exported for user review and manual official portal handoff without silent errors.
                </div>
              </div>
            </div>

          </div>

          {/* Core Technical Benefits List */}
          <div className="pt-6 border-t border-border-subtle grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.benefits.map((b) => (
              <div key={b.title} className="space-y-1.5">
                <div className="flex items-center gap-2 text-forest font-bold text-sm">
                  <Check className="w-4 h-4 text-agri stroke-[2.5]" />
                  <span>{b.title}</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

