# 📅 GramSathi AI — 10-Week Execution Plan & Milestone Roadmap

**Project:** GramSathi AI  
**Core Methodology:** Evidence-Linked, Confidence-Gated Application Generation  
**Target Milestone:** Production-grade pilot of 1 Scholarship Workflow with Hindi Voice & OCR Evidence Reconciliation  

---

## 🗺️ High-Level 10-Week Milestone Summary

```
Week  1 [Phase 0] ───► Research, Scheme Field Specification & Synthetic Document Dataset
Week  2 [Phase 1] ───► Basic Application Without AI (Flutter + FastAPI Manual Flow)
Week  3 [Phase 2] ───► Database & Document Management (PostgreSQL & Private Object Store)
Week  4 [Phase 3] ───► OCR Pipeline & Structured Field Extraction (Tesseract/EasyOCR Adapters)
Week  5 [Phase 4] ───► Core Innovation: Evidence Reconciliation & Conflict Detection Engine
Week  6 [Phase 5] ───► Confidence Management & Controlled Draft Generation State Machine
Week  7 [Phase 6] ───► Versioned Scheme Rules & Dependency-Aware Validation (DAG)
Week  8 [Phase 7] ───► Hindi Voice Assistant (STT, Intent Mapping & Guided Interaction)
Week  9 [Phase 8] ───► Offline Reliability, Security Hardening & DPDP Privacy Compliance
Week 10 [Phase 9/10] ► System Integration, Comparative Evaluation & Patent Documentation
```

---

## 📋 Phase-by-Phase Detailed Breakdown

### 🟢 Phase 0: Research, Scope & Specification (Week 1)
- **Goal:** Freeze statutory rules for one target scholarship scheme and construct synthetic test data.
- **Key Tasks:**
  - Select target scheme (e.g., Post-Matric State Scholarship).
  - Define required fields: `full_name`, `date_of_birth`, `annual_income`, `marks_percentage`, `category`, `institution`.
  - Map each field to its acceptable source documents (Aadhaar, Marksheet, Income Certificate).
  - Generate a controlled synthetic document dataset with clean, blurred, and deliberately conflicting records.
- **Deliverable Gate:** Written field specification, JSON validation rules, and synthetic document ground-truth dataset.

---

### 🟢 Phase 1: Basic Application Workflow Without AI (Week 2 — P0)
- **Goal:** Prove end-to-end draft creation, field saving, and validation before touching AI or OCR.
- **Key Tasks:**
  - Build Flutter client: Welcome screen, language toggle, scheme selection, manual field entry, review summary.
  - Build FastAPI backend: `POST /v1/sessions`, `POST /v1/drafts`, `PATCH /v1/drafts/{id}/fields`, `POST /v1/drafts/{id}/validate`, `GET /v1/drafts/{id}/summary`.
- **Deliverable Gate:** A user can create, save, validate, and inspect an application draft entirely via manual entry.

---

### 🟢 Phase 2: Database & Document Management (Week 3 — P0)
- **Goal:** Establish PostgreSQL data model decoupling fields from evidence.
- **Key Tasks:**
  - Implement relational schema: `application_drafts`, `documents`, `extracted_fields`, `field_evidence`, `field_conflicts`, `field_confirmations`, `audit_events`.
  - Secure private document storage pipeline with cryptographic hash check (`SHA-256`) and size/type validation.
- **Deliverable Gate:** Backend persists drafts, documents, and multiple evidence records per field.

---

### 🟢 Phase 3: OCR & Structured Field Extraction (Week 4 — P0)
- **Goal:** Ingest documents and convert raw images/PDFs into structured candidates.
- **Key Tasks:**
  - Implement pluggable OCR adapter (`pytesseract` / `easyocr`).
  - Preprocessing pipeline: Deskew, binarization, format conversion.
  - Field identification & normalization routines.
  - Build OCR review UI in Flutter highlighting extracted values and raw confidence.
- **Deliverable Gate:** Uploaded synthetic documents produce editable extracted fields with coordinate bounding boxes.

---

