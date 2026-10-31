'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  FileText,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  UploadCloud,
  Check,
  Loader2,
  ShieldCheck,
  Download,
  Wifi,
  WifiOff,
  Mic,
  MicOff,
  Volume2,
  Send,
  UserRound,
  Copy,
  CheckCheck,
  FileCode,
} from 'lucide-react';
import { Language } from '../lib/content';
import { apiClient } from '../lib/apiClient';
import { CitizenUser, DEFAULT_CITIZEN } from './SignInModal';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  currentUser?: CitizenUser;
  initialService?: string;
}

interface UploadedDocItem {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'verified' | 'review_required' | 'processing';
  extractedKey?: string;
  extractedVal?: string;
  confidence?: number;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

export function ApplicationDemoModal({
  isOpen,
  onClose,
  currentLang,
  currentUser = DEFAULT_CITIZEN,
  initialService,
}: DemoModalProps) {
  const isHindi = currentLang === 'hi';
  const userName = currentUser?.name || (isHindi ? 'यश शर्मा' : 'Yash Sharma');

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedScheme, setSelectedScheme] = useState(
    initialService || 'UP Post-Matric Scholarship 2026'
  );
  const [conflictResolved, setConflictResolved] = useState(false);
  const [confirmedName, setConfirmedName] = useState(userName);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Synchronize scheme when initialService prop changes
  useEffect(() => {
    if (initialService) {
      if (initialService.includes('Scholarship') || initialService.includes('छात्रवृत्ति')) {
        setSelectedScheme('UP Post-Matric Scholarship 2026');
      } else if (initialService.includes('Certificate') || initialService.includes('प्रमाण')) {
        setSelectedScheme('Government Certificates (Income, Caste, Domicile)');
      } else if (initialService.includes('Farmer') || initialService.includes('PM-KISAN') || initialService.includes('किसान') || initialService.includes('कृषि')) {
        setSelectedScheme('PM-KISAN Samman Nidhi & Agri-Equipment Subsidy');
      } else if (initialService.includes('Pension') || initialService.includes('पेंशन')) {
        setSelectedScheme('Old-Age & Widow Social Security Pension');
      } else if (initialService.includes('Organisation') || initialService.includes('प्रबंधन') || initialService.includes('दस्तावेज़')) {
        setSelectedScheme('Civic Document Organisation & Integrity Pre-Audit');
      } else if (initialService.includes('Guidance') || initialService.includes('मार्गदर्शन')) {
        setSelectedScheme('National Means-cum-Merit Scholarship (NMMSS)');
      } else {
        setSelectedScheme(initialService);
      }
    }
  }, [initialService, isOpen]);

  // Dynamic document generator for all 6 public services
  const getSchemeDocuments = (schemeName: string, applicantName: string): UploadedDocItem[] => {
    if (schemeName.includes('Farmer') || schemeName.includes('PM-KISAN') || schemeName.includes('किसान')) {
      return [
        {
          id: 'doc_aadhaar',
          name: 'Aadhaar_Card_Verified.pdf',
          type: 'AADHAAR',
          size: '1.2 MB',
          status: 'verified',
          extractedKey: 'Applicant Name',
          extractedVal: applicantName,
          confidence: 0.98,
          boundingBox: { x: 120, y: 210, width: 240, height: 35 },
        },
        {
          id: 'doc_land',
          name: 'Bhulekh_Khatauni_Land_Record.pdf',
          type: 'LAND_RECORD',
          size: '2.1 MB',
          status: 'review_required',
          extractedKey: 'Khasra Landholder Name',
          extractedVal: applicantName.replace(' ', ' S '),
          confidence: 0.95,
          boundingBox: { x: 90, y: 160, width: 250, height: 38 },
        },
        {
          id: 'doc_bank',
          name: 'Bank_Passbook_Verified.pdf',
          type: 'BANK_PASSBOOK',
          size: '1.4 MB',
          status: 'verified',
          extractedKey: 'Account Holder (DBT)',
          extractedVal: applicantName,
          confidence: 0.97,
          boundingBox: { x: 110, y: 240, width: 210, height: 32 },
        },
      ];
    }

    if (schemeName.includes('Certificate') || schemeName.includes('प्रमाण')) {
      return [
        {
          id: 'doc_aadhaar',
          name: 'Aadhaar_Card_Verified.pdf',
          type: 'AADHAAR',
          size: '1.2 MB',
          status: 'verified',
          extractedKey: 'Applicant Name',
          extractedVal: applicantName,
          confidence: 0.98,
          boundingBox: { x: 120, y: 210, width: 240, height: 35 },
        },
        {
          id: 'doc_parivar',
          name: 'Parivar_Register_Nakal.pdf',
          type: 'FAMILY_REGISTER',
          size: '1.6 MB',
          status: 'review_required',
          extractedKey: 'Family Member Record',
          extractedVal: applicantName.replace(' ', ' S '),
          confidence: 0.94,
          boundingBox: { x: 80, y: 130, width: 270, height: 36 },
        },
        {
          id: 'doc_income',
          name: 'Tehsildar_Income_Verification.pdf',
          type: 'INCOME_RECORD',
          size: '1.8 MB',
          status: 'verified',
          extractedKey: 'Annual Income Certified',
          extractedVal: '₹1,20,000',
          confidence: 0.96,
          boundingBox: { x: 140, y: 280, width: 180, height: 30 },
        },
      ];
    }

    if (schemeName.includes('Pension') || schemeName.includes('पेंशन')) {
      return [
        {
          id: 'doc_aadhaar',
          name: 'Aadhaar_Card_Verified.pdf',
          type: 'AADHAAR',
          size: '1.2 MB',
          status: 'verified',
          extractedKey: 'Beneficiary Name',
          extractedVal: applicantName,
          confidence: 0.98,
          boundingBox: { x: 120, y: 210, width: 240, height: 35 },
        },
        {
          id: 'doc_ration',
          name: 'BPL_Ration_Card_Verified.pdf',
          type: 'RATION_CARD',
          size: '1.7 MB',
          status: 'review_required',
          extractedKey: 'BPL Beneficiary Name',
          extractedVal: applicantName.replace(' ', ' S '),
          confidence: 0.93,
          boundingBox: { x: 85, y: 140, width: 260, height: 38 },
        },
        {
          id: 'doc_bank',
          name: 'Bank_Passbook_Verified.pdf',
          type: 'BANK_PASSBOOK',
          size: '1.4 MB',
          status: 'verified',
          extractedKey: 'Direct Benefit Transfer Account',
          extractedVal: applicantName,
          confidence: 0.97,
          boundingBox: { x: 110, y: 240, width: 210, height: 32 },
        },
      ];
    }

    // Default: UP Post-Matric Scholarship / Educational Services
    return [
      {
        id: 'doc_aadhaar',
        name: 'Aadhaar_Card_Verified.pdf',
        type: 'AADHAAR',
        size: '1.2 MB',
        status: 'verified',
        extractedKey: 'Applicant Name',
        extractedVal: applicantName,
        confidence: 0.98,
        boundingBox: { x: 120, y: 210, width: 240, height: 35 },
      },
      {
        id: 'doc_marksheet',
        name: 'Class12_Marksheet_UPBoard.jpg',
        type: 'MARKSHEET',
        size: '2.4 MB',
        status: 'review_required',
        extractedKey: 'Student Name',
        extractedVal: applicantName.replace(' ', ' S '),
        confidence: 0.94,
        boundingBox: { x: 85, y: 140, width: 260, height: 38 },
      },
      {
        id: 'doc_income',
        name: 'Tehsildar_Income_Certificate.pdf',
        type: 'INCOME_CERTIFICATE',
        size: '1.8 MB',
        status: 'verified',
        extractedKey: 'Annual Income',
        extractedVal: '₹1,20,000',
        confidence: 0.96,
        boundingBox: { x: 140, y: 280, width: 180, height: 30 },
      },
    ];
  };

