# 🌾 GramSathi (ग्राम साथी)
### *Bridging Rural India to Digital Governance, Welfare & Agri-Prosperity*

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%20%2B%20PostGIS-336791.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC.svg)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Offline--First-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

---

## 📌 Executive Summary

**GramSathi** is an offline-first, multilingual civic-tech and agri-empowerment platform built specifically for rural citizens, Gram Panchayats, and agricultural communities.

In rural ecosystems, citizens frequently face three bottlenecks:
1. **Information Asymmetry**: Lack of awareness regarding central/state government welfare schemes and eligibility.
2. **Civic Friction**: Difficulty lodging, tracking, and resolving village-level grievances (clean water, electricity, sanitation, roads).
3. **Market Fragmentation**: Lack of real-time local APMC/Mandi price discovery and direct advisory.

GramSathi solves these challenges through **low-bandwidth optimization**, **voice-assisted Indic language interaction**, **geo-tagged grievance management**, and an **AI-driven scheme eligibility engine**.

---

## 🚀 Key Modules & Capabilities

```
                                  ┌──────────────────────────────┐
                                  │      GramSathi Platform      │
                                  └──────────────┬───────────────┘
                                                 │
         ┌──────────────────┬────────────────────┼──────────────────┬──────────────────┐
         ▼                  ▼                    ▼                  ▼                  ▼
┌─────────────────┐┌─────────────────┐ ┌──────────────────┐┌─────────────────┐┌─────────────────┐
│ AI Scheme Engine││ Civic Grievance │ │  Mandi & Market  ││ Offline & Voice ││ Gram Panchayat   │
│ & Welfare Match ││ Geo-Redressal   │ │  Price Discovery ││ Indic Interface ││ Officer Portal   │
└─────────────────┘└─────────────────┘ └──────────────────┘└─────────────────┘└─────────────────┘
```

### 1. 🤖 AI Scheme Recommendation Engine
- Profile-based matching (land size, caste/category, income, age, gender, occupation).
- One-click eligibility assessment for schemes (PM-KISAN, PM Awas Yojana, Ayushman Bharat, MGNREGA, Sukanya Samriddhi).
- Required documentation checklist with camera OCR scanner.

### 2. 🏛️ Civic Grievance Redressal (Gram Samasya Nivaran)
- One-tap issue reporting with camera capture and automated GPS geo-tagging.
- Automated categorization: Drinking Water, Electricity/Poles, Roads, Drainage, Health/Anganwadi, Sanitation.
- SLA-based automated escalation matrix:
  `Citizen Report` ➔ `Ward Member (48h)` ➔ `Gram Panchayat Secretary (5 days)` ➔ `Block Development Officer / BDO (10 days)`.

### 3. 📈 Mandi Rates & Agri-Advisory
- Real-time commodity price tracking across regional APMC Mandis (via Agmarknet integration).
- Hyper-local weather alerts & seasonal crop protection advisories.
- Community equipment sharing / farm machinery rentals board (Custom Hiring Centre model).

### 4. 🗣️ Multilingual & Voice-First Access
- Support for Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati, Punjabi, Kannada, and English.
- Text-to-Speech (TTS) and Speech-to-Text (STT) for low-literacy users.
- Conversational audio assistant powered by Google Gemini API and Indic NLP.

### 5. 📴 Offline-First Architecture
- Service-worker based PWA with IndexedDB client-side cache.
- Grievances and farmer diary entries can be logged in zero-connectivity areas and auto-synced once connection is restored.

---

## 🛠️ Technology Stack Rationale

| Layer | Chosen Technology | Rationale & Advantage |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14+ (App Router, React 18, TypeScript)** | Server-side rendering (SSR) for fast first loads on 2G/3G networks, hybrid SSG/ISR for scheme catalogs. |
| **Styling & UI** | **Tailwind CSS + Radix UI + Lucide Indic Icons** | High contrast, accessible visual design with large touch targets (WCAG AAA compliant for outdoor sunlight visibility). |
| **State & Offline Storage** | **TanStack Query (React Query) + Dexie.js (IndexedDB)** | Optimistic UI updates, automated background retry, robust offline transactional queues. |
| **Backend & API** | **Node.js (TypeScript) + Fastify / Next.js API Routes** | High throughput, sub-millisecond JSON serialization, modular enterprise structure. |
| **Database & GIS** | **PostgreSQL 16 with PostGIS Extension** | Production standard for relational data and spatial querying (calculating distance to mandis, panchayat boundaries, geotagged complaints). |
| **ORM & Migrations** | **Prisma ORM** | Type-safe schema definition, automated migrations, zero runtime overhead. |
| **Cache & Queue** | **Redis + BullMQ** | Fast caching for mandi rates, rate limiting, and background workers for SMS/WhatsApp notifications. |
| **AI / LLM Integration** | **Google Gemini 1.5/Flash API** | Multimodal analysis (evaluating damaged roads/water pipes from pictures) & high-accuracy multilingual conversational responses. |
| **Auth & Security** | **Mobile OTP Auth + JWT + RBAC** | Passwordless mobile authentication suitable for rural users + role-based access for citizens, panchayat staff, and district admins. |

