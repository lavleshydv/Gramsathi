'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_GRIEVANCES, MANDI_RATES } from '../lib/mockData';

export default function HomePage() {
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [voiceReply, setVoiceReply] = useState<string | null>(null);

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setVoiceReply(null);
    setVoiceQuery('सुन रहे हैं... कृपया बोलें...');

    // Simulate speech-to-text and AI response
    setTimeout(() => {
      setVoiceQuery('मुझे पीएम किसान सम्मान निधि की अगली किस्त कब मिलेगी?');
      setIsListening(false);
      setVoiceReply(
        'नमस्ते! पीएम किसान की 17वीं किस्त जारी हो चुकी है। अपने बैंक खाते में डीबीटी (DBT) सक्रिय स्थिति जांचने के लिए योजनाएं अनुभाग देखें।'
      );
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Village Weather Advisory Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-start gap-3 shadow-sm">
        <span className="text-2xl mt-0.5">🌦️</span>
        <div className="flex-1 text-sm text-amber-900">
          <span className="font-bold block">मौसम चेतावनी (बिलारी / मुरादाबाद क्षेत्र):</span>
          आगामी 48 घंटों में हल्की से मध्यम बारिश की संभावना है। कटी हुई फसल को खुले में न रखें व सुरक्षित स्थानों पर ढकें।
        </div>
      </div>

      {/* Voice Assistant Interaction Card */}
      <section className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 bg-emerald-700/60 px-3 py-1 rounded-full text-xs text-amber-300 font-semibold border border-emerald-600">
              <span>🤖</span> AI आवाज साथी (Voice Assistant)
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              बोलकर पूछें या समस्या बताएं
            </h1>
            <p className="text-emerald-100 text-sm max-w-lg">
              योजना की जानकारी, खाद सब्सिडी, या गांव की शिकायत बोलकर दर्ज करें।
            </p>
          </div>

          {/* Large Voice Action Button */}
          <button
            onClick={handleVoiceToggle}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center font-bold shadow-xl transition-all ${
              isListening
                ? 'bg-red-600 text-white scale-110 voice-active ring-4 ring-red-300'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-900 hover:scale-105 ring-4 ring-amber-400/30'
            }`}
            aria-label="बोलकर पूछने के लिए माइक दबाएं"
          >
            <span className="text-2xl sm:text-3xl">{isListening ? '🛑' : '🎙️'}</span>
            <span className="text-[10px] sm:text-xs font-black uppercase mt-0.5">
              {isListening ? 'सुन रहे हैं' : 'माइक दबाएं'}
            </span>
          </button>
        </div>

        {/* Voice Query / Response Area */}
        {(voiceQuery || voiceReply) && (
          <div className="mt-4 pt-4 border-t border-emerald-700/60 space-y-2">
            {voiceQuery && (
              <div className="text-sm bg-emerald-900/80 p-2.5 rounded-lg border border-emerald-700 flex items-center gap-2">
                <span className="text-amber-300">🗣️ आपने कहा:</span>
                <span className="italic font-medium">{voiceQuery}</span>
              </div>
            )}
            {voiceReply && (
              <div className="text-sm bg-amber-400 text-slate-950 p-3 rounded-lg font-medium shadow flex items-start gap-2">
                <span className="text-lg">🔊</span>
                <div>
                  <span className="font-bold block">ग्राम साथी उत्तर:</span>
                  {voiceReply}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4 Core Quick Services Grid */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>⚡</span> त्वरित सेवाएं (Quick Services)
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Schemes */}
          <Link
            href="/schemes"
            className="group bg-white p-4 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md hover:border-emerald-600 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition">
                📜
              </div>
              <h3 className="font-bold text-slate-900 text-base leading-snug">सरकारी योजनाएं</h3>
              <p className="text-xs text-slate-500 mt-1">पात्रता जांचें व लाभ उठाएं</p>
            </div>
            <span className="mt-3 text-xs font-semibold text-emerald-700 flex items-center gap-1">
              24 योजनाएं देखें →
            </span>
          </Link>

          {/* Card 2: Grievances */}
          <Link
            href="/grievances"
            className="group bg-white p-4 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md hover:border-red-500 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-red-100 text-red-800 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition">
                📢
              </div>
              <h3 className="font-bold text-slate-900 text-base leading-snug">समस्या दर्ज करें</h3>
              <p className="text-xs text-slate-500 mt-1">पानी, सड़क, बिजली निवारण</p>
            </div>
            <span className="mt-3 text-xs font-semibold text-red-700 flex items-center gap-1">
              नई शिकायत दर्ज करें →
            </span>
          </Link>

          {/* Card 3: Mandi Rates */}
          <Link
            href="/mandi"
            className="group bg-white p-4 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md hover:border-amber-500 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition">
                🚜
              </div>
              <h3 className="font-bold text-slate-900 text-base leading-snug">आज का मंडी भाव</h3>
              <p className="text-xs text-slate-500 mt-1">मुरादाबाद / बिलारी दरें</p>
            </div>
            <span className="mt-3 text-xs font-semibold text-amber-700 flex items-center gap-1">
              ताजा भाव सूची →
            </span>
          </Link>

          {/* Card 4: Panchayat Desk */}
          <Link
            href="/panchayat"
            className="group bg-white p-4 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md hover:border-slate-800 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition">
                🏛️
              </div>
              <h3 className="font-bold text-slate-900 text-base leading-snug">ग्राम पंचायत कार्य</h3>
              <p className="text-xs text-slate-500 mt-1">विकास कार्य व ग्राम सभा</p>
            </div>
            <span className="mt-3 text-xs font-semibold text-slate-800 flex items-center gap-1">
              अधिकारी लॉगिन →
            </span>
          </Link>
        </div>
      </section>

      {/* Live Mandi Ticker Preview */}
      <section className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>🌾</span> स्थानीय मंडी भाव झलक (Today's Prices)
          </h2>
          <Link href="/mandi" className="text-xs font-semibold text-emerald-700 hover:underline">
            पूरा बोर्ड देखें
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MANDI_RATES.slice(0, 3).map((rate) => (
            <div
              key={rate.id}
              className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-900 text-sm block">{rate.commodityHi}</span>
                <span className="text-xs text-slate-500">{rate.market}</span>
              </div>
              <div className="text-right">
                <span className="font-black text-slate-900 text-base block">
                  ₹{rate.modalPrice.toLocaleString('en-IN')}
                </span>
                <span
                  className={`text-xs font-bold ${
                    rate.trend === 'UP' ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {rate.trend === 'UP' ? '▲' : '▼'} {rate.trendPercent}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Grievances Status Tracking */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>📋</span> गांव की सक्रिय शिकायतें व समाधान स्थिति
          </h2>
          <Link href="/grievances" className="text-xs font-semibold text-emerald-700 hover:underline">
            सभी देखें
          </Link>
        </div>

        <div className="space-y-3">
          {INITIAL_GRIEVANCES.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm hover:shadow transition space-y-2"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  टोकन: {item.ticketId}
                </span>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    item.status === 'RESOLVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'IN_PROGRESS'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {item.statusHi}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">{item.description}</p>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-neutral-100">
                <span>📍 {item.landmark}</span>
                <span>📅 {item.reportedDate}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