### 🟡 Phase 4: Core Innovation — Evidence Reconciliation Engine (Week 5 — Core IP)
- **Goal:** Build the multi-document provenance and conflict detection engine.
- **Key Tasks:**
  - **Field Provenance Manager:** Records immutable source metadata for every extracted value.
  - **Field Matcher:** Maps document attributes to canonical application fields across multiple documents.
  - **Conflict Detector:** Implements deterministic comparison classifying exact matches, format variations, spelling/transliteration differences, and material contradictions.
  - **Conflict Resolution Store:** Preserves conflicting evidence alongside user overrides.
- **Deliverable Gate:** Deliberately uploading conflicting synthetic documents causes the system to detect the conflict and present both sources to the user.

---

### 🟡 Phase 5: Confidence Management & Controlled Draft Generation (Week 6 — Core IP)
- **Goal:** Implement the formal field reliability state machine.
- **Key Tasks:**
  - State machine transitions: `EXTRACTED` $\rightarrow$ `EVIDENCE_CHECK` $\rightarrow$ `READY / NEEDS_REVIEW / CONFLICTED` $\rightarrow$ `USER_CONFIRMED / USER_CORRECTED` $\rightarrow$ `ELIGIBLE_FOR_DRAFT`.
  - Multi-dimensional confidence matrix: Separating $\mathcal{C}_{ocr}$, $\mathcal{C}_{consist}$, $\mathcal{C}_{audit}$, $\mathcal{C}_{rules}$.
  - **Draft Generation Controller:** Hard gating ensuring no conflicting or unconfirmed field silently enters the final draft.
- **Deliverable Gate:** Draft generation fails safely if any blocking field remains unverified or conflicted.

---

### 🟠 Phase 6: Scheme Rules & Dependency-Aware Validation (Week 7 — P0)
- **Goal:** Implement statutory rule evaluation using a Directed Acyclic Graph (DAG).
- **Key Tasks:**
  - Versioned JSON scheme configuration schemas.
  - Rule evaluators for mandatory fields, formats, numeric ranges, and income ceilings.
  - Dependency manager: Marking dependent checks dirty upon field mutation (e.g., income change triggers revalidation of fee waiver).
- **Deliverable Gate:** Modifying a field re-evaluates only downstream statutory rules and updates overall draft readiness.

---

### 🟠 Phase 7: Hindi Voice Assistant & Guided Interaction (Week 8 — P1)
- **Goal:** Enable hands-free voice interaction for low-literacy rural users.
- **Key Tasks:**
  - Hindi Speech-to-Text integration with editable transcript view.
  - Intent recognition mapping spoken phrases to scheme workflow and document upload requests.
  - Spoken Hindi guidance (`[🔊 सुनिए]`) explaining identified conflicts or required documents.
- **Deliverable Gate:** Citizen can initiate scholarship preparation and receive spoken guidance entirely in Hindi.

---

### 🔵 Phase 8: Offline Reliability, Security & DPDP Compliance (Week 9 — P1)
- **Goal:** Harden the system for real-world rural network conditions and data protection.
- **Key Tasks:**
  - Weak-network recovery: Chunked upload, local draft checkpoints, idempotent operation tokens.
  - DPDP compliance: Masked Aadhaar handling, explicit consent capture, hard deletion routines.
  - Audit log immutability and fraud warning banners.
- **Deliverable Gate:** Interrupted uploads recover cleanly after network reconnection without data loss or duplicate processing.

---

### 🔵 Phase 9 & 10: Complete Integration, Comparative Evaluation & Patent Prep (Week 10)
- **Goal:** End-to-end validation, comparative benchmarking, and patent documentation.
- **Key Tasks:**
  - Benchmark proposed GramSathi system against Baseline (OCR + naive form fill).
  - Measure False Acceptance Rate (FAR), Conflict Detection Precision/Recall, and Draft Completion Rate.
  - Prepare technical novelty disclosures for patentability assessment.
- **Deliverable Gate:** Working demonstration of Test Scenarios A, B, C, D with quantitative evaluation results.

---

## ⚡ First 48-Hour Execution Milestones

### Day 1: Design & Scope Freeze
1. Finalize target scholarship scheme and official statutory requirements.
2. Freeze field-to-evidence matrix and database entity specifications.
3. Generate synthetic document test set (clean, blurred, and conflicting).

### Day 2: Basic Working Skeleton
1. Initialize repository directories (`backend/` and `mobile/`).
2. Scaffold FastAPI backend with PostgreSQL models.
3. Scaffold Flutter manual entry screens.
4. Verify end-to-end draft saving and validation without AI.
