# 📊 GramSathi AI — 10-Week Milestone & Implementation Tracker

**Project:** GramSathi AI (ग्राम साथी)  
**Core Technical Innovation:** Evidence-Linked, Confidence-Gated Application Generation  
**Status Snapshot:** 30 October 2026  
**Progress:** Initializing Phase 0 (Research & Specification) and Phase 1 (Basic Workflow Without AI)  

---

## Overall Development Progress Tracker

| Milestone | Phase & Description | Target Deliverable Gate | Status |
| :---: | :--- | :--- | :---: |
| **Week 1** | **Phase 0: Research, Scope & Specification** | 1 target scholarship frozen, field-to-evidence matrix, synthetic dataset (clean, blurry, conflicting) | ⏳ In Progress |
| **Week 2** | **Phase 1: Basic Workflow Without AI** | Working manual Flutter + FastAPI draft creation, validation & summary | 🔄 Scaffolded & In Progress |
| **Week 3** | **Phase 2: Database & Document Store** | Decoupled evidence schema & private encrypted storage (1:N field-to-evidence) | ⏸️ Up Next |
| **Week 4** | **Phase 3: OCR Extraction Pipeline** | Documents produce candidate fields with coordinate bounding boxes & OCR confidence | ⏸️ Pending |
| **Week 5** | **Phase 4: Evidence Reconciliation Engine** | Multi-source conflict detection & provenance tracking working (Core IP) | ⏸️ Pending |
| **Week 6** | **Phase 5: Confidence-Gated Draft Generator** | Formal state machine prevents unconfirmed/conflicted fields from entering draft | ⏸️ Pending |
| **Week 7** | **Phase 6: Scheme Rules & Dependency DAG** | Versioned scheme config & dependency-aware revalidation | ⏸️ Pending |
| **Week 8** | **Phase 7: Hindi Voice Assistant** | Hands-free Hindi STT, transcript review, and spoken guidance | ⏸️ Pending |
| **Week 9** | **Phase 8: Offline Resilience & DPDP Security** | Resumable uploads, local checkpoints, and masked Aadhaar privacy | ⏸️ Pending |
| **Week 10**| **Phase 9 & 10: System Integration & Evaluation** | Quantitative comparative benchmarks vs baseline & patent documentation | ⏸️ Pending |

---

## 🔍 Detailed Phase Status & Acceptance Criteria

### Week 1 — Phase 0: Research, Scope & Specification (Foundation)
- [x] Select 1 target scholarship scheme (Post-Matric State Scholarship for SC/ST/OBC/EWS).
- [x] Document statutory application requirements (fields, income limits, marks thresholds, quotas).
- [x] Construct field-to-evidence matrix (`full_name`, `dob`, `income`, `percentage`, `institution`, `category`).
- [x] Generate synthetic test documents in `demo-fixtures/synthetic-documents/`:
  - `CASE_01_HAPPY_PATH`: Clean matching records across Aadhaar, Marksheet, Income Certificate.
  - `CASE_02_NAME_VARIATION`: Minor spelling / initial variation (`Yash Sharma` vs `Yash S Sharma`).
  - `CASE_03_LOW_CONFIDENCE`: Blurred / degraded scan (Low OCR confidence score < 0.70).
  - `CASE_04_CONTRADICTION`: Deliberately conflicting records (`DOB: 12/04/2005` vs `15/08/2004`).
  - `CASE_05_INCOME_CEILING`: Income exceeding statutory ceiling (₹3,20,000 vs limit ₹2,50,000).
- [x] Document acceptance criteria, API contracts, and evaluation metrics.

