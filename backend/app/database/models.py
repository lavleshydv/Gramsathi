"""SQLAlchemy Relational Schema decoupling canonical fields from evidence (1:N relationship)."""
import uuid
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import (
    Column,
    String,
    Boolean,
    Float,
    Integer,
    DateTime,
    ForeignKey,
    Text,
    Enum as SQLEnum,
)
from sqlalchemy.orm import declarative_base, relationship
from app.models.schemas import FieldReliabilityState, ConflictType, ConflictSeverity

Base = declarative_base()

def utc_now():
    return datetime.now(timezone.utc)


class SessionModel(Base):
    __tablename__ = "sessions"

    session_id = Column(String(64), primary_key=True, default=lambda: f"SES-{uuid.uuid4().hex[:8].upper()}")
    citizen_phone = Column(String(20), nullable=False)
    consent_given = Column(Boolean, default=True, nullable=False)
    purpose_id = Column(String(128), default="POST_MATRIC_SCHOLARSHIP_2026")
    preferred_language = Column(String(10), default="hi")
    consent_timestamp = Column(DateTime(timezone=True), default=utc_now)


class ApplicationDraftModel(Base):
    __tablename__ = "application_drafts"

    draft_id = Column(String(64), primary_key=True, default=lambda: f"DFT-{uuid.uuid4().hex[:8].upper()}")
    service_id = Column(String(64), default="POST_MATRIC_STATE_SCHOLARSHIP", nullable=False)
    rule_version = Column(String(20), default="1.0", nullable=False)
    status = Column(String(32), default="IN_PROGRESS", nullable=False)  # IN_PROGRESS, READY, SUBMITTED
    is_ready_for_draft = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    # Relationships
    documents = relationship("DocumentModel", back_populates="draft", cascade="all, delete-orphan")
    fields = relationship("ExtractedFieldModel", back_populates="draft", cascade="all, delete-orphan")
    conflicts = relationship("FieldConflictModel", back_populates="draft", cascade="all, delete-orphan")
    audit_events = relationship("AuditEventModel", back_populates="draft", cascade="all, delete-orphan")


class DocumentModel(Base):
    __tablename__ = "documents"

    document_id = Column(String(64), primary_key=True, default=lambda: f"DOC-{uuid.uuid4().hex[:8].upper()}")
    draft_id = Column(String(64), ForeignKey("application_drafts.draft_id", ondelete="CASCADE"), nullable=False)
    document_type = Column(String(32), nullable=False)  # AADHAAR, MARKSHEET, INCOME_CERTIFICATE
    file_name = Column(String(255), nullable=False)
    sha256_hash = Column(String(64), nullable=False)
    storage_path = Column(Text, nullable=False)
    mime_type = Column(String(64), default="application/pdf")
    file_size_bytes = Column(Integer, default=0)
    is_encrypted = Column(Boolean, default=True)
    uploaded_at = Column(DateTime(timezone=True), default=utc_now)

    draft = relationship("ApplicationDraftModel", back_populates="documents")
    evidences = relationship("FieldEvidenceModel", back_populates="document", cascade="all, delete-orphan")


