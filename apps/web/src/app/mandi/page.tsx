'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MANDI_RATES, MandiRate } from '../../lib/mockData';

export default function MandiPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const categories = [
    { key: 'ALL', label: 'सभी फसलें (All)' },
    { key: 'GRAIN', label: '🌾 अनाज (Grains)' },
    { key: 'OILSEED', label: '🌻 तिलहन (Oilseeds)' },
    { key: 'VEGETABLE', label: '🥔 सब्जियां (Vegetables)' },
  ];

  const filteredRates = MANDI_RATES.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  const handleSpeakPrice = (rate: MandiRate) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('ब्राउज़र में आवाज की सुविधा उपलब्ध नहीं है।');
      return;
    }

    if (playingId === rate.id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setPlayingId(rate.id);

    const textToSpeak = `${rate.market} में ${rate.commodityHi} का औसत भाव ${rate.modalPrice} रुपये ${rate.unit} है। न्यूनतम भाव ${rate.minPrice} और अधिकतम भाव ${rate.maxPrice} रुपये रहा।`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Title & APMC Connection Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold mb-1 border border-emerald-300">
            <span>📡</span> Agmarknet / e-NAM दैनिक लाइव फीड (Today)
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>🚜</span> कृषि उपज मंडी भाव (APMC Mandi Rates)
          </h1>
          <p className="text-slate-600 text-sm">
            मुरादाबाद, बिलारी एवं संभल मंडियों के दैनिक न्यूनतम, अधिकतम व मॉडल भाव।
          </p>
        </div>

        <Link
          href="/"
          className="self-start text-xs font-bold bg-neutral-200 hover:bg-neutral-300 text-slate-800 px-3 py-1.5 rounded-lg"
        >
          ← वापस होम
        </Link>
      </div>

      {/* Proximity Mandi Locator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-900 text-sm block">बिलारी उप-मंडी</span>
            <span className="text-xs text-slate-500">निकटतम मंडी</span>
          </div>
          <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md">
            📍 6.2 KM
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-900 text-sm block">मुरादाबाद मुख्य APMC</span>
            <span className="text-xs text-slate-500">बड़ी थोक मंडी</span>
          </div>
          <span className="text-xs font-black bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
            📍 14.5 KM
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-900 text-sm block">संभल कृषि उपज मंडी</span>
            <span className="text-xs text-slate-500">तिलहन केंद्र</span>
          </div>
          <span className="text-xs font-black bg-amber-100 text-amber-800 px-2 py-1 rounded-md">
            📍 22.0 KM
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
              selectedCategory === cat.key
                ? 'bg-emerald-800 text-white shadow'
                : 'bg-white text-slate-700 border border-neutral-300 hover:bg-neutral-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Mandi Rates Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRates.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500">मंडी: {item.market}</span>
                <h3 className="font-extrabold text-slate-900 text-lg mt-0.5">{item.commodityHi}</h3>
              </div>

              {/* Audio Speaker Button */}
              <button
                type="button"
                onClick={() => handleSpeakPrice(item)}
                className={`p-2.5 rounded-full text-base border transition ${
                  playingId === item.id
                    ? 'bg-red-500 text-white border-red-600 animate-pulse'
                    : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                }`}
                title="भाव बोलकर सुनें"
                aria-label="भाव बोलकर सुनें"
              >
                {playingId === item.id ? '⏹️' : '🔊'}
              </button>
            </div>

            {/* Modal Price Primary Card */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block font-medium">मॉडल / प्रचलित भाव</span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{item.modalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 font-semibold ml-1">/ क्विंटल</span>
              </div>

              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${
                    item.trend === 'UP'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.trend === 'DOWN'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.trend === 'UP' ? '▲ बढ़ोतरी' : item.trend === 'DOWN' ? '▼ गिरावट' : '● स्थिर'} {item.trendPercent}
                </span>
                <span className="block text-[11px] text-slate-400 mt-1">कल के भाव की तुलना में</span>
              </div>
            </div>

            {/* Price Spread Range (Min to Max) */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-neutral-100/70 p-2.5 rounded-lg border border-neutral-200">
                <span className="text-slate-500 block">न्यूनतम बोली (Min)</span>
                <span className="font-bold text-slate-800 text-sm">
                  ₹{item.minPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-neutral-100/70 p-2.5 rounded-lg border border-neutral-200 text-right">
                <span className="text-slate-500 block">उच्चतम बोली (Max)</span>
                <span className="font-bold text-slate-800 text-sm">
                  ₹{item.maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
