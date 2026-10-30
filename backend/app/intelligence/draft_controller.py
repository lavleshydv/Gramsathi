"""Draft Generation Controller: Hard Gating ensuring unconfirmed or contradictory fields never silently enter the draft."""
from typing import Dict, Any, Tuple, List, Optional
from datetime import datetime, timezone
from app.models.domain import DraftRecord, FieldRecord, ConflictRecord, AuditRecord
from app.models.schemas import (
    FieldReliabilityState,
    ConflictSeverity,
    FinalDraftPackageResponse,
)
from app.rules.rule_engine import rule_engine
from app.intelligence.confidence_manager import confidence_manager


class DraftGatingException(Exception):
    """Raised when a hard gate prevents draft finalization."""
    pass


class DraftGenerationController:
    """Evaluates readiness and controls the formal gating of application drafts."""

    @staticmethod
    def can_use_in_draft(
        field: FieldRecord,
        active_conflict: Optional[ConflictRecord] = None,
        statutory_error: Optional[str] = None,
    ) -> Tuple[bool, Optional[str]]:
        """Field-level hard gating function. Returns (is_allowed, failure_reason)."""
        # 1. Reject if value is missing
        if field.candidate_value is None or str(field.candidate_value).strip() == "":
            return False, f"Field '{field.key}' is missing or empty."

        # 2. Reject if statutory rule failed
        if statutory_error:
            return False, f"Field '{field.key}' violates statutory requirement: {statutory_error}"

        # 3. Reject if unresolved blocking conflict
        if active_conflict and active_conflict.status == "UNRESOLVED":
            if active_conflict.severity == ConflictSeverity.BLOCKING_ERROR:
                return False, f"Field '{field.key}' has an unresolved material contradiction: {active_conflict.message_en}"
            elif active_conflict.severity == ConflictSeverity.WARNING and not field.user_confirmed:
                return False, f"Field '{field.key}' has an unconfirmed variation: {active_conflict.message_en}"

        # 4. Reject if low confidence without user confirmation
        if field.status == FieldReliabilityState.NEEDS_REVIEW and not field.user_confirmed:
            return False, f"Field '{field.key}' has low OCR confidence and requires explicit applicant confirmation."

        # 5. Passed all gates
        return True, None

    @classmethod
    def assess_draft_readiness(cls, draft: DraftRecord) -> Tuple[bool, List[str]]:
        """Evaluates whole draft against all statutory rules and multi-source conflict gates."""
        blocking_reasons: List[str] = []
        field_values = {k: f.candidate_value for k, f in draft.fields.items()}

        # 1. Statutory rule check
        issues = rule_engine.validate_fields(field_values)
        issue_map = {iss.field_key: iss.message_en for iss in issues if iss.severity == ConflictSeverity.BLOCKING_ERROR}

        # 2. Conflict lookup map
        conflict_map = {c.field_key: c for c in draft.conflicts if c.status == "UNRESOLVED"}

        # 3. Check every field against the hard gating function
        for key, field in draft.fields.items():
            conflict = conflict_map.get(key)
            statutory_err = issue_map.get(key)
            allowed, reason = cls.can_use_in_draft(field, conflict, statutory_err)
            if not allowed:
                blocking_reasons.append(reason)

        is_ready = len(blocking_reasons) == 0
        draft.is_ready_for_draft = is_ready
        draft.status = "READY" if is_ready else "IN_PROGRESS"
        return is_ready, blocking_reasons

    @classmethod
    def generate_final_draft_package(cls, draft: DraftRecord) -> FinalDraftPackageResponse:
        """Produces the finalized, verified application draft package or raises DraftGatingException."""
        is_ready, blocking_reasons = cls.assess_draft_readiness(draft)
        if not is_ready:
            raise DraftGatingException(
                f"Draft generation blocked by {len(blocking_reasons)} unresolved gate(s): {'; '.join(blocking_reasons)}"
            )

        # Assemble sanitized payload
        final_payload = {
            "applicant_name": draft.fields["full_name"].candidate_value,
            "dob": draft.fields["date_of_birth"].candidate_value,
            "annual_income_inr": draft.fields["annual_income"].candidate_value,
            "academic_percentage": draft.fields["marks_percentage"].candidate_value,
            "category": draft.fields["category"].candidate_value,
            "institution": draft.fields.get("institution_name", {}).candidate_value or "Not Specified",
            "statutory_scheme": draft.service_id,
        }

        # Assemble evidence manifest linking every field to supporting documents
        evidence_manifest: Dict[str, List[Dict[str, Any]]] = {}
        for key, field in draft.fields.items():
            evidence_manifest[key] = [
                {
                    "evidence_id": ev.evidence_id,
                    "document_id": ev.document_id,
                    "document_type": ev.document_type,
                    "raw_text": ev.raw_text,
                    "ocr_confidence": ev.ocr_confidence,
                    "page_number": ev.page_number,
                    "source_region": ev.source_region,
                }
                for ev in field.evidences
            ]

        # Audit event
        draft.audit_events.append(
            AuditRecord(
                draft_id=draft.draft_id,
                event_type="DRAFT_PACKAGE_GENERATED",
                payload={"verified_fields_count": len(final_payload)},
            )
        )
        draft.status = "FINAL_DRAFT_GENERATED"

        return FinalDraftPackageResponse(
            draft_id=draft.draft_id,
            service_id=draft.service_id,
            service_name_hi="पोस्ट-मैट्रिक राज्य छात्रवृत्ति योजना (Post-Matric State Scholarship)",
            rule_version=draft.rule_version,
            generated_at=datetime.now(timezone.utc),
            is_ready_for_portal=True,
            blocking_errors=[],
            application_payload=final_payload,
            evidence_manifest=evidence_manifest,
            audit_event_count=len(draft.audit_events),
        )


draft_controller = DraftGenerationController()
