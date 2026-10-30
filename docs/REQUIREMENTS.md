# 📋 GramSathi AI — Software Requirements Specification (SRS) & System Prerequisites

**Document Version:** 2.0.0  
**Project:** GramSathi AI (ग्राम साथी)  
**Core Technical Innovation:** Evidence-Linked, Confidence-Gated Application Generation  
**Classification:** Voice-First Government Application Preparation & Evidence Reconciliation Platform  

---

## 1. System & Runtime Prerequisites

### 1.1 Hardware Specifications
- **Development / Evaluation Server:** Minimum 4 vCPU, 8 GB RAM, 25 GB SSD storage (supports local OCR & text processing).
- **Client Mobile Device:** Android 9.0+ / iOS 14+, Minimum 2 GB RAM, Camera sensor, Microphone, Touchscreen (minimum 48x48px touch targets).

### 1.2 Software & Runtimes
- **Backend Runtime:** Python 3.10+ / 3.11 (FastAPI, SQLAlchemy Async, Pydantic v2).
- **Mobile Runtime:** Flutter 3.19+ / Dart 3.3+.
- **Database:** PostgreSQL 15+ (Relational data, audit trails, and versioned rule storage).
- **OCR Engine:** Tesseract 5.x / EasyOCR (interfaced via swappable service adapters).
- **Speech Processing:** Web Speech / Indic STT service adapter with fallback text transcript editor.

---

## 2. Functional Requirements (FR)

### FR-1: Session & Consent Management
- **FR-1.1:** The system shall establish an authenticated, encrypted user session for each application attempt.
- **FR-1.2:** The system must record explicit citizen consent detailing the purpose of document processing under the DPDP Act.
- **FR-1.3:** The platform shall never store raw, unmasked 12-digit Aadhaar numbers.

### FR-2: Document Management & Private Storage
- **FR-2.1:** The system shall accept PDF, JPEG, and PNG document uploads with strict MIME-type and size validation (maximum 10 MB per file).
- **FR-2.2:** Uploaded files must be stored outside public web access using private, cryptographically generated storage identifiers.
- **FR-2.3:** The system must compute and store a SHA-256 hash for every uploaded document for integrity verification.
- **FR-2.4:** The platform must provide an explicit hard-purge capability to delete documents and derived evidence upon user request.

### FR-3: OCR & Field Provenance Extraction
- **FR-3.1:** The system shall extract text candidates from uploaded documents via pluggable OCR adapters.
- **FR-3.2:** For every extracted candidate, the system must create an immutable `FieldEvidence` record containing:
  - Source document ID
  - Page number
  - Bounding box coordinates (`x, y, width, height`)
  - Raw extracted text and normalized value
  - OCR engine name and extraction confidence score ($\mathcal{C}_{ocr}$)

### FR-4: Cross-Document Evidence Reconciliation & Conflict Detection
- **FR-4.1:** The system shall match corresponding fields across distinct documents (e.g., matching name across Aadhaar, Marksheet, and Income Certificate).
- **FR-4.2:** The system must deterministically classify evidence comparisons into:
  - `EXACT_MATCH`: Complete normalized string equivalence.
  - `FORMAT_VARIATION`: Non-substantive date, case, or punctuation differences.
  - `SPELLING_OR_TRANSLITERATION_VARIATION`: Minor edit distance or Indic transliteration variations requiring user confirmation.
  - `MATERIAL_CONTRADICTION`: Conflicting dates, distinct names, or differing monetary figures.
- **FR-4.3:** The system must record detected conflicts as distinct entities and preserve all conflicting evidence trails intact.

### FR-5: Confidence Management & Gated Draft Generation
- **FR-5.1:** The system shall track field reliability across a formal state machine (`EXTRACTED`, `NEEDS_REVIEW`, `CONFLICTED`, `USER_CONFIRMED`, `USER_CORRECTED`, `ELIGIBLE_FOR_DRAFT`).
- **FR-5.2:** No field in `CONFLICTED`, `NEEDS_REVIEW`, or `MISSING` state shall be permitted to enter the final application draft.
- **FR-5.3:** The draft generation controller must generate a verified, editable draft summary with an auditable readiness score only when all mandatory fields are in the `ELIGIBLE_FOR_DRAFT` state.

### FR-6: Scheme-Specific Rules & Dependency-Aware Validation
- **FR-6.1:** Scheme eligibility rules shall be defined in versioned JSON configuration schemas.
- **FR-6.2:** The system shall evaluate statutory rules including income ceilings, minimum mark percentages, category quotas, and required document sets.
- **FR-6.3:** The system must maintain a dependency graph (DAG) to mark dependent checks dirty and re-evaluate only affected rules upon field mutation.

### FR-7: Hindi Voice Assistant & Accessibility
- **FR-7.1:** The mobile client shall support hands-free Hindi speech input with an editable transcript interface.
- **FR-7.2:** The system shall provide spoken audio explanations (`[🔊 सुनिए]`) of required documents, eligibility rules, and detected inconsistencies.

---

## 3. Non-Functional Requirements (NFR)

### NFR-1: Determinism & Auditability
- **NFR-1.1:** Official scheme eligibility decisions must be 100% deterministic and auditable. Generative AI / LLMs must not make legal eligibility rulings.
- **NFR-1.2:** Every user override or field confirmation must be recorded in an immutable audit log with actor ID, timestamp, prior value, and new value.

### NFR-2: Low-Bandwidth & Network Interruption Resilience
- **NFR-2.1:** Mobile client initial payload must not exceed 15 MB.
- **NFR-2.2:** Uploads interrupted by poor rural connectivity must be resumable without restarting the workflow or duplicating backend processing.
- **NFR-2.3:** Local draft checkpoints must persist on the device so offline users can review progress before reconnection.

### NFR-3: High Outdoor Contrast & Touch Ergonomics (WCAG AAA)
- **NFR-3.1:** All interactive UI buttons and tap targets must have a minimum dimension of **48x48 pixels**.
- **NFR-3.2:** Color contrast ratios must exceed **7:1** against backgrounds for outdoor visibility under direct midday sunlight.

---

## 4. Backend Dependencies Specification (`backend/requirements.txt`)

```text
# Core Web Framework & ASGI
fastapi==0.115.4
uvicorn[standard]==0.32.0
pydantic==2.9.2
pydantic-settings==2.6.1

# Database & ORM
sqlalchemy[asyncio]==2.0.36
asyncpg==0.30.0
alembic==1.13.3
psycopg2-binary==2.9.10

# Object Storage & Private File Handling
aiofiles==24.1.0
python-multipart==0.0.17
cryptography==43.0.3

# Document Processing & OCR Layer (Swappable Adapters)
pytesseract==0.3.13
easyocr==1.7.2
pdf2image==1.17.0
PyPDF2==3.0.1
Pillow==11.0.0
opencv-python-headless==4.10.0.84

# Text Normalization & Fuzzy Reconciliation
rapidfuzz==3.10.1
jellyfish==1.1.0
indic-nlp-library==0.92

# Dependency Graph & Validation
networkx==3.4.2

# Speech & Voice Interface Adapter
soundfile==0.12.1
numpy==1.26.4

# Testing & Quality Assurance
pytest==8.3.3
pytest-asyncio==0.24.0
pytest-cov==6.0.0
httpx==0.27.2
faker==30.8.2
```
