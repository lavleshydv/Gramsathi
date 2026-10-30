"""Draft Orchestrator: High-level operations on application drafts."""
from typing import Dict, Any, Optional
from app.database.store import store
from app.models.domain import DraftRecord, AuditRecord
from app.models.schemas import DraftSummaryResponse, ExtractedFieldSummary, EvidenceItem, ConflictItem, ValidationIssueItem
from app.intelligence.draft_controller import draft_controller
from app.rules.rule_engine import rule_engine


class DraftService:
    @staticmethod
    def get_summary(draft: DraftRecord) -> DraftSummaryResponse:
        is_ready, blocking_reasons = draft_controller.assess_draft_readiness(draft)

        field_summaries: Dict[str, ExtractedFieldSummary] = {}
        for key, field in draft.fields.items():
            ev_items = [
                EvidenceItem(
                    evidence_id=ev.evidence_id,
                    document_id=ev.document_id,
                    document_type=ev.document_type,
                    page_number=ev.page_number,
                    source_region=ev.source_region,
                    ocr_confidence=ev.ocr_confidence,
                    raw_text=ev.raw_text,
                )
                for ev in field.evidences
            ]
            field_summaries[key] = ExtractedFieldSummary(
                field_id=field.field_id,
                field_key=field.key,
                display_name_hi=field.display_name_hi,
                display_name_en=field.display_name_en,
                candidate_value=field.candidate_value,
                status=field.status,
                requires_user_confirmation=field.requires_user_confirmation,
                ocr_confidence=ev_items[0].ocr_confidence if ev_items else None,
                evidences=ev_items,
            )

        conflict_items = [
            ConflictItem(
                conflict_id=c.conflict_id,
                field_key=c.field_key,
                conflict_type=c.conflict_type,
                severity=c.severity,
                status=c.status,
                message_hi=c.message_hi,
                message_en=c.message_en,
                evidence_ids=c.evidence_ids,
                conflicting_values=c.conflicting_values,
            )
            for c in draft.conflicts
        ]

        field_values = {k: f.candidate_value for k, f in draft.fields.items()}
        validation_issues = rule_engine.validate_fields(field_values)

        return DraftSummaryResponse(
            draft_id=draft.draft_id,
            service_id=draft.service_id,
            service_name_hi="पोस्ट-मैट्रिक राज्य छात्रवृत्ति योजना (Post-Matric State Scholarship)",
            status=draft.status,
            is_ready_for_draft=is_ready,
            fields=field_values,
            field_states=field_summaries,
            conflicts=conflict_items,
            validation_issues=validation_issues,
            audit_trail_count=len(draft.audit_events),
        )


draft_service = DraftService()

