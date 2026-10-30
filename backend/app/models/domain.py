"""In-memory and SQLAlchemy-ready domain data models for GramSathi backend."""
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
from app.models.schemas import (
    FieldReliabilityState,
    ConflictType,
    ConflictSeverity,
)

def utc_now() -> datetime:
    return datetime.now(timezone.utc)



class EvidenceRecord:
    def __init__(
        self,
        document_id: str,
        document_type: str,
        raw_text: str,
        ocr_confidence: float = 0.95,
        page_number: int = 1,
        source_region: Optional[Dict[str, int]] = None,
    ):
        self.evidence_id: str = f"EVD-{uuid.uuid4().hex[:8].upper()}"
        self.document_id: str = document_id
        self.document_type: str = document_type
        self.raw_text: str = raw_text
        self.ocr_confidence: float = ocr_confidence
        self.page_number: int = page_number
        self.source_region: Dict[str, int] = source_region or {"x": 100, "y": 100, "width": 200, "height": 30}
        self.created_at: datetime = utc_now()


class FieldRecord:
    def __init__(
        self,
        key: str,
        display_name_hi: str,
        display_name_en: str,
        candidate_value: Optional[Any] = None,
        status: FieldReliabilityState = FieldReliabilityState.EXTRACTED,
    ):
        self.field_id: str = f"FLD-{uuid.uuid4().hex[:8].upper()}"
        self.key: str = key
        self.display_name_hi: str = display_name_hi
        self.display_name_en: str = display_name_en
        self.candidate_value: Optional[Any] = candidate_value
        self.status: FieldReliabilityState = status
        self.requires_user_confirmation: bool = False
        self.user_confirmed: bool = False
        self.confirmed_value: Optional[Any] = None
        self.evidences: List[EvidenceRecord] = []
        self.updated_at: datetime = utc_now()


class ConflictRecord:
    def __init__(
        self,
        field_key: str,
        conflict_type: ConflictType,
        severity: ConflictSeverity,
        message_hi: str,
        message_en: str,
        evidence_ids: List[str],
        conflicting_values: List[Dict[str, Any]],
    ):
        self.conflict_id: str = f"CNF-{uuid.uuid4().hex[:8].upper()}"
        self.field_key: str = field_key
        self.conflict_type: ConflictType = conflict_type
        self.severity: ConflictSeverity = severity
        self.message_hi: str = message_hi
        self.message_en: str = message_en
        self.evidence_ids: List[str] = evidence_ids
        self.conflicting_values: List[Dict[str, Any]] = conflicting_values
        self.status: str = "UNRESOLVED"
        self.created_at: datetime = utc_now()


class DocumentRecord:
    def __init__(
        self,
        draft_id: str,
        document_type: str,
        file_name: str,
        sha256_hash: str,
        storage_path: str,
    ):
        self.document_id: str = f"DOC-{uuid.uuid4().hex[:8].upper()}"
        self.draft_id: str = draft_id
        self.document_type: str = document_type
        self.file_name: str = file_name
        self.sha256_hash: str = sha256_hash
        self.storage_path: str = storage_path
        self.uploaded_at: datetime = utc_now()
        self.extracted: bool = False


class AuditRecord:
    def __init__(self, draft_id: str, event_type: str, payload: Dict[str, Any]):
        self.event_id: str = f"AUD-{uuid.uuid4().hex[:8].upper()}"
        self.draft_id: str = draft_id
        self.event_type: str = event_type
        self.payload: Dict[str, Any] = payload
        self.created_at: datetime = utc_now()


class DraftRecord:
    def __init__(self, service_id: str = "POST_MATRIC_STATE_SCHOLARSHIP", rule_version: str = "1.0"):
        self.draft_id: str = f"DFT-{uuid.uuid4().hex[:8].upper()}"
        self.service_id: str = service_id
        self.rule_version: str = rule_version
        self.status: str = "IN_PROGRESS"  # IN_PROGRESS, READY, SUBMITTED
        self.is_ready_for_draft: bool = False
        self.created_at: datetime = utc_now()
        self.updated_at: datetime = utc_now()
        self.fields: Dict[str, FieldRecord] = {}
        self.documents: Dict[str, DocumentRecord] = {}
        self.conflicts: List[ConflictRecord] = []
        self.audit_events: List[AuditRecord] = []


class SessionRecord:
    def __init__(self, citizen_phone: str, purpose_id: str, consent_given: bool = True):
        self.session_id: str = f"SES-{uuid.uuid4().hex[:8].upper()}"
        self.citizen_phone: str = citizen_phone
        self.purpose_id: str = purpose_id
        self.consent_given: bool = consent_given
        self.consent_timestamp: datetime = utc_now()
        self.active_draft_id: Optional[str] = None
