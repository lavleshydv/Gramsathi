# GramSathi Implementation Phases

**Project:** GramSathi  
**Status snapshot:** 29 October 2026  
**Source roadmap:** [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)

## Status legend

- **Completed** — implemented and verifiable in the current repository.
- **Partially completed** — some supporting code or UI exists, but the complete requirement is not verifiable.
- **Not evidenced** — the roadmap marks the item complete, but the required implementation could not be found in the current repository.

> This file distinguishes roadmap checkboxes from implementation evidence. All five phases are checked off in the implementation plan, but several production capabilities still need their application, infrastructure, tests, or deployment evidence added to the repository.

## Overall status

| Phase | Roadmap status | Code-verifiable status |
|---|---:|---:|
| Phase 1 — Foundation, data modeling, and citizen PWA | Complete | Partially completed |
| Phase 2 — AI scheme recommendations and voice search | Complete | Partially completed |
| Phase 3 — Civic grievances and Panchayat dashboard | Complete | Partially completed |
| Phase 4 — Mandi prices and offline-first sync | Complete | Partially completed |
| Phase 5 — Hardening, security, field validation, and production launch | Complete | Not evidenced |

## Phase 1 — Foundation, Data Modeling & Core Citizen PWA

**Planned period:** Weeks 1–3  
**Roadmap status:** Complete  
**Code-verifiable status:** Partially completed

### Completed and evidenced

- The repository is organized as an npm workspace monorepo with `apps/*` and `packages/*`.
- The web application exists under `apps/web`.
- The database package exists under `packages/database`.
- Shared types exist under `packages/shared-types`.
- Next.js, React, TypeScript, Tailwind CSS, and Dexie are configured for the web application.
- Prisma is configured with a PostgreSQL datasource and generated client.
- The schema contains the core GramSathi domain models:
  - users and roles;
  - Gram Panchayats;
  - citizen profiles;
  - grievances, attachments, and timelines;
  - schemes, eligibility criteria, and applications;
  - mandi prices;
  - weather alerts.
- The schema includes role, caste, grievance category, grievance status, and priority enums.
- Database seed code exists in `packages/database/prisma/seed.ts`.
- A PWA manifest exists at `apps/web/public/manifest.json`.
- Citizen-facing web routes and a shared application layout exist.

### Partially completed or not yet evidenced

- Passwordless mobile OTP verification is not verifiable from the current source tree.
- Citizen demographic onboarding is not verifiable as a complete persisted flow.
- Service-worker registration and installation prompts are not verifiable.
- The dual-script Hindi/English localization engine is not verifiable as a complete shared system.
- Redis cache and BullMQ queue scaffolding is not present in the visible repository.
- The implementation plan refers to `apps/api`, but no API application is present in the current repository snapshot.
- PostgreSQL/PostGIS geometry support is not represented in the current Prisma schema; latitude and longitude scalar fields are present instead.

### Phase 1 gate

**Gate requirement:** A citizen can register with a phone number, select a village/Panchayat, complete a demographic profile, and install the PWA on Android.

**Assessment:** Partially complete. The web/PWA foundation and data model exist, but the complete registration, onboarding, persistence, and installation flow are not verifiable.

## Phase 2 — AI Scheme Recommendation Engine & Voice Search

**Planned period:** Weeks 4–6  
**Roadmap status:** Complete  
**Code-verifiable status:** Partially completed

### Completed and evidenced

- Scheme discovery and detail routes exist under `apps/web/src/app/schemes`.
- The Prisma schema includes:
  - scheme catalog records;
  - bilingual scheme titles and descriptions;
  - categories;
  - benefit amounts;
  - required-document arrays;
  - official application URLs;
  - eligibility criteria;
  - scheme applications.
- The database seed file contains scheme seed data.
- The web package includes the frontend dependencies needed for the current scheme interface.

### Partially completed or not yet evidenced

- A complete JSON-based eligibility rule evaluator is not verifiable.
- Profile-to-scheme matching is not verifiable as an end-to-end operation.
- The planned 50+ central and state scheme catalog cannot be confirmed from the visible files.
- Gemini 1.5 Flash integration and secure server-side API handling are not present in the visible repository.
- Browser speech recognition and speech synthesis integration is not verifiable.
- The single-tap audio explanation feature is not verifiable on every scheme card.
- A benefit calculator implementation is not verifiable.

### Phase 2 gate

**Gate requirement:** A citizen can ask in Hindi about tractor subsidies and receive eligible recommendations with voice playback.

**Assessment:** Partially complete. Scheme data structures and UI routes exist, but AI, eligibility execution, and voice behavior are not verifiable.

## Phase 3 — Civic Grievance Redressal & Panchayat Officer Dashboard

**Planned period:** Weeks 7–9  
**Roadmap status:** Complete  
**Code-verifiable status:** Partially completed

### Completed and evidenced

- A citizen grievance route exists at `apps/web/src/app/grievances`.
- A Panchayat officer route exists at `apps/web/src/app/panchayat`.
- The database schema models the complete grievance domain:
  - unique ticket IDs;
  - citizen and Panchayat relationships;
  - grievance categories;
  - status and priority;
  - SLA due dates;
  - attachments;
  - status timelines;
  - resolution proof.
