"""Field Reliability State Machine: Transitions fields through formal confidence gates."""
from app.models.domain import FieldRecord, ConflictRecord
from app.models.schemas import FieldReliabilityState, ConflictSeverity


class ConfidenceManager:
    """Manages the state transition function for candidate fields:
    EXTRACTED -> EVIDENCE_CHECK -> READY_FOR_REVIEW / NEEDS_REVIEW / CONFLICTED -> USER_CONFIRMED -> ELIGIBLE_FOR_DRAFT
    """

    @staticmethod
    def evaluate_field_state(field: FieldRecord, active_conflict: ConflictRecord = None) -> FieldReliabilityState:
        # If user explicitly confirmed or corrected, allow transition
        if field.user_confirmed:
            field.status = FieldReliabilityState.USER_CONFIRMED
            return FieldReliabilityState.ELIGIBLE_FOR_DRAFT

        # If there are no evidences and no candidate value
        if not field.evidences and (field.candidate_value is None or str(field.candidate_value).strip() == ""):
            field.status = FieldReliabilityState.MISSING
            return FieldReliabilityState.MISSING

        # Check for active unresolved conflicts
        if active_conflict and active_conflict.status == "UNRESOLVED":
            field.status = FieldReliabilityState.CONFLICTED
            field.requires_user_confirmation = True
            return FieldReliabilityState.CONFLICTED

        # Check OCR confidence across evidences
        min_ocr_conf = 1.0
        for ev in field.evidences:
            if ev.ocr_confidence < min_ocr_conf:
                min_ocr_conf = ev.ocr_confidence

        if min_ocr_conf < 0.70 or (field.candidate_value and "?" in str(field.candidate_value)):
            field.status = FieldReliabilityState.NEEDS_REVIEW
            field.requires_user_confirmation = True
            return FieldReliabilityState.NEEDS_REVIEW

        # If all checks pass
        field.status = FieldReliabilityState.READY_FOR_REVIEW
        field.requires_user_confirmation = False
        return FieldReliabilityState.ELIGIBLE_FOR_DRAFT


confidence_manager = ConfidenceManager()

