"""Phase 4 Verification: Test Complete Evidence Reconciliation Engine & 5-Tier Conflict Classifier."""
import unittest
from app.intelligence.conflict_detector import conflict_detector
from app.models.schemas import ConflictType, ConflictSeverity
from app.models.domain import EvidenceRecord, FieldRecord
from app.database.store import store


class TestReconciliationEngine(unittest.TestCase):
    def test_multi_source_three_document_provenance(self):
        """Tests that a single field retains 3 independent pieces of supporting evidence."""
        field = FieldRecord(key="full_name", display_name_hi="आवेदक का नाम", display_name_en="Applicant Name")

        # 3 distinct documents
        ev_aadhaar = EvidenceRecord(document_id="DOC1", document_type="AADHAAR", raw_text="Yash Sharma", ocr_confidence=0.98)
        ev_marksheet = EvidenceRecord(document_id="DOC2", document_type="MARKSHEET", raw_text="Yash S Sharma", ocr_confidence=0.97)
        ev_income = EvidenceRecord(document_id="DOC3", document_type="INCOME_CERTIFICATE", raw_text="Yash Sharma", ocr_confidence=0.96)

        field.evidences.extend([ev_aadhaar, ev_marksheet, ev_income])
        self.assertEqual(len(field.evidences), 3)

        # Detect conflict across the 3 evidences
        conflict = conflict_detector.evaluate_field_conflicts("full_name", field.evidences)
        self.assertIsNotNone(conflict)
        self.assertEqual(conflict.conflict_type, ConflictType.SPELLING_OR_TRANSLITERATION_VARIATION)
        self.assertEqual(conflict.severity, ConflictSeverity.WARNING)
        self.assertEqual(len(conflict.conflicting_values), 3)

    def test_format_variation_date_and_currency(self):
        # 1. Date format differences (hyphen vs slash)
        ev_date1 = EvidenceRecord(document_id="D1", document_type="AADHAAR", raw_text="15/08/2004")
        ev_date2 = EvidenceRecord(document_id="D2", document_type="MARKSHEET", raw_text="15-08-2004")
        c_type, c_sev, _, _ = conflict_detector.classify_pair(ev_date1.raw_text, ev_date2.raw_text, "date_of_birth")
        self.assertEqual(c_type, ConflictType.FORMAT_VARIATION)
        self.assertEqual(c_sev, ConflictSeverity.INFO)

        # 2. Currency commas difference (₹1,20,000 vs 120000)
        ev_inc1 = EvidenceRecord(document_id="D1", document_type="INCOME_CERT", raw_text="₹1,20,000")
        ev_inc2 = EvidenceRecord(document_id="D2", document_type="AFFIDAVIT", raw_text="120000")
        c_type_inc, c_sev_inc, _, _ = conflict_detector.classify_pair(ev_inc1.raw_text, ev_inc2.raw_text, "annual_income")
        self.assertEqual(c_type_inc, ConflictType.FORMAT_VARIATION)
        self.assertEqual(c_sev_inc, ConflictSeverity.INFO)

    def test_material_contradiction_blocking_severity(self):
        # Contradictory birth dates
        ev1 = EvidenceRecord(document_id="D1", document_type="AADHAAR", raw_text="15/08/2004")
        ev2 = EvidenceRecord(document_id="D2", document_type="MARKSHEET", raw_text="12/04/2005")
        conflict = conflict_detector.evaluate_field_conflicts("date_of_birth", [ev1, ev2])
        self.assertIsNotNone(conflict)
        self.assertEqual(conflict.conflict_type, ConflictType.MATERIAL_CONTRADICTION)
        self.assertEqual(conflict.severity, ConflictSeverity.BLOCKING_ERROR)

    def test_unreadable_missing_glyph_classification(self):
        ev1 = EvidenceRecord(document_id="D1", document_type="INCOME_CERT", raw_text="9?000")
        ev2 = EvidenceRecord(document_id="D2", document_type="APPLICATION", raw_text="90000")
        c_type, c_sev, _, _ = conflict_detector.classify_pair(ev1.raw_text, ev2.raw_text, "annual_income")
        self.assertEqual(c_type, ConflictType.UNREADABLE_OR_MISSING)
        self.assertEqual(c_sev, ConflictSeverity.WARNING)

    def test_evidence_preservation_after_user_override(self):
        """Verifies that user confirmation resolves the conflict but retains all underlying evidence records."""
        draft = store.create_draft(service_id="POST_MATRIC_STATE_SCHOLARSHIP")
        field = draft.fields["full_name"]

        ev1 = EvidenceRecord(document_id="D1", document_type="AADHAAR", raw_text="Yash Sharma")
        ev2 = EvidenceRecord(document_id="D2", document_type="MARKSHEET", raw_text="Yash S Sharma")
        field.evidences.extend([ev1, ev2])

        # Run reconciliation
        from app.intelligence.confidence_manager import confidence_manager
        conflict = conflict_detector.evaluate_field_conflicts("full_name", field.evidences)
        draft.conflicts.append(conflict)
        confidence_manager.evaluate_field_state(field, active_conflict=conflict)

        self.assertEqual(conflict.status, "UNRESOLVED")
        self.assertEqual(field.status.value, "CONFLICTED")

        # Simulate applicant confirming "Yash Sharma" as the authoritative spelling
        field.candidate_value = "Yash Sharma"
        field.confirmed_value = "Yash Sharma"
        field.user_confirmed = True
        conflict.status = "RESOLVED"
        confidence_manager.evaluate_field_state(field, active_conflict=None)

        self.assertEqual(field.status.value, "USER_CONFIRMED")
        self.assertEqual(conflict.status, "RESOLVED")
        # Ensure underlying conflicting evidence is NOT erased:
        self.assertEqual(len(field.evidences), 2)
        self.assertIn("Yash S Sharma", [e.raw_text for e in field.evidences])


if __name__ == "__main__":
    unittest.main()

