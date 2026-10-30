# 📊 GramSathi AI — Project Phase Status & Progress Report

**Date:** 30 October 2026  
**Project:** GramSathi AI (ग्राम साथी)  
**Core Technical Innovation:** Evidence-Linked, Confidence-Gated Application Generation  
**Target Milestone:** Production-grade pilot of Post-Matric State Scholarship with Hindi Voice, OCR & Cross-Document Reconciliation  

---

## 🚦 Phase Completion Summary

| Phase | Title | Week | Status | Deliverables Achieved |
| :--- | :--- | :---: | :---: | :--- |
| **Phase 0** | **Research, Scope & Specification** | Week 1 | 🟢 **COMPLETED** | Target scholarship frozen, field-to-evidence matrix specified, synthetic test fixtures generated (Cases 1–5), API contract & architecture documented. |
| **Phase 1** | **Basic Application Workflow Without AI** | Week 2 | 🟢 **COMPLETED** | Complete manual workflow built across Flutter frontend + FastAPI backend. Draft creation, manual field saving, deterministic statutory validation, and draft summary review working end-to-end. Unit tests passing (6/6). |
| **Phase 2** | **Database & Document Store** | Week 3 | ⏳ **UP NEXT** | Decoupled evidence schema in PostgreSQL, private encrypted storage pipeline (S3/MinIO), SHA-256 upload validation, document purge & DPDP consent controls. |
| **Phase 3** | **OCR & Structured Field Extraction** | Week 4 | ⏸️ Pending | Pluggable OCR adapters (Tesseract/EasyOCR), coordinate bounding box mapping, OCR confidence recording, and review UI. |
| **Phase 4** | **Evidence Reconciliation Engine (Core IP)** | Week 5 | ⏸️ Pending | Multi-document matching, 5-tier conflict detection (`EXACT_MATCH`, `FORMAT_VARIATION`, `SPELLING_OR_TRANSLITERATION_VARIATION`, `MATERIAL_CONTRADICTION`, `UNREADABLE_OR_MISSING`), and immutable evidence preservation. |
| **Phase 5** | **Confidence-Gated Draft Generation (Core IP)**| Week 6 | ⏸️ Pending | Field Reliability State Machine ($\text{EXTRACTED} \rightarrow \text{EVIDENCE\_CHECK} \rightarrow \text{READY / NEEDS\_REVIEW / CONFLICTED} \rightarrow \text{USER\_CONFIRMED} \rightarrow \text{ELIGIBLE\_FOR\_DRAFT}$), and hard draft gating. |
| **Phase 6** | **Scheme Rules & Dependency DAG** | Week 7 | ⏸️ Pending | Versioned scheme config files and Directed Acyclic Graph (DAG) for selective revalidation on field updates. |
| **Phase 7** | **Hindi Voice Assistant** | Week 8 | ⏸️ Pending | Hands-free Hindi Speech-to-Text (STT), editable transcripts, and spoken audio guidance (`[🔊 सुनिए]`). |
| **Phase 8** | **Offline Resilience & DPDP Security** | Week 9 | ⏸️ Pending | Weak-network recovery, local checkpoints, masked Aadhaar storage, and audit log immutability. |
| **Phase 9/10**| **System Integration & Evaluation** | Week 10 | ⏸️ Pending | End-to-end integration test scenarios (A, B, C, D), baseline comparative benchmarks (FAR, Conflict Precision/Recall), and patent disclosure documentation. |

---

## 🔍 Detailed Breakdown of Completed Work

### 🟢 Phase 0: Research, Scope & Specification (Completed)
- **Target Scheme Frozen:** Post-Matric State Scholarship for SC/ST/OBC/EWS students.
- **Statutory Requirements Documented:** Required fields (`full_name`, `date_of_birth`, `annual_income`, `marks_percentage`, `category`, `institution_name`), annual income ceiling (₹2,50,000), and academic thresholds (50% minimum).
- **Field-to-Evidence Matrix:** Defined in [`demo-fixtures/synthetic-documents/field_evidence_matrix.json`](./demo-fixtures/synthetic-documents/field_evidence_matrix.json) mapping acceptable document sources (Aadhaar, Marksheet, Income Certificate) per canonical field.
- **Synthetic Ground-Truth Dataset:** 5 evaluation test cases created in `demo-fixtures/synthetic-documents/`:
  - `CASE_01_HAPPY_PATH.json`: Clean, perfectly matching records across all documents.
  - `CASE_02_NAME_VARIATION.json`: Spelling/initials mismatch (`Yash Sharma` vs `Yash S Sharma`).
  - `CASE_03_LOW_CONFIDENCE.json`: Degraded scan producing low OCR confidence (< 0.70) triggering `NEEDS_REVIEW`.
  - `CASE_04_CONTRADICTION.json`: Contradictory DOB (`15/08/2004` vs `12/04/2005`) hard-blocking draft generation.
  - `CASE_05_INCOME_CEILING.json`: Income exceeding statutory limit (₹3,20,000) triggering statutory ineligibility.

