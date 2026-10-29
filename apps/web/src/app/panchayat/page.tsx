'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_GRIEVANCES, Grievance } from '../../lib/mockData';

export default function PanchayatPortalPage() {
  const [grievances, setGrievances] = useState<Grievance[]>(INITIAL_GRIEVANCES);
  const [selectedTicket, setSelectedTicket] = useState<Grievance | null>(null);
  const [officerNotes, setOfficerNotes] = useState('');
  const [newStatus, setNewStatus] = useState<Grievance['status']>('IN_PROGRESS');

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const updated = grievances.map((g) => {
      if (g.id === selectedTicket.id) {
        return {
          ...g,
          status: newStatus,
          statusHi:
            newStatus === 'RESOLVED'
              ? 'समाधान पूर्ण (सत्यापित)'
              : newStatus === 'IN_PROGRESS'
              ? 'प्रगति पर (कार्य जारी)'
              : 'ब्लॉक स्तर पर प्रेषित (Escalated)',
          daysRemainingSla: newStatus === 'RESOLVED' ? 0 : g.daysRemainingSla,
        };
      }
      return g;
    });

    setGrievances(updated);
    alert(`टोकन ${selectedTicket.ticketId} की स्थिति सफलतापूर्वक अपडेट हो गई है। नागरिक को एसएमएस अलर्ट भेजा गया।`);
    setSelectedTicket(null);
    setOfficerNotes('');
  };

  const totalComplaints = grievances.length;
  const inProgress = grievances.filter((g) => g.status === 'IN_PROGRESS').length;
  const resolved = grievances.filter((g) => g.status === 'RESOLVED').length;

  return (
    <div className="space-y-6">
      {/* Officer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-white p-5 rounded-2xl shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 px-3 py-1 rounded-full text-xs font-black uppercase mb-1">
            <span>🏛️</span> ग्राम पंचायत प्रशासनिक पोर्टल
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            रामपुर ग्राम सचिवालय (कार्यालय ग्राम प्रधान व सचिव)
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            लॉगिन: रमेश सिंह (पंचायत सचिव) | एलजीडी कोड: GP-UP-091201
          </p>
        </div>

        <Link
          href="/"
          className="self-start sm:self-auto bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg border border-slate-700"
        >
          ← नागरिक पोर्टल पर जाएं
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-xs text-slate-500 font-bold block">कुल दर्ज शिकायतें</span>
          <span className="text-2xl font-black text-slate-900">{totalComplaints}</span>
          <span className="text-[11px] text-slate-400 block mt-1">इस माह</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-xs text-amber-700 font-bold block">प्रगति पर (कार्य जारी)</span>
          <span className="text-2xl font-black text-amber-600">{inProgress}</span>
          <span className="text-[11px] text-amber-800 block mt-1">SLA सक्रिय</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-xs text-emerald-700 font-bold block">निस्तारित शिकायतें</span>
          <span className="text-2xl font-black text-emerald-600">{resolved}</span>
          <span className="text-[11px] text-emerald-800 block mt-1">सत्यापित फोटो सहित</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-xs text-blue-700 font-bold block">औसत समाधान समय</span>
          <span className="text-2xl font-black text-blue-600">3.2 दिन</span>
          <span className="text-[11px] text-blue-800 block mt-1">लक्ष्य: 5 दिन</span>
        </div>
      </div>

      {/* Action Desk List */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>📋</span> नागरिक शिकायतों की कार्यसूची (Action Desk)
          </h2>
          <span className="text-xs text-slate-500">वार्ड 1 से 7</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-neutral-100 text-slate-700 text-xs uppercase font-bold border-b">
              <tr>
                <th className="p-3">टोकन व श्रेणी</th>
                <th className="p-3">शिकायत विवरण</th>
                <th className="p-3">स्थान / वार्ड</th>
                <th className="p-3">SLA स्थिति</th>
                <th className="p-3 text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {grievances.map((g) => (
                <tr key={g.id} className="hover:bg-neutral-50 transition">
                  <td className="p-3 whitespace-nowrap">
                    <span className="font-bold text-slate-900 block">{g.ticketId}</span>
                    <span className="text-[11px] text-emerald-800 font-semibold">{g.categoryHi}</span>
                  </td>

                  <td className="p-3">
                    <span className="font-bold text-slate-900 block line-clamp-1">{g.title}</span>
                    <span className="text-xs text-slate-500 line-clamp-1">{g.description}</span>
                  </td>

                  <td className="p-3 text-xs text-slate-600 whitespace-nowrap">
                    📍 {g.landmark}
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        g.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : g.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {g.statusHi}
                    </span>
                  </td>

                  <td className="p-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedTicket(g);
                        setNewStatus(g.status);
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition"
                    >
                      अपडेट करें
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-bold text-slate-400">शिकायत अद्यतन (Update)</span>
                <h3 className="text-base font-black text-slate-900">{selectedTicket.ticketId}</h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  नई स्थिति चुनें:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as Grievance['status'])}
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs sm:text-sm font-bold text-slate-900"
                >
                  <option value="IN_PROGRESS">🔨 कार्य जारी (In Progress / Assigned)</option>
                  <option value="RESOLVED">✅ समाधान पूर्ण (Resolved)</option>
                  <option value="ESCALATED">⚠️ ब्लॉक अधिकारी को प्रेषित (Escalate to BDO)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  पंचायत सचिव / प्रधान की टिप्पणी:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="उदा. जल निगम के प्लम्बर द्वारा हैंडपंप का वॉशर बदल दिया गया है..."
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="bg-neutral-50 p-3 rounded-lg border text-xs text-slate-600">
                <span className="font-bold block text-slate-900">नागरिक को अलर्ट:</span>
                यह स्टेटस बदलते ही नागरिक ({selectedTicket.citizenName}) को मोबाइल पर स्वतः एसएमएस प्रेषित होगा।
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-neutral-100"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow"
                >
                  सुरक्षित करें व एसएमएस भेजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
