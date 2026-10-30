# 🌾 GramSathi AI (ग्राम साथी)
### *Voice-First Government Application Preparation & Evidence-Linked Documentation Assistant*

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![Flutter](https://img.shields.io/badge/Frontend-Flutter%203.19+-02569B.svg)](https://flutter.dev/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2015+-336791.svg)](https://www.postgresql.org/)
[![Pydantic v2](https://img.shields.io/badge/Validation-Pydantic%20v2-E92063.svg)](https://docs.pydantic.dev/)
[![Core IP](https://img.shields.io/badge/Core%20IP-Evidence--Linked%20Gated%20Drafting-blueviolet.svg)](#-the-core-technical-innovation)

---

## 📌 Executive Summary

**GramSathi AI** is a voice-first, offline-resilient government application preparation assistant built specifically for rural citizens, students, and village kiosk operators (CSCs / Gram Panchayat Sachivs).

In rural welfare and scholarship distribution, over 35% of applications face administrative rejection due to minor cross-document inconsistencies (e.g. spelling variations on Aadhaar vs. Marksheet) or illegible certificate numbers. Existing OCR and LLM tools blindly extract text and overwrite fields without verifying whether independent documents corroborate the claim.

GramSathi AI introduces **Evidence-Linked, Confidence-Gated Application Generation**:
1. **Decoupled Field-to-Evidence Model**: Canonical application fields maintain 1:N immutable links to all supporting documents rather than destructively overwriting values.
2. **Deterministic Cross-Document Reconciliation**: Multi-source attributes are systematically aligned and classified across 5 tiers:
   - `EXACT_MATCH`
   - `FORMAT_VARIATION`
   - `SPELLING_OR_TRANSLITERATION_VARIATION`
   - `MATERIAL_CONTRADICTION`
   - `UNREADABLE_OR_MISSING`
3. **Formal Field Reliability State Machine**: Fields must progress through explicit gating:
   $$\text{EXTRACTED} \longrightarrow \text{EVIDENCE\_CHECK} \longrightarrow \text{READY / NEEDS\_REVIEW / CONFLICTED} \longrightarrow \text{USER\_CONFIRMED} \longrightarrow \text{ELIGIBLE\_FOR\_DRAFT}$$
4. **Hard Draft Generation Gating**: Unreconciled, unconfirmed, or contradictory fields can **never silently enter an official draft**.

---

## 🏗️ Repository Architecture & Layout

```plaintext
GramSathi/
├── mobile/                  # Flutter cross-platform mobile client
│   ├── pubspec.yaml
│   └── lib/
│       ├── main.dart
│       ├── core/theme/      # High outdoor contrast (WCAG AAA) tokens
│       ├── services/        # HTTP REST client for FastAPI v1
│       └── features/
│           ├── onboarding/  # Welcome & DPDP consent screen
│           ├── scheme_selection/ # Target scholarship card
│           └── application_draft/ # Manual entry & draft summary review
│
├── backend/                 # FastAPI backend & Evidence Intelligence Engine
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py          # FastAPI application & router mounting
│   │   ├── api/             # v1 REST endpoints (sessions, drafts, docs, evidence, reconcile, validate)
│   │   ├── intelligence/    # Provenance manager, conflict detector, confidence state machine, draft controller
│   │   ├── rules/           # Scheme rule engine & Dependency DAG
│   │   ├── services/        # OCR adapter, document storage, draft service
│   │   ├── models/          # Domain entities & Pydantic v2 schemas
│   │   └── database/        # In-memory store & repository adapter
│   └── tests/               # Unit test suite (manual workflow & reconciliation tests)
│
├── demo-fixtures/           # Controlled synthetic dataset for OCR & conflict evaluation
│   ├── README.md
│   └── synthetic-documents/
│       ├── field_evidence_matrix.json
│       ├── CASE_01_HAPPY_PATH.json
│       ├── CASE_02_NAME_VARIATION.json
│       ├── CASE_03_LOW_CONFIDENCE.json
│       ├── CASE_04_CONTRADICTION.json
│       └── CASE_05_INCOME_CEILING.json
│
├── docs/                    # System architecture, API contracts, design & requirements
├── phases.md                # 10-week milestone execution tracker
└── package.json             # Root monorepo configuration
```

---

## ⚡ Quickstart

### 1. Run Backend Unit Tests
```bash
cd backend
python -m unittest discover -s tests -p "test_*.py" -v
```

### 2. Launch FastAPI Backend
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive API docs available at `http://localhost:8000/docs`.

### 3. Launch Mobile Client
```bash
cd mobile
flutter run
```
