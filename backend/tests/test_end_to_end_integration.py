"""Phase 9 Verification: End-to-End System Integration Tests (Scenarios A, B, C, D)."""
import unittest
from app.database.store import store
from app.models.domain import FieldRecord, EvidenceRecord, DocumentRecord, ConflictRecord
from app.models.schemas import FieldReliabilityState, ConflictType, ConflictSeverity
from app.intelligence.provenance_manager import provenance_manager
from app.intelligence.confidence_manager import confidence_manager
from app.intelligence.draft_controller import draft_controller, DraftGatingException
from app.rules.dependency_manager import dependency_manager
from app.services.resilience_service import resumable_upload_manager, draft_checkpoint_manager
from app.services.privacy_service import privacy_service


class TestEndToEndIntegration(unittest.TestCase):
    def setUp(self):
        self.session = store.create_session("9876543210", "POST_MATRIC_SCHOLARSHIP_2026", consent_given=True)
        self.draft = store.create_draft("POST_MATRIC_STATE_SCHOLARSHIP", "2.0.0")

    def test_scenario_a_happy_path_clean_documents(self):
        """Scenario A: Clean matching records across 3 documents generate verified draft package."""
        draft = self.draft
        draft_id = draft.draft_id

        # 1. Attach 3 clean documents
        doc_aadhaar = DocumentRecord(draft_id=draft_id, document_type="aadhaar", file_name="aadhaar.pdf", sha256_hash="sha_a", storage_path="/vault/a.enc")
        doc_marksheet = DocumentRecord(draft_id=draft_id, document_type="marksheet", file_name="marksheet.pdf", sha256_hash="sha_m", storage_path="/vault/m.enc")
        doc_income = DocumentRecord(draft_id=draft_id, document_type="income_certificate", file_name="income.pdf", sha256_hash="sha_i", storage_path="/vault/i.enc")

        for d in [doc_aadhaar, doc_marksheet, doc_income]:
            draft.documents[d.document_id] = d

        # 2. Extract fields with 1:N provenance
        f_name = draft.fields["full_name"]
        f_name.candidate_value = "Yash Sharma"
        f_name.user_confirmed = True
        provenance_manager.attach_evidence(f_name, doc_aadhaar.document_id, "Aadhaar", "Yash Sharma", 0.98, 1)
        provenance_manager.attach_evidence(f_name, doc_marksheet.document_id, "Marksheet", "Yash Sharma", 0.95, 1)

        f_dob = draft.fields["date_of_birth"]
        f_dob.candidate_value = "15/08/2004"
        f_dob.user_confirmed = True
        provenance_manager.attach_evidence(f_dob, doc_aadhaar.document_id, "Aadhaar", "15/08/2004", 0.98, 1)

        f_inc = draft.fields["annual_income"]
        f_inc.candidate_value = 120000
        f_inc.user_confirmed = True
        provenance_manager.attach_evidence(f_inc, doc_income.document_id, "Income Cert", "120000", 0.94, 1)

        f_marks = draft.fields["marks_percentage"]
        f_marks.candidate_value = 78.5
        f_marks.user_confirmed = True
        provenance_manager.attach_evidence(f_marks, doc_marksheet.document_id, "Marksheet", "78.5", 0.95, 1)

        f_cat = draft.fields["category"]
        f_cat.candidate_value = "OBC"
        f_cat.user_confirmed = True

        f_inst = draft.fields["institution_name"]
        f_inst.candidate_value = "Govt Polytechnic Moradabad"
        f_inst.user_confirmed = True

        # 3. Conflict Detection: Zero conflicts
        self.assertEqual(len(draft.conflicts), 0)

        # 4. Assess readiness & DAG revalidation
        field_values = {k: f.candidate_value for k, f in draft.fields.items()}
        dag_rep = dependency_manager.execute_selective_revalidation("annual_income", field_values)
        self.assertTrue(dag_rep["is_valid"])

        # 5. Generate final draft package
        pkg = draft_controller.generate_final_draft_package(draft)
        self.assertTrue(pkg.is_ready_for_portal)
        self.assertEqual(pkg.draft_id, draft_id)
        self.assertEqual(pkg.application_payload["applicant_name"], "Yash Sharma")
        self.assertIn("full_name", pkg.evidence_manifest)

    def test_scenario_b_material_contradiction_and_user_resolution(self):
        """Scenario B: Conflicting DOB is blocked with 422, then user resolves it in comparator, allowing final draft."""
        draft = self.draft
        draft_id = draft.draft_id

        doc_aadhaar = DocumentRecord(draft_id=draft_id, document_type="aadhaar", file_name="aadhaar.pdf", sha256_hash="sha_a", storage_path="/vault/a.enc")
        doc_marksheet = DocumentRecord(draft_id=draft_id, document_type="marksheet", file_name="marksheet.pdf", sha256_hash="sha_m", storage_path="/vault/m.enc")
        draft.documents[doc_aadhaar.document_id] = doc_aadhaar
        draft.documents[doc_marksheet.document_id] = doc_marksheet

        # Populate happy path fields
        draft.fields["full_name"].candidate_value = "Yash Sharma"
        draft.fields["full_name"].user_confirmed = True
        draft.fields["annual_income"].candidate_value = 120000
        draft.fields["annual_income"].user_confirmed = True
        draft.fields["marks_percentage"].candidate_value = 75.0
        draft.fields["marks_percentage"].user_confirmed = True
        draft.fields["category"].candidate_value = "OBC"
        draft.fields["category"].user_confirmed = True
        draft.fields["institution_name"].candidate_value = "Govt Polytechnic"
        draft.fields["institution_name"].user_confirmed = True

        # Populate DOB with contradictory evidence
        f_dob = draft.fields["date_of_birth"]
        f_dob.candidate_value = "15/08/2004"
        f_dob.user_confirmed = False
        f_dob.status = FieldReliabilityState.CONFLICTED
        provenance_manager.attach_evidence(f_dob, doc_aadhaar.document_id, "Aadhaar", "15/08/2004", 0.98, 1)
        provenance_manager.attach_evidence(f_dob, doc_marksheet.document_id, "Marksheet", "12/04/2005", 0.95, 1)

        # Inject active conflict
        conflict = ConflictRecord(
            field_key="date_of_birth",
            conflict_type=ConflictType.MATERIAL_CONTRADICTION,
            severity=ConflictSeverity.BLOCKING_ERROR,
            message_hi="जन्म तिथि में गंभीर विसंगति",
            message_en="Material contradiction in date_of_birth",
            evidence_ids=[doc_aadhaar.document_id, doc_marksheet.document_id],
            conflicting_values=[{"doc": "Aadhaar", "val": "15/08/2004"}, {"doc": "Marksheet", "val": "12/04/2005"}],
        )
        draft.conflicts.append(conflict)

        # 1. Hard gating must reject draft generation
        with self.assertRaises(DraftGatingException):
            draft_controller.generate_final_draft_package(draft)

        # 2. User resolves conflict via side-by-side comparator
        f_dob.user_confirmed = True
        f_dob.confirmed_value = "15/08/2004"
        f_dob.candidate_value = "15/08/2004"
        conflict.status = "RESOLVED"

        # Verify both evidence records still exist (no data loss)
        self.assertEqual(len(f_dob.evidences), 2)

        # 3. Now draft generation succeeds cleanly
        pkg = draft_controller.generate_final_draft_package(draft)
        self.assertTrue(pkg.is_ready_for_portal)
        self.assertEqual(pkg.application_payload["dob"], "15/08/2004")

    def test_scenario_c_low_confidence_blur_and_user_confirmation(self):
        """Scenario C: Low OCR confidence / degraded scan is gated until user inspects & confirms."""
        draft = self.draft
        draft_id = draft.draft_id

        doc_inc = DocumentRecord(draft_id=draft_id, document_type="income_certificate", file_name="blur.jpg", sha256_hash="sha_b", storage_path="/vault/b.enc")
        draft.documents[doc_inc.document_id] = doc_inc

        # Fill clean fields
        draft.fields["full_name"].candidate_value = "Yash Sharma"
        draft.fields["full_name"].user_confirmed = True
        draft.fields["date_of_birth"].candidate_value = "15/08/2004"
        draft.fields["date_of_birth"].user_confirmed = True
        draft.fields["marks_percentage"].candidate_value = 75.0
        draft.fields["marks_percentage"].user_confirmed = True
        draft.fields["category"].candidate_value = "OBC"
        draft.fields["category"].user_confirmed = True
        draft.fields["institution_name"].candidate_value = "Govt Polytechnic"
        draft.fields["institution_name"].user_confirmed = True

        # Blurred income field
        f_inc = draft.fields["annual_income"]
        f_inc.candidate_value = "12?000"
        f_inc.user_confirmed = False
        f_inc.status = FieldReliabilityState.NEEDS_REVIEW
        provenance_manager.attach_evidence(f_inc, doc_inc.document_id, "Income Cert", "12?000", 0.45, 1)

        # Must be blocked by draft controller
        with self.assertRaises(DraftGatingException):
            draft_controller.generate_final_draft_package(draft)

        # User inspects and corrects the blurred value to 120000
        f_inc.candidate_value = 120000
        f_inc.user_confirmed = True
        f_inc.confirmed_value = 120000
        f_inc.status = FieldReliabilityState.ELIGIBLE_FOR_DRAFT

        # Draft generation succeeds
        pkg = draft_controller.generate_final_draft_package(draft)
        self.assertTrue(pkg.is_ready_for_portal)
        self.assertEqual(pkg.application_payload["annual_income_inr"], 120000)

    def test_scenario_d_resumable_recovery_and_dpdp_privacy(self):
        """Scenario D: Weak network interrupted upload resumes cleanly, restores checkpoint, and masks Aadhaar."""
        draft_id = self.draft.draft_id

        # 1. Resumable upload chunking
        dummy_file = b"%PDF-1.4\n" + (b"RECOVERY_DOCUMENT_TEST_" * 150)
        init_res = resumable_upload_manager.initiate_upload("income_resilient.pdf", "application/pdf", 2, len(dummy_file))
        upload_id = init_res["upload_id"]

        half = len(dummy_file) // 2
        chunk1 = dummy_file[:half]
        chunk2 = dummy_file[half:]

        # Upload chunk 0
        resumable_upload_manager.receive_chunk(upload_id, 0, chunk1)
        status = resumable_upload_manager.get_upload_status(upload_id)
        self.assertEqual(status["missing_indices"], [1])

        # Resume and upload chunk 1
        resumable_upload_manager.receive_chunk(upload_id, 1, chunk2)
        doc = resumable_upload_manager.stitch_and_finalize(upload_id, draft_id, "income_certificate")
        self.assertEqual(doc.file_name, "income_resilient.pdf")

        # 2. Checkpoint save & restore
        draft_checkpoint_manager.save_checkpoint(draft_id, {"step": "DOCUMENTS_UPLOADED", "document_id": doc.document_id})
        restored_ckpt = draft_checkpoint_manager.get_latest_checkpoint(draft_id)
        self.assertEqual(restored_ckpt["snapshot"]["document_id"], doc.document_id)

        # 3. DPDP Aadhaar Redaction Check
        sanitized = privacy_service.sanitize_dictionary({
            "citizen_name": "Yash Sharma",
            "aadhaar_number": "5412-8921-9843",
            "citizen_phone": "+91 9876543210",
        })
        self.assertEqual(sanitized["aadhaar_number"], "XXXX-XXXX-9843")
        self.assertTrue(sanitized["citizen_phone"].startswith("+91-XXXXX-"))


if __name__ == "__main__":
    unittest.main()
