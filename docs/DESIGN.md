# 🎨 GramSathi Design System & UI/UX Specification

**Design Version:** 1.0.0  
**Target Audience:** Rural citizens (farmers, daily-wage laborers, women self-help groups, village youth), Gram Panchayat Sarpanchs, Village Secretaries.  
**Core Design Philosophy:** *Radical Simplicity, High Outdoor Contrast, Icon & Voice-Driven Affordance.*

---

## 1. Rural UX Principles & Affordances

Standard urban UI patterns (dense text, multi-level dropdowns, tiny tap targets, complex modals) fail in rural environments. GramSathi adheres to four fundamental design pillars:

```
┌─────────────────────────┐    ┌─────────────────────────┐
│ 1. Icon & Audio First   │    │ 2. High Outdoor Contrast│
│ Every action accompanied│    │ Legible under direct    │
│ by icon + voice readout │    │ midday sunlight         │
└─────────────────────────┘    └─────────────────────────┘
            │                               │
            ▼                               ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│ 3. Thumb-Zone Centric   │    │ 4. Single-Action Screens│
│ Minimum 48x48px tap     │    │ Linear steps without    │
│ targets for rough hands │    │ cognitive overload      │
└─────────────────────────┘    └─────────────────────────┘
```

---

## 2. Color System & Design Tokens

The palette draws inspiration from agricultural prosperity, Indian soil, and trustworthy governance.

### 2.1 Primary & Accent Palette

| Token Name | Hex Code | Tailwind Class | Semantic Purpose |
| :--- | :--- | :--- | :--- |
| **Agri-Green (Kisan Green)** | `#1E6B38` | `bg-emerald-800` | Primary brand color, success states, verified badges. |
| **Crop-Gold (Sarson Yellow)** | `#E5A910` | `bg-amber-500` | High-visibility action buttons, urgent alerts, voice mic state. |
| **Mitti-Earth (Soil Terracotta)**| `#8C3B1E` | `bg-amber-900` | Civic alerts, infrastructure grievances, active highlights. |
| **Govt-Deep Navy** | `#0E2A47` | `bg-slate-900` | High-contrast headers, official government documentation cues. |
| **Surface Off-White** | `#F8F9FA` | `bg-neutral-50` | Primary background reducing eye glare outdoors. |
| **Card Surface** | `#FFFFFF` | `bg-white` | Elevated card surfaces with crisp `1px border-neutral-200`. |

### 2.2 Status & Grievance Indicator Tokens

| Status | Color Token | Visual Badge Icon | Meaning |
| :--- | :--- | :--- | :--- |
| **Submitted** | `#2563EB` (Blue) | ⏳ Clock | Received by system |
| **In Progress** | `#D97706` (Amber) | 🔨 Wrench | Work assigned to panchayat team |
| **Resolved** | `#16A34A` (Green) | ✅ Check Circle | Fixed with photographic evidence |
| **Escalated** | `#DC2626` (Red) | ⚠️ Alert Triangle | Exceeded 7-day SLA; sent to Block Officer |

---

## 3. Typography & Dual-Script Hierarchy

Typography must support seamless rendering of both Devanagari/regional scripts and Latin numerals.

- **Primary Font Family:** `Inter` (Latin) paired with `Noto Sans Devanagari` (Hindi/Marathi) via Google Fonts.
- **Minimum Body Size:** `16px` (`text-base`) — no `text-xs` is permitted for critical instructions.
- **Font Scale:**
  - **Display 1 (Greeting / Balance):** `32px` / Bold / Leading `38px`
  - **Heading 1 (Module Title):** `24px` / SemiBold / Leading `30px`
  - **Heading 2 (Card Header):** `18px` / Medium / Leading `24px`
  - **Body 1 (Form inputs, Descriptions):** `16px` / Regular / Leading `24px`
  - **Caption (Timestamps, Sub-labels):** `14px` / Regular / Leading `20px`

---

## 4. Key Screen Flows & Wireframes

### 4.1 Citizen Home Dashboard

