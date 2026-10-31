'use client';

import React, { useState } from 'react';
import {
  X,
  UserRound,
  Phone,
  MapPin,
  Building,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { Language } from '../lib/content';

export interface CitizenUser {
  name: string;
  mobile: string;
  village: string;
  block: string;
  district: string;
  state: string;
  category: string;
  isAuthenticated: boolean;
}

export const DEFAULT_CITIZEN: CitizenUser = {
  name: 'Yash Sharma',
  mobile: '98765 43210',
  village: 'Rampur Village',
  block: 'Bilari Block',
  district: 'Moradabad',
  state: 'Uttar Pradesh',
  category: 'OBC',
  isAuthenticated: true,
};

const PRESET_CITIZENS: Array<{ label: string; user: CitizenUser; roleEn: string; roleHi: string }> = [
  {
    label: 'Yash Sharma',
    roleEn: 'Scholarship Applicant (OBC Student)',
    roleHi: 'छात्रवृत्ति आवेदक (ओबीसी छात्र)',
    user: {
      name: 'Yash Sharma',
      mobile: '98765 43210',
      village: 'Rampur Village',
      block: 'Bilari Block',
      district: 'Moradabad',
      state: 'Uttar Pradesh',
      category: 'OBC',
      isAuthenticated: true,
    },
  },
  {
    label: 'Sukhdev Singh',
    roleEn: 'Agricultural Beneficiary (PM-Kisan)',
    roleHi: 'कृषि लाभार्थी (पीएम-किसान)',
    user: {
      name: 'Sukhdev Singh',
      mobile: '98123 45678',
      village: 'Kalyanpur',
      block: 'Amroha Block',
      district: 'Amroha',
      state: 'Uttar Pradesh',
      category: 'GENERAL',
      isAuthenticated: true,
    },
  },
];

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  currentUser: CitizenUser;
  onSaveUser: (user: CitizenUser) => void;
}

export function SignInModal({
  isOpen,
  onClose,
  currentLang,
  currentUser,
  onSaveUser,
}: SignInModalProps) {
  const isHi = currentLang === 'hi';

  const [formName, setFormName] = useState(currentUser.name);
  const [formMobile, setFormMobile] = useState(currentUser.mobile);
  const [formVillage, setFormVillage] = useState(currentUser.village);
  const [formDistrict, setFormDistrict] = useState(currentUser.district);
  const [formCategory, setFormCategory] = useState(currentUser.category);

  if (!isOpen) return null;

  const handleSelectPreset = (presetUser: CitizenUser) => {
    setFormName(presetUser.name);
    setFormMobile(presetUser.mobile);
    setFormVillage(presetUser.village);
    setFormDistrict(presetUser.district);
    setFormCategory(presetUser.category);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CitizenUser = {
      name: formName.trim() || 'Citizen',
      mobile: formMobile.trim() || '98765 00000',
      village: formVillage.trim() || 'Gram Panchayat',
      block: currentUser.block,
      district: formDistrict.trim() || 'District',
      state: currentUser.state,
      category: formCategory,
      isAuthenticated: true,
    };
    onSaveUser(updated);
    onClose();
  };

  const handleSignOut = () => {
    onSaveUser({
      name: isHi ? 'नागरिक' : 'Citizen',
      mobile: '',
      village: '',
      block: '',
      district: '',
      state: 'Uttar Pradesh',
      category: 'OBC',
      isAuthenticated: false,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full border border-border-subtle shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-forest px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-fresh font-bold text-xs">
              <UserRound className="w-4 h-4 text-fresh stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {isHi ? 'नागरिक पहचान व प्रोफ़ाइल' : 'Citizen Identity & Profile'}
              </h3>
              <p className="text-[11px] text-fresh/80 font-medium">
                {isHi ? 'ग्राम साथी सेवा प्रमाणीकरण' : 'GramSathi Service Authentication'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          
          {/* Quick Select Presets */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
              {isHi ? 'त्वरित प्रोफ़ाइल चुनें (परीक्षण हेतु)' : 'Quick Select Profile (For Demonstration)'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_CITIZENS.map((preset) => {
                const isSelected = formName === preset.user.name;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleSelectPreset(preset.user)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-forest bg-sage/60 ring-1 ring-forest'
                        : 'border-border-subtle bg-warm hover:bg-sage/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-forest-dark">{preset.label}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-forest" />}
                    </div>
                    <span className="text-[10px] text-text-secondary mt-1">
                      {isHi ? preset.roleHi : preset.roleEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-forest-dark mb-1">
                {isHi ? 'आवेदक / नागरिक का पूरा नाम' : 'Citizen / Applicant Full Name'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={isHi ? 'जैसे: यश शर्मा' : 'e.g. Yash Sharma'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle text-xs text-text-main focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest bg-warm/50 font-medium"
                />
              </div>
            </div>

            {/* Mobile & Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-forest-dark mb-1">
                  {isHi ? 'मोबाइल नंबर' : 'Mobile Number'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formMobile}
                    onChange={(e) => setFormMobile(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle text-xs text-text-main focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest bg-warm/50 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-dark mb-1">
                  {isHi ? 'आरक्षण वर्ग' : 'Category'}
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle text-xs text-text-main focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest bg-warm/50 font-medium"
                >
                  <option value="OBC">OBC (अन्य पिछड़ा वर्ग)</option>
                  <option value="SC">SC (अनुसूचित जाति)</option>
                  <option value="ST">ST (अनुसूचित जनजाति)</option>
                  <option value="GENERAL">GENERAL (सामान्य)</option>
                </select>
              </div>
            </div>

            {/* Village & District Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-forest-dark mb-1">
                  {isHi ? 'गांव / ग्राम पंचायत' : 'Village / Gram Panchayat'}
                </label>
                <input
                  type="text"
                  value={formVillage}
                  onChange={(e) => setFormVillage(e.target.value)}
                  placeholder={isHi ? 'जैसे: रामपुर गांव' : 'e.g. Rampur Village'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle text-xs text-text-main focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest bg-warm/50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-dark mb-1">
                  {isHi ? 'जिला' : 'District'}
                </label>
                <input
                  type="text"
                  value={formDistrict}
                  onChange={(e) => setFormDistrict(e.target.value)}
                  placeholder={isHi ? 'जैसे: मुरादाबाद' : 'e.g. Moradabad'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle text-xs text-text-main focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest bg-warm/50 font-medium"
                />
              </div>
            </div>

            {/* Privacy notice */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-sage/60 border border-border-subtle text-xs text-text-secondary">
              <ShieldCheck className="w-4 h-4 text-agri shrink-0 stroke-[2]" />
              <span>
                {isHi
                  ? 'डीपीडीपी 2023 के तहत आपकी प्रोफ़ाइल केवल वर्तमान सेवा सत्र के लिए सुरक्षित रखी जाती है।'
                  : 'Under DPDP 2023, your profile is securely retained solely for this service session.'}
              </span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              {currentUser.isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-error hover:bg-error/5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isHi ? 'लॉग आउट' : 'Sign Out'}</span>
                </button>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-text-secondary hover:bg-warm border border-border-subtle transition-colors"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-forest hover:bg-forest-light transition-all shadow-sm"
                >
                  <span>{isHi ? 'सहेजें व जारी रखें' : 'Save & Continue'}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}

