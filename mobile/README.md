# 📱 GramSathi AI — Flutter Mobile Client Architecture

This directory contains the cross-platform Flutter application providing the voice-first, high-contrast, offline-resilient user interface for GramSathi AI.

## Architectural Principles
1. **High Outdoor Contrast (WCAG AAA)**: Large 48x48px touch targets and high-visibility tokens (Kisan Green, Sarson Yellow, Navy) optimized for direct sunlight.
2. **Audio-Guided Interaction**: Spoken Hindi instructions accompanying every review card, conflict prompt, and required document checklist.
3. **Resilient Local Draft Persistence**: Local state checkpoints ensuring poor rural connectivity does not lose applicant progress.

## Directory Structure & Feature Layout

```plaintext
mobile/
└── lib/
    ├── features/
    │   ├── onboarding/          # Welcome screen, DPDP consent & language toggle
    │   ├── voice_assistant/     # Hindi microphone interface & transcript editor
    │   ├── scheme_selection/    # Target scholarship card & requirements overview
    │   ├── document_upload/     # Camera snap & document file picker with progress
    │   ├── field_review/        # Extracted values, OCR confidence & bounding box view
    │   ├── conflict_resolution/ # Side-by-side multi-document evidence comparator
    │   ├── application_draft/   # Final editable draft summary & portal handoff
    │   └── profile/             # Basic demographic context
    │
    ├── core/
    │   ├── theme/               # High-contrast color tokens & typography (Noto Sans Devanagari)
    │   ├── constants/           # API endpoints & asset paths
    │   └── errors/              # User-friendly Hindi error message mappings
    │
    └── services/
        ├── api_client.dart      # HTTP REST client communicating with FastAPI
        ├── speech_service.dart  # Native microphone & speech-to-text bridge
        └── storage_service.dart # Local secure offline checkpoint storage
```
