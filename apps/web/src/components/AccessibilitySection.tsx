'use client';

import React, { useState } from 'react';
import {
  Mic,
  Volume2,
  VolumeX,
  Languages,
  Eye,
  MousePointerClick,
  FileEdit,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Language, CONTENT } from '../lib/content';

interface AccessibilityProps {
  currentLang: Language;
}

export function AccessibilitySection({ currentLang }: AccessibilityProps) {
  const t = CONTENT[currentLang].accessibility;
  const v = t.interactiveVoice;
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggleAudio = () => {
    if (isPlaying) {
      setIsPlaying(false);
      window.speechSynthesis?.cancel();
      return;
    }

    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const textToSpeak = currentLang === 'hi'
        ? "नमस्ते! उत्तर प्रदेश पोस्ट-मैट्रिक छात्रवृत्ति के लिए आपको 3 मुख्य दस्तावेज चाहिए: आधार कार्ड, 12वीं की अंकतालिका, और तहसीलदार द्वारा जारी आय प्रमाण पत्र।"
        : "Namaste! For UP Post-Matric Scholarship, you require 3 key documents: Aadhaar card, Class 12 marksheet, and an Income Certificate issued by the Tehsildar.";
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  const featureIcons = [
    Languages,
    Mic,
    Eye,
    MousePointerClick,
    FileEdit,
    ShieldCheck,
  ];

  return (
    <section id="accessibility" className="py-20 md:py-28 bg-warm border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
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

        {/* 2-Column Layout: Features List & Interactive Voice Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Features Column */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {t.features.map((feat, idx) => {
              const Icon = featureIcons[idx] || CheckCircle2;
              return (
                <div key={feat.title} className="p-5 rounded-2xl bg-white border border-border-subtle shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-sage flex items-center justify-center text-forest border border-border-subtle">
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h3 className="text-sm font-bold text-forest-dark tracking-tight">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Interactive Voice Simulator Preview */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-border-subtle shadow-lg space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-forest flex items-center justify-center text-white">
                    <Mic className="w-4 h-4 text-fresh" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-forest-dark">{v.title}</h4>
                    <p className="text-[11px] text-text-secondary">{v.subtitle}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sage text-agri border border-border-subtle">
                  Indic Audio Layer
                </span>
              </div>

              {/* Citizen Query Bubble */}
              <div className="p-3.5 rounded-2xl bg-warm border border-border-subtle text-xs space-y-1">
                <span className="text-[10px] font-bold text-agri uppercase tracking-wider block">
                  Citizen Query (Hindi Speech Input)
                </span>
                <p className="font-semibold text-forest-dark text-sm leading-relaxed">
                  {v.sampleQuery}
                </p>
              </div>

              {/* Spoken Guidance Response Box */}
              <div className="p-4 rounded-2xl bg-sage/60 border border-agri/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-forest uppercase tracking-wider">
                    GramSathi Audio Guidance
                  </span>

                  {/* Animated Voice Equalizer bars when playing */}
                  {isPlaying && (
                    <div className="flex items-center gap-1 h-3">
                      <span className="w-1 bg-forest h-full animate-voice-bar-1 rounded-full" />
                      <span className="w-1 bg-forest h-full animate-voice-bar-2 rounded-full" />
                      <span className="w-1 bg-forest h-full animate-voice-bar-3 rounded-full" />
                      <span className="w-1 bg-forest h-full animate-voice-bar-4 rounded-full" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-text-main leading-relaxed italic">
                  {v.sampleResponse}
                </p>
              </div>

              {/* Audio Play Trigger Button */}
              <button
                type="button"
                onClick={handleToggleAudio}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95 ${
                  isPlaying
                    ? 'bg-forest text-white'
                    : 'bg-forest hover:bg-forest-light text-white'
                }`}
              >
                {isPlaying ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Oral Playback</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-fresh" />
                    <span>{v.playButton}</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-text-muted">
                Zero typing necessary for rural citizens. Full transcripts remain editable at every stage.
              </p>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

