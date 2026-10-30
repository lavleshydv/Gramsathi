# 📊 GramSathi AI — Project Phase Status & Progress Report

**Date:** 30 October 2026  
**Project:** GramSathi AI (ग्राम साथी)  
**Core Technical Innovation:** Evidence-Linked, Confidence-Gated Application Generation  
**Progress Status:** **4/10 Phases Completed (Phases 0, 1, 2, and 3 are 100% COMPLETE)**  

---

## 🚦 Phase Completion Summary

| Phase | Title | Week | Status | Deliverables Achieved |
| :--- | :--- | :---: | :---: | :--- |
| **Phase 0** | **Research, Scope & Specification** | Week 1 | 🟢 **COMPLETED** | Post-Matric Scholarship frozen, field-to-evidence matrix specified, synthetic test fixtures generated (Cases 1–5), API contract & architecture documented. |
| **Phase 1** | **Basic Application Workflow Without AI** | Week 2 | 🟢 **COMPLETED** | Manual draft creation, field persistence, deterministic validation check, and summary review working across Flutter and FastAPI backend. |
| **Phase 2** | **Database & Document Management** | Week 3 | 🟢 **COMPLETED** | Decoupled 1:N relational schema (`application_drafts`, `extracted_fields`, `field_evidence`), AES-256 encrypted private file store, SHA-256 upload verification, duplicate blocking, 15-min signed tokens, and DPDP-compliant cryptographic purge unlinking evidence. |
| **Phase 3** | **OCR & Structured Field Extraction** | Week 4 | 🟢 **COMPLETED** | Image preprocessor (blur detection, deskewing, Otsu binarization), pluggable OCR adapter architecture (Synthetic, Tesseract, EasyOCR), candidate field extraction with bounding boxes `[x, y, w, h]`, low-confidence gating (`NEEDS_REVIEW`), and Flutter OCR review screen. |
| **Phase 4** | **Evidence Reconciliation Engine (Core IP)** | Week 5 | ⏳ **UP NEXT** | Multi-document matching, deterministic 5-tier conflict detection (`EXACT_MATCH`, `FORMAT_VARIATION`, `SPELLING_OR_TRANSLITERATION_VARIATION`, `MATERIAL_CONTRADICTION`, `UNREADABLE_OR_MISSING`), and immutable evidence preservation. |
| **Phase 5** | **Confidence-Gated Draft Generation (Core IP)**| Week 6 | ⏸️ Pending | Field Reliability State Machine ($\text{EXTRACTED} \rightarrow \text{EVIDENCE\_CHECK} \rightarrow \text{READY / NEEDS\_REVIEW / CONFLICTED} \rightarrow \text{USER\_CONFIRMED} \rightarrow \text{ELIGIBLE\_FOR\_DRAFT}$), and hard draft gating. |
| **Phase 6** | **Scheme Rules & Dependency DAG** | Week 7 | ⏸️ Pending | Versioned scheme config files and Directed Acyclic Graph (DAG) for selective revalidation on field updates. |
| **Phase 7** | **Hindi Voice Assistant** | Week 8 | ⏸️ Pending | Hands-free Hindi Speech-to-Text (STT), editable transcripts, and spoken audio guidance (`[🔊 सुनिए]`). |
| **Phase 8** | **Offline Resilience & DPDP Security** | Week 9 | ⏸️ Pending | Weak-network recovery, local checkpoints, masked Aadhaar storage, and audit log immutability. |
| **Phase 9/10**| **System Integration & Evaluation** | Week 10 | ⏸️ Pending | End-to-end integration test scenarios (A, B, C, D), baseline comparative benchmarks (FAR, Conflict Precision/Recall), and patent disclosure documentation. |

---

## 🔍 Detailed Breakdown of Newly Completed Work

