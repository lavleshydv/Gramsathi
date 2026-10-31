# 📦 GramSathi AI — Production Packaging & Deployment Guide

**Version:** 1.0.0-RELEASE  
**Architecture:** Evidence-Linked, Confidence-Gated Application Generation  
**Target Environments:** Rural Panchayat Kiosks, Citizen Mobile Web, District Administration Edge Nodes  
**Date:** 31 October 2026  

---

## 1. SYSTEM ARCHITECTURE & COMPONENTS

The GramSathi AI system consists of three decoupled operational tiers:

```
[ Citizen Voice / Mobile Client (Flutter) ]
                  │
                  ▼ (HTTPS / WSS / REST v1)
[ FastAPI Evidence Intelligence Engine ]
  ├── Input Processing: Whisper/Vosk Hindi STT + OpenCV Deskew + Otsu Binarization + Tesseract/EasyOCR
  ├── Core Innovation: Provenance Manager + 5-Tier Conflict Engine + Reliability State Machine
  └── Rules & DAG: NetworkX Statutory Acyclic Graph + Conditional Benefit Evaluator
                  │
                  ▼
[ Private Security & Persistence Layer ]
  ├── PostgreSQL (Decoupled 1:N Drafts, Fields, Evidence, and Audit Events)
  ├── AES-256 Encrypted Private Document Vault
  └── DPDP Privacy & Masking Interceptor (8-digit Aadhaar & Phone Masking)
```

---

## 2. PRODUCTION DIRECTORY STRUCTURE

```text
GramSathi/
├── backend/
│   ├── app/
│   │   ├── api/             # REST Endpoints (sessions, drafts, documents, evidence, voice, resilience, validation)
│   │   ├── database/        # In-memory store & PostgreSQL SQLAlchemy models
│   │   ├── evaluation/      # Benchmark evaluator & FAR metrics
│   │   ├── intelligence/    # Provenance manager, 5-tier conflict detector, confidence tensor, draft controller
│   │   ├── models/          # Domain entities & Pydantic v1 schemas
│   │   ├── rules/           # NetworkX DAG dependency manager, scheme configs v2.0.0
│   │   ├── services/        # Preprocessor, OCR adapters, speech service, privacy service, resilience service
│   │   └── main.py          # FastAPI application entrypoint
│   ├── storage/             # AES-256 encrypted private document vault
│   └── tests/               # 12 Automated test suites (46+ unit & regression tests)
├── mobile/                  # Flutter Client
│   ├── lib/
│   │   ├── core/            # API constants & high-contrast GovTech themes
│   │   ├── features/        # Onboarding, schemes, documents, OCR review, conflict resolution, draft summary, voice assistant
│   │   └── services/        # Resilient HTTP ApiClient with checkpoint recovery
├── demo-fixtures/           # Synthetic test documents (Cases 1–5: clean, blurry, conflicting, ceiling breach)
├── docs/                    # Technical architecture, patent disclosure, API contracts
├── phases.md                # 10-Week Milestone Tracker (10/10 Phases Complete)
└── PHASE_STATUS_REPORT.md   # Executive Progress Report & Verification Matrix
```

---

## 3. CONTAINERIZATION SPECIFICATION (Docker & Compose)

### 3.1 Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM python:3.13-slim

WORKDIR /app

# System dependencies for OpenCV, Tesseract OCR, and audio processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-hin \
    libgl1 \
    libglib2.0-0 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONPATH=/app
ENV STORAGE_ENCRYPTION_KEY=""

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 3.2 Multi-Service `docker-compose.yml`
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: gramsathi-backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://gramsathi:secure_pass@postgres:5432/gramsathi_db
      - STORAGE_ENCRYPTION_KEY=dGhpcy1pcy1hLXNhbXBsZS1mZXJuZXQta2V5LTMyei0=
      - TESSERACT_CMD=/usr/bin/tesseract
    volumes:
      - encrypted_vault:/app/storage/private_encrypted_documents
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: gramsathi-db
    environment:
      POSTGRES_DB: gramsathi_db
      POSTGRES_USER: gramsathi
      POSTGRES_PASSWORD: secure_pass
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  encrypted_vault:
  pgdata:
```

---

## 4. HARDWARE SPECIFICATIONS FOR RURAL KIOSK DEPLOYMENT

| Component | Minimum Specification (Rural CSC / Kiosk) | Recommended Production Specification |
| :--- | :--- | :--- |
| **Processor** | Intel Core i3 / AMD Ryzen 3 (Quad Core) | Intel Xeon / AMD EPYC (8+ Cores) |
| **RAM** | 8 GB DDR4 | 32 GB DDR4 / DDR5 |
| **Storage** | 256 GB NVMe SSD | 1 TB Enterprise SSD (RAID 1) |
| **Connectivity** | Intermittent 2G/3G (Supported via Chunked Resumable Uploads) | 100 Mbps Broadband / 4G Fallback |
| **Audio** | USB Omnidirectional Microphone + Speaker Pill | Integrated Kiosk Array Microphone |
| **Scanner / Camera** | 8 MP Flatbed Scanner / Mobile Camera (300 DPI) | Document Autofeed Scanner (300–600 DPI) |

---

## 5. API ENDPOINTS DIRECTORY (v1 CONTRACT)

| Method | Endpoint | Description | Phase |
| :--- | :--- | :--- | :---: |
| `POST` | `/v1/sessions` | Create session with DPDP consent | Phase 1 |
| `POST` | `/v1/drafts` | Create application draft | Phase 1 |
| `PATCH`| `/v1/drafts/{id}/fields` | Update manual field values | Phase 1 |
| `POST` | `/v1/drafts/{id}/validate` | Run deterministic rules validation | Phase 1 |
| `GET`  | `/v1/drafts/{id}/summary` | Retrieve full draft summary | Phase 1 |
| `POST` | `/v1/drafts/{id}/documents` | Upload & AES-256 encrypt document | Phase 2 |
| `DELETE`| `/v1/drafts/{id}/documents/{doc_id}` | Cryptographically purge document under DPDP | Phase 2 |
| `POST` | `/v1/documents/{id}/extract` | Run OCR & bounding box extraction | Phase 3 |
| `POST` | `/v1/drafts/{id}/reconcile` | Run 5-tier cross-document conflict detector | Phase 4 |
| `POST` | `/v1/drafts/{id}/fields/{field_id}/confirm` | User resolves conflict; preserves evidence | Phase 4 |
| `POST` | `/v1/drafts/{id}/generate` | Hard gating draft package generator | Phase 5 |
| `POST` | `/v1/drafts/{id}/dag-revalidate` | Selective NetworkX DAG revalidation | Phase 6 |
| `POST` | `/v1/voice/transcribe` | Hindi speech-to-text with editable transcript | Phase 7 |
| `POST` | `/v1/voice/intent` | GovTech intent classifier & Hindi guidance | Phase 7 |
| `GET`  | `/v1/voice/guidance/{draft_id}` | Real-time oral Hindi guidance `[🔊 सुनिए]` | Phase 7 |
| `POST` | `/v1/uploads/initiate` | Initiate chunked resumable upload session | Phase 8 |
| `POST` | `/v1/uploads/chunk` | Upload individual file chunk with SHA-256 | Phase 8 |
| `GET`  | `/v1/uploads/{id}/status` | Check received vs missing chunk indices | Phase 8 |
| `POST` | `/v1/drafts/{id}/checkpoint` | Save tamper-evident hash-chained snapshot | Phase 8 |
| `POST` | `/v1/privacy/mask-aadhaar` | Redact first 8 digits of Aadhaar | Phase 8 |

---

## 6. VERIFICATION PROCEDURE

To verify the complete package on any host:
```bash
# Set PYTHONPATH
export PYTHONPATH="$(pwd)/backend"

# Execute all test suites
python -m unittest discover -s backend/tests -p "test_*.py" -v
```
All 46+ tests across 12 test suites must pass in $< 0.3$ seconds with 0 errors.