### 🟢 Phase 1: Basic Application Workflow Without AI (Completed)
- **FastAPI Backend (`backend/app/`):**
  - **Sessions & Draft Lifecycle:** `POST /v1/sessions`, `POST /v1/drafts`, `GET /v1/drafts/{id}`, `PATCH /v1/drafts/{id}/fields`, `GET /v1/drafts/{id}/summary`.
  - **Deterministic Scheme Validation:** `rule_engine.py` validates statutory limits without relying on probabilistic LLMs.
  - **Evidence Intelligence Foundation:** Models for decoupled evidence (`ExtractedField`, `FieldEvidence`, `FieldConflict`, `FieldConfirmation`), 5-tier conflict detector, and draft generation controller.
  - **Unit Test Suite:** 6 comprehensive unit tests passing with 0 warnings (`backend/tests/test_manual_workflow.py` and `backend/tests/test_reconciliation.py`).
- **Flutter Mobile Client (`mobile/`):**
  - **High Outdoor Contrast (WCAG AAA) Theme:** Kisan Green, Sarson Yellow, Panchayat Navy with large 48px+ touch targets (`mobile/lib/core/theme/app_theme.dart`).
  - **Onboarding Screen:** Mobile entry with DPDP Act consent tracking (`mobile/lib/features/onboarding/welcome_screen.dart`).
  - **Scheme Selection Screen:** Post-Matric Scholarship criteria overview (`mobile/lib/features/scheme_selection/scheme_selection_screen.dart`).
  - **Manual Entry & Validation Screen:** Full application form entry connected to FastAPI (`mobile/lib/features/application_draft/manual_entry_screen.dart`).
  - **Draft Summary Screen:** Displays draft eligibility badge, statutory validation issues, and confirmed fields (`mobile/lib/features/application_draft/draft_summary_screen.dart`).

---

## ⏭️ What the Next Phase Is: Phase 2 (Week 3)

### **Phase 2: Database & Document Management (P0)**
**Objective:** Transition from in-memory state to production-grade PostgreSQL storage and set up an encrypted private document repository.

#### Key Tasks for Phase 2:
1. **PostgreSQL Relational Schema Migration:**
   - Execute migrations for the decoupled 1:N schema: `application_drafts`, `documents`, `extracted_fields`, `field_evidence`, `field_conflicts`, `field_confirmations`, `audit_events`.
   - Update Prisma and SQLAlchemy migrations to persist multiple supporting documents per field.
2. **Private Encrypted Object Store Pipeline:**
   - Integrate S3/MinIO private bucket storage outside the public web root.
   - Enforce pre-signed temporary URLs (15-minute expiration) for review.
3. **Upload Integrity & Validation:**
   - Enforce file type (PDF, JPG, PNG) and file size (≤ 10MB) restrictions.
   - Compute and verify cryptographic SHA-256 hashes on upload to detect corrupted or duplicate files.
4. **Document Purge & Consent Management:**
   - Implement `DELETE /v1/drafts/{id}/documents/{document_id}` for hard cryptographic purging.
   - Unlink derived evidence records upon citizen deletion requests in compliance with India's DPDP Act, 2023.

---

## 📢 Team Update Message (Ready to Copy & Share)

*Copy the section below to send directly to your teammates:*

```markdown
Hey team! 👋 Here is a quick update on where we stand with GramSathi AI:

🚀 WHAT IS COMPLETED (Phases 0 & 1):
1. Phase 0 (Research, Scope & Specification) is 100% DONE:
   - Target scheme frozen: Post-Matric State Scholarship for SC/ST/OBC/EWS.
   - Full statutory requirements, field-to-evidence matrix, and API contracts are documented.
   - Synthetic document dataset created with 5 real-world evaluation scenarios (Clean Happy Path, Name/Initials Variation, Degraded/Low OCR Confidence, Material Contradiction on DOB, and Income Ceiling Exceeded).

2. Phase 1 (Basic Workflow Without AI) is 100% DONE:
   - FastAPI Backend is live with complete v1 endpoints for sessions, drafts, manual field updates, statutory validation, and draft readiness summary.
   - Core IP logic scaffolded: 1:N decoupled evidence data models, deterministic 5-tier conflict detector, and hard draft-generation gating.
   - All backend unit tests are passing (6/6).
   - Flutter Mobile App is scaffolded with high-contrast outdoor UI (WCAG AAA), DPDP consent onboarding, scheme selection, manual application entry, and draft review summary connected to the backend.

🎯 WHAT WE ARE WORKING ON NEXT (Phase 2):
- Database & Document Management: Setting up production PostgreSQL migrations for the decoupled evidence schema, configuring private encrypted storage (S3/MinIO), SHA-256 upload validation, and DPDP-compliant document purge controls.

Check out `PHASE_STATUS_REPORT.md` and `phases.md` in the repo for full details!
```

