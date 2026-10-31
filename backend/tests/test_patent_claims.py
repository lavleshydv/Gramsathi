"""Phase 10 Verification: Programmatic Assertion of Core Patent Claims 1 Through 5."""
import unittest
import networkx as nx
from app.models.domain import FieldRecord, EvidenceRecord, ConflictRecord, DraftRecord
from app.models.schemas import FieldReliabilityState, ConflictType, ConflictSeverity
from app.intelligence.provenance_manager import provenance_manager
from app.intelligence.conflict_detector import conflict_detector
from app.intelligence.confidence_manager import confidence_manager
from app.intelligence.draft_controller import draft_controller, DraftGatingException
from app.rules.dependency_manager import dependency_manager
from app.evaluation.benchmark_evaluator import benchmark_evaluator


class TestPatentClaimsVerification(unittest.TestCase):
    """Programmatically verifies each of the 5 core patent claims documented in PATENT_DISCLOSURE_SPECIFICATION.md."""

    def test_claim_1_multi_source_1_to_n_provenance_graph(self):
        """Claim 1: Single canonical field maintains 1:N non-destructive supporting evidence records."""
        field = FieldRecord("f_name", "आवेदक का नाम", "Applicant Name")
        
        # Attach Evidence 1 (Aadhaar)
        ev1 = provenance_manager.attach_evidence(field, "DOC_AADHAAR", "AADHAAR", "Yash Sharma", 0.98, 1, {"x": 10, "y": 20, "width": 100, "height": 30})
        # Attach Evidence 2 (Marksheet with variation)
        ev2 = provenance_manager.attach_evidence(field, "DOC_MARKSHEET", "MARKSHEET", "Yash S Sharma", 0.92, 1, {"x": 15, "y": 25, "width": 105, "height": 30})
        # Attach Evidence 3 (Income Certificate)
        ev3 = provenance_manager.attach_evidence(field, "DOC_INCOME", "INCOME_CERT", "Yash Sharma", 0.96, 1, {"x": 20, "y": 30, "width": 100, "height": 30})

        # Assert 1:N relationship holds; all 3 independent pieces of provenance are preserved
        self.assertEqual(len(field.evidences), 3)
        self.assertEqual(field.evidences[0].document_type, "AADHAAR")
        self.assertEqual(field.evidences[1].raw_text, "Yash S Sharma")
        self.assertEqual(field.evidences[2].document_type, "INCOME_CERT")

    def test_claim_2_deterministic_5_tier_conflict_engine(self):
        """Claim 2: Discrepancies are deterministically classified into exactly 5 stratified tiers."""
        # Tier 1: EXACT_MATCH
        t1_type, t1_sev, _, _ = conflict_detector.classify_pair("Yash Sharma", "Yash Sharma", "full_name")
        self.assertEqual(t1_type, ConflictType.EXACT_MATCH)
        self.assertEqual(t1_sev, ConflictSeverity.INFO)

        # Tier 2: FORMAT_VARIATION (date separators / currency)
        t2_type, t2_sev, _, _ = conflict_detector.classify_pair("15/08/2004", "15-08-2004", "date_of_birth")
        self.assertEqual(t2_type, ConflictType.FORMAT_VARIATION)
        self.assertEqual(t2_sev, ConflictSeverity.INFO)

        # Tier 3: SPELLING_OR_TRANSLITERATION_VARIATION (initials - non-blocking warning)
        t3_type, t3_sev, _, _ = conflict_detector.classify_pair("Yash Sharma", "Yash S Sharma", "full_name")
        self.assertEqual(t3_type, ConflictType.SPELLING_OR_TRANSLITERATION_VARIATION)
        self.assertEqual(t3_sev, ConflictSeverity.WARNING)

        # Tier 4: MATERIAL_CONTRADICTION (differing DOBs - blocking error)
        t4_type, t4_sev, _, _ = conflict_detector.classify_pair("15/08/2004", "12/04/2005", "date_of_birth")
        self.assertEqual(t4_type, ConflictType.MATERIAL_CONTRADICTION)
        self.assertEqual(t4_sev, ConflictSeverity.BLOCKING_ERROR)

        # Tier 5: UNREADABLE_OR_MISSING (glyph uncertainty)
        t5_type, _, _, _ = conflict_detector.classify_pair("12?000", "120000", "annual_income")
        self.assertEqual(t5_type, ConflictType.UNREADABLE_OR_MISSING)

    def test_claim_3_multidimensional_confidence_tensor(self):
        """Claim 3: Tensor C = <C_ocr, C_consist, C_audit, C_rules> eliminates single-scalar collapse."""
        field = FieldRecord("marks", "प्राप्तांक", "Marks")
        field.candidate_value = "78.5"
        provenance_manager.attach_evidence(field, "D1", "MARKSHEET", "78.5", 0.94, 1)

        tensor = confidence_manager.calculate_confidence_tensor(field, active_conflict=None)
        
        # Assert each dimension is independently observable
        self.assertAlmostEqual(tensor.c_ocr, 0.94, places=2)
        self.assertEqual(tensor.c_consist, 1.0)
        self.assertEqual(tensor.c_rules, 1.0)
        self.assertTrue(tensor.is_draft_eligible)
        self.assertGreaterEqual(tensor.composite_score, 0.80)

    def test_claim_4_formal_reliability_state_machine_hard_gating(self):
        """Claim 4: Strict state machine prevents contradictory fields from entering draft (FAR = 0.0%)."""
        draft = DraftRecord(service_id="POST_MATRIC_STATE_SCHOLARSHIP")
        for key in ["full_name", "date_of_birth", "annual_income", "marks_percentage", "category", "institution_name"]:
            f = FieldRecord(key, key, key, candidate_value="VAL")
            f.user_confirmed = True
            draft.fields[key] = f

        # Inject material contradiction on date_of_birth
        draft.fields["date_of_birth"].user_confirmed = False
        draft.conflicts.append(
            ConflictRecord(
                field_key="date_of_birth",
                conflict_type=ConflictType.MATERIAL_CONTRADICTION,
                severity=ConflictSeverity.BLOCKING_ERROR,
                message_hi="जन्म तिथि विरोध",
                message_en="Material contradiction in DOB",
                evidence_ids=["D1", "D2"],
                conflicting_values=[],
            )
        )

        # Must raise DraftGatingException — zero silent leak
        with self.assertRaises(DraftGatingException):
            draft_controller.generate_final_draft_package(draft)

        # Assert empirical False Acceptance Rate is strictly 0.0%
        bench = benchmark_evaluator.evaluate_gramsathi_system()
        self.assertEqual(bench["false_acceptance_rate_pct"], 0.0)

    def test_claim_5_topological_dag_selective_revalidation(self):
        """Claim 5: NetworkX DAG is strictly acyclic and skips independent validation branches."""
        # Acyclicity
        self.assertTrue(nx.is_directed_acyclic_graph(dependency_manager.graph))

        # Downstream selective tracing
        fields = {
            "full_name": "Yash Sharma",
            "date_of_birth": "15/08/2004",
            "annual_income": 120000,
            "marks_percentage": 78.5,
            "category": "OBC",
            "institution_name": "Govt Polytechnic",
        }
        report = dependency_manager.execute_selective_revalidation("annual_income", fields)
        
        # Must evaluate dependent income checks
        self.assertIn("statutory_income_check", report["evaluated_nodes"])
        self.assertIn("fee_waiver_tier_evaluation", report["evaluated_nodes"])

        # Must skip independent academic and age branches
        self.assertIn("academic_merit_check", report["skipped_nodes"])
        self.assertIn("age_eligibility_check", report["skipped_nodes"])
        self.assertGreater(report["skipped_count"], 0)


if __name__ == "__main__":
    unittest.main()