```
┌────────────────────────────────────────────────────────┐
│ 🇮🇳 GramSathi (ग्राम साथी)             [🌐 भाषा] [👤 खाता] │
├────────────────────────────────────────────────────────┤
│ 📍 ग्राम: रामपुर | ब्लॉक: बिलारी | जिला: मुरादाबाद      │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 🎙️ बोलकर पूछें (Tap to Speak)                      │ │
│ │ "मुझे खाद सब्सिडी योजना के बारे में बताएं..."       │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ [ त्वरित सेवाएं / Quick Services ]                     │
│                                                        │
│ ┌──────────────────────┐    ┌──────────────────────┐   │
│ │ 📜 सरकारी योजनाएं     │    │ 📢 समस्या दर्ज करें    │   │
│ │ (Find Govt Schemes)  │    │ (Report Grievance)   │   │
│ │ [ 24 योजनाएं उपलब्ध ]│    │ [ नया आवेदन करें ]   │   │
│ └──────────────────────┘    └──────────────────────┘   │
│                                                        │
│ ┌──────────────────────┐    ┌──────────────────────┐   │
│ │ 🚜 मंडी भाव (Mandi)  │    │ 🏛️ ग्राम पंचायत कार्य  │   │
│ │ गेहूं: ₹2,425/क्विंटल │    │ विकास कार्य व बैठकें │   │
│ └──────────────────────┘    └──────────────────────┘   │
│                                                        │
│ ⚡ आपकी हालिया शिकायतें (Your Recent Grievances)        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 💧 वार्ड 3 में हैंडपंप खराब   [ प्रगति पर / In Progress ]│ │
│ │ टोकन: #GS-8491 | 2 दिन पहले दर्ज                     │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

### 4.2 3-Step Grievance Filing (Zero-Typing UX)

```
Step 1: Photo & Category           Step 2: Auto Location            Step 3: Voice / Submit
┌───────────────────────────┐    ┌───────────────────────────┐    ┌───────────────────────────┐
│ 📷 समस्या की फोटो लें      │    │ 📍 स्थान की पुष्टि         │    │ 🎙️ समस्या बोलकर बताएं     │
│                           │    │                           │    │                           │
│  ┌─────────────────────┐  │    │ 🗺️ GPS द्वारा लिया गया:    │    │ [ 🔴 00:15 बोलें ]        │
│  │   [ 📸 Camera Tap ] │  │    │ "वार्ड नं. 4, स्कूल के पास"│    │                           │
│  └─────────────────────┘  │    │ रामपुर, उत्तर प्रदेश       │    │ "स्कूल के सामने मुख्य     │
│                           │    │                           │    │  पानी का पाइप टूट गया है" │
│ श्रेणी चुनें:             │    │ [✓] स्थान सही है          │    │                           │
│ [💧 पानी]  [💡 बिजली]     │    │                           │    │ [ 🚀 शिकायत दर्ज करें ]   │
│ [🛣️ सड़क]  [🧹 सफाई]      │    │                           │    │                           │
└───────────────────────────┘    └───────────────────────────┘    └───────────────────────────┘
```

---

### 4.3 Mandi Price & Commodity Discovery

- **Filter Bar:** Simple toggle for [🌾 अनाज / Grains] [🥬 सब्जियां / Vegetables] [🌻 तिलहन / Oilseeds].
- **High-Low Indicators:** Green upward arrow for rising prices, red downward arrow for falling prices.
- **Audio Price Readout:** Single speaker icon `[🔊]` next to each commodity reads: *"Rampur Mandi me gehu ka bhav chaubees sau pachis rupaye prat quintal hai."*

---

## 5. UI Component Specifications

### 5.1 Voice Microphone FAB (Floating Action Button)
- **Position:** Fixed at bottom right or centered in mobile bottom bar.
- **Size:** `64px x 64px` circular button.
- **States:**
  - *Idle:* Mustard Gold (`#E5A910`) with glowing pulse wave.
  - *Listening:* Bright Crimson (`#DC2626`) with expanding concentric ripple animation.
  - *Processing:* Indigo spinner with Indic loader message.

### 5.2 Offline Status Banner
- Appears immediately when `navigator.onLine === false`.
- **Styling:** Persistent top ribbon in muted charcoal (`#374151`) with yellow signal icon:
  `📶 आप अभी ऑफलाइन हैं — दर्ज किया गया विवरण नेटवर्क आने पर स्वतः सुरक्षित हो जाएगा।`

### 5.3 Panchayat Official SLA Countdown Timer
- Displayed on Panchayat Officer review cards:
  - Green pill when `> 48 hours remaining`.
  - Amber pill when `< 24 hours remaining`.
  - Flashing Red pill with escalation warning when breached (`0 hours`).
