# 📊 GramSathi AI — 10-Week Milestone & Implementation Tracker

**Project:** GramSathi AI (ग्राम साथी)  
**Core Technical Innovation:** Evidence-Linked, Confidence-Gated Application Generation  
**Status Snapshot:** 30 October 2026  
**Progress:** 0/10 Weeks Completed  

---

## Overall Development Progress Tracker

| Milestone | Phase & Description | Target Deliverable Gate | Status |
| :---: | :--- | :--- | :---: |
| **Week 1** | **Phase 0: Research, Scope & Specification** | Target scheme frozen, field-to-evidence matrix specified, synthetic dataset created | ⏳ Up Next |
| **Week 2** | **Phase 1: Basic Workflow Without AI** | Working manual Flutter + FastAPI draft creation & validation | ⏸️ Pending |
| **Week 3** | **Phase 2: Database & Document Store** | Decoupled evidence schema & private encrypted storage | ⏸️ Pending |
| **Week 4** | **Phase 4: OCR Extraction Pipeline** | Documents produce candidate fields with coordinate bounding boxes | ⏸️ Pending |
| **Week 5** | **Phase 5: Evidence Reconciliation Engine** | Multi-source conflict detection & provenance tracking working | ⏸️ Pending |
| **Week 6** | **Phase 6: Confidence-Gated Draft Generator** | Formal state machine prevents unconfirmed fields from entering draft | ⏸️ Pending |
| **Week 7** | **Phase 7: Scheme Rules & Dependency DAG** | Versioned scheme config & dependency-aware revalidation | ⏸️ Pending |
| **Week 8** | **Phase 8: Hindi Voice Assistant** | Hands-free Hindi STT, transcript review, and spoken guidance | ⏸️ Pending |
| **Week 9** | **Phase 9: Offline Resilience & DPDP Security** | Resumable uploads, local checkpoints, and masked Aadhaar privacy | ⏸️ Pending |
| **Week 10**| **Phase 10: System Integration & Evaluation** | Quantitative comparative benchmarks vs baseline & patent documentation | ⏸️ Pending |

---

## 🔍 Detailed Phase Status & Acceptance Criteria

### Week 1 — Phase 0: Research, Scope & Specification
- [ ] Select 1 target scholarship scheme (e.g., Post-Matric State Scholarship).
- [ ] Document statutory application requirements (fields, income limits, marks thresholds, quotas).
- [ ] Construct field-to-evidence matrix (`full_name`, `dob`, `income`, `percentage`, `category`).
- [ ] Generate synthetic test documents:
  - Clean matching records (Happy Path).
  - Blurred / degraded scan (Low OCR confidence test).
  - Deliberately conflicting records (`Yash Sharma` vs `Yash S Sharma` / differing DOB).
- [ ] Document acceptance criteria and evaluation metrics.

### Week 2 — Phase 1: Basic Application Workflow Without AI (P0)
- [ ] Initialize FastAPI backend skeleton.
- [ ] Initialize Flutter client skeleton with high-contrast UI.
- [ ] Implement session creation (`POST /v1/sessions`).
- [ ] Implement manual field entry and draft persistence (`PATCH /v1/drafts/{id}/fields`).
- [ ] Implement deterministic validation check (`POST /v1/drafts/{id}/validate`).
- [ ] Implement draft summary review (`GET /v1/drafts/{id}/summary`).
- **Gate Check:** Complete manual application draft workflow verified without OCR or LLM dependencies.

### Week 3 — Phase 2: Database & Document Management (P0)
- [ ] Implement PostgreSQL relational schema decoupling fields from evidence.
- [ ] Set up private encrypted object storage pipeline.
- [ ] Implement file type/size validation and SHA-256 integrity checks.
- [ ] Implement document purge & consent controls.

### Week 4 — Phase 3: OCR & Structured Extraction (P0)
- [ ] Implement pluggable OCR adapter (`pytesseract` / `easyocr`).
- [ ] Implement image preprocessing (deskew, binarization).
- [ ] Map extracted text tokens to candidate fields with bounding box coordinates.
- [ ] Build Flutter OCR review screen highlighting extracted values and source regions.

### Week 5 — Phase 4: Evidence Reconciliation & Conflict Detection (Core IP)
- [ ] Implement Field Provenance Manager recording immutable evidence records.
- [ ] Implement Field Matcher mapping corresponding fields across distinct documents.
- [ ] Implement Conflict Detection Engine classifying:
  - `EXACT_MATCH`
  - `FORMAT_VARIATION`
  - `SPELLING_OR_TRANSLITERATION_VARIATION`
  - `MATERIAL_CONTRADICTION`
  - `UNREADABLE_OR_MISSING`
- [ ] Preserve conflicting evidence records during user overrides.

### Week 6 — Phase 5: Confidence-Gated Draft Generation (Core IP)
- [ ] Implement Field Reliability State Machine:
  $\text{EXTRACTED} \rightarrow \text{EVIDENCE\_CHECK} \rightarrow \text{READY / NEEDS\_REVIEW / CONFLICTED} \rightarrow \text{USER\_CONFIRMED} \rightarrow \text{ELIGIBLE\_FOR\_DRAFT}$.
- [ ] Implement multi-dimensional confidence evaluator ($\mathcal{C}_{ocr}, \mathcal{C}_{consist}, \mathcal{C}_{audit}, \mathcal{C}_{rules}$).
- [ ] Implement Draft Generation Controller with hard blocking gates.

### Week 7 — Phase 6: Scheme Rules & Dependency DAG (P0)
- [ ] Create versioned JSON scheme configuration format.
- [ ] Implement deterministic rule validators for statutory boundaries.
- [ ] Implement dependency-aware validation graph (DAG) re-evaluating only dirty nodes on field updates.

### Week 8 — Phase 7: Hindi Voice Assistant (P1)
- [ ] Connect Hindi Speech-to-Text engine with editable transcript.
- [ ] Implement voice intent classification for scheme onboarding and document queries.
- [ ] Implement spoken audio guidance (`[🔊 सुनिए]`) for low-literacy users.

### Week 9 — Phase 8: Offline Reliability & Security (P1)
- [ ] Implement resumable uploads and client draft checkpoints.
- [ ] Enforce DPDP compliance: Masked Aadhaar storage, encrypted references, and privacy-safe logs.
- [ ] Test offline recovery under simulated network interruptions.

### Week 10 — Phase 9 & 10: Complete Integration & Patent Documentation (Core IP)
- [ ] Run end-to-end integration test scenarios (A: Clean, B: Conflicting, C: Low Confidence, D: Interrupted).
- [ ] Execute comparative benchmark against baseline (OCR + naive form fill):
  - False Acceptance Rate (FAR)
  - Conflict Detection Precision & Recall
  - Draft Completion Rate
- [ ] Assemble technical patent disclosure documentation detailing the novel mechanisms.
