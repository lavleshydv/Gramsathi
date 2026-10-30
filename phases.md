# 📊 GramSathi AI — 10-Week Milestone & Implementation Tracker

**Project:** GramSathi AI (ग्राम साथी)  
**Core Technical Innovation:** Evidence-Linked, Confidence-Gated Application Generation  
**Status Snapshot:** 30 October 2026  
**Progress:** 6/10 Phases Completed (Phase 0, 1, 2, 3, 4, and 5 Complete)  

---

## Overall Development Progress Tracker

| Milestone | Phase & Description | Target Deliverable Gate | Status |
| :---: | :--- | :--- | :---: |
| **Week 1** | **Phase 0: Research, Scope & Specification** | 1 target scholarship frozen, field-to-evidence matrix, synthetic dataset (clean, blurry, conflicting) | 🟢 **COMPLETED** |
| **Week 2** | **Phase 1: Basic Workflow Without AI** | Working manual Flutter + FastAPI draft creation, validation & summary | 🟢 **COMPLETED** |
| **Week 3** | **Phase 2: Database & Document Store** | Decoupled evidence schema & private encrypted storage (1:N field-to-evidence) | 🟢 **COMPLETED** |
| **Week 4** | **Phase 3: OCR Extraction Pipeline** | Documents produce candidate fields with coordinate bounding boxes & OCR confidence | 🟢 **COMPLETED** |
| **Week 5** | **Phase 4: Evidence Reconciliation Engine** | Multi-source conflict detection & provenance tracking working (Core IP) | 🟢 **COMPLETED** |
| **Week 6** | **Phase 5: Confidence-Gated Draft Generator** | Formal state machine prevents unconfirmed/conflicted fields from entering draft (Core IP) | 🟢 **COMPLETED** |
| **Week 7** | **Phase 6: Scheme Rules & Dependency DAG** | Versioned scheme config & dependency-aware revalidation | ⏳ **UP NEXT** |
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
- [x] Implement PostgreSQL/SQLAlchemy relational schema strictly decoupling `extracted_fields` from `field_evidence` (1:N relationship).
- [x] Implement private AES-256 encrypted object storage pipeline outside public web access.
- [x] Implement file type (PDF, JPG, PNG) and file size (≤ 10MB) validation with magic byte verification.
- [x] Compute and verify SHA-256 checksums to block duplicate uploads.
- [x] Provide temporary 15-minute signed access tokens for authorized document inspection (`GET /v1/documents/{id}/view`).
- [x] Implement hard cryptographic purge (`DELETE /v1/drafts/{id}/documents/{id}`) cleanly unlinking derived evidence records under DPDP Act compliance.

### Week 4 — Phase 3: OCR & Structured Extraction (P0)
- [x] Implement image preprocessing pipeline: blur detection (Laplacian variance), deskewing (minimum area bounding box), and Otsu binarization.
- [x] Build pluggable OCR adapter architecture (`BaseOCRAdapter`, `SyntheticFixtureOCRAdapter`, `TesseractOCRAdapter`, `EasyOCRAdapter`).
- [x] Map extracted text tokens to candidate fields retaining coordinate bounding boxes (`[x, y, w, h]`), OCR confidence, and page number.
- [x] Detect low-confidence glyphs (`?`, confidence < 0.70) and transition fields to `NEEDS_REVIEW` state.
- [x] Build Flutter document upload screen (`DocumentUploadScreen`) and OCR review screen (`FieldReviewScreen`) highlighting values, source regions, confidence badges, and in-place confirmation.

### Week 5 — Phase 4: Evidence Reconciliation & Conflict Detection (Core IP)
- [x] Implement Field Provenance Manager recording immutable 1:N evidence records across multiple simultaneous documents.
- [x] Implement Field Matcher mapping document-specific attributes to canonical application keys.
- [x] Implement deterministic 5-tier Conflict Detection Engine classifying:
  - `EXACT_MATCH`: Normalization matches exactly.
  - `FORMAT_VARIATION`: Date separators (`/` vs `-`) or currency formatting.
  - `SPELLING_OR_TRANSLITERATION_VARIATION`: Initials and minor edit-distance variations (`Yash Sharma` vs `Yash S Sharma`) producing non-blocking warnings.
  - `MATERIAL_CONTRADICTION`: Conflicting statutory values (e.g. differing DOBs) producing blocking errors.
  - `UNREADABLE_OR_MISSING`: Unreadable glyphs (`?`) or missing certificates.
- [x] Preserve conflicting evidence records during user overrides and confirmations.
- [x] Build Flutter side-by-side evidence comparator screen (`ConflictResolutionScreen`) prompting applicant to choose or type authoritative values.

### Week 6 — Phase 5: Confidence-Gated Draft Generation (Core IP)
- [x] Implement formal Field Reliability State Machine:
  $$\text{EXTRACTED} \longrightarrow \text{EVIDENCE\_CHECK} \longrightarrow (\text{READY\_FOR\_REVIEW} \mid \text{NEEDS\_REVIEW} \mid \text{CONFLICTED} \mid \text{INVALID} \mid \text{MISSING}) \longrightarrow (\text{USER\_CONFIRMED} \mid \text{USER\_CORRECTED}) \longrightarrow \text{ELIGIBLE\_FOR\_DRAFT}$$
- [x] Implement Multi-Dimensional Confidence Tensor Evaluator evaluating $\mathcal{C}_{ocr}$, $\mathcal{C}_{consist}$, $\mathcal{C}_{audit}$, $\mathcal{C}_{rules}$ and composite reliability scores.
- [x] Implement Draft Generation Controller with hard blocking gates:
  - Conflicted fields cannot silently enter final draft.
  - Unconfirmed low-confidence fields cannot enter draft.
  - Statutory ineligibility blocks draft generation.
- [x] Implement final draft package generation endpoint (`POST /v1/drafts/{id}/generate`) producing sanitized application payload with full evidence manifest.

### Week 7 — Phase 6: Scheme Rules & Dependency DAG (P0)
- [ ] Create versioned JSON scheme configuration format (`post_matric_scholarship.json`).
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
- [ ] Execute comparative benchmark against baseline (OCR + naive form fill).
- [ ] Assemble technical patent disclosure documentation detailing the novel mechanisms.
