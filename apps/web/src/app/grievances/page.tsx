'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_GRIEVANCES, Grievance } from '../../lib/mockData';

export default function GrievancesPage() {
  const [grievances, setGrievances] = useState<Grievance[]>(INITIAL_GRIEVANCES);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Form states
  const [category, setCategory] = useState('DRINKING_WATER');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [landmark, setLandmark] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);

  const handleCaptureGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation(`GPS: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E (रामपुर वार्ड 3)`);
        },
        () => {
          setGpsLocation('GPS: 28.6253°N, 78.8021°E (रामपुर ग्राम सीमा)');
        }
      );
    } else {
      setGpsLocation('GPS: 28.6253°N, 78.8021°E (रामपुर ग्राम सीमा)');
    }
  };

  const handleVoiceNote = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      setVoiceRecorded(true);
      if (!description) {
        setDescription('बोलकर दर्ज की गई आवाज: वार्ड 4 में प्राइमरी स्कूल के पास नाली टूट गई है और सारा गंदा पानी रास्ते पर आ रहा है। कृपया जल्द मरम्मत कराएं।');
      }
    }, 2000);
  };

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !description) return;

    const newTicketId = `GS-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newGrievance: Grievance = {
      id: `g-${Date.now()}`,
      ticketId: newTicketId,
      category,
      categoryHi:
        category === 'DRINKING_WATER'
          ? '💧 पेयजल'
          : category === 'ELECTRICITY_POLE'
          ? '💡 बिजली/खंभा'
          : category === 'ROAD_REPAIR'
          ? '🛣️ सड़क मरम्मत'
          : '🧹 स्वच्छता/नाली',
      icon: 'AlertCircle',
      title: title || 'नागरिक द्वारा दर्ज शिकायत',
      description,
      landmark: landmark || (gpsLocation ? gpsLocation : 'रामपुर मुख्य बस्ती'),
      status: 'SUBMITTED',
      statusHi: 'प्राप्त हुई (स्वीकृति लंबित)',
      daysRemainingSla: 7,
      reportedDate: 'अभी-अभी दर्ज',
      citizenName: 'आप (सत्यापित नागरिक)',
    };

    setGrievances([newGrievance, ...grievances]);
    setShowModal(false);
    // Reset form
    setTitle('');
    setDescription('');
    setLandmark('');
    setHasPhoto(false);
    setGpsLocation(null);
    setVoiceRecorded(false);
    alert(`आपकी शिकायत सफलतापूर्वक दर्ज हो गई है! आपका टोकन नंबर है: ${newTicketId}। पंचायत सचिव को सूचित कर दिया गया है।`);
  };

  const filteredGrievances = grievances.filter((item) => {
    if (filterStatus === 'ALL') return true;
    return item.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>📢</span> ग्राम समस्या निवारण (Civic Grievances)
          </h1>
          <p className="text-slate-600 text-sm">
            पेयजल, बिजली, सड़क, नाली या स्वच्छता से जुड़ी समस्या फोटो और जीपीएस के साथ दर्ज करें।
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="self-start sm:self-auto bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 text-sm"
        >
          <span>➕</span>
          <span>नई शिकायत दर्ज करें</span>
        </button>
      </div>

      {/* SLA Guarantee Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex items-start gap-3 shadow">
        <span className="text-2xl">⚖️</span>
        <div className="text-xs sm:text-sm text-slate-200">
          <span className="font-bold text-amber-400 block text-sm">
            ग्राम पंचायत नागरिक अधिकार पत्र (Citizens Charter Guarantee):
          </span>
          प्रत्येक शिकायत पर 48 घंटे के भीतर वार्ड सदस्य द्वारा संज्ञान लिया जाना अनिवार्य है। 7 दिनों में निस्तारण न होने पर शिकायत स्वतः ब्लॉक विकास अधिकारी (BDO) को प्रेषित कर दी जाती है।
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 pb-2">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            filterStatus === 'ALL'
              ? 'bg-emerald-800 text-white'
              : 'bg-white text-slate-700 border border-neutral-300'
          }`}
        >
          सभी शिकायतें ({grievances.length})
        </button>
        <button
          onClick={() => setFilterStatus('IN_PROGRESS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            filterStatus === 'IN_PROGRESS'
              ? 'bg-amber-600 text-white'
              : 'bg-white text-slate-700 border border-neutral-300'
          }`}
        >
          प्रगति पर (कार्य जारी)
        </button>
        <button
          onClick={() => setFilterStatus('RESOLVED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            filterStatus === 'RESOLVED'
              ? 'bg-emerald-700 text-white'
              : 'bg-white text-slate-700 border border-neutral-300'
          }`}
        >
          समाधान पूर्ण (Resolved)
        </button>
      </div>

      {/* Grievance Cards List */}
      <div className="space-y-3">
        {filteredGrievances.map((g) => (
          <div
            key={g.id}
            className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-neutral-200">
                  {g.ticketId}
                </span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {g.categoryHi}
                </span>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  g.status === 'RESOLVED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : g.status === 'IN_PROGRESS'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {g.statusHi}
              </span>
            </div>

            <h3 className="font-extrabold text-slate-900 text-base">{g.title}</h3>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{g.description}</p>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-neutral-100 flex-wrap gap-2">
              <span>📍 {g.landmark}</span>
              <span>👤 प्रेषक: {g.citizenName} | 📅 {g.reportedDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: File New Grievance */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>📷</span> नई समस्या दर्ज करें
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitGrievance} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  समस्या की श्रेणी चुनें:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'DRINKING_WATER', label: '💧 पेयजल व्यवस्था' },
                    { key: 'ELECTRICITY_POLE', label: '💡 बिजली / खंभा' },
                    { key: 'ROAD_REPAIR', label: '🛣️ सड़क मरम्मत' },
                    { key: 'SANITATION_DRAINAGE', label: '🧹 नाली व स्वच्छता' },
                  ].map((c) => (
                    <button
                      type="button"
                      key={c.key}
                      onClick={() => setCategory(c.key)}
                      className={`p-2.5 rounded-lg font-bold border text-left transition ${
                        category === c.key
                          ? 'bg-emerald-800 text-white border-emerald-900'
                          : 'bg-neutral-50 text-slate-700 border-neutral-300'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  समस्या का शीर्षक:
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. हैंडपंप खराब है / सड़क पर गड्ढा..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-emerald-700"
                />
              </div>

              {/* Photo & GPS Capture Row */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHasPhoto(!hasPhoto)}
                  className={`p-3 rounded-lg border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                    hasPhoto
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                      : 'bg-neutral-50 text-slate-700 border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  <span className="text-xl">📸</span>
                  <span>{hasPhoto ? '✓ फोटो संलग्न' : 'फोटो खींचें'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCaptureGps}
                  className={`p-3 rounded-lg border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                    gpsLocation
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                      : 'bg-neutral-50 text-slate-700 border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  <span className="text-xl">📍</span>
                  <span>{gpsLocation ? '✓ GPS स्थान प्राप्त' : 'GPS स्थान जोड़ें'}</span>
                </button>
              </div>

              {gpsLocation && (
                <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                  {gpsLocation}
                </div>
              )}

              {/* Voice Note Record */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="text-xs text-amber-900">
                  <span className="font-bold block">बोलकर विवरण दें:</span>
                  यदि टाइप नहीं करना चाहते तो माइक दबाएं
                </div>
                <button
                  type="button"
                  onClick={handleVoiceNote}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow transition ${
                    isRecordingVoice
                      ? 'bg-red-600 text-white animate-pulse'
                      : voiceRecorded
                      ? 'bg-emerald-700 text-white'
                      : 'bg-amber-400 text-slate-900 hover:bg-amber-300'
                  }`}
                >
                  {isRecordingVoice ? '🛑 रिकॉर्ड जारी...' : voiceRecorded ? '✓ रिकॉर्ड हुआ' : '🎙️ आवाज रिकॉर्ड करें'}
                </button>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  विस्तृत विवरण (या बोलकर भरें):
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="समस्या कब से है, कौन सा स्थान है..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs sm:text-sm text-slate-900 focus:border-emerald-700"
                />
              </div>

              {/* Landmark */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  नजदीकी पहचान / लैंडमार्क:
                </label>
                <input
                  type="text"
                  placeholder="उदा. प्राइमरी स्कूल के पास, वार्ड 3..."
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-neutral-100"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow"
                >
                  🚀 शिकायत दर्ज करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
