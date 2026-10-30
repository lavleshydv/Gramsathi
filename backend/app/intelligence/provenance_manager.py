"""Field Provenance Manager: Maintains immutable 1:N evidence links for extracted attributes."""
from typing import Dict, Any, List
from app.models.domain import FieldRecord, EvidenceRecord
from app.models.schemas import FieldReliabilityState


class FieldProvenanceManager:
    """Attaches and maintains multi-source evidence for canonical draft fields."""

    @staticmethod
    def attach_evidence(
        field: FieldRecord,
        document_id: str,
        document_type: str,
        raw_text: str,
        ocr_confidence: float = 0.95,
        page_number: int = 1,
        source_region: Dict[str, int] = None,
    ) -> EvidenceRecord:
        evidence = EvidenceRecord(
            document_id=document_id,
            document_type=document_type,
            raw_text=raw_text,
            ocr_confidence=ocr_confidence,
            page_number=page_number,
            source_region=source_region,
        )
        field.evidences.append(evidence)
        
        # If field has no candidate value yet, set from primary evidence
        if field.candidate_value is None:
            field.candidate_value = raw_text
            field.status = FieldReliabilityState.EXTRACTED

        return evidence


provenance_manager = FieldProvenanceManager()

