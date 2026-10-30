# ⚙️ GramSathi AI — Backend Architecture & Service Structure

FastAPI backend, the **Evidence Intelligence Engine**, and scheme validation layers.

## Directory Structure & Architectural Purpose

```plaintext
backend/
├── app/
│   ├── main.py              # Application lifecycle, CORS & API routers
│   │
│   ├── api/                 # REST API endpoints (v1)
│   │   ├── sessions.py      # Session creation & DPDP consent tracking
│   │   ├── drafts.py        # Draft CRUD & readiness inspection
│   │   ├── documents.py     # Document upload & private reference storage
│   │   ├── evidence.py      # Field evidence retrieval
│   │   ├── reconciliation.py# Cross-document conflict detection endpoints
│   │   └── validation.py    # Scheme rule validation endpoints
│   │
│   ├── services/            # System adapters & external service wrappers
│   │   ├── ocr_service.py   # Swappable OCR adapter (Tesseract / EasyOCR / Fixtures)
│   │   ├── document_service.py # Private object store & SHA-256 checks
│   │   └── draft_service.py # Draft orchestration controller
│   │
│   ├── intelligence/        # THE CORE INNOVATION LAYER (PATENTABLE IP)
│   │   ├── field_mapper.py  # Maps document attributes to canonical keys
│   │   ├── provenance_manager.py # Immutable 1:N evidence tracking
│   │   ├── conflict_detector.py # Deterministic 5-tier conflict classifier
│   │   ├── confidence_manager.py # Field reliability state machine
│   │   └── draft_controller.py   # Confidence-gated draft generator
│   │
│   ├── rules/               # Statutory validation engine
│   │   ├── rule_engine.py   # Deterministic predicate evaluator
│   │   ├── dependency_manager.py # Dependency Graph (DAG) for dirty-check revalidation
│   │   └── scheme_configs/  # Versioned JSON scheme policies (post_matric_scholarship.json)
│   │
│   ├── models/              # Domain entities & Pydantic DTOs
│   │   ├── domain.py        # Domain entities (Draft, Field, Evidence, Conflict, Audit)
│   │   └── schemas.py       # Pydantic v2 schemas
│   │
│   └── database/            # Store & repository access
│       └── store.py         # Thread-safe in-memory store & repository adapter
│
├── tests/                   # Quantitative test & evaluation suite
│   ├── test_manual_workflow.py # Phase 1 test: manual entry, validation, gating
│   └── test_reconciliation.py  # Phase 4 test: conflict classification
│
└── requirements.txt         # Pinned backend dependencies
```

## Running the Backend

```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Running the Test Suite

```bash
cd backend
python -m unittest discover -s tests -p "test_*.py" -v
```