### 🟢 Phase 2: Database & Document Management (Completed)
1. **Relational Database Schema Decoupled (1:N Evidence Model):**
   - Implemented SQLAlchemy relational models in [`backend/app/database/models.py`](./backend/app/database/models.py):
     - `application_drafts`: Tracks draft state and readiness status.
     - `documents`: Stores document metadata, SHA-256 checksums, and encrypted storage paths.
     - `extracted_fields`: Canonical application fields (`full_name`, `date_of_birth`, `annual_income`, etc.).
     - `field_evidence`: **Decoupled 1:N evidence records** storing source document ID, raw text, page number, bounding box coordinates, and extraction engine.
     - `field_conflicts`, `field_confirmations`, and `audit_events`.
   - Setup synchronous and async engine support in [`backend/app/database/connection.py`](./backend/app/database/connection.py).
2. **Private Encrypted Document Storage Pipeline:**
   - Implemented in [`backend/app/services/document_service.py`](./backend/app/services/document_service.py):
     - File format & MIME validation: Strict magic-byte inspection accepting only PDF, JPG, and PNG.
     - Enforces maximum 10MB statutory upload limit.
     - **Cryptographic SHA-256 Checksums:** Calculated on upload; duplicate documents within a draft are automatically rejected.
     - **AES-256 File Encryption:** Documents are encrypted at rest with Fernet symmetric keys outside public web roots.
     - **Expiring Signed Tokens:** 15-minute temporary access tokens generated for authorized document viewing (`GET /v1/documents/{id}/view`).
     - **DPDP-Compliant Cryptographic Purge:** `DELETE /v1/drafts/{id}/documents/{id}` overwrites physical bytes with zeros, deletes the file, unlinks all derived evidence records, and invalidates active tokens.

### 🟢 Phase 3: OCR & Structured Field Extraction (Completed)
1. **Image Preprocessing Pipeline:**
   - Implemented in [`backend/app/services/image_preprocessor.py`](./backend/app/services/image_preprocessor.py):
     - **Quality & Blur Assessment:** Uses OpenCV Laplacian variance ($< 100.0$) to detect blurry/degraded scans.
     - **Deskew Angle Correction:** Calculates text angle via foreground pixel minimum area bounding box and applies affine warp rotation.
     - **Illumination Correction & Binarization:** Applies morphological background estimation and Otsu adaptive thresholding for faded government stamps.
2. **Pluggable OCR Adapter Architecture:**
   - Implemented in [`backend/app/services/ocr_adapters.py`](./backend/app/services/ocr_adapters.py):
     - `BaseOCRAdapter`: Abstract extraction interface.
     - `SyntheticFixtureOCRAdapter`: Extracts high-precision ground truth from `demo-fixtures/`.
     - `TesseractOCRAdapter` & `EasyOCRAdapter`: Swappable engine adapters.
   - Orchestrated in [`backend/app/services/ocr_service.py`](./backend/app/services/ocr_service.py):
     - Penalizes confidence priors on blurry uploads.
     - Extracts candidate fields with coordinate bounding boxes (`[x, y, w, h]`), OCR confidence, and page number.
     - Automatically flags low-confidence glyphs (`?`, confidence $< 0.70$) into `NEEDS_REVIEW`.
3. **Flutter OCR Upload & Review Interface:**
   - [`DocumentUploadScreen`](./mobile/lib/features/document_upload/document_upload_screen.dart): Upload status for Aadhaar, Marksheet, and Income Certificate with SHA-256 integrity tags.
   - [`FieldReviewScreen`](./mobile/lib/features/field_review/field_review_screen.dart): Interactive UI showing extracted candidate values, source document badge, coordinate bounding boxes (`[X: 120, Y: 210, W: 240, H: 35]`), visual confidence indicators (High vs Needs Review), and in-place applicant confirmation.
4. **Automated Test Suite (16/16 Tests Passing):**
   - [`backend/tests/test_database.py`](./backend/tests/test_database.py): Relational 1:N decoupled evidence schema & audit trails.
   - [`backend/tests/test_document_storage.py`](./backend/tests/test_document_storage.py): SHA-256 hashing, duplicate rejection, encryption at rest, token decryption, and DPDP hard purge.
   - [`backend/tests/test_ocr_pipeline.py`](./backend/tests/test_ocr_pipeline.py): Image blur assessment, deskewing, pluggable adapter bounding boxes, and low-confidence uncertainty handling.
   - [`backend/tests/test_manual_workflow.py`](./backend/tests/test_manual_workflow.py) & [`backend/tests/test_reconciliation.py`](./backend/tests/test_reconciliation.py): Phase 1 & 4 workflow tests.