class ExtractedFieldModel(Base):
    __tablename__ = "extracted_fields"

    field_id = Column(String(64), primary_key=True, default=lambda: f"FLD-{uuid.uuid4().hex[:8].upper()}")
    draft_id = Column(String(64), ForeignKey("application_drafts.draft_id", ondelete="CASCADE"), nullable=False)
    field_key = Column(String(64), nullable=False)  # e.g. full_name, date_of_birth, annual_income
    display_name_hi = Column(String(128), nullable=False)
    display_name_en = Column(String(128), nullable=False)
    candidate_value = Column(Text, nullable=True)
    confirmed_value = Column(Text, nullable=True)
    user_confirmed = Column(Boolean, default=False)
    status = Column(SQLEnum(FieldReliabilityState), default=FieldReliabilityState.EXTRACTED, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    draft = relationship("ApplicationDraftModel", back_populates="fields")
    # 1:N decoupled relationship to supporting evidence records
    evidences = relationship("FieldEvidenceModel", back_populates="field", cascade="all, delete-orphan")
    confirmations = relationship("FieldConfirmationModel", back_populates="field", cascade="all, delete-orphan")


class FieldEvidenceModel(Base):
    __tablename__ = "field_evidence"

    evidence_id = Column(String(64), primary_key=True, default=lambda: f"EVD-{uuid.uuid4().hex[:8].upper()}")
    field_id = Column(String(64), ForeignKey("extracted_fields.field_id", ondelete="CASCADE"), nullable=False)
    document_id = Column(String(64), ForeignKey("documents.document_id", ondelete="CASCADE"), nullable=False)
    raw_text = Column(Text, nullable=False)
    ocr_confidence = Column(Float, default=0.95, nullable=False)
    page_number = Column(Integer, default=1, nullable=False)
    bbox_x = Column(Integer, default=100)
    bbox_y = Column(Integer, default=100)
    bbox_w = Column(Integer, default=200)
    bbox_h = Column(Integer, default=30)
    extraction_engine = Column(String(64), default="Tesseract-5.0")
    created_at = Column(DateTime(timezone=True), default=utc_now)

    field = relationship("ExtractedFieldModel", back_populates="evidences")
    document = relationship("DocumentModel", back_populates="evidences")


class FieldConflictModel(Base):
    __tablename__ = "field_conflicts"

    conflict_id = Column(String(64), primary_key=True, default=lambda: f"CNF-{uuid.uuid4().hex[:8].upper()}")
    draft_id = Column(String(64), ForeignKey("application_drafts.draft_id", ondelete="CASCADE"), nullable=False)
    field_key = Column(String(64), nullable=False)
    conflict_type = Column(SQLEnum(ConflictType), nullable=False)
    severity = Column(SQLEnum(ConflictSeverity), nullable=False)
    status = Column(String(32), default="UNRESOLVED")  # UNRESOLVED, RESOLVED
    message_hi = Column(Text, nullable=False)
    message_en = Column(Text, nullable=False)
    evidence_ids = Column(Text, default="[]")  # JSON encoded list of evidence IDs
    conflicting_values = Column(Text, default="[]")  # JSON encoded candidate values
    created_at = Column(DateTime(timezone=True), default=utc_now)

    draft = relationship("ApplicationDraftModel", back_populates="conflicts")


class FieldConfirmationModel(Base):
    __tablename__ = "field_confirmations"

    confirmation_id = Column(String(64), primary_key=True, default=lambda: f"CFM-{uuid.uuid4().hex[:8].upper()}")
    field_id = Column(String(64), ForeignKey("extracted_fields.field_id", ondelete="CASCADE"), nullable=False)
    actor = Column(String(32), default="APPLICANT")  # APPLICANT, OPERATOR
    action = Column(String(32), default="USER_CONFIRMED")  # USER_CONFIRMED, USER_CORRECTED
    previous_value = Column(Text, nullable=True)
    confirmed_value = Column(Text, nullable=False)
    notes = Column(Text, nullable=True)
    confirmed_at = Column(DateTime(timezone=True), default=utc_now)

    field = relationship("ExtractedFieldModel", back_populates="confirmations")


class AuditEventModel(Base):
    __tablename__ = "audit_events"

    event_id = Column(String(64), primary_key=True, default=lambda: f"AUD-{uuid.uuid4().hex[:8].upper()}")
    draft_id = Column(String(64), ForeignKey("application_drafts.draft_id", ondelete="CASCADE"), nullable=False)
    event_type = Column(String(64), nullable=False)
    payload = Column(Text, default="{}")  # JSON encoded payload
    created_at = Column(DateTime(timezone=True), default=utc_now)

    draft = relationship("ApplicationDraftModel", back_populates="audit_events")

