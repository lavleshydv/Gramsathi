"""Phase 1 Verification: Test manual draft workflow without AI."""
import unittest
from app.database.store import store
from app.rules.rule_engine import rule_engine
from app.intelligence.draft_controller import draft_controller


class TestManualWorkflow(unittest.TestCase):
    def test_session_and_draft_creation(self):
        session = store.create_session(citizen_phone="+919876543210", purpose_id="SCHOLARSHIP_2026")
        self.assertTrue(session.session_id.startswith("SES-"))
        self.assertEqual(session.citizen_phone, "+919876543210")

        draft = store.create_draft(service_id="POST_MATRIC_STATE_SCHOLARSHIP")
        self.assertTrue(draft.draft_id.startswith("DFT-"))
        self.assertIn("full_name", draft.fields)
        self.assertIn("annual_income", draft.fields)

    def test_manual_field_entry_and_validation(self):
        draft = store.create_draft(service_id="POST_MATRIC_STATE_SCHOLARSHIP")
        
        # 1. Fill fields manually
        draft.fields["full_name"].candidate_value = "Yash Sharma"
        draft.fields["full_name"].user_confirmed = True
        draft.fields["date_of_birth"].candidate_value = "15/08/2004"
        draft.fields["date_of_birth"].user_confirmed = True
        draft.fields["annual_income"].candidate_value = 120000
        draft.fields["annual_income"].user_confirmed = True
        draft.fields["marks_percentage"].candidate_value = 75.5
        draft.fields["marks_percentage"].user_confirmed = True
        draft.fields["category"].candidate_value = "OBC"
        draft.fields["category"].user_confirmed = True
        draft.fields["institution_name"].candidate_value = "Govt Polytechnic"
        draft.fields["institution_name"].user_confirmed = True

        # 2. Run rule engine
        field_vals = {k: f.candidate_value for k, f in draft.fields.items()}
        issues = rule_engine.validate_fields(field_vals)
        self.assertEqual(len(issues), 0)

        # 3. Assess draft readiness
        is_ready, blocking = draft_controller.assess_draft_readiness(draft)
        self.assertTrue(is_ready)
        self.assertEqual(len(blocking), 0)

    def test_ineligible_income_blocking(self):
        draft = store.create_draft(service_id="POST_MATRIC_STATE_SCHOLARSHIP")
        draft.fields["full_name"].candidate_value = "Pooja Devi"
        draft.fields["date_of_birth"].candidate_value = "10/05/2003"
        draft.fields["annual_income"].candidate_value = 350000  # Exceeds 250,000 ceiling!
        draft.fields["marks_percentage"].candidate_value = 80.0
        draft.fields["category"].candidate_value = "SC"

        is_ready, blocking = draft_controller.assess_draft_readiness(draft)
        self.assertFalse(is_ready)
        self.assertTrue(any("exceeds scheme ceiling" in r.lower() or "income" in r.lower() for r in blocking))


if __name__ == "__main__":
    unittest.main()