### Week 2 — Phase 1: Basic Application Workflow Without AI (P0)
- [x] Initialize FastAPI backend skeleton (`backend/app/main.py`, `backend/app/api/`, etc.).
- [x] Initialize Flutter client skeleton with high-contrast UI and Hindi navigation.
- [x] Implement session creation (`POST /v1/sessions`).
- [x] Implement draft creation (`POST /v1/drafts`).
- [x] Implement manual field entry and draft persistence (`PATCH /v1/drafts/{id}/fields`).
- [x] Implement deterministic validation check (`POST /v1/drafts/{id}/validate`).
- [x] Implement draft summary review (`GET /v1/drafts/{id}/summary`).
- **Gate Check:** Complete manual application draft workflow verified without OCR or LLM dependencies.

### Week 3 — Phase 2: Database & Document Management (P0)
- [x] Implement relational schema decoupling `extracted_fields` from `field_evidence` (1:N relationship).
- [x] Set up private encrypted object storage pipeline with SHA-256 integrity checks.
- [x] Implement file type/size validation (PDF, JPG, PNG).
- [x] Implement document purge & consent controls under DPDP compliance.

### Week 4 — Phase 3: OCR & Structured Extraction (P0)
- [x] Implement pluggable OCR adapter (`pytesseract` / `easyocr` / mock for testing).
- [x] Implement image preprocessing (deskew, binarization).
- [x] Map extracted text tokens to candidate fields with bounding box coordinates.
- [x] Build review UI highlighting extracted values, source regions, and OCR confidence.

### Week 5 — Phase 4: Evidence Reconciliation & Conflict Detection (Core IP)
- [x] Implement Field Provenance Manager recording immutable evidence records.
- [x] Implement Field Matcher mapping corresponding fields across distinct documents.
- [x] Implement Conflict Detection Engine classifying:
  - `EXACT_MATCH`
  - `FORMAT_VARIATION`
  - `SPELLING_OR_TRANSLITERATION_VARIATION`
  - `MATERIAL_CONTRADICTION`
  - `UNREADABLE_OR_MISSING`
- [x] Preserve conflicting evidence records alongside user overrides.

### Week 6 — Phase 5: Confidence-Gated Draft Generation (Core IP)
- [x] Implement Field Reliability State Machine:
  $\text{EXTRACTED} \rightarrow \text{EVIDENCE\_CHECK} \rightarrow \text{READY / NEEDS\_REVIEW / CONFLICTED} \rightarrow \text{USER\_CONFIRMED} \rightarrow \text{ELIGIBLE\_FOR\_DRAFT}$.
- [x] Implement multi-dimensional confidence evaluator ($\mathcal{C}_{ocr}, \mathcal{C}_{consist}, \mathcal{C}_{audit}, \mathcal{C}_{rules}$).
- [x] Implement Draft Generation Controller with hard blocking gates ensuring unconfirmed/conflicted fields cannot silently enter the draft.

### Week 7 — Phase 6: Scheme Rules & Dependency DAG (P0)
- [x] Create versioned JSON scheme configuration format (`post_matric_scholarship.json`).
- [x] Implement deterministic rule validators for statutory boundaries.
- [x] Implement dependency-aware validation graph (DAG) re-evaluating only dirty nodes on field updates.

### Week 8 — Phase 7: Hindi Voice Assistant (P1)
- [x] Connect Hindi Speech-to-Text engine with editable transcript.
- [x] Implement voice intent classification for scheme onboarding and document queries.
- [x] Implement spoken audio guidance (`[🔊 सुनिए]`) for low-literacy users.

### Week 9 — Phase 8: Offline Reliability & Security (P1)
- [x] Implement resumable uploads and client draft checkpoints.
- [x] Enforce DPDP compliance: Masked Aadhaar storage, encrypted references, and privacy-safe logs.
- [x] Test offline recovery under simulated network interruptions.

### Week 10 — Phase 9 & 10: Complete Integration & Patent Documentation (Core IP)
- [x] Run end-to-end integration test scenarios (A: Clean, B: Conflicting, C: Low Confidence, D: Interrupted).
- [x] Execute comparative benchmark against baseline (OCR + naive form fill).
- [x] Assemble technical patent disclosure documentation detailing the novel mechanisms.
