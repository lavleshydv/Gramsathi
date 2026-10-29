# 📋 GramSathi Software Requirements Specification (SRS) & System Prerequisites

**Document Version:** 1.0.0  
**Project:** GramSathi (ग्राम साथी)  
**Classification:** Rural Civic Governance, AI Welfare Discovery & Agri-Prosperity Platform  

---

## 1. Dependency & Package Management Equivalent

In the Node.js & TypeScript ecosystem, there is no single `requirements.txt` file as in Python. Instead, requirements are tracked across two standard files:

| File | Purpose & Equivalent | Location |
| :--- | :--- | :--- |
| **`package.json`** | Direct equivalent to `requirements.txt` + `setup.py`. Lists required runtime packages (`dependencies`) and tooling packages (`devDependencies`). | [package.json](file:///c:/Users/WINDOWS%2011/OneDrive/Desktop/GramSathi/package.json) |
| **`package-lock.json`** | Exact cryptographic lockfile (equivalent to `poetry.lock` or `pip freeze > requirements.lock`). Pins exact tree versions. | [package-lock.json](file:///c:/Users/WINDOWS%2011/OneDrive/Desktop/GramSathi/package-lock.json) |

---

## 2. System & Runtime Prerequisites

To run GramSathi in local development, staging, or production:

### 2.1 Hardware Requirements
- **Server Minimum:** 2 vCPU, 4GB RAM, 20GB SSD Storage (Production: 4 vCPU, 8GB RAM).
- **Client Device:** Android 9.0+, Chrome 80+ / Mobile Safari / Edge, 2GB RAM minimum, GPS chip, Camera sensor.

### 2.2 Software & Tooling Runtimes
- **Node.js:** `v20.x` or `v22.x` (LTS installed in `AppData\Local\Programs\node-v20.18.0-win-x64`)
- **Package Manager:** `npm` v10+ (or `pnpm` v9+)
- **Database:** PostgreSQL `v15+` with **PostGIS** extension (`CREATE EXTENSION postgis;`)
- **In-Memory Cache & Queue:** Redis `v7.0+`
- **Object Storage:** AWS S3 or MinIO (for grievance evidence photos & audio notes)

---

## 3. Functional Requirements (FR)

### FR-1: Passwordless Mobile Authentication & Citizen Profiles
- **FR-1.1:** The system shall authenticate citizens using Indian mobile numbers (`+91XXXXXXXXXX`) with 6-digit SMS OTPs.
- **FR-1.2:** The citizen profile shall record demographic attributes: land holding (in acres), caste category (General/OBC/SC/ST), annual household income, and occupation.
- **FR-1.3:** The system must never store unmasked 12-digit Aadhaar numbers, adhering strictly to the DPDP Act.

### FR-2: AI Scheme Recommendation Engine
- **FR-2.1:** The engine shall match citizen profiles against criteria rules for 50+ central and state schemes (e.g. PM-KISAN, PM Awas Yojana, Ayushman Bharat).
- **FR-2.2:** Each scheme record must display benefit amounts, required document checklists, and direct official application links.
- **FR-2.3:** The platform shall provide an audio playback button (`[🔊 सुनिए]`) for every scheme using Indic speech synthesis.

### FR-3: Civic Grievance Geo-Redressal
- **FR-3.1:** Citizens shall be able to lodge issues across 6 categories: Drinking Water, Electricity/Poles, Roads, Sanitation/Drainage, Health/Anganwadi, and Other.
- **FR-3.2:** The system must support zero-typing reporting via camera capture, automated HTML5 GPS location tagging, and voice notes.
- **FR-3.3:** The system must auto-generate a unique tracking ticket (e.g., `GS-2026-XXXXX`).
- **FR-3.4:** An automated SLA escalation engine shall monitor grievance age and escalate tickets unresolved after 7 days to the Block Development Officer (BDO).

### FR-4: Real-Time Mandi Commodity Ingestion
- **FR-4.1:** The platform shall ingest daily minimum, maximum, and modal prices across regional APMC Mandis (via Agmarknet feeds).
- **FR-4.2:** The system shall compute proximity in kilometers from the citizen's Gram Panchayat to surrounding mandis using PostGIS distance functions.
- **FR-4.3:** The UI shall display price trends (Up/Down indicators with rupee delta) and provide single-tap audio price reading.

### FR-5: Gram Panchayat Administrative Portal
- **FR-5.1:** Role-Based Access Control (RBAC) shall isolate records so that Panchayat Officers can only review complaints within their assigned village.
- **FR-5.2:** Officers shall have workflows to acknowledge, assign to field workers, and resolve grievances with photographic proof.
- **FR-5.3:** Status transitions must automatically dispatch SMS notifications to the citizen.

---

## 4. Non-Functional Requirements (NFR)

### NFR-1: Network Resilience & Low Bandwidth Optimization
- The application initial JavaScript payload must not exceed **85 KB gzipped**.
- The platform shall be fully functional over intermittent 2G/3G cellular networks (50–250 kbps).
- Images must be downsampled client-side to WebP format (<200 KB) before uploading.

### NFR-2: Offline-First Capability (PWA)
- The application must install as a Progressive Web App (PWA) on mobile devices via `manifest.json`.
- When offline (`navigator.onLine === false`), grievance submissions and profile edits must be persisted to local IndexedDB (`outbox_mutations`) and auto-synced upon reconnection.

### NFR-3: Outdoor Accessibility & High Contrast (WCAG AAA)
- UI buttons and interactive chips must have a minimum tap area of **48x48 pixels**.
- Text contrast ratio against backgrounds must exceed **7:1** for outdoor sunlight visibility.
- Navigation must rely primarily on clear iconography and bilingual labels (Hindi + English).

### NFR-4: Data Privacy & Compliance
- Full compliance with the **Digital Personal Data Protection (DPDP) Act, 2023**.
- Field-level tokenization for personal identity attributes with explicit consent logs.

---

## 5. Third-Party Integrations & API Keys

| Service | Purpose | Required Key / Env Variable |
| :--- | :--- | :--- |
| **Google Gemini 1.5 Flash** | Multimodal damage image assessment & natural language Indic scheme Q&A | `GEMINI_API_KEY` |
| **SMS Gateway (Fast2SMS / Gupshup)** | Mobile OTP dispatch & grievance SLA status SMS alerts | `SMS_GATEWAY_API_KEY`, `SMS_SENDER_ID` |
| **PostgreSQL + PostGIS** | Relational data & village boundary spatial indexing | `DATABASE_URL` |
| **Redis** | Mandi caching, rate limiting & BullMQ background jobs | `REDIS_URL` |
| **S3 / MinIO** | Storage for grievance photos and audio attachments | `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` |
