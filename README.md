# 🌾 GramSathi AI (ग्राम साथी)
### *Voice-First Government Application Preparation & Evidence-Linked Documentation Assistant*

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![Flutter](https://img.shields.io/badge/Frontend-Flutter%203.19+-02569B.svg)](https://flutter.dev/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2015+-336791.svg)](https://www.postgresql.org/)
[![Pydantic v2](https://img.shields.io/badge/Validation-Pydantic%20v2-E92063.svg)](https://docs.pydantic.dev/)
[![Innovation](https://img.shields.io/badge/Core%20IP-Evidence--Linked%20Gated%20Drafting-blueviolet.svg)](#-the-core-technical-innovation)

---

## 📌 Executive Summary

**GramSathi AI** is a voice-first, offline-resilient government application preparation assistant built specifically for rural citizens, students, and village kiosk operators (CSCs / Gram Panchayat Sachivs).

In rural welfare and scholarship distribution, over 35% of applications face administrative rejection due to minor cross-document inconsistencies (e.g. spelling variations on Aadhaar vs. Marksheet) or illegible certificate numbers. Existing OCR and LLM tools blindly extract text and overwrite fields without verifying whether independent documents corroborate the claim.

GramSathi AI introduces **Evidence-Linked, Confidence-Gated Application Generation**:
1. **Field Provenance**: Every extracted field retains an auditable link to its source document, page, and coordinate bounding box.
2. **Cross-Document Reconciliation**: Compares and matches corresponding fields across multiple documents (Aadhaar, Marksheets, Income Certificates).
3. **Deterministic Conflict Detection**: Identifies and classifies discrepancies (Exact Match, Format Differences, Spelling/Transliteration Variations, Material Contradictions).
4. **Confidence-Gated Draft Generation**: A formal field reliability state machine guarantees that contradictory, low-confidence, or unconfirmed fields **can never silently enter an official application draft**.

---

## 🔬 The Core Technical Innovation

```
   [ Uploaded Documents ]
   (Aadhaar, Marksheet, Income)
              │
              ▼
   [ OCR Adapter Layer ] (Tesseract / EasyOCR)
              │
              ▼
  ┌─────────────────────────────────────────────────────────┐
  │              EVIDENCE INTELLIGENCE ENGINE               │
  │                                                         │
  │  1. Provenance Manager  ──► Creates FieldEvidence nodes │
  │  2. Field Matcher       ──► Matches cross-doc keys      │
  │  3. Conflict Detector   ──► Classifies differences:     │
  │     - Exact Match                                       │
  │     - Formatting/Whitespace                            │
  │     - Transliteration / Spelling Variation             │
  │     - Material Contradiction                            │
  │  4. User Correction     ──► Audited Human Override      │
  └────────────────────────────┬────────────────────────────┘
                               │
                               ▼
               [ Field Reliability State Machine ]
      EXTRACTED ──► EVIDENCE_CHECK ──► CONFLICTED / NEEDS_REVIEW
                          │                        │
                          ▼ (Consistent)           ▼ (User Resolves)
                   READY_FOR_REVIEW ──► USER_CONFIRMED
                               │                   │
                               └─────────┬─────────┘
                                         ▼
                                ELIGIBLE_FOR_DRAFT
                                         │
                                         ▼
                     [ Application Intelligence Layer ]
                   - Versioned Scheme Config (JSON)
                   - Dependency-Aware Rule Engine (DAG)
                   - Draft Generation Controller
                                         │
                                         ▼
                       [ Verified Editable Draft ]
```

---

## 🎯 First Release Scope: One Scholarship Scheme

To prove reliability and benchmark performance rigorously, the first release freezes scope to:
- **Application Type**: One target scholarship scheme (e.g. Post-Matric State Scholarship).
- **Language**: Hindi first (Voice and Text).
- **Document Pipeline**: Synthetic PDF/JPG/PNG test suite with controlled variations (clean, blurred, and conflicting records).
- **OCR Engine**: Tesseract 5 / EasyOCR behind an abstracted adapter.
- **Validation**: Deterministic rule checks (income limits, marks percentage, required document checklist).
- **Draft Output**: Verified, editable application draft with user-controlled portal handoff.

---

## 📂 Target Project Directory Structure

```plaintext
gramsathi-ai/
├── mobile/                      # Flutter Mobile Application
│   └── lib/
│       ├── features/            # Feature-driven architecture
│       │   ├── onboarding/      # Language selection & welcome flow
│       │   ├── voice_assistant/ # Hindi STT & audio guidance
│       │   ├── scheme_selection/# Target scholarship workflow
│       │   ├── document_upload/ # Camera/file upload with progress
│       │   ├── field_review/    # Extracted fields & confidence review
│       │   ├── conflict_resolution/ # Side-by-side evidence inspection
│       │   ├── application_draft/   # Verified draft summary
│       │   └── profile/         # Citizen demographic context
│       ├── core/                # Design system, themes & constants
│       └── services/            # API client & local offline cache
│
├── backend/                     # FastAPI Core & Evidence Intelligence
│   ├── app/
│   │   ├── main.py              # Application entrypoint
│   │   ├── api/                 # REST API endpoints (v1)
│   │   │   ├── sessions.py      # Session & consent handling
│   │   │   ├── drafts.py        # Application draft state
│   │   │   ├── documents.py     # Document upload & storage
│   │   │   ├── evidence.py      # Field evidence endpoints
│   │   │   ├── reconciliation.py# Cross-document conflict endpoints
│   │   │   └── validation.py    # Scheme rule validation endpoints
│   │   ├── services/            # Core system services
│   │   │   ├── ocr_service.py   # OCR engine adapters
│   │   │   ├── speech_service.py# Hindi speech processing adapter
│   │   │   ├── document_service.py # Private storage & SHA-256 checks
│   │   │   └── draft_service.py # Draft orchestration logic
│   │   ├── intelligence/        # THE CORE INNOVATION LAYER
│   │   │   ├── field_mapper.py  # Key mapping definitions
│   │   │   ├── provenance_manager.py # Immutable evidence logging
│   │   │   ├── field_matcher.py # Multi-document field alignment
│   │   │   ├── conflict_detector.py # Deterministic conflict classifier
│   │   │   ├── confidence_manager.py # Reliability state machine
│   │   │   └── draft_controller.py   # Confidence-gated generator
│   │   ├── rules/               # Application rules & DAG validation
│   │   │   ├── rule_engine.py   # Statutory rule evaluator
│   │   │   ├── dependency_manager.py # Dependency Graph (DAG)
│   │   │   └── scheme_configs/  # Versioned JSON scheme definitions
│   │   ├── models/              # SQLAlchemy & Pydantic domain models
│   │   ├── database/            # Connection & migration setup
│   │   ├── security/            # Encryption, DPDP compliance & tokens
│   │   └── utils/               # String normalizers & transliteration helpers
│   ├── tests/                   # Comprehensive test suite
│   │   ├── test_ocr.py
│   │   ├── test_evidence.py
│   │   ├── test_reconciliation.py
│   │   ├── test_confidence.py
│   │   ├── test_validation.py
│   │   └── test_draft_generation.py
│   └── requirements.txt         # Pinned backend dependencies
│
├── demo-fixtures/               # Controlled evaluation assets
│   └── synthetic-documents/     # Clean, blurred, and conflicting samples
│
├── docs/                        # Complete technical documentation
│   ├── ARCHITECTURE.md          # C4 diagrams, ER models & state machine
│   ├── REQUIREMENTS.md          # SRS & system prerequisites
│   ├── IMPLEMENTATION_PLAN.md   # 10-week execution plan & milestones
│   ├── api-contract.md          # REST API contracts & payloads
│   ├── innovation-design.md     # Mathematical & technical novelty specs
│   └── privacy-and-retention.md # DPDP compliance & retention policies
│
└── phases.md                    # Live 10-week development progress tracker
```

---

## 🛠️ Technology Stack Rationale

| Layer | Chosen Technology | Rationale & Advantage |
| :--- | :--- | :--- |
| **Mobile Client** | **Flutter (Dart)** | Native performance, high outdoor contrast rendering (WCAG AAA), cross-platform deployment, robust camera/mic access. |
| **Backend & API** | **FastAPI (Python 3.10+)** | High-throughput asynchronous endpoints, native Pydantic v2 data validation, seamless integration with Python OCR & NLP ecosystems. |
| **Database** | **PostgreSQL 15+** | Relational integrity for decoupled evidence entities (`ExtractedFields` vs `FieldEvidence`), immutable audit trails. |
| **Document Processing** | **PyPDF2 + pdf2image + Pillow** | Fast client/server image preprocessing, format conversion, and deskewing. |
| **OCR Adapters** | **Tesseract 5 / EasyOCR** | Abstracted behind pluggable interfaces so engines can be swapped without altering evidence reconciliation logic. |
| **String & Phonetic Matching** | **RapidFuzz + Jellyfish + Indic NLP** | High-speed normalized string comparison and Indic transliteration handling. |
| **Dependency Graph** | **NetworkX** | Models scheme statutory rules as a Directed Acyclic Graph (DAG) for selective revalidation upon field mutation. |
| **Testing & Evaluation** | **pytest + pytest-asyncio** | High-coverage test suite evaluating False Acceptance Rate (FAR) and conflict detection recall against ground truth. |

---

## 📅 10-Week Milestone Roadmap

- **Week 1 (Phase 0)**: Research, Scheme Field Specification & Synthetic Document Dataset.
- **Week 2 (Phase 1)**: Basic Application Without AI (Manual Flutter + FastAPI flow).
- **Week 3 (Phase 2)**: Database & Document Management (PostgreSQL & private object store).
- **Week 4 (Phase 3)**: OCR Extraction Pipeline & Review UI.
- **Week 5 (Phase 4)**: Evidence Reconciliation Engine & Conflict Detector.
- **Week 6 (Phase 5)**: Confidence-Gated Draft Generation State Machine.
- **Week 7 (Phase 6)**: Versioned Scheme Rules & Dependency DAG Validation.
- **Week 8 (Phase 7)**: Hindi Voice Assistant (STT & audio guidance).
- **Week 9 (Phase 8)**: Offline Resilience, Security & DPDP Compliance.
- **Week 10 (Phase 9/10)**: System Integration, Comparative Benchmarks & Patent Documentation.

---

## 🤝 Contribution & License
Licensed under the [MIT License](LICENSE). Built for rural digital inclusion, transparent governance, and accurate welfare delivery.
