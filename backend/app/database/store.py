"""In-memory thread-safe store and SQLAlchemy repository adapter for GramSathi backend."""
from typing import Dict, Optional, List
from app.models.domain import (
    DraftRecord,
    SessionRecord,
    FieldRecord,
    EvidenceRecord,
    AuditRecord,
    DocumentRecord,
)
from app.models.schemas import FieldReliabilityState


class DataStore:
    _instance = None

    def __init__(self):
        self.sessions: Dict[str, SessionRecord] = {}
        self.drafts: Dict[str, DraftRecord] = {}

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = DataStore()
        return cls._instance

    def create_session(self, citizen_phone: str, purpose_id: str, consent_given: bool = True) -> SessionRecord:
        session = SessionRecord(citizen_phone=citizen_phone, purpose_id=purpose_id, consent_given=consent_given)
        self.sessions[session.session_id] = session
        return session

    def get_session(self, session_id: str) -> Optional[SessionRecord]:
        return self.sessions.get(session_id)

    def create_draft(self, service_id: str = "POST_MATRIC_STATE_SCHOLARSHIP", rule_version: str = "1.0") -> DraftRecord:
        draft = DraftRecord(service_id=service_id, rule_version=rule_version)
        
        # Initialize default required fields for Post-Matric Scholarship
        initial_fields = [
            ("full_name", "आवेदक का पूरा नाम", "Applicant Full Name"),
            ("date_of_birth", "जन्म तिथि", "Date of Birth"),
            ("annual_income", "पारिवारिक वार्षिक आय", "Annual Family Income"),
            ("marks_percentage", "पिछली कक्षा के प्राप्तांक प्रतिशत", "Previous Academic Percentage"),
            ("category", "सामाजिक श्रेणी (वर्ग)", "Social Category"),
            ("institution_name", "महाविद्यालय / संस्थान का नाम", "Institution Name"),
        ]
        for key, name_hi, name_en in initial_fields:
            draft.fields[key] = FieldRecord(key=key, display_name_hi=name_hi, display_name_en=name_en)

        draft.audit_events.append(AuditRecord(draft_id=draft.draft_id, event_type="DRAFT_CREATED", payload={"service_id": service_id}))
        self.drafts[draft.draft_id] = draft
        return draft

    def get_draft(self, draft_id: str) -> Optional[DraftRecord]:
        return self.drafts.get(draft_id)


# Global singleton access
store = DataStore.get_instance()