---

## 📂 Project Directory Structure

```plaintext
GramSathi/
├── apps/
│   ├── web/                     # Next.js 14 Progressive Web App (Citizen & Panchayat)
│   │   ├── public/              # PWA manifest, service-worker, icons, offline fallback
│   │   ├── src/
│   │   │   ├── app/             # App router pages (dashboard, schemes, grievances, mandi)
│   │   │   ├── components/      # UI component library (voice mic, cards, status pills)
│   │   │   ├── hooks/           # Custom hooks (useOfflineSync, useSpeechRecognition)
│   │   │   ├── lib/             # API client, db client, i18n localization dictionaries
│   │   │   └── types/           # Shared TypeScript interfaces
│   │   └── package.json
│   └── api/                     # Backend microservice / worker (Fastify / Express)
│       ├── src/
│       │   ├── controllers/     # Schemes, Grievances, Mandi, Panchayat controllers
│       │   ├── middleware/      # Auth, rate-limiter, geo-fencing validator
│       │   ├── services/        # AI eligibility engine, SMS notification, Agmarknet sync
│       │   └── routes/          # RESTful v1 endpoints
│       └── package.json
├── packages/
│   ├── database/                # Database schema, Prisma client, seeds & migrations
│   │   ├── prisma/
│   │   │   └── schema.prisma    # Data models (User, Scheme, Grievance, MandiRecord)
│   │   └── seed/                # Standard Indian government schemes & panchayat data
│   └── shared-types/            # Shared DTOs, schemas (Zod), and constants
├── docs/                        # Architecture, Design & Roadmap Docs
│   ├── ARCHITECTURE.md          # Complete C4 models, data flows, and tech specifications
│   ├── DESIGN.md                # Design system, UX guidelines, accessibility standards
│   └── IMPLEMENTATION_PLAN.md   # Sprint-by-sprint development phases
├── .env.example                 # Environment variable templates
├── .gitignore                   # Standard ignore rules
├── package.json                 # Monorepo root workspace configuration
└── README.md                    # Project overview & quickstart
```

---

## ⚡ Quickstart & Local Setup

### Prerequisites
- **Node.js**: v18.18.0 or v20+
- **npm** / **pnpm**: npm v9+ or pnpm v8+
- **PostgreSQL**: v15+ (with PostGIS enabled: `CREATE EXTENSION postgis;`)
- **Redis**: v7+ (for background queues and caching)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/GramSathi.git
cd GramSathi
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your database URL, Gemini API Key, and SMS gateway credentials.

### 3. Initialize Database & Seeds
```bash
cd packages/database
npx prisma migrate dev --name init
npx prisma db seed
cd ../..
```

### 4. Run Development Servers
```bash
# Start frontend and backend concurrently
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 In-Depth Documentation

For thorough architectural, design, and roadmap deep-dives, consult:
- 🏗️ **[System Architecture Documentation](docs/ARCHITECTURE.md)** - System context, container diagrams, ER diagrams, security, and offline sync mechanics.
- 🎨 **[Design System & UX Specifications](docs/DESIGN.md)** - Color palette, typography, low-literacy affordances, screen flows, and component specs.
- 📅 **[Phase-by-Phase Implementation Plan](docs/IMPLEMENTATION_PLAN.md)** - 5 distinct delivery phases across 14 weeks from MVP to production scale.

---

## 🔒 Security & Privacy Compliance
- **Digital Personal Data Protection (DPDP) Act Compliance**: Explicit consent logging for all citizen identity collection.
- **Row-Level Security (RLS) & RBAC**: Strict boundaries ensuring Panchayat Officers can only review complaints within their designated Gram Panchayat jurisdiction.
- **Tamper-Evident Audit Trail**: Every status transition of citizen grievances is timestamped with actor signatures.

---

## 🤝 Contribution & License
Licensed under the [MIT License](LICENSE). Built with pride for rural development and digital inclusion.
