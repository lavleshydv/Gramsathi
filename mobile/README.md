# 📱 GramSathi AI — Flutter Mobile Client

Cross-platform Flutter application providing the voice-first, high-contrast, offline-resilient user interface for GramSathi AI.

## Architectural Principles
1. **High Outdoor Contrast (WCAG AAA)**: Large 48x48px touch targets and high-visibility tokens (Kisan Green, Sarson Yellow, Navy) optimized for direct sunlight.
2. **Audio-Guided Interaction**: Spoken Hindi instructions accompanying review cards, conflict prompts, and required document checklists.
3. **Resilient Local Draft Persistence**: Local state checkpoints ensuring poor rural connectivity does not lose applicant progress.

## Implemented Directory Structure & Feature Layout

```plaintext
mobile/
├── pubspec.yaml
└── lib/
    ├── main.dart
    ├── core/
    │   ├── theme/
    │   │   └── app_theme.dart               # High-contrast color tokens & typography
    │   ├── constants/
    │   │   └── api_constants.dart           # API endpoints & routes
    │   └── errors/
    │
    ├── services/
    │   └── api_client.dart                  # HTTP REST client communicating with FastAPI
    │
    └── features/
        ├── onboarding/
        │   └── welcome_screen.dart          # Welcome screen, DPDP consent & language toggle
        ├── scheme_selection/
        │   └── scheme_selection_screen.dart # Target scholarship card & requirements overview
        └── application_draft/
            ├── manual_entry_screen.dart     # Phase 1 manual field entry & validation flow
            └── draft_summary_screen.dart    # Final editable draft summary & portal handoff
```

## Running the Flutter Mobile Client

```bash
cd mobile
flutter pub get
flutter run
```