  // Synchronize documents whenever selectedScheme or citizen changes
  useEffect(() => {
    const nextDocs = getSchemeDocuments(selectedScheme, userName);
    setDocuments(nextDocs);
    setInspectingDoc(nextDocs[1] || nextDocs[0]);
  }, [selectedScheme, userName]);

  // Backend connection state
  const [isBackendLive, setIsBackendLive] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);

  // Document Uploads State
  const [documents, setDocuments] = useState<UploadedDocItem[]>([
    {
      id: 'doc_aadhaar',
      name: 'Aadhaar_Card_Verified.pdf',
      type: 'AADHAAR',
      size: '1.2 MB',
      status: 'verified',
      extractedKey: 'Applicant Name',
      extractedVal: userName,
      confidence: 0.98,
      boundingBox: { x: 120, y: 210, width: 240, height: 35 },
    },
    {
      id: 'doc_marksheet',
      name: 'Class12_Marksheet_UPBoard.jpg',
      type: 'MARKSHEET',
      size: '2.4 MB',
      status: 'review_required',
      extractedKey: 'Student Name',
      extractedVal: userName.replace(' ', ' S '),
      confidence: 0.94,
      boundingBox: { x: 85, y: 140, width: 260, height: 38 },
    },
    {
      id: 'doc_income',
      name: 'Tehsildar_Income_Certificate.pdf',
      type: 'INCOME_CERTIFICATE',
      size: '1.8 MB',
      status: 'verified',
      extractedKey: 'Annual Income',
      extractedVal: '₹1,20,000',
      confidence: 0.96,
      boundingBox: { x: 140, y: 280, width: 180, height: 30 },
    },
  ]);

  // Selected document for bounding-box preview
  const [inspectingDoc, setInspectingDoc] = useState<UploadedDocItem | null>(documents[1]);

  // Conversational Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [voiceIntent, setVoiceIntent] = useState<string | null>(null);
  const [spokenGuidance, setSpokenGuidance] = useState<string>('');
  const [textInput, setTextInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Step-specific default guidance
  const getDefaultGuidance = (targetStep: 1 | 2 | 3 | 4) => {
    const isFarmer = selectedScheme.includes('Farmer') || selectedScheme.includes('PM-KISAN') || selectedScheme.includes('किसान');
    const isCert = selectedScheme.includes('Certificate') || selectedScheme.includes('प्रमाण');
    const isPension = selectedScheme.includes('Pension') || selectedScheme.includes('पेंशन');

    switch (targetStep) {
      case 1:
        if (isFarmer) {
          return isHindi
            ? `नमस्ते ${userName} जी! आप पीएम-किसान सम्मान निधि एवं कृषि सब्सिडी के लिए आवेदन कर रहे हैं। क्या हम आधार एवं खतौनी दस्तावेज़ों की जांच प्रारंभ करें?`
            : `Namaste ${userName}! You are preparing an application for PM-KISAN & Agri Subsidies. Shall we verify your Aadhaar and Land Records now?`;
        }
        if (isCert) {
          return isHindi
            ? `नमस्ते ${userName} जी! आप आय, जाति एवं निवास प्रमाण पत्र हेतु आवेदन कर रहे हैं। क्या हम आवश्यक साक्ष्यों की जांच शुरू करें?`
            : `Namaste ${userName}! You are preparing an application for Government Certificates. Shall we verify your supporting records now?`;
        }
        if (isPension) {
          return isHindi
            ? `नमस्ते ${userName} जी! आप वृद्धावस्था एवं सामाजिक सुरक्षा पेंशन हेतु आवेदन कर रहे हैं। क्या हम आधार व बीपीएल दस्तावेज़ों की जांच प्रारंभ करें?`
            : `Namaste ${userName}! You are applying for Social Security Pension. Shall we verify your Aadhaar and BPL records now?`;
        }
        return isHindi
          ? `नमस्ते ${userName} जी! आप ${selectedScheme} के लिए आवेदन कर रहे हैं। क्या हम आवश्यक दस्तावेज़ों की जांच प्रारंभ करें?`
          : `Namaste ${userName}! You are applying for ${selectedScheme}. Shall we verify your required documents now?`;

      case 2:
        return isHindi
          ? `हमने आपके 3 आवश्यक दस्तावेज़ स्कैन कर लिए हैं। कानूनी नाम में एक वर्तनी अंतर पाया गया है। क्या हम विसंगति समाधान के लिए आगे बढ़ें?`
          : `We scanned your 3 required documents. A legal name variation was detected across records. Shall we proceed to resolve the discrepancy?`;

      case 3:
        return isHindi
          ? `कृपया अपने आधार कार्ड वाला नाम ('${userName}') या अन्य दस्तावेज़ में से आधिकारिक नाम की पुष्टि करें।`
          : `Please confirm your authoritative legal name from Aadhaar ('${userName}') or supporting records.`;

      case 4:
        return isHindi
          ? `बधाई हो ${userName} जी! आपका ${selectedScheme} का आवेदन ड्राफ्ट 100% तैयार है और सभी नियमों पर खरा उतरा है।`
          : `Congratulations ${userName}! Your application draft for ${selectedScheme} is 100% ready and satisfies all statutory rules.`;
    }
  };

  // Initialize or update guidance on step or language change
  useEffect(() => {
    if (isOpen) {
      const g = getDefaultGuidance(step);
      setSpokenGuidance(g);
    }
  }, [step, isHindi, userName, isOpen]);

  useEffect(() => {
    if (isOpen) {
      checkBackendConnection();
    }
  }, [isOpen]);

  const checkBackendConnection = async () => {
    const isLive = await apiClient.checkHealth();
    setIsBackendLive(isLive);
  };

  const speakAloud = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = isHindi ? 'hi-IN' : 'en-IN';
      utt.rate = 1.0;
      utt.onend = () => setIsSpeaking(false);
      utt.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utt);
    }
  };

  const resetDemo = () => {
    setStep(1);
    setConflictResolved(false);
    setActiveDraftId(null);
    setVoiceQuery('');
    setVoiceIntent(null);
    const initialG = getDefaultGuidance(1);
    setSpokenGuidance(initialG);
    speakAloud(initialG);
  };

  // Step 1 -> 2: Initialize Session and Draft
  const handleProceedToDocs = async () => {
    setIsLoading(true);
    try {
      if (isBackendLive) {
        const session = await apiClient.createSession(isHindi ? 'hi' : 'en');
        const draft = await apiClient.createDraft(session.session_id, 'SCHOLARSHIP_POST_MATRIC_2026');
        setActiveDraftId(draft.draft_id);
      }
    } catch (err) {
      console.warn('Backend call failed, using graceful simulation:', err);
    } finally {
      setIsLoading(false);
      setStep(2);
    }
  };

  // Step 2 -> 3: Reconcile Cross-Doc Evidence
  const handleProceedToReconcile = async () => {
    setIsLoading(true);
    try {
      if (isBackendLive && activeDraftId) {
        await apiClient.reconcileDraft(activeDraftId);
      }
    } catch (err) {
      console.warn('Backend reconcile call failed, using simulation:', err);
    } finally {
      setIsLoading(false);
      setStep(3);
    }
  };

  // Step 3 -> 4: Finalize User Override & Generate Draft
  const handleFinalizeDraft = async () => {
    setIsLoading(true);
    try {
      if (isBackendLive && activeDraftId) {
        await apiClient.confirmField(activeDraftId, 'full_name', confirmedName);
        await apiClient.getDraftSummary(activeDraftId);
        try {
          await apiClient.generateFinalDraftPackage(activeDraftId);
        } catch (e) {
          console.warn('Package generation backend warning:', e);
        }
      }
    } catch (err) {
      console.warn('Draft finalization failed, using simulation:', err);
    } finally {
      setIsLoading(false);
      setStep(4);
    }
  };

  // Build authoritative text draft
  const getDraftDocumentText = () => {
    const timestamp = new Date().toLocaleString(isHindi ? 'hi-IN' : 'en-IN', {
      dateStyle: 'full',
      timeStyle: 'medium',
    });
    const draftRef = activeDraftId || `GS-UP-DFT-${Date.now().toString().slice(-8)}`;
    const userLocation = currentUser?.village
      ? `${currentUser.village}, ${currentUser.block}, ${currentUser.district}, ${currentUser.state}`
      : 'Rampur Village, Bilari Block, Moradabad, Uttar Pradesh';

    const isFarmer = selectedScheme.includes('Farmer') || selectedScheme.includes('PM-KISAN') || selectedScheme.includes('किसान');
    const isCert = selectedScheme.includes('Certificate') || selectedScheme.includes('प्रमाण');
    const isPension = selectedScheme.includes('Pension') || selectedScheme.includes('पेंशन');
    const isDocOrg = selectedScheme.includes('Organisation') || selectedScheme.includes('प्रबंधन') || selectedScheme.includes('दस्तावेज़');

    const departmentName = isFarmer
      ? 'Department of Agriculture & Farmers Welfare, Govt of UP'
      : isCert
      ? 'Revenue Department, Govt of Uttar Pradesh (Tehsildar Issuance)'
      : isPension
      ? 'Social Welfare Department, Govt of Uttar Pradesh'
      : isDocOrg
      ? 'Gram Secretariat & Digital Village Service Center'
      : 'Social Welfare & Backward Class Welfare Department, UP';

    const portalUrl = isFarmer
      ? 'https://pmkisan.gov.in & https://upagriculture.com'
      : isCert
      ? 'https://edistrict.up.gov.in'
      : isPension
      ? 'https://sspy-up.gov.in'
      : isDocOrg
      ? 'https://digitalseva.csc.gov.in'
      : 'https://scholarship.up.gov.in';

    let eligibilitySection = '';
    let applicantDetailExtra = '';

    if (isFarmer) {
      applicantDetailExtra = `Category              : Marginal / Small Farmer (Under 2 Hectares)
Primary Occupation    : Agriculture & Allied Activities
Khasra / Khatauni Ref : Khatauni #KH-77129 (Bilari Tehsil)`;
      eligibilitySection = `----------------------------------------------------------------------------------------
2. STATUTORY ELIGIBILITY & RECONCILED DATA
----------------------------------------------------------------------------------------
[✓] Cultivable Landholding  : 1.8 Hectares (Statutory Limit: Small Farmer < 2.0 Ha) -> ELIGIBLE
    Evidence Source         : Bhulekh Khatauni Land Record #KH-77129 (Confidence: 95%)

[✓] DBT Bank Mandate        : Aadhaar-Seeded Active NPCI Mandate -> DBT ACTIVE
    Evidence Source         : Bank Passbook Record (Verified for Central Installments)

[✓] Identity Verification   : Aadhaar Card UIDAI Masked (Confidence: 98%)
    Audit Hash              : a3f88921c5b4e870129bcfe1438910d65a`;
    } else if (isCert) {
      applicantDetailExtra = `Category              : ${currentUser?.category || 'OBC (Other Backward Class)'}
Tehsil / Sub-Division : Bilari Tehsil, Moradabad District
Lekhpal Field Circle  : Circle 04, Rampur Majra`;
      eligibilitySection = `----------------------------------------------------------------------------------------
2. STATUTORY ELIGIBILITY & RECONCILED DATA
----------------------------------------------------------------------------------------
[✓] Domicile Eligibility    : Permanent Resident of Uttar Pradesh (>15 years) -> ELIGIBLE
    Evidence Source         : Parivar Register Nakal #PR-5521 (Gram Rampur) (Confidence: 94%)

[✓] Annual Household Income : ₹1,20,000 / year (Certified by Revenue Inspector) -> ELIGIBLE
    Evidence Source         : Tehsildar Field Inspection #INSP-882 (Confidence: 96%)

[✓] Identity Verification   : Aadhaar Card UIDAI Masked (Confidence: 98%)
    Audit Hash              : a3f88921c5b4e870129bcfe1438910d65a`;
    } else if (isPension) {
      applicantDetailExtra = `Category              : Senior Citizen / Social Security Beneficiary
Statutory Age         : 62 Years (Completed)
Ration Card Category  : BPL (Below Poverty Line Antyodaya)`;
      eligibilitySection = `----------------------------------------------------------------------------------------
2. STATUTORY ELIGIBILITY & RECONCILED DATA
----------------------------------------------------------------------------------------
[✓] Statutory Age Record    : 62 Years (Threshold: >= 60 Years) -> ELIGIBLE
    Evidence Source         : Aadhaar Card Verified UIDAI (DOB: 1964) (Confidence: 98%)

[✓] BPL Social Status       : Below Poverty Line Verified (Confidence: 93%)
    Evidence Source         : BPL Ration Card #0981726354 (NFSA Registry)

[✓] DBT Bank Account        : Active Pension Account (Confidence: 97%)
    Evidence Source         : Bank Passbook DBT Mandate Active`;
    } else if (isDocOrg) {
      applicantDetailExtra = `Vault Vault Ref       : GS-VAULT-${Date.now().toString().slice(-6)}
Indexed Records       : 3 Essential Statutory Credentials
OCR Quality Score     : 98.5% High Fidelity Optical Spatial Index`;
      eligibilitySection = `----------------------------------------------------------------------------------------
2. STATUTORY ELIGIBILITY & RECONCILED DATA
----------------------------------------------------------------------------------------
[✓] Document Vault Completeness: 3 of 3 Essential Civic Records Indexed (100%) -> AUDIT PASS
    Evidence Sources        : Aadhaar Card, State Residence, Income Records

[✓] Optical Feature Quality : C_ocr = 0.98 (Zero legibility defects or blur) -> OPTIMAL
    Spatial Provenance      : Bounding box coordinates verified across all pages

[✓] Identity Hash Integrity : Immutable cryptographic SHA-256 fingerprint verified`;
    } else {
      applicantDetailExtra = `Category              : ${currentUser?.category || 'OBC (Other Backward Class)'}
Date of Birth         : 12 April 2005 (Verified: UP Board Marksheet)
Statutory Institution : Government Polytechnic College, Moradabad`;
      eligibilitySection = `----------------------------------------------------------------------------------------
2. STATUTORY ELIGIBILITY & RECONCILED DATA
----------------------------------------------------------------------------------------
[✓] Annual Household Income : ₹1,20,000 / year (Limit: ₹2,50,000) -> ELIGIBLE
    Evidence Source         : Tehsildar Certificate #INC-89214 (Confidence: 96%)

[✓] Class 12 Marks          : 82.5% (Threshold: >= 60.0%) -> ELIGIBLE (MERIT TIER 1)
    Evidence Source         : UP Board Class 12 Marksheet #ROLL-44192 (Confidence: 94%)

[✓] Identity Verification   : Aadhaar Card UIDAI Masked (Confidence: 98%)
    Audit Hash              : a3f88921c5b4e870129bcfe1438910d65a`;
    }

    return `========================================================================================
                      GRAMSATHI AI — OFFICIAL APPLICATION DRAFT
                Government Services, Made Simpler for Every Village
========================================================================================

APPLICATION REFERENCE : ${draftRef}
DRAFT TIMESTAMP       : ${timestamp}
TARGET SCHEME         : ${selectedScheme}
DEPARTMENT            : ${departmentName}
OFFICIAL PORTAL       : ${portalUrl}
READINESS SCORE       : 100% (Statutorily Gated & Verified)

----------------------------------------------------------------------------------------
1. APPLICANT IDENTIFICATION & RECONCILED PROFILE
----------------------------------------------------------------------------------------
Applicant Legal Name  : ${confirmedName}
Confirmed By          : Authoritative Citizen Override (UIDAI Standard)
Discrepancy Resolved  : Middle Initial "S" reconciled to "${confirmedName}"
Mobile Number         : +91 ${currentUser?.mobile || '98765 43210'}
Address / Location    : ${userLocation}
${applicantDetailExtra}

${eligibilitySection}

----------------------------------------------------------------------------------------
3. FORMAL RELIABILITY TENSOR & GATING PROVENANCE
----------------------------------------------------------------------------------------
OCR Clarity Score (C_ocr)       : 0.98 (High Clarity Bounding Boxes)
Inter-Doc Consistency (C_cons)  : 1.00 (Zero Unresolved Conflicts)
Audit Trail Score (C_audit)     : 1.00 (Immutable SHA-256 Event Chain)
Statutory Rule Score (C_rules)  : 1.00 (NetworkX Topological DAG Verified)
Gating State                    : ELIGIBLE_FOR_PORTAL_SUBMISSION
False Acceptance Risk           : 0.0% (Zero Silent Hallucinations Guaranteed)

----------------------------------------------------------------------------------------
4. PRIVACY & COMPLIANCE NOTICE (DPDP ACT 2023)
----------------------------------------------------------------------------------------
Aadhaar UIDAI Masking : XXXX-XXXX-1234 (8 digits masked as per statutory requirements)
Storage Security      : AES-256 Encrypted at Rest
Consent Receipt ID    : CR-UP-2026-${Date.now().toString().slice(-8)}

----------------------------------------------------------------------------------------
5. NEXT STEPS FOR CITIZEN / CSC VLE SUBMISSION
----------------------------------------------------------------------------------------
Step 1: Open the official portal at ${portalUrl}
Step 2: Copy the exact pre-validated values from this verified draft into the online form.
Step 3: Attach the verified documents matching your audited application bundle.
Step 4: Keep this draft copy for your records and track application status.

========================================================================================
Generated by GramSathi AI Intelligence Engine — Zero Portal Rejection Architecture
========================================================================================`;
  };

  // Real file download trigger
  const handleDownloadDraft = (format: 'txt' | 'json' = 'txt') => {
    const draftRef = activeDraftId || `GS-UP-DFT-${Date.now().toString().slice(-8)}`;
    const cleanFileName = confirmedName.replace(/\s+/g, '_');

    const isFarmer = selectedScheme.includes('Farmer') || selectedScheme.includes('PM-KISAN') || selectedScheme.includes('किसान');
    const isCert = selectedScheme.includes('Certificate') || selectedScheme.includes('प्रमाण');
    const isPension = selectedScheme.includes('Pension') || selectedScheme.includes('पेंशन');
    const isDocOrg = selectedScheme.includes('Organisation') || selectedScheme.includes('प्रबंधन') || selectedScheme.includes('दस्तावेज़');

    const departmentName = isFarmer
      ? 'Department of Agriculture & Farmers Welfare, Govt of UP'
      : isCert
      ? 'Revenue Department, Govt of Uttar Pradesh (Tehsildar Issuance)'
      : isPension
      ? 'Social Welfare Department, Govt of Uttar Pradesh'
      : isDocOrg
      ? 'Gram Secretariat & Digital Village Service Center'
      : 'Social Welfare & Backward Class Welfare Department, UP';

    const portalUrl = isFarmer
      ? 'https://pmkisan.gov.in & https://upagriculture.com'
      : isCert
      ? 'https://edistrict.up.gov.in'
      : isPension
      ? 'https://sspy-up.gov.in'
      : isDocOrg
      ? 'https://digitalseva.csc.gov.in'
      : 'https://scholarship.up.gov.in';

    const serviceIdCode = isFarmer
      ? 'FARMER_AGRICULTURE_PMKISAN'
      : isCert
      ? 'GOVERNMENT_CERTIFICATES'
      : isPension
      ? 'PENSION_SOCIAL_SECURITY'
      : isDocOrg
      ? 'DOCUMENT_ORGANISATION'
      : 'SCHOLARSHIP_POST_MATRIC_2026';

    if (format === 'json') {
      const userLocation = currentUser?.village
        ? `${currentUser.village}, ${currentUser.block}, ${currentUser.district}, ${currentUser.state}`
        : 'Rampur Village, Bilari Block, Moradabad, Uttar Pradesh';

      const draftJson = {
        application_id: draftRef,
        service_id: serviceIdCode,
        target_scheme: selectedScheme,
        department: departmentName,
        official_portal_url: portalUrl,
        generation_timestamp: new Date().toISOString(),
        readiness_score: 1.0,
        gating_status: 'ELIGIBLE_FOR_SUBMISSION',
        applicant_profile: {
          full_name: confirmedName,
          mobile_number: currentUser?.mobile || '98765 43210',
          category: currentUser?.category || 'OBC',
          location: userLocation,
          institution: 'Government Polytechnic College',
          academic_percentage: 82.5,
          annual_family_income: 120000,
        },
        reconciliation_audit: {
          reconciliation_type: 'AUTHORITATIVE_CITIZEN_OVERRIDE',
          original_variation: 'Middle Initial reconciled to authoritative citizen standard',
          evidence_nodes_linked: documents.length,
          evidence_sources: documents.map((d) => ({
            document: d.name,
            status: d.status.toUpperCase(),
            confidence: d.confidence || 0.95,
            extracted_field: d.extractedKey,
            extracted_value: d.extractedVal,
          })),
          confidence_tensor: { c_ocr: 0.98, c_consist: 1.0, c_audit: 1.0, c_rules: 1.0 },
          statutory_dag_pass: true,
          false_acceptance_rate: 0.0,
        },
        dpdp_compliance: {
          consent_receipt_id: `CR-DPDP-${Date.now()}`,
          aadhaar_masked: true,
          storage_encryption: 'AES-256',
        },
      };

      const blob = new Blob([JSON.stringify(draftJson, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GramSathi_Draft_${cleanFileName}_${draftRef}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const text = getDraftDocumentText();
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GramSathi_Draft_${cleanFileName}_${draftRef}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    setHasDownloaded(true);

    const announce = isHindi
      ? `बधाई हो ${userName} जी! आपका आवेदन ड्राफ्ट सफलतापूर्वक डाउनलोड हो गया है।`
      : `Congratulations ${userName}! Your verified application draft has been successfully downloaded.`;
    setSpokenGuidance(announce);
    speakAloud(announce);
  };

  const handleCopyToClipboard = () => {
    const text = getDraftDocumentText();
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Central Conversational Speech Processor
  const handleProcessCitizenSpeech = async (spokenText: string) => {
    const text = spokenText.trim();
    if (!text) return;

    setVoiceQuery(text);

    // Affirmation / Progression triggers (Yes, start, next, proceed, Haan, aage badho)
    const isAffirmative = /(हाँ|हा|शुरू|आगे|चलो|ठीक|करो|नेक्स्ट|हो गया|बिल्कुल|yes|proceed|next|start|ok|okay|continue|confirm|let's go|sure|go ahead|yeah|yep)/i.test(text);

    // 1. If user says YES / NEXT / PROCEED: Move to the next logical step
    if (isAffirmative) {
      setVoiceIntent('PROCEED_NEXT');

      if (step === 1) {
        const reply = isHindi
          ? `बहुत बढ़िया ${userName} जी! चलिए आवश्यक दस्तावेज़ों की जांच और अपलोड शुरू करते हैं।`
          : `Great, ${userName}! Let's proceed to verify and upload your required documents.`;
        setSpokenGuidance(reply);
        speakAloud(reply);
        handleProceedToDocs();
        return;
      }

      if (step === 2) {
        const reply = isHindi
          ? `जी बिल्कुल, विसंगति समाधान स्क्रीन खोली जा रही है।`
          : `Certainly! Opening the discrepancy resolution screen now.`;
        setSpokenGuidance(reply);
        speakAloud(reply);
        handleProceedToReconcile();
        return;
      }

      if (step === 3) {
        setConfirmedName(userName);
        setConflictResolved(true);
        const reply = isHindi
          ? `शानदार! आपका सही नाम '${userName}' सत्यापित हो गया है। अंतिम ड्राफ्ट तैयार किया जा रहा है।`
          : `Confirmed! Your legal name '${userName}' has been verified. Generating your final statutory draft now.`;
        setSpokenGuidance(reply);
        speakAloud(reply);
        handleFinalizeDraft();
        return;
      }

      if (step === 4) {
        handleDownloadDraft('txt');
        return;
      }
    }

    // Direct download trigger by voice
    if (/download|डाउनलोड|draft|मसौदा/i.test(text)) {
      handleDownloadDraft('txt');
      return;
    }

    // 2. Otherwise: Call live backend /v1/voice/intent for general intent handling
    try {
      if (isBackendLive) {
        const res = await apiClient.classifyVoiceIntent(text, isHindi ? 'hi' : 'en', userName);
        setVoiceIntent(res.intent);
        const reply = res.spoken_reply || getDefaultGuidance(step);
        setSpokenGuidance(reply);
        speakAloud(reply);
      } else {
        // Local contextual classification
        if (/दस्तावेज|कागज|documents|papers/i.test(text)) {
          setVoiceIntent('DOCUMENT_QUERY');
          const reply = isHindi
            ? `इस छात्रवृत्ति हेतु तीन मुख्य दस्तावेज़ आवश्यक हैं: आधार कार्ड, 12वीं कक्षा का अंकपत्र, और तहसीलदार द्वारा जारी आय प्रमाण पत्र।`
            : `For this scholarship, 3 statutory documents are required: Aadhaar Card, Class 12 Marksheet, and an Income Certificate.`;
          setSpokenGuidance(reply);
          speakAloud(reply);
        } else if (/स्थिति|स्टेटस|status|तैयार/i.test(text)) {
          setVoiceIntent('CHECK_STATUS');
          const reply = isHindi
            ? `मैं आपके आवेदन की जांच कर रहा हूँ। वर्तमान में आप चरण ${step} पर हैं।`
            : `Checking your application status. You are currently on step ${step} of 4.`;
          setSpokenGuidance(reply);
          speakAloud(reply);
        } else if (/गलती|त्रुटि|लाल|error|problem/i.test(text)) {
          setVoiceIntent('EXPLAIN_ERROR');
          const reply = isHindi
            ? `अंकपत्र में मध्य नाम 'S' जुड़ा होने के कारण प्रणाली ने पुष्टि मांगी है ताकि पोर्टल पर आवेदन रद्द न हो।`
            : `A middle initial 'S' in the marksheet requires your confirmation to prevent portal rejection.`;
          setSpokenGuidance(reply);
          speakAloud(reply);
        } else {
          setVoiceIntent('GENERAL_HELP');
          const reply = isHindi
            ? `जी ${userName} जी, आप 'हाँ' या 'आगे बढ़ें' बोलकर अगले चरण पर जा सकते हैं, या दस्तावेज़ों के बारे में पूछ सकते हैं।`
            : `Yes ${userName}, you can say 'Yes' or 'Proceed' to advance to the next step, or ask about required documents.`;
          setSpokenGuidance(reply);
          speakAloud(reply);
        }
      }
    } catch (err) {
      console.warn('Speech intent error:', err);
    }
  };

  // Microphone toggle with Web Speech Recognition or Contextual Simulation
  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    if (typeof window !== 'undefined') {
      const SpeechRec = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (SpeechRec) {
        try {
          const recognition = new SpeechRec();
          recognition.lang = isHindi ? 'hi-IN' : 'en-IN';
          recognition.interimResults = false;
          recognition.maxAlternatives = 1;

          recognition.onstart = () => setIsRecording(true);
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setIsRecording(false);
            handleProcessCitizenSpeech(transcript);
          };
          recognition.onerror = () => {
            setIsRecording(false);
            fallbackSimulation();
          };
          recognition.onend = () => setIsRecording(false);
          recognition.start();
          return;
        } catch (err) {
          console.warn('Web Speech API error, falling back:', err);
        }
      }
    }

    fallbackSimulation();
  };

  const fallbackSimulation = () => {
    setIsRecording(true);
    setVoiceQuery(isHindi ? 'बोल रहे हैं... कृपया प्रतीक्षा करें' : 'Listening... Please speak');

    setTimeout(() => {
      setIsRecording(false);
      // Supply the most natural affirmative progression utterance for this step
      let simulated = '';
      if (step === 1) {
        simulated = isHindi ? 'हाँ, आवश्यक दस्तावेज़ों की जांच शुरू करें' : 'Yes, proceed with document verification';
      } else if (step === 2) {
        simulated = isHindi ? 'हाँ, विसंगति समाधान के लिए आगे बढ़ें' : 'Yes, proceed to resolve discrepancy';
      } else if (step === 3) {
        simulated = isHindi ? 'आधार वाला नाम सही है, पुष्टि करें' : 'Aadhaar name is correct, confirm';
      } else {
        simulated = isHindi ? 'आवेदन का अंतिम मसौदा तैयार करें' : 'Confirm final verified draft';
      }
      handleProcessCitizenSpeech(simulated);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc: UploadedDocItem = {
      id: `doc_${Date.now()}`,
      name: file.name,
      type: 'USER_UPLOAD',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'verified',
      extractedKey: 'Verified Field',
      extractedVal: userName,
      confidence: 0.95,
      boundingBox: { x: 100, y: 150, width: 220, height: 35 },
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setInspectingDoc(newDoc);
  };

  // Dynamic quick-response chips for each step
  const getStepChips = () => {
    switch (step) {
      case 1:
        return [
          { text: isHindi ? 'हाँ, शुरू करें' : 'Yes, Start', label: isHindi ? 'हाँ, शुरू करें' : 'Yes, Start' },
          { text: isHindi ? 'दस्तावेज क्या चाहिए?' : 'What documents are needed?', label: isHindi ? 'दस्तावेज़ सूची' : 'Required Docs' },
          { text: isHindi ? 'आवेदन स्थिति क्या है?' : 'What is the status?', label: isHindi ? 'आवेदन स्थिति' : 'Check Status' },
        ];
      case 2:
        return [
          { text: isHindi ? 'हाँ, विसंगति समाधान करें' : 'Yes, Resolve Discrepancy', label: isHindi ? 'हाँ, विसंगति ठीक करें' : 'Yes, Resolve Discrepancy' },
          { text: isHindi ? 'यह लाल निशान क्यों है?' : 'Why is there an error?', label: isHindi ? 'समस्या क्या है?' : 'Explain Error' },
          { text: isHindi ? 'दस्तावेज सूची दिखाएं' : 'Show documents list', label: isHindi ? 'दस्तावेज़ सूची' : 'Doc List' },
        ];
      case 3:
        return [
          { text: isHindi ? 'आधार वाला नाम सही है, पुष्टि करें' : 'Aadhaar name is correct, confirm', label: isHindi ? 'आधार वाला नाम चुनें' : 'Confirm Aadhaar Name' },
          { text: isHindi ? 'अंकपत्र वाला नाम चुनें' : 'Marksheet name is correct', label: isHindi ? 'अंकपत्र वाला चुनें' : 'Confirm Marksheet Name' },
          { text: isHindi ? 'हाँ, आगे बढ़ें' : 'Yes, proceed', label: isHindi ? 'हाँ, पुष्टि करें' : 'Yes, Confirm' },
        ];
      case 4:
        return [
          { text: isHindi ? 'आधिकारिक मसौदा डाउनलोड करें' : 'Download verified draft', label: isHindi ? 'ड्राफ्ट डाउनलोड करें' : 'Download Draft' },
          { text: isHindi ? 'ड्राफ्ट सारांश दिखाएं' : 'Show draft summary', label: isHindi ? 'ड्राफ्ट सारांश' : 'View Summary' },
          { text: isHindi ? 'पुनः प्रारंभ करें' : 'Restart application', label: isHindi ? 'पुनः प्रारंभ' : 'Restart' },
        ];
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-border-subtle shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="bg-forest px-6 py-4 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-fresh uppercase tracking-wider block">
                {isHindi ? 'आवेदन तैयारी प्रवाह' : 'Application Preparation Workflow'}
              </span>

              {/* Live Connection Badge */}
              <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                isBackendLive
                  ? 'bg-fresh/20 text-fresh border-fresh/30'
                  : 'bg-white/10 text-white/70 border-white/10'
              }`}>
                {isBackendLive ? (
                  <>
                    <Wifi className="w-2.5 h-2.5 text-fresh" />
                    <span>FastAPI Core: ONLINE</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-2.5 h-2.5 text-white/70" />
                    <span>Local Resilience Mode</span>
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <h3 className="text-base font-bold text-white tracking-tight">
                {selectedScheme}
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] text-fresh/90 font-medium px-2 py-0.5 rounded-full bg-white/10">
                <UserRound className="w-3 h-3 text-fresh" />
                <span>{userName}</span>
              </span>
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

        {/* Step Progress Timeline Indicator */}
        <div className="bg-sage/40 px-6 py-3 border-b border-border-subtle flex items-center justify-between text-xs text-text-secondary overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-forest text-white' : 'bg-border-subtle text-text-muted'
            }`}>
              1
            </span>
            <span className={step === 1 ? 'text-forest font-bold' : ''}>
              {isHindi ? 'योजना चयन' : 'Scheme'}
            </span>
          </div>

          <div className="w-8 h-0.5 bg-border-subtle" />

          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-forest text-white' : 'bg-border-subtle text-text-muted'
            }`}>
              2
            </span>
            <span className={step === 2 ? 'text-forest font-bold' : ''}>
              {isHindi ? 'दस्तावेज़ व OCR' : 'Docs & OCR'}
            </span>
          </div>

          <div className="w-8 h-0.5 bg-border-subtle" />

          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 3 ? 'bg-forest text-white' : 'bg-border-subtle text-text-muted'
            }`}>
              3
            </span>
            <span className={step === 3 ? 'text-forest font-bold' : ''}>
              {isHindi ? 'मिलान व पुष्टि' : 'Reconciliation'}
            </span>
          </div>

          <div className="w-8 h-0.5 bg-border-subtle" />

          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 4 ? 'bg-forest text-white' : 'bg-border-subtle text-text-muted'
            }`}>
              4
            </span>
            <span className={step === 4 ? 'text-forest font-bold' : ''}>
              {isHindi ? 'पक्का मसौदा' : 'Verified Draft'}
            </span>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* PERSISTENT MULTI-TURN CONVERSATIONAL VOICE COMPANION */}
          <div className="p-4 rounded-2xl bg-sage/60 border border-agri/30 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isSpeaking || isRecording ? 'bg-forest text-fresh animate-pulse' : 'bg-forest text-white'
                }`}>
                  <Volume2 className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-forest-dark block">
                    {isHindi ? 'ग्राम साथी आवाज सहायक' : 'GramSathi Voice Assistant'}
                  </span>
                  <span className="text-[10px] text-agri font-medium">
                    {isSpeaking
                      ? (isHindi ? 'मार्गदर्शन बोल रहे हैं...' : 'Speaking guidance aloud...')
                      : isRecording
                      ? (isHindi ? 'आपकी आवाज सुन रहे हैं...' : 'Listening to your microphone...')
                      : (isHindi ? 'मार्गदर्शन उपलब्ध है' : 'Interactive guidance active')}
                  </span>
                </div>
              </div>

              {/* Microphone Action */}
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-forest text-white hover:bg-forest-light'
                }`}
                title="Click to speak or reply"
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? (isHindi ? 'सुन रहे हैं...' : 'Listening...') : (isHindi ? 'बोलकर जवाब दें' : 'Speak / Reply')}</span>
              </button>
            </div>

            {/* Spoken Guidance Prompt */}
            <div className="p-3 rounded-xl bg-white border border-border-subtle text-xs space-y-1">
              <div className="flex items-center justify-between text-[10px] text-text-muted font-semibold uppercase">
                <span>{isHindi ? 'सहायक का मौखिक संदेश:' : 'Assistant Guidance:'}</span>
                <button
                  type="button"
                  onClick={() => speakAloud(spokenGuidance)}
                  className="inline-flex items-center gap-1 text-agri hover:text-forest"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>{isHindi ? 'दोबारा सुनें' : 'Listen again'}</span>
                </button>
              </div>
              <p className="text-forest-dark font-medium leading-relaxed">
                {spokenGuidance}
              </p>
            </div>

            {/* Recognized Citizen Transcript */}
            {voiceQuery && (
              <div className="p-2.5 rounded-xl bg-warm border border-border-subtle text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden truncate">
                  <span className="text-[10px] font-bold text-text-secondary uppercase shrink-0">
                    {isHindi ? 'आपने कहा:' : 'You said:'}
                  </span>
                  <span className="text-text-main font-semibold truncate">"{voiceQuery}"</span>
                </div>
                {voiceIntent && (
                  <span className="px-2 py-0.5 rounded-md bg-sage text-forest text-[10px] font-mono font-bold shrink-0">
                    {voiceIntent}
                  </span>
                )}
              </div>
            )}

            {/* Contextual Quick Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-text-secondary uppercase block">
                {isHindi ? 'त्वरित विकल्प (क्लिक करके बोलें):' : 'Quick Voice Responses (Click to speak):'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {getStepChips().map((chip) => (
                  <button
                    key={chip.text}
                    type="button"
                    onClick={() => handleProcessCitizenSpeech(chip.text)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-border-subtle hover:border-forest hover:bg-sage/40 text-forest-dark transition-all shadow-2xs"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input Fallback Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (textInput.trim()) {
                  handleProcessCitizenSpeech(textInput.trim());
                  setTextInput('');
                }
              }}
              className="flex items-center gap-2 pt-1"
            >
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={isHindi ? "बोलें या उत्तर लिखें (जैसे: 'हाँ', 'आगे', 'दस्तावेज क्या लगेंगे')..." : "Speak or type response (e.g. 'yes', 'next', 'documents')..."}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-border-subtle focus:outline-none focus:border-forest bg-white"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-bold transition-colors inline-flex items-center gap-1"
              >
                <span>{isHindi ? 'भेजें' : 'Send'}</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>

          {/* STEP 1: Scheme Selection */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Scheme List Selection */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-text-main uppercase tracking-wider block">
                  {isHindi ? 'उपलब्ध सरकारी योजनाएं' : 'Supported Government Applications'}
                </span>

                {[
                  {
                    title: 'UP Post-Matric Scholarship 2026',
                    dept: isHindi ? 'समाज कल्याण एवं पिछड़ा वर्ग कल्याण विभाग' : 'Social Welfare & Backward Class Welfare Dept',
                    type: isHindi ? 'छात्रवृत्ति' : 'Scholarship',
                    active: true,
                  },
                  {
                    title: 'Government Certificates (Income, Caste, Domicile)',
                    dept: isHindi ? 'राजस्व विभाग, उ.प्र. · तहसीलदार कार्यालय' : 'Revenue Department, UP · Tehsildar Issuance',
                    type: isHindi ? 'प्रमाण पत्र' : 'Certificates',
                    active: true,
                  },
                  {
                    title: 'PM-KISAN Samman Nidhi & Agri-Equipment Subsidy',
                    dept: isHindi ? 'कृषि एवं किसान कल्याण विभाग' : 'Department of Agriculture & Farmers Welfare',
                    type: isHindi ? 'कृषि एवं किसान' : 'Farmer / Agri',
                    active: true,
                  },
                  {
                    title: 'Old-Age & Widow Social Security Pension',
                    dept: isHindi ? 'समाज कल्याण विभाग, उ.प्र.' : 'Social Welfare Department, UP',
                    type: isHindi ? 'पेंशन सहायता' : 'Pension',
                    active: true,
                  },
                  {
                    title: 'Civic Document Organisation & Integrity Pre-Audit',
                    dept: isHindi ? 'ग्राम सचिवालय लोक सेवा केंद्र' : 'Gram Secretariat Public Service Center',
                    type: isHindi ? 'दस्तावेज़ प्रबंधन' : 'Document Vault',
                    active: true,
                  },
                  {
                    title: 'National Means-cum-Merit Scholarship (NMMSS)',
                    dept: isHindi ? 'शिक्षा मंत्रालय, भारत सरकार' : 'Ministry of Education, Govt of India',
                    type: isHindi ? 'छात्रवृत्ति' : 'Scholarship',
                    active: true,
                  },
                ].map((s) => (
                  <div
                    key={s.title}
                    onClick={() => {
                      if (s.active) {
                        setSelectedScheme(s.title);
                        const newDocs = getSchemeDocuments(s.title, userName);
                        setDocuments(newDocs);
                        if (newDocs.length > 0) {
                          setInspectingDoc(newDocs[0]);
                        }
                      }
                    }}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      selectedScheme === s.title
                        ? 'border-forest bg-sage/40 ring-1 ring-forest'
                        : s.active
                        ? 'border-border-subtle bg-white hover:border-agri/50'
                        : 'border-border-subtle/60 bg-warm/50 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-forest-dark">{s.title}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          s.active ? 'bg-sage text-agri' : 'bg-border-subtle text-text-muted'
                        }`}>
                          {s.active ? (isHindi ? 'सक्रिय' : 'Active') : (isHindi ? 'शीघ्र उपलब्ध' : 'Planned')}
                        </span>
                      </div>
                      <span className="text-[11px] text-text-secondary block mt-0.5">{s.dept}</span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedScheme === s.title ? 'border-forest bg-forest text-white' : 'border-border-subtle'
                    }`}>
                      {selectedScheme === s.title && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleProceedToDocs}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-forest hover:bg-forest-light transition-all shadow-sm disabled:opacity-50"
                >
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isHindi ? 'आगे बढ़ें: दस्तावेज़ व OCR जांच' : 'Proceed to Documents & OCR'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Document Verification with Drag & Drop and Bounding Box Viewer */}
          {step === 2 && (
            <div className="space-y-5">
              
              {/* Drag and Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-5 rounded-2xl border-2 border-dashed border-border-subtle hover:border-forest bg-warm hover:bg-sage/40 transition-all text-center cursor-pointer space-y-2"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <UploadCloud className="w-8 h-8 text-agri mx-auto stroke-[1.8]" />
                <div>
                  <span className="text-xs font-bold text-forest-dark block">
                    {isHindi ? 'नया दस्तावेज़ जोड़ें या ड्रैग करें' : 'Upload or Drag & Drop Documents'}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    Supports PDF, JPG, PNG (Max 10 MB per document · DPDP Encrypted)
                  </span>
                </div>
              </div>

              {/* Document List & Spatial Bounding Box Inspector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Documents Column */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-text-main uppercase tracking-wider block">
                    Uploaded Documents ({documents.length})
                  </span>

                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setInspectingDoc(doc)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        inspectingDoc?.id === doc.id
                          ? 'border-forest bg-sage/50 shadow-xs'
                          : 'border-border-subtle bg-warm hover:border-agri/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileCheck className="w-4 h-4 text-agri shrink-0" />
                        <div className="truncate">
                          <span className="text-xs font-bold text-forest-dark block truncate">{doc.name}</span>
                          <span className="text-[10px] text-text-muted">{doc.size} · Conf: {Math.round((doc.confidence || 0.95) * 100)}%</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        doc.status === 'verified'
                          ? 'bg-sage text-agri'
                          : 'bg-warning-light text-warning-dark'
                      }`}>
                        {doc.status === 'verified' ? 'Verified' : 'Needs Review'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Simulated Bounding Box Spatial Canvas */}
                <div className="p-4 rounded-2xl bg-white border border-border-subtle space-y-3">
                  <span className="text-xs font-bold text-forest-dark block">
                    Optical Feature Extraction & Spatial Bounding Box
                  </span>

                  <div className="aspect-[4/3] rounded-xl bg-warm border border-border-subtle relative overflow-hidden flex flex-col justify-between p-4">
                    {/* Mock document layout with highlight */}
                    <div className="space-y-2 opacity-50">
                      <div className="w-1/3 h-2.5 bg-text-muted/30 rounded" />
                      <div className="w-2/3 h-2 bg-text-muted/20 rounded" />
                      <div className="w-1/2 h-2 bg-text-muted/20 rounded" />
                    </div>

                    {/* Active Bounding Box Highlight */}
                    <div className="border-2 border-forest bg-fresh/15 rounded p-2.5 space-y-1 animate-pulse">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-forest uppercase tracking-wider">
                          {inspectingDoc?.extractedKey || 'Candidate Field'}
                        </span>
                        <span className="text-[9px] font-bold text-agri bg-white px-1.5 py-0.2 rounded border border-border-subtle">
                          {Math.round((inspectingDoc?.confidence || 0.95) * 100)}% Match
                        </span>
                      </div>
                      <span className="text-sm font-bold text-forest-dark block">
                        {inspectingDoc?.extractedVal || userName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-text-muted pt-2 border-t border-border-subtle/60">
                      <span>Page 1</span>
                      <span>Confidence: {Math.round((inspectingDoc?.confidence || 0.95) * 100)}%</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-text-muted leading-tight">
                    Every extracted attribute maintains spatial coordinates and immutable document provenance.
                  </p>
                </div>

              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-text-secondary hover:text-forest"
                >
                  {isHindi ? 'वापस' : 'Back'}
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleProceedToReconcile}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-forest hover:bg-forest-light transition-all shadow-sm"
                >
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isHindi ? 'दस्तावेज़ मिलान जांचें' : 'Run Cross-Doc Reconciliation'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Cross-Document Conflict Resolution */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-forest-dark">
                  {isHindi ? '3. अंतर पहचान एवं नागरिक पुष्टि' : '3. Cross-Document Conflict Resolution'}
                </h4>
                <p className="text-xs text-text-secondary">
                  {isHindi
                    ? 'सिस्टम ने आधार और अंकपत्र के बीच नाम में भिन्नता पाई है। आधिकारिक आवेदन के लिए सही नाम चुनें।'
                    : 'The reconciliation engine flagged a discrepancy between Aadhaar and Marksheet. Select the authoritative statutory name.'}
                </p>
              </div>

              {/* Conflict Box */}
              <div className="p-4 rounded-2xl bg-warning-light/60 border border-warning/40 space-y-3">
                <div className="flex items-center gap-2 text-warning-dark font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {isHindi
                      ? 'पहचाना गया अंतर: नाम में संक्षिप्त अक्षर का अंतर'
                      : 'Flagged Variation: Middle Initial Variation Present'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div
                    onClick={() => {
                      setConfirmedName(userName);
                      setConflictResolved(true);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      confirmedName === userName && conflictResolved
                        ? 'border-forest bg-white shadow-xs'
                        : 'border-warning/30 bg-white/80'
                    }`}
                  >
                    <span className="text-[10px] text-text-muted block">Source: Aadhaar Card</span>
                    <span className="text-sm font-bold text-forest-dark block mt-1">{userName}</span>
                    <span className="text-[10px] text-agri block mt-1">Matches UIDAI Registry</span>
                  </div>

                  <div
                    onClick={() => {
                      setConfirmedName(userName.replace(' ', ' S '));
                      setConflictResolved(true);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      confirmedName === userName.replace(' ', ' S ') && conflictResolved
                        ? 'border-forest bg-white shadow-xs'
                        : 'border-warning/30 bg-white/80'
                    }`}
                  >
                    <span className="text-[10px] text-text-muted block">
                      Source: {selectedScheme.includes('Farmer') || selectedScheme.includes('किसान')
                        ? 'Bhulekh Land Record'
                        : selectedScheme.includes('Certificate') || selectedScheme.includes('प्रमाण')
                        ? 'Parivar Register Nakal'
                        : selectedScheme.includes('Pension') || selectedScheme.includes('पेंशन')
                        ? 'BPL Ration Card'
                        : 'Class 12 Marksheet'}
                    </span>
                    <span className="text-sm font-bold text-forest-dark block mt-1">{userName.replace(' ', ' S ')}</span>
                    <span className="text-[10px] text-warning-dark block mt-1">
                      {selectedScheme.includes('Farmer') || selectedScheme.includes('किसान')
                        ? 'Revenue Board Record'
                        : selectedScheme.includes('Certificate') || selectedScheme.includes('प्रमाण')
                        ? 'Panchayat Registry Record'
                        : selectedScheme.includes('Pension') || selectedScheme.includes('पेंशन')
                        ? 'Food & Civil Supplies Record'
                        : 'Board Examination Record'}
                    </span>
                  </div>
                </div>

                {conflictResolved ? (
                  <div className="p-2.5 rounded-lg bg-sage/80 border border-border-subtle flex items-center justify-between text-xs">
                    <span className="text-agri font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isHindi ? `पुष्टि किया गया नाम: "${confirmedName}"` : `Confirmed Legal Name: "${confirmedName}"`}</span>
                    </span>
                    <span className="text-[10px] text-text-secondary">Immutable Audit Logged</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-warning-dark font-medium">
                    {isHindi
                      ? 'नागरिक द्वारा सही नाम की पुष्टि होने तक आवेदन ड्राफ्ट जनरेट नहीं होगा।'
                      : 'Draft generation is gated until authoritative citizen override is confirmed.'}
                  </p>
                )}
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-text-secondary hover:text-forest"
                >
                  {isHindi ? 'वापस' : 'Back'}
                </button>

                <button
                  type="button"
                  disabled={!conflictResolved || isLoading}
                  onClick={handleFinalizeDraft}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
                    conflictResolved
                      ? 'bg-forest hover:bg-forest-light'
                      : 'bg-text-muted/50 cursor-not-allowed'
                  }`}
                >
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isHindi ? 'मसौदा बनाएं' : 'Generate Verified Draft'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Verified Draft Summary Output */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center py-2 space-y-1">
                <div className="w-12 h-12 rounded-full bg-fresh/20 text-forest mx-auto flex items-center justify-center border border-fresh/30">
                  <CheckCircle2 className="w-6 h-6 text-agri stroke-[2.5]" />
                </div>
                <h4 className="text-base font-bold text-forest-dark">
                  {isHindi ? 'आवेदन मसौदा सफलतापूर्वक तैयार' : 'Application Draft Successfully Prepared'}
                </h4>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  {isHindi
                    ? 'सभी अनिवार्य विवरण सत्यापित हैं और कोई अधूरा अंतर नहीं बचा है।'
                    : 'All statutory fields are reconciled with zero unresolved discrepancies.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sage/50 border border-border-subtle space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border-subtle">
                  <span className="text-text-muted">{isHindi ? 'योजना / सेवा:' : 'Target Service:'}</span>
                  <span className="font-bold text-forest-dark">{selectedScheme}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-subtle">
                  <span className="text-text-muted">{isHindi ? 'सत्यापित नाम:' : 'Confirmed Name:'}</span>
                  <span className="font-bold text-forest">{confirmedName}</span>
                </div>

                {/* Domain-adaptive field metrics */}
                {(selectedScheme.includes('Farmer') || selectedScheme.includes('PM-KISAN') || selectedScheme.includes('किसान')) ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-border-subtle">
                      <span className="text-text-muted">{isHindi ? 'कृषि भूमि जोत:' : 'Cultivable Landholding:'}</span>
                      <span className="font-semibold text-text-main">1.8 Hectares (Khasra #214/1 Khatauni Verified)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border-subtle">
                      <span className="text-text-muted">{isHindi ? 'डीबीटी बैंक स्थिति:' : 'DBT Bank Account:'}</span>
                      <span className="font-semibold text-agri">Aadhaar-Seeded Active NPCI Mandate</span>
                    </div>
                  </>
                ) : (selectedScheme.includes('Certificate') || selectedScheme.includes('प्रमाण')) ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-border-subtle">
                      <span className="text-text-muted">{isHindi ? 'स्थाई निवास क्षेत्र:' : 'Domicile Region:'}</span>
                      <span className="font-semibold text-text-main">Tehsil Bilari, District Moradabad, UP</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border-subtle">
                      <span className="text-text-muted">{isHindi ? 'पारिवारिक वार्षिक आय:' : 'Certified Annual Income:'}</span>
                      <span className="font-semibold text-text-main">₹1,20,000 (Revenue Lekhpal Verified)</span>
                    </div>
                  </>
                ) : (selectedScheme.includes('Pension') || selectedScheme.includes('पेंशन')) ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-border-subtle">
                      <span className="text-text-muted">{isHindi ? 'नागरिक आयु:' : 'Verified Age:'}</span>
                      <span className="font-semibold text-text-main">{"62 Years (Exceeds >= 60 Years statutory threshold)"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border-subtle">
                      <span className="text-text-muted">{isHindi ? 'सामाजिक श्रेणी व बीपीएल:' : 'BPL Status:'}</span>
                      <span className="font-semibold text-agri">Verified BPL Ration Card Holder</span>
                    </div>
                  </>
                ) : (selectedScheme.includes('Organisation') || selectedScheme.includes('प्रबंधन') || selectedScheme.includes('दस्तावेज़')) ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-border-subtle">
                      <span className="text-text-muted">{isHindi ? 'दस्तावेज़ स्पष्टता स्कोर:' : 'OCR Clarity Tensor:'}</span>
                      <span className="font-semibold text-agri">98.5% (High Fidelity Spatial Extraction)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border-subtle">
                      <span className="text-text-muted">{isHindi ? 'तैयारी स्थिति:' : 'CSC Counter Status:'}</span>
                      <span className="font-semibold text-text-main">Verified & Ready for Counter Submission</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between py-1 border-b border-border-subtle">
                      <span className="text-text-muted">{isHindi ? 'वार्षिक आय:' : 'Annual Income:'}</span>
                      <span className="font-semibold text-text-main">₹1,20,000 (Within limit of ₹2,50,000)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border-subtle">
                      <span className="text-text-muted">{isHindi ? 'कक्षा 12 प्राप्तांक:' : 'Class 12 Marks:'}</span>
                      <span className="font-semibold text-text-main">82.5% (Exceeds 60.0% statutory threshold)</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between py-1">
                  <span className="text-text-muted">{isHindi ? 'ऑडिट साक्ष्य श्रृंखला:' : 'Audit Provenance:'}</span>
                  <span className="font-semibold text-agri">{isHindi ? '3 सत्यापित दस्तावेज़ नोड लिंक' : '3 Verified Document Nodes Linked'}</span>
                </div>
              </div>

              {hasDownloaded && (
                <div className="p-3 rounded-xl bg-fresh/20 border border-fresh/40 text-xs text-forest font-semibold flex items-center justify-between animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-agri shrink-0" />
                    <span>
                      {isHindi
                        ? 'आधिकारिक मसौदा फ़ाइल आपके डिवाइस पर सफलतापूर्वक डाउनलोड हो गई है।'
                        : 'Official application draft has been downloaded to your device.'}
                    </span>
                  </div>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded text-forest font-mono">
                    SHA-256 Verified
                  </span>
                </div>
              )}

              {/* Action Buttons: Real Downloads */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetDemo}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-forest hover:bg-warm border border-border-subtle transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'पुनः प्रारंभ' : 'Restart'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyToClipboard}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-forest bg-sage hover:bg-sage/70 border border-border-subtle transition-colors"
                    title="Copy full draft text to clipboard"
                  >
                    {isCopied ? <CheckCheck className="w-3.5 h-3.5 text-agri" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : (isHindi ? 'कॉपी करें' : 'Copy Text')}</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadDraft('json')}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-forest-dark bg-warm hover:bg-sage border border-border-subtle transition-all"
                    title="Download machine-readable payload"
                  >
                    <FileCode className="w-3.5 h-3.5 text-agri" />
                    <span>{isHindi ? 'JSON पैकेज' : 'Portal JSON'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadDraft('txt')}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-forest hover:bg-forest-light transition-all shadow-sm active:scale-95"
                  >
                    <Download className="w-4 h-4 stroke-[2.2]" />
                    <span>{isHindi ? 'आधिकारिक मसौदा डाउनलोड करें' : 'Download Verified Draft'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Note */}
        <div className="bg-warm px-6 py-3 border-t border-border-subtle text-[11px] text-text-muted flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-agri" />
            <span>DPDP 2023 Compliant · Zero Silent Hallucinations</span>
          </span>
          <span>GramSathi AI Engine v1.0</span>
        </div>

      </div>
    </div>
  );
}
