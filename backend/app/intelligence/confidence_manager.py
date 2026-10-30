"""Field Reliability State Machine & Multi-Dimensional Confidence Tensor Evaluator."""
from typing import Dict, Any, Optional, Tuple, List
from app.models.domain import FieldRecord, ConflictRecord
from app.models.schemas import (
    FieldReliabilityState,
    ConflictSeverity,
    ConflictType,
    MultiDimensionalConfidenceScore,
)


class ConfidenceManager:
    """Manages the formal Field Reliability State Machine:
    EXTRACTED -> EVIDENCE_CHECK -> READY_FOR_REVIEW / NEEDS_REVIEW / CONFLICTED -> USER_CONFIRMED -> ELIGIBLE_FOR_DRAFT
    
    Evaluates the 4-Dimensional Reliability Tensor:
    C = (C_ocr, C_consist, C_audit, C_rules)
    """

    @staticmethod
    def calculate_confidence_tensor(
        field: FieldRecord,
        active_conflict: Optional[ConflictRecord] = None,
        statutory_error: Optional[str] = None,
    ) -> MultiDimensionalConfidenceScore:
        # 1. C_ocr: Mean OCR extraction confidence across supporting evidence items
        if field.evidences:
            c_ocr = sum(e.ocr_confidence for e in field.evidences) / len(field.evidences)
        else:
            c_ocr = 1.0 if field.user_confirmed else 0.0

        # Check for glyph uncertainty
        if field.candidate_value and "?" in str(field.candidate_value):
            c_ocr = min(c_ocr, 0.50)

        # 2. C_consist: Cross-document consistency score
        if not field.evidences or len(field.evidences) <= 1:
            c_consist = 1.0  # Single authoritative source
        elif active_conflict and active_conflict.status == "UNRESOLVED":
            if active_conflict.conflict_type == ConflictType.EXACT_MATCH:
                c_consist = 1.0
            elif active_conflict.conflict_type == ConflictType.FORMAT_VARIATION:
                c_consist = 0.90
            elif active_conflict.conflict_type == ConflictType.SPELLING_OR_TRANSLITERATION_VARIATION:
                c_consist = 0.70
            elif active_conflict.conflict_type == ConflictType.MATERIAL_CONTRADICTION:
                c_consist = 0.00
            else:
                c_consist = 0.40
        else:
            c_consist = 1.0  # Conflicts resolved or exact match

        # 3. C_audit: Verification status
        if field.user_confirmed:
            c_audit = 1.0
        elif field.status == FieldReliabilityState.CONFLICTED:
            c_audit = 0.0
        elif field.status == FieldReliabilityState.NEEDS_REVIEW:
            c_audit = 0.3
        else:
            c_audit = 0.7  # Passed automatic consistency checks

        # 4. C_rules: Statutory rule compliance
        c_rules = 0.0 if statutory_error else 1.0

        # Composite score (weighted harmonic combination)
        composite = 0.25 * c_ocr + 0.35 * c_consist + 0.20 * c_audit + 0.20 * c_rules

        # Strict draft gating condition
        is_eligible = (
            field.candidate_value is not None
            and str(field.candidate_value).strip() != ""
            and (c_consist >= 0.85 or field.user_confirmed)
            and (c_ocr >= 0.70 or field.user_confirmed)
            and c_rules == 1.0
            and not (active_conflict and active_conflict.status == "UNRESOLVED" and active_conflict.severity == ConflictSeverity.BLOCKING_ERROR)
        )

        # Generate explanatory note
        if not is_eligible:
            if c_rules == 0.0:
                explanation = f"Statutory rule violation: {statutory_error}"
            elif active_conflict and active_conflict.status == "UNRESOLVED":
                explanation = f"Unresolved {active_conflict.conflict_type.value}: {active_conflict.message_en}"
            elif c_ocr < 0.70:
                explanation = "Low OCR extraction confidence (< 0.70). Manual confirmation required."
            elif not field.candidate_value:
                explanation = "Field value is missing."
            else:
                explanation = "Requires applicant review before draft inclusion."
        else:
            explanation = "Verified: Satisfies statutory rules and cross-document evidence gates."

        return MultiDimensionalConfidenceScore(
            c_ocr=round(c_ocr, 3),
            c_consist=round(c_consist, 3),
            c_audit=round(c_audit, 3),
            c_rules=round(c_rules, 3),
            composite_score=round(composite, 3),
            is_draft_eligible=is_eligible,
            explanation=explanation,
        )

    @classmethod
    def evaluate_field_state(
        cls,
        field: FieldRecord,
        active_conflict: Optional[ConflictRecord] = None,
        statutory_error: Optional[str] = None,
    ) -> FieldReliabilityState:
        """Formal State Machine transition function:
        Updates field.status and returns the target state.
        """
        # If statutory rule is violated
        if statutory_error:
            field.status = FieldReliabilityState.INVALID
            field.requires_user_confirmation = True
            return FieldReliabilityState.INVALID

        # If user explicitly confirmed or corrected
        if field.user_confirmed:
            field.status = FieldReliabilityState.USER_CONFIRMED
            return FieldReliabilityState.ELIGIBLE_FOR_DRAFT

        # If missing value
        if not field.evidences and (field.candidate_value is None or str(field.candidate_value).strip() == ""):
            field.status = FieldReliabilityState.MISSING
            field.requires_user_confirmation = True
            return FieldReliabilityState.MISSING

        # Check for active unresolved conflicts
        if active_conflict and active_conflict.status == "UNRESOLVED":
            field.status = FieldReliabilityState.CONFLICTED
            field.requires_user_confirmation = True
            return FieldReliabilityState.CONFLICTED

        # Check OCR confidence threshold
        min_ocr_conf = 1.0
        for ev in field.evidences:
            if ev.ocr_confidence < min_ocr_conf:
                min_ocr_conf = ev.ocr_confidence

        if min_ocr_conf < 0.70 or (field.candidate_value and "?" in str(field.candidate_value)):
            field.status = FieldReliabilityState.NEEDS_REVIEW
            field.requires_user_confirmation = True
            return FieldReliabilityState.NEEDS_REVIEW

        # Passed evidence check and consistent
        field.status = FieldReliabilityState.READY_FOR_REVIEW
        field.requires_user_confirmation = False
        return FieldReliabilityState.READY_FOR_REVIEW


confidence_manager = ConfidenceManager()