- The schema includes Panchayat officer and administrative roles.
- The grievance model has indexes for Panchayat/status and citizen lookups.

### Partially completed or not yet evidenced

- A complete three-step camera/category/audio submission flow is not verifiable.
- Camera capture and client-side WebP compression below 200 KB are not verifiable.
- HTML5 geolocation and reverse geocoding are not verifiable.
- S3/MinIO presigned upload handling is not present in the visible repository.
- Gemini Vision tagging and damage classification are not verifiable.
- Backend RBAC enforcement and village-level data isolation are not verifiable.
- Officer acknowledgement, assignment, resolution, and “After” photo workflows are not verifiable end to end.
- The automated seven-day SLA escalation worker is not present.
- SMS notification dispatch is not present.

### Phase 3 gate

**Gate requirement:** A citizen can submit a water-handpump complaint with a photo and GPS, an officer can update it, and the citizen receives an SMS.

**Assessment:** Partially complete. The UI routes and relational data model exist, but the end-to-end API, storage, worker, authorization, and SMS pipeline are not verifiable.

## Phase 4 — Mandi Price Tracking & Offline-First Sync

**Planned period:** Weeks 10–12  
**Roadmap status:** Complete  
**Code-verifiable status:** Partially completed

### Completed and evidenced

- A mandi route exists at `apps/web/src/app/mandi`.
- The database schema includes `MandiPrice` with:
  - mandi, district, and state;
  - commodity and variety;
  - minimum, maximum, and modal prices;
  - arrival date;
  - price unit.
- The schema includes `WeatherAlert` with bilingual messages, severity, and validity.
- Dexie is listed as a web application dependency.
- The project documentation describes offline-first behavior and cached data requirements.

### Partially completed or not yet evidenced

- Automated Agmarknet or open-data price ingestion is not present.
- Proximity sorting with PostGIS distance queries is not verifiable.
- Seven-day high/low trend calculation is not verifiable.
- OpenWeather or IMD integration is not verifiable.
- A Dexie database schema mirroring profiles, grievances, and mandi rates is not verifiable.
- An `OutboxMutationQueue` implementation is not present.
- Background Sync service-worker handling is not present.
- Automatic reconnect synchronization and ticket generation are not verifiable.
- A complete offline status banner and optimistic mutation flow are not verifiable.

### Phase 4 gate

**Gate requirement:** A user can file a grievance in Airplane Mode, reconnect, and observe automatic synchronization with a generated ticket ID.

**Assessment:** Not yet verifiable. Dexie is available as a dependency and the data models exist, but the offline outbox, service worker, and synchronization pipeline are not present in the visible source tree.

## Phase 5 — Hardening, Security, Field Validation & Production Launch

**Planned period:** Weeks 13–14  
**Roadmap status:** Complete  
**Code-verifiable status:** Not evidenced

### Roadmap items

- Low-bandwidth testing under simulated 2G/3G conditions.
- Initial JavaScript bundle audit below 85 KB gzipped.
- DPDP Act, SQL injection, and OTP rate-limiting review.
- Cross-browser and Android 9+ testing.
- Production Docker containerization.
- GitHub Actions CI/CD for lint, type checking, tests, and builds.
- Zero-downtime production deployment with managed PostgreSQL, Redis, and CDN caching.
- Pilot rollout to ten Gram Panchayats with a training handbook.

### Current evidence assessment

- No `Dockerfile` is present in the visible repository.
- No `.github` workflow files are present in the visible repository.
- No production API or deployment configuration is present.
- No automated test suite is visible in the current repository snapshot.
- No performance-test results or bundle-size report is present.
- No security-audit report is present.
- No device/browser test report is present.
- No pilot rollout evidence or training handbook is present.

### Phase 5 gate

**Gate requirement:** The application is validated on low-end devices and low-bandwidth networks, passes security review, and is deployed for the first ten pilot Panchayats.

**Assessment:** Not evidenced in the current repository.

## Repository evidence index

| Capability | Primary evidence |
|---|---|
| Product roadmap | [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) |
| Requirements | [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) |
| Architecture | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| UX and design | [docs/DESIGN.md](docs/DESIGN.md) |
| Web application | [apps/web](apps/web) |
| Web package configuration | [apps/web/package.json](apps/web/package.json) |
| PWA manifest | [apps/web/public/manifest.json](apps/web/public/manifest.json) |
| Database schema | [packages/database/prisma/schema.prisma](packages/database/prisma/schema.prisma) |
| Database seed data | [packages/database/prisma/seed.ts](packages/database/prisma/seed.ts) |
| Shared types | [packages/shared-types/src/index.ts](packages/shared-types/src/index.ts) |

## Final status statement

The GramSathi roadmap is **administratively marked complete for Phases 1–5**. Based on the implementation evidence available in this repository, the project currently has a meaningful **frontend prototype and domain data foundation**, while the production backend, integrations, offline synchronization, automated workers, test evidence, deployment assets, and pilot-launch evidence remain incomplete or unverified.

This status should be updated whenever an implementation, test report, deployment asset, or field-validation result is added to the repository.
