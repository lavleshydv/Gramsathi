# 📅 GramSathi Phase-by-Phase Implementation Plan

**Engineering Roadmap:** 14 Weeks (5 Distinct Execution Phases)  
**Methodology:** Agile / Sprint-based (2-week cadence) with early rural user validation gates.

---

## 🗺️ High-Level Milestone Roadmap

```
Week  1 - 3   [Phase 1] ───► Monorepo, Core Auth, Database & Base Citizen PWA
Week  4 - 6   [Phase 2] ───► AI Scheme Recommendation Engine & Multilingual Content
Week  7 - 9   [Phase 3] ───► Civic Grievances, Geo-tagging & Panchayat Officer Portal
Week 10 - 12  [Phase 4] ───► Mandi Price Ingestion, Weather & Offline-First Sync
Week 13 - 14  [Phase 5] ───► Security Audit, Low-Bandwidth Stress Testing & Production Launch
```

---

## 📋 Detailed Phase Breakdown

### 🟢 Phase 1: Foundation, Data Modeling & Core Citizen PWA (Weeks 1 - 3)

**Objective:** Set up monorepo infrastructure, establish PostgreSQL + PostGIS schema, implement passwordless mobile OTP authentication, and scaffold the baseline Next.js 14 PWA.

- **Sprint 1 (Weeks 1 - 2): Infrastructure & Database**
  - [x] Initialize npm / pnpm workspace structure (`apps/web`, `apps/api`, `packages/database`).
  - [x] Configure Prisma ORM with PostgreSQL + PostGIS geometry models.
  - [x] Seed master data: 50+ Indian districts, blocks, gram panchayats, and standard government scheme catalogs.
  - [x] Set up Redis cache & BullMQ queue scaffolding for async jobs.

- **Sprint 2 (Week 3): Mobile Auth & Citizen Profile**
  - [x] Implement passwordless mobile phone OTP verification flow.
  - [x] Build Citizen demographic onboarding (caste category, land holding, annual income, occupation).
  - [x] Configure PWA manifest (`manifest.json`), service worker registration, and app installation prompts.
  - [x] Implement dual-script i18n localization engine (Hindi & English base dictionaries).

*Deliverable Gate 1:* Citizen can register with phone number, select their village/panchayat, complete demographic profile, and install the PWA on Android.

---

### 🟡 Phase 2: AI Scheme Recommendation Engine & Voice Search (Weeks 4 - 6)

**Objective:** Enable citizens to discover and check eligibility for 50+ central & state schemes using profile matching and voice queries.

- **Sprint 3 (Weeks 4 - 5): Rule-Based & Semantic Matching Engine**
  - [x] Construct JSON-based scheme eligibility rule evaluator:
    `(income <= threshold && land_holding <= 5.0 && occupation == 'FARMER')`.
  - [x] Build Scheme Discovery catalog with categorized filtering (Agriculture, Health, Pension, Housing, Education).
  - [x] Create Scheme Detail view with required documents checklist, application links, and benefit calculator.

- **Sprint 4 (Week 6): Multilingual AI Voice Assistant**
  - [x] Integrate Google Gemini 1.5 Flash API with custom system prompts for conversational Indic welfare advisory.
  - [x] Connect browser Web Speech Recognition & SpeechSynthesis APIs with graceful fallback.
  - [x] Add single-tap audio explanation button `[🔊 सुनिए]` on every scheme card.

*Deliverable Gate 2:* Citizen can press the microphone button, ask about tractor subsidies in Hindi, and receive instant eligible scheme recommendations with voice playback.

---

### 🟠 Phase 3: Civic Grievance Redressal & Panchayat Officer Dashboard (Weeks 7 - 9)

**Objective:** Implement end-to-end civic issue reporting with camera capture, auto-geolocation, SLA tracking, and role-based officer resolution dashboard.

- **Sprint 5 (Weeks 7 - 8): Citizen Grievance Reporting Pipeline**
  - [x] 3-step zero-typing grievance submission flow (Camera snap ➔ Category chip ➔ Audio note).
  - [x] Automated HTML5 Geolocation capture with reverse geocoding to Gram Panchayat boundary.
  - [x] S3/Cloud Storage presigned URL pipeline with client-side WebP image downsampling (<200KB).
  - [x] Gemini Vision pipeline for automated tag suggestion and damage classification.

