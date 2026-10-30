"""Draft Generation Controller: Hard gating ensuring only fully reconciled & verified fields form a valid draft."""
from typing import Dict, Any, Tuple, List
from app.models.domain import DraftRecord
from app.models.schemas import FieldReliabilityState, ConflictSeverity
from app.rules.rule_engine import rule_engine


class DraftGenerationController:
    """Evaluates readiness of an entire application draft."""

    @staticmethod
    def assess_draft_readiness(draft: DraftRecord) -> Tuple[bool, List[str]]:
        blocking_reasons: List[str] = []

        # 1. Check all required fields have values
        field_values = {k: f.candidate_value for k, f in draft.fields.items()}
        for req_field in ["full_name", "date_of_birth", "annual_income", "marks_percentage", "category"]:
            val = field_values.get(req_field)
            if val is None or str(val).strip() == "":
                blocking_reasons.append(f"Mandatory field '{req_field}' has not been filled.")

        # 2. Check for unresolved blocking conflicts
        for conflict in draft.conflicts:
            if conflict.status == "UNRESOLVED":
                if conflict.severity == ConflictSeverity.BLOCKING_ERROR:
                    blocking_reasons.append(f"Unresolved conflict in '{conflict.field_key}': {conflict.message_en}")
                elif conflict.severity == ConflictSeverity.WARNING:
                    field = draft.fields.get(conflict.field_key)
                    if not (field and field.user_confirmed):
                        blocking_reasons.append(f"Unconfirmed variation in '{conflict.field_key}' requires applicant confirmation.")

        # 3. Check for fields in NEEDS_REVIEW state without user confirmation
        for key, field in draft.fields.items():
            if field.status == FieldReliabilityState.NEEDS_REVIEW and not field.user_confirmed:
                blocking_reasons.append(f"Field '{key}' has low OCR confidence / uncertainty and requires user confirmation.")

        # 4. Run statutory rule engine
        issues = rule_engine.validate_fields(field_values)
        for issue in issues:
            if issue.severity == ConflictSeverity.BLOCKING_ERROR:
                blocking_reasons.append(issue.message_en)

        is_ready = len(blocking_reasons) == 0
        draft.is_ready_for_draft = is_ready
        draft.status = "READY" if is_ready else "IN_PROGRESS"
        return is_ready, blocking_reasons


draft_controller = DraftGenerationController()

