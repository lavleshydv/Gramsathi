"""Pydantic v2 data models & schemas for GramSathi AI."""
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class LanguageEnum(str, Enum):
    HI = "hi"
    EN = "en"


class FieldReliabilityState(str, Enum):
    EXTRACTED = "EXTRACTED"
    EVIDENCE_CHECK = "EVIDENCE_CHECK"
    READY_FOR_REVIEW = "READY_FOR_REVIEW"
    NEEDS_REVIEW = "NEEDS_REVIEW"
    CONFLICTED = "CONFLICTED"
    USER_CONFIRMED = "USER_CONFIRMED"
    USER_CORRECTED = "USER_CORRECTED"
    ELIGIBLE_FOR_DRAFT = "ELIGIBLE_FOR_DRAFT"
    INVALID = "INVALID"
    MISSING = "MISSING"


class ConflictType(str, Enum):
    EXACT_MATCH = "EXACT_MATCH"
    FORMAT_VARIATION = "FORMAT_VARIATION"
    SPELLING_OR_TRANSLITERATION_VARIATION = "SPELLING_OR_TRANSLITERATION_VARIATION"
    MATERIAL_CONTRADICTION = "MATERIAL_CONTRADICTION"
    UNREADABLE_OR_MISSING = "UNREADABLE_OR_MISSING"


class ConflictSeverity(str, Enum):
    INFO = "INFO"
    WARNING = "WARNING"
    BLOCKING_ERROR = "BLOCKING_ERROR"


# ---------------- Sessions ----------------
class CreateSessionRequest(BaseModel):
    citizen_phone: str = Field(..., description="Indian 10-digit mobile number with or without +91")
    consent_given: bool = Field(True, description="Explicit DPDP consent for document processing")
    purpose_id: str = Field("POST_MATRIC_SCHOLARSHIP_2026", description="Statutory purpose for document access")
    preferred_language: LanguageEnum = Field(LanguageEnum.HI, description="Preferred language (hi/en)")


class SessionResponse(BaseModel):
    session_id: str
    citizen_phone: str
    consent_timestamp: datetime
    active_draft_id: Optional[str] = None


# ---------------- Drafts ----------------
class CreateDraftRequest(BaseModel):
    service_id: str = Field("POST_MATRIC_STATE_SCHOLARSHIP", description="Identifier of the target scheme")
    rule_version: str = Field("1.0", description="Scheme rule version")


class SaveFieldsRequest(BaseModel):
    fields: Dict[str, Any] = Field(..., description="Key-value mapping of field entries")


class FieldCorrectionRequest(BaseModel):
    corrected_value: Any = Field(..., description="New value entered or selected by user")
    action: str = Field("USER_CORRECTED", description="Action tag: USER_CONFIRMED or USER_CORRECTED")
    notes: Optional[str] = Field(None, description="Optional explanation or reason")


class DocumentUploadMetadata(BaseModel):
    document_type: str = Field(..., description="Type of document (e.g. AADHAAR, MARKSHEET, INCOME_CERTIFICATE)")
    file_name: str
    page_count: int = 1


class DocumentResponse(BaseModel):
    document_id: str
    draft_id: str
    document_type: str
    file_name: str
    sha256_hash: str
    uploaded_at: datetime
    status: str = "UPLOADED"


class EvidenceItem(BaseModel):
    evidence_id: str
    document_id: str
    document_type: str
    page_number: int
    source_region: Optional[Dict[str, int]] = None
    ocr_confidence: float
    raw_text: str


class ExtractedFieldSummary(BaseModel):
    field_id: str
    field_key: str
    display_name_hi: str
    display_name_en: str
    candidate_value: Optional[Any] = None
    status: FieldReliabilityState
    requires_user_confirmation: bool = False
    ocr_confidence: Optional[float] = None
    consistency_score: Optional[float] = None
    evidences: List[EvidenceItem] = []


class ConflictItem(BaseModel):
    conflict_id: str
    field_key: str
    conflict_type: ConflictType
    severity: ConflictSeverity
    status: str = "UNRESOLVED"
    message_hi: str
    message_en: str
    evidence_ids: List[str]
    conflicting_values: List[Dict[str, Any]]


class ValidationIssueItem(BaseModel):
    field_key: Optional[str] = None
    severity: ConflictSeverity
    rule_code: str
    message_hi: str
    message_en: str
    is_resolved: bool = False


class DraftSummaryResponse(BaseModel):
    draft_id: str
    service_id: str
    service_name_hi: str
    status: str
    is_ready_for_draft: bool
    fields: Dict[str, Any]
    field_states: Dict[str, ExtractedFieldSummary]
    conflicts: List[ConflictItem]
    validation_issues: List[ValidationIssueItem]
    audit_trail_count: int

