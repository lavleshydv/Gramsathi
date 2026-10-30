"""Phase 5 Verification: Test Field Reliability State Machine & Confidence-Gated Draft Generation."""
import unittest
from app.models.domain import FieldRecord, EvidenceRecord, ConflictRecord
from app.models.schemas import FieldReliabilityState, ConflictType, ConflictSeverity
from app.intelligence.confidence_manager import confidence_manager
from app.intelligence.draft_controller import draft_controller, DraftGatingException
from app.database.store import store


class TestConfidenceStateMachine(unittest.TestCase):
    def test_state_machine_transitions(self):
        field = FieldRecord(key="full_name", display_name_hi="नाम", display_name_en="Name")
        
        # 1. Initially without value -> MISSING
        state = confidence_manager.evaluate_field_state(field)
        self.assertEqual(state, FieldReliabilityState.MISSING)

        # 2. Add high-confidence evidence -> READY_FOR_REVIEW
        ev = EvidenceRecord(document_id="D1", document_type="AADHAAR", raw_text="Yash Sharma", ocr_confidence=0.98)
        field.evidences.append(ev)
        field.candidate_value = "Yash Sharma"
        state = confidence_manager.evaluate_field_state(field)
        self.assertEqual(state, FieldReliabilityState.READY_FOR_REVIEW)

        # 3. Add conflicting evidence -> CONFLICTED
        conflict = ConflictRecord(
            field_key="full_name",
            conflict_type=ConflictType.MATERIAL_CONTRADICTION,
            severity=ConflictSeverity.BLOCKING_ERROR,
            message_hi="विरोध",
            message_en="Material contradiction",
            evidence_ids=["D1", "D2"],
            conflicting_values=[],
        )
        state = confidence_manager.evaluate_field_state(field, active_conflict=conflict)
        self.assertEqual(state, FieldReliabilityState.CONFLICTED)
        self.assertTrue(field.requires_user_confirmation)

        # 4. User confirms value -> USER_CONFIRMED -> ELIGIBLE_FOR_DRAFT
        field.user_confirmed = True
        field.confirmed_value = "Yash Sharma"
        state = confidence_manager.evaluate_field_state(field, active_conflict=None)
        self.assertEqual(state, FieldReliabilityState.ELIGIBLE_FOR_DRAFT)

    def test_multidimensional_confidence_tensor(self):
        field = FieldRecord(key="marks_percentage", display_name_hi="प्राप्तांक", display_name_en="Marks")
        field.candidate_value = "78.5"
        ev = EvidenceRecord(document_id="M1", document_type="MARKSHEET", raw_text="78.5", ocr_confidence=0.96)
        field.evidences.append(ev)

        tensor = confidence_manager.calculate_confidence_tensor(field, active_conflict=None)
        self.assertAlmostEqual(tensor.c_ocr, 0.96, places=2)
        self.assertEqual(tensor.c_consist, 1.0)
        self.assertEqual(tensor.c_rules, 1.0)
        self.assertTrue(tensor.is_draft_eligible)
        self.assertGreaterEqual(tensor.composite_score, 0.80)

    def test_hard_draft_gating_blocks_contradictory_field(self):
        draft = store.create_draft(service_id="POST_MATRIC_STATE_SCHOLARSHIP")

        # Fill happy path fields
        draft.fields["full_name"].candidate_value = "Anil Verma"
        draft.fields["full_name"].user_confirmed = True
        draft.fields["annual_income"].candidate_value = 140000
        draft.fields["annual_income"].user_confirmed = True
        draft.fields["marks_percentage"].candidate_value = 72.0
        draft.fields["marks_percentage"].user_confirmed = True
        draft.fields["category"].candidate_value = "OBC"
        draft.fields["category"].user_confirmed = True
        draft.fields["institution_name"].candidate_value = "Government Polytechnic Moradabad"
        draft.fields["institution_name"].user_confirmed = True

        # Inject an active unresolved material contradiction on DOB
        conflict = ConflictRecord(
            field_key="date_of_birth",
            conflict_type=ConflictType.MATERIAL_CONTRADICTION,
            severity=ConflictSeverity.BLOCKING_ERROR,
            message_hi="जन्म तिथि में गंभीर विसंगति",
            message_en="Material contradiction in date_of_birth: 15/08/2004 vs 12/04/2005",
            evidence_ids=["DOC1", "DOC2"],
            conflicting_values=[],
        )
        draft.conflicts.append(conflict)
        draft.fields["date_of_birth"].candidate_value = "15/08/2004"
        draft.fields["date_of_birth"].status = FieldReliabilityState.CONFLICTED
        draft.fields["date_of_birth"].user_confirmed = False

        # Attempt to generate final draft: MUST RAISE DraftGatingException!
        is_ready, blocking = draft_controller.assess_draft_readiness(draft)
        self.assertFalse(is_ready)
        self.assertTrue(any("date_of_birth" in r for r in blocking))

        with self.assertRaises(DraftGatingException):
            draft_controller.generate_final_draft_package(draft)

        # Resolve conflict via user confirmation
        draft.fields["date_of_birth"].user_confirmed = True
        draft.fields["date_of_birth"].confirmed_value = "15/08/2004"
        conflict.status = "RESOLVED"

        # Now final draft package generation MUST succeed!
        pkg = draft_controller.generate_final_draft_package(draft)
        self.assertTrue(pkg.is_ready_for_portal)
        self.assertEqual(pkg.application_payload["dob"], "15/08/2004")
        self.assertIn("date_of_birth", pkg.evidence_manifest)


if __name__ == "__main__":
    unittest.main()
