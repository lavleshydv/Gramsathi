"""Phase 4 Verification: Test Evidence Reconciliation & Conflict Detection."""
import unittest
from app.intelligence.conflict_detector import conflict_detector
from app.models.schemas import ConflictType, ConflictSeverity
from app.models.domain import EvidenceRecord


class TestReconciliation(unittest.TestCase):
    def test_exact_match_detection(self):
        ev1 = EvidenceRecord(document_id="DOC1", document_type="AADHAAR", raw_text="Yash Sharma")
        ev2 = EvidenceRecord(document_id="DOC2", document_type="MARKSHEET", raw_text="yash sharma")
        
        conflict = conflict_detector.evaluate_field_conflicts("full_name", [ev1, ev2])
        self.assertIsNone(conflict)

    def test_initials_variation_detection(self):
        ev1 = EvidenceRecord(document_id="DOC1", document_type="AADHAAR", raw_text="Yash Sharma")
        ev2 = EvidenceRecord(document_id="DOC2", document_type="MARKSHEET", raw_text="Yash S Sharma")

        conflict = conflict_detector.evaluate_field_conflicts("full_name", [ev1, ev2])
        self.assertIsNotNone(conflict)
        self.assertEqual(conflict.conflict_type, ConflictType.SPELLING_OR_TRANSLITERATION_VARIATION)
        self.assertEqual(conflict.severity, ConflictSeverity.WARNING)

    def test_material_contradiction_dob(self):
        ev1 = EvidenceRecord(document_id="DOC1", document_type="AADHAAR", raw_text="15/08/2004")
        ev2 = EvidenceRecord(document_id="DOC2", document_type="MARKSHEET", raw_text="12/04/2005")

        conflict = conflict_detector.evaluate_field_conflicts("date_of_birth", [ev1, ev2])
        self.assertIsNotNone(conflict)
        self.assertEqual(conflict.conflict_type, ConflictType.MATERIAL_CONTRADICTION)
        self.assertEqual(conflict.severity, ConflictSeverity.BLOCKING_ERROR)


if __name__ == "__main__":
    unittest.main()