---

## ⏭️ What the Next Phase Is: Phase 4 (Week 5)

### **Phase 4: Evidence Reconciliation Engine (Core Innovation)**
**Objective:** Cross-document evidence alignment, multi-source attribute matching, and deterministic 5-tier conflict classification.

#### Key Tasks for Phase 4:
1. **Field Provenance Manager:** Deepen multi-document provenance graph linking fields across 3+ simultaneous documents.
2. **Deterministic Conflict Classifier Integration:**
   - Detect and classify differences across the 5 statutory tiers:
     1. `EXACT_MATCH`: Complete equivalence across supporting documents.
     2. `FORMAT_VARIATION`: Date separators (`/` vs `-`) or currency symbols (`₹` vs `Rs`).
     3. `SPELLING_OR_TRANSLITERATION_VARIATION`: Initials and minor phonetic variations (`Yash Sharma` vs `Yash S Sharma`) triggering non-blocking warnings.
     4. `MATERIAL_CONTRADICTION`: Conflicting statutory values (e.g. differing DOBs) triggering hard blocking errors.
     5. `UNREADABLE_OR_MISSING`: Unresolvable glyphs or missing documents.
3. **Flutter Conflict Resolution Screen:**
   - Build side-by-side multi-document evidence comparator showing conflicting source documents and bounding boxes, prompting the applicant to select or type the authoritative value.

---

## 📢 Team Update Message (Ready to Copy & Share)

*Copy the section below to send directly to your teammates:*

```markdown
Hey team! 👋 Huge milestone reached for GramSathi AI — Phases 0, 1, 2, and 3 are now 100% COMPLETE:

🚀 WHAT IS COMPLETED SO FAR:
1. Phase 0 (Research & Specification):
   - Target scheme frozen (Post-Matric State Scholarship), field-to-evidence matrix defined, and 5 synthetic evaluation datasets created.
2. Phase 1 (Basic Workflow Without AI):
   - FastAPI backend endpoints (sessions, drafts, manual entry, deterministic rule validation, draft summary) + Flutter mobile screens working end-to-end.
3. Phase 2 (Database & Document Management):
   - Decoupled 1:N relational schema in SQLAlchemy/Postgres separating fields from evidence records.
   - Private AES-256 encrypted object storage outside web roots.
   - File size/MIME validation with SHA-256 duplicate detection.
   - 15-minute temporary signed access tokens for document inspection.
   - DPDP-compliant cryptographic hard purge (`DELETE /v1/drafts/{id}/documents/{id}`) that zeroes out files and unlinks derived evidence.
4. Phase 3 (OCR & Structured Field Extraction):
   - Image preprocessor with OpenCV Laplacian blur detection, text deskewing, and Otsu binarization.
   - Pluggable OCR adapter architecture (Synthetic, Tesseract, EasyOCR).
   - Candidate extraction preserving coordinate bounding boxes [x, y, w, h], OCR confidence, and page numbers.
   - Automatic low-confidence gating (< 0.70) into `NEEDS_REVIEW`.
   - Flutter Document Upload & OCR Review UI with visual confidence indicators.
5. Automated Tests:
   - All 16 unit tests across DB, Storage, OCR, Manual Flow, and Reconciliation pass in 0.18s!

🎯 WHAT WE ARE WORKING ON NEXT (Phase 4):
- Core Evidence Reconciliation Engine: Cross-document field matching, 5-tier conflict classification (Exact Match, Format Variation, Spelling/Initials, Material Contradiction, Unreadable), and Flutter side-by-side evidence comparator screen.

Check out `PHASE_STATUS_REPORT.md` and `phases.md` in the repo for full details!
```
