# 📊 GramSathi AI — 10-Week Milestone & Implementation Tracker

**Project:** GramSathi AI (ग्राम साथी)  
**Core Technical Innovation:** Evidence-Linked, Confidence-Gated Application Generation  
**Status Snapshot:** 31 October 2026  
**Progress:** 9/10 Phases Completed (Phases 0, 1, 2, 3, 4, 5, 6, 7, 8, and 9 Complete)  

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
| **Week 7** | **Phase 6: Scheme Rules & Dependency DAG** | Versioned scheme config & dependency-aware revalidation (NetworkX DAG) | 🟢 **COMPLETED** |
| **Week 8** | **Phase 7: Hindi Voice Assistant** | Hands-free Hindi STT, editable Devanagari transcripts, and spoken guidance `[🔊 सुनिए]` | 🟢 **COMPLETED** |
| **Week 9** | **Phase 8: Offline Resilience & DPDP Security** | Resumable chunked uploads, local draft checkpoints, and 8-digit Aadhaar masking | 🟢 **COMPLETED** |
| **Week 10**| **Phase 9: System Integration & Evaluation** | E2E integration test scenarios (A, B, C, D) & comparative benchmarks (FAR = 0.0%) | 🟢 **COMPLETED** |
| **Final**  | **Phase 10: Patent Documentation & Packaging** | Technical patent claims & formal IP disclosure document | ⏳ **UP NEXT** |

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
- [x] Create versioned JSON scheme configuration format (`post_matric_scholarship.json` v2.0.0).
- [x] Define multi-tier conditional benefits (Tier 1 full waiver for SC/ST with income ≤ ₹1L; Tier 2 standard waiver for income ≤ ₹2.5L).
- [x] Implement formal Directed Acyclic Graph (`dependency_manager.py`) using NetworkX with strict acyclicity verification (0 cycles).
- [x] Implement downstream dependency tracing and selective dirty node re-evaluation (skipping independent nodes).
- [x] Expose selective revalidation endpoint (`POST /v1/drafts/{id}/dag-revalidate`) and pass all 5 unit tests in `test_dependency_dag.py`.

### Week 8 — Phase 7: Hindi Voice Assistant (P1)
- [x] Build Hindi Speech Processing service (`speech_service.py`) supporting speech-to-text with editable Devanagari transcripts (`is_editable: True`).
- [x] Implement Hindi Intent Classifier recognizing 5 structured GovTech intents: `CHECK_STATUS`, `RESOLVE_CONFLICT`, `EXPLAIN_ERROR`, `DOCUMENT_QUERY`, and `APPLY_SCHEME`.
- [x] Implement empathetic spoken Hindi guidance generator with `[🔊 सुनिए]` audio cue dynamically reflecting draft health and blocking issues.
- [x] Expose voice API endpoints (`POST /v1/voice/transcribe`, `POST /v1/voice/intent`, `GET /v1/voice/guidance/{draft_id}`).
- [x] Build Flutter Voice Assistant Screen (`VoiceAssistantScreen`) with pulsing mic animation, editable transcript, preset Hindi query chips, and spoken guidance audio player.
- [x] Integrate voice entry points in Flutter onboarding (`welcome_screen.dart`) and draft review (`draft_summary_screen.dart`).
- [x] Pass all 4 unit tests in `test_hindi_voice.py`.

### Week 9 — Phase 8: Offline Resilience & DPDP Security (P1)
- [x] Build chunked resumable upload manager (`resilience_service.py`) supporting packet reordering, chunk validation, and seamless stitch finalization.
- [x] Implement client draft recovery checkpointing with cryptographic SHA-256 chaining.
- [x] Implement DPDP Act privacy engine (`privacy_service.py`): automatic 8-digit Aadhaar masking (`XXXX-XXXX-1234` / `XXXXXXXX1234`), phone masking, PII log scrubbing, and consent receipts.
- [x] Expose resilience & privacy API endpoints (`/v1/uploads/initiate`, `/v1/uploads/chunk`, `/v1/uploads/{id}/status`, `/v1/drafts/{id}/checkpoint`, `/v1/privacy/mask-aadhaar`).
- [x] Pass all 5 unit tests in `test_offline_resilience_and_dpdp.py`.

### Week 10 — Phase 9: System Integration & Evaluation (Core IP)
- [x] Build and pass all 4 Canonical End-to-End System Integration scenarios in `test_end_to_end_integration.py`:
  - **Scenario A (Happy Path):** Clean multi-document upload, automatic verification, DAG benefit tier evaluation, and verified draft generation.
  - **Scenario B (Material Contradiction):** Contradictory DOB blocked by hard gating ($422$), user resolves in side-by-side comparator, both evidence items preserved, draft succeeds.
  - **Scenario C (Low-Confidence Blur):** Blurred scan gated in `NEEDS_REVIEW` until user inspects and confirms, draft succeeds.
  - **Scenario D (Resumable Offline Recovery):** Interrupted chunked upload resumed, checkpoint restored, Aadhaar masked.
- [x] Implement quantitative benchmark evaluator (`benchmark_evaluator.py`) and pass all tests in `test_benchmarks.py`:
  - **False Acceptance Rate (FAR):** GramSathi $= 0.0\%$ vs Baseline $> 50\%$.
  - **Conflict Detection Recall & Precision:** GramSathi $= 100.0\%$ vs Baseline $= 0.0\%$.
  - **Selective DAG Revalidation Efficiency:** GramSathi skips $\ge 40\%$ of independent nodes on single field updates.
  - **Evidence Traceability:** $100\%$ of fields maintain cryptographic provenance links.

### Final — Phase 10: Patent Documentation & Packaging (Core IP)
- [ ] Assemble formal patent disclosure documentation detailing the 5 novel claims.
- [ ] Final package deployment instructions.
