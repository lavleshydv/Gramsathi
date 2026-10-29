'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_SCHEMES, Scheme } from '../../lib/mockData';

export default function SchemesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Quick Eligibility Calculator states
  const [landHolding, setLandHolding] = useState<string>('2.5');
  const [annualIncome, setAnnualIncome] = useState<string>('120000');
  const [isBpl, setIsBpl] = useState<boolean>(true);
  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);

  const categories = [
    { key: 'ALL', label: 'सभी योजनाएं (All)' },
    { key: 'AGRICULTURE', label: '🌾 कृषि एवं किसान' },
    { key: 'HEALTH', label: '🏥 स्वास्थ्य एवं बीमा' },
    { key: 'HOUSING', label: '🏠 आवास एवं निर्माण' },
  ];

  const filteredSchemes = INITIAL_SCHEMES.filter((scheme) => {
    const matchesCategory = selectedCategory === 'ALL' || scheme.category === selectedCategory;
    const matchesSearch =
      scheme.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.descriptionHi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSpeak = (scheme: Scheme) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('आपके ब्राउज़र में आवाज की सुविधा उपलब्ध नहीं है।');
      return;
    }

    if (playingId === scheme.id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setPlayingId(scheme.id);

    const textToSpeak = `${scheme.titleHi}। लाभ: ${scheme.benefit}। पात्रता: ${scheme.eligibilityHi}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleCheckEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const acres = parseFloat(landHolding) || 0;
    const income = parseFloat(annualIncome) || 0;

    let matchedCount = 0;
    let names: string[] = [];

    if (acres <= 5.0) {
      matchedCount++;
      names.push('पीएम किसान सम्मान निधि (₹6,000/वर्ष)');
    }
    if (income <= 250000 || isBpl) {
      matchedCount++;
      names.push('आयुष्मान भारत (₹5 लाख मुफ्त इलाज)');
    }
    if (isBpl) {
      matchedCount++;
      names.push('पीएम आवास योजना (ग्रामीण अनुदान)');
    }

    setEligibilityResult(
      `बधाई! आपके विवरण अनुसार आप ${matchedCount} योजनाओं के लिए पात्र हैं: ${names.join(', ')}।`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>📜</span> सरकारी योजनाएं एवं पात्रता
          </h1>
          <p className="text-slate-600 text-sm">
            केंद्र एवं राज्य सरकार की ग्रामीण कल्याणकारी योजनाओं की संपूर्ण जानकारी व आवेदन।
          </p>
        </div>

        <Link
          href="/"
          className="self-start text-xs font-bold bg-neutral-200 hover:bg-neutral-300 text-slate-800 px-3 py-1.5 rounded-lg"
        >
          ← वापस होम
        </Link>
      </div>

      {/* Instant Eligibility Calculator Card */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-5 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <span>🎯</span> 1-मिनट पात्रता कैलकुलेटर (Eligibility Checker)
        </div>

        <form onSubmit={handleCheckEligibility} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-emerald-100 font-semibold mb-1">
              कृषि भूमि (एकड़ में)
            </label>
            <input
              type="number"
              step="0.5"
              value={landHolding}
              onChange={(e) => setLandHolding(e.target.value)}
              className="w-full bg-emerald-900 border border-emerald-600 rounded-lg px-3 py-2 text-white font-bold text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-emerald-100 font-semibold mb-1">
              वार्षिक पारिवारिक आय (₹)
            </label>
            <input
              type="number"
              step="10000"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              className="w-full bg-emerald-900 border border-emerald-600 rounded-lg px-3 py-2 text-white font-bold text-sm"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm transition shadow"
            >
              🔍 पात्रता जांचें
            </button>
          </div>
        </form>

        {eligibilityResult && (
          <div className="bg-emerald-900/90 border border-amber-400/60 p-3 rounded-lg text-xs sm:text-sm text-emerald-50 font-medium">
            {eligibilityResult}
          </div>
        )}
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="योजना का नाम खोजें (उदा. किसान, आवास, आयुष्मान)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-slate-900 text-sm shadow-sm focus:border-emerald-700"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedCategory === cat.key
                  ? 'bg-emerald-800 text-white shadow'
                  : 'bg-white text-slate-700 border border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {scheme.department}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mt-1">
                    {scheme.titleHi}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">{scheme.titleEn}</span>
                </div>

                {/* Voice Readout Button */}
                <button
                  type="button"
                  onClick={() => handleSpeak(scheme)}
                  className={`p-2 rounded-full text-base border transition ${
                    playingId === scheme.id
                      ? 'bg-red-500 text-white border-red-600 animate-pulse'
                      : 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                  }`}
                  title="योजना का विवरण बोलकर सुनें"
                  aria-label="योजना का विवरण बोलकर सुनें"
                >
                  {playingId === scheme.id ? '⏹️' : '🔊'}
                </button>
              </div>

              {/* Benefit Highlight Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-950 font-bold flex items-center gap-2">
                <span>💰 लाभ:</span>
                <span>{scheme.benefit}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {scheme.descriptionHi}
              </p>

              {/* Eligibility */}
              <div className="text-xs text-slate-600 space-y-1 pt-1">
                <span className="font-bold text-slate-900 block">📌 कौन पात्र है:</span>
                <p>{scheme.eligibilityHi}</p>
              </div>

              {/* Required Documents */}
              <div className="text-xs text-slate-600 pt-1">
                <span className="font-bold text-slate-900 block">📋 आवश्यक दस्तावेज:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {scheme.documents.map((doc, idx) => (
                    <span
                      key={idx}
                      className="bg-neutral-100 text-slate-700 px-2 py-0.5 rounded text-[11px] border border-neutral-200"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Official Apply Action */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              <a
                href={scheme.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 px-4 rounded-lg text-xs transition shadow"
              >
                आधिकारिक पोर्टल पर आवेदन करें ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
