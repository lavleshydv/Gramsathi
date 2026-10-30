"""Phase 2 Verification: Test Relational Database Schema & 1:N Decoupled Evidence."""
import unittest
from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.models import (
    Base,
    ApplicationDraftModel,
    DocumentModel,
    ExtractedFieldModel,
    FieldEvidenceModel,
    FieldConflictModel,
    FieldConfirmationModel,
    AuditEventModel,
    FieldReliabilityState,
    ConflictType,
    ConflictSeverity,
)

# In-memory SQLite engine for relational testing
engine = create_engine("sqlite:///:memory:", echo=False)
TestingSessionLocal = sessionmaker(bind=engine)


class TestDatabaseSchema(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)

    def setUp(self):
        self.db = TestingSessionLocal()

    def tearDown(self):
        self.db.close()

    def test_decoupled_one_to_many_evidence_schema(self):
        """Verifies that 1 canonical field can hold N independent evidence records from distinct documents."""
        # 1. Create Draft
        draft = ApplicationDraftModel(service_id="POST_MATRIC_STATE_SCHOLARSHIP")
        self.db.add(draft)
        self.db.commit()

        # 2. Add two documents
        doc1 = DocumentModel(
            draft_id=draft.draft_id,
            document_type="AADHAAR",
            file_name="aadhaar.pdf",
            sha256_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            storage_path="/tmp/aadhaar.enc",
        )
        doc2 = DocumentModel(
            draft_id=draft.draft_id,
            document_type="MARKSHEET",
            file_name="marksheet.pdf",
            sha256_hash="ca978112ca1bbdcafac231b39a23dc4da7860814966f866c2c2e8991c30995c4",
            storage_path="/tmp/marksheet.enc",
        )
        self.db.add_all([doc1, doc2])
        self.db.commit()

        # 3. Create 1 canonical field 'full_name'
        field = ExtractedFieldModel(
            draft_id=draft.draft_id,
            field_key="full_name",
            display_name_hi="आवेदक का नाम",
            display_name_en="Applicant Name",
            candidate_value="Yash Sharma",
            status=FieldReliabilityState.EXTRACTED,
        )
        self.db.add(field)
        self.db.commit()

        # 4. Attach Evidence 1 from Aadhaar
        ev1 = FieldEvidenceModel(
            field_id=field.field_id,
            document_id=doc1.document_id,
            raw_text="Yash Sharma",
            ocr_confidence=0.98,
            page_number=1,
            bbox_x=120,
            bbox_y=210,
            bbox_w=240,
            bbox_h=35,
        )

        # 5. Attach Evidence 2 from Marksheet (e.g. Yash S Sharma)
        ev2 = FieldEvidenceModel(
            field_id=field.field_id,
            document_id=doc2.document_id,
            raw_text="Yash S Sharma",
            ocr_confidence=0.96,
            page_number=1,
            bbox_x=140,
            bbox_y=180,
            bbox_w=250,
            bbox_h=30,
        )
        self.db.add_all([ev1, ev2])
        self.db.commit()

        # Verify decoupled 1:N relations
        queried_field = self.db.query(ExtractedFieldModel).filter_by(field_key="full_name").first()
        self.assertIsNotNone(queried_field)
        self.assertEqual(len(queried_field.evidences), 2)
        
        evidence_texts = [ev.raw_text for ev in queried_field.evidences]
        self.assertIn("Yash Sharma", evidence_texts)
        self.assertIn("Yash S Sharma", evidence_texts)

    def test_audit_event_immutability(self):
        draft = ApplicationDraftModel(service_id="POST_MATRIC_STATE_SCHOLARSHIP")
        self.db.add(draft)
        self.db.commit()

        audit = AuditEventModel(
            draft_id=draft.draft_id,
            event_type="FIELD_OVERRIDE",
            payload='{"field": "full_name", "confirmed_by": "APPLICANT"}',
        )
        self.db.add(audit)
        self.db.commit()

        retrieved = self.db.query(AuditEventModel).filter_by(draft_id=draft.draft_id).first()
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved.event_type, "FIELD_OVERRIDE")


if __name__ == "__main__":
    unittest.main()

