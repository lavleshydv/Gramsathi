# ⚙️ GramSathi AI — Backend Architecture & Service Structure

This directory contains the FastAPI backend, the **Evidence Intelligence Engine**, and scheme validation layers.

## Directory Structure & Architectural Purpose

```plaintext
backend/
├── app/
│   ├── main.py              # Application lifecycle & middleware config
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
│   │   ├── ocr_service.py   # Swappable OCR adapter (Tesseract / EasyOCR)
│   │   ├── speech_service.py# Hindi STT & audio guidance adapter
│   │   ├── document_service.py # Private object store & SHA-256 checks
│   │   └── draft_service.py # Draft orchestration controller
│   │
│   ├── intelligence/        # THE CORE INNOVATION LAYER (PATENTABLE IP)
│   │   ├── field_mapper.py  # Maps document attributes to canonical keys
│   │   ├── provenance_manager.py # Immutable 1:N evidence tracking
│   │   ├── field_matcher.py # Multi-document field alignment
│   │   ├── conflict_detector.py # Deterministic 5-tier conflict classifier
│   │   ├── confidence_manager.py # Field reliability state machine
│   │   └── draft_controller.py   # Confidence-gated draft generator
│   │
│   ├── rules/               # Statutory validation engine
│   │   ├── rule_engine.py   # Deterministic predicate evaluator
│   │   ├── dependency_manager.py # Dependency Graph (DAG) for dirty-check revalidation
│   │   └── scheme_configs/  # Versioned JSON scheme policies
│   │
│   ├── models/              # Domain entities & Pydantic DTOs
│   ├── database/            # SQLAlchemy async session & connection pool
│   ├── security/            # Encryption, session tokens & DPDP audit logging
│   └── utils/               # String normalization & Indic transliteration helpers
│
├── tests/                   # Quantitative test & evaluation suite
│   ├── test_ocr.py
│   ├── test_evidence.py
│   ├── test_reconciliation.py
│   ├── test_confidence.py
│   ├── test_validation.py
│   └── test_draft_generation.py
│
└── requirements.txt         # Pinned backend dependencies
```