- **Sprint 6 (Week 9): Panchayat Officer Workspace & Escalation Matrix**
  - [x] Role-Based Access Control (RBAC): Gram Panchayat Officer login with village-level isolation.
  - [x] Officer Kanban/Table view: Acknowledge, assign to field worker, and resolve with "After" photo proof.
  - [x] Automated 7-day SLA cron worker: Escalates unresolved complaints to Block Development Officer (BDO).
  - [x] Automated SMS status notification dispatch to citizen upon status change.

*Deliverable Gate 3:* Citizen files a water handpump complaint with photo and GPS; Panchayat Officer receives it instantly, updates status to "In Progress", and citizen gets SMS update.

---

### 🔵 Phase 4: Mandi Price Tracking & Offline-First Sync (Weeks 10 - 12)

**Objective:** Provide real-time local mandi commodity rates and ensure 100% of the app's critical features function without active internet connectivity.

- **Sprint 7 (Weeks 10 - 11): Mandi Price Ingestion & Weather Advisory**
  - [x] Automated cron worker syncing daily APMC Mandi rates (Agmarknet / open data feeds).
  - [x] Mandi price discovery interface with sorting by proximity (using PostGIS distance queries).
  - [x] Commodity price trends (7-day high/low) with simple red/green direction indicators.
  - [x] Hyperlocal weather warning card (heavy rainfall, frost alerts) via OpenWeather / IMD API.

- **Sprint 8 (Week 12): Offline-First Persistence & Outbox Sync**
  - [x] Implement Dexie.js (IndexedDB) client database mirroring user profile, active grievances, and cached mandi rates.
  - [x] Build `OutboxMutationQueue` intercepting offline POST requests (e.g., lodging grievance while offline in fields).
  - [x] Implement Background Sync service worker listener to auto-drain the outbox upon network reconnect.
  - [x] Comprehensive offline status banner and optimistic UI updates.

*Deliverable Gate 4:* User turns on Airplane Mode, files a grievance with photo, turns Airplane Mode off, and observes the grievance syncing automatically with ticket ID generation.

---

### 🟣 Phase 5: Hardening, Security, Field Validation & Production Launch (Weeks 13 - 14)

**Objective:** Validate performance on low-end hardware under 2G network simulation, perform penetration/security review, and deploy production cluster.

- **Sprint 9 (Week 13): Performance Optimization & Security Audit**
  - [x] Chrome DevTools network throttling test (simulated 2G/3G slow connection, 200kbps, 400ms latency).
  - [x] Bundle size audit: Ensure initial JS bundle < 85 KB gzipped.
  - [x] Security audit: DPDP Act compliance review, SQL injection prevention, rate-limiting on OTP endpoints.
  - [x] Cross-browser and low-cost Android device testing (Android 9+, Chrome 80+).

- **Sprint 10 (Week 14): Production Deployment & Pilot Go-Live**
  - [x] Production Docker containerization (`Dockerfile` for web & api).
  - [x] CI/CD pipeline setup via GitHub Actions (Lint, Typecheck, Unit Tests, Build).
  - [x] Zero-downtime deployment setup (PostgreSQL managed cluster + Redis + CDN edge caching).
  - [x] Rollout to first 10 pilot Gram Panchayats with training handbook for Sarpanch and Panchayat Secretaries.

---

## ⚠️ Risk Assessment & Mitigation Strategies

| Risk Factor | Probability | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Citizens hesitant to type in English/Hindi** | High | Critical | Provide voice-first recording for grievances and voice search for schemes. Minimal required typing. |
| **Panchayat officers failing to act on grievances** | Medium | High | Automated SLA countdown with auto-escalation to higher Block/District administrative tiers with weekly email/SMS digests. |
| **Low phone storage on budget smartphones** | High | Medium | PWA footprint < 5 MB without requiring app store installation; automatic image compression before upload. |
| **Outdated Mandi prices due to API downtime** | Medium | Medium | Fallback to cached historical modal prices with clear "Last updated X hours ago" badge. |
