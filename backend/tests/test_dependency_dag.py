"""Phase 6 Verification: Test Scheme Rules & Dependency-Aware Validation DAG."""
import unittest
import networkx as nx
from app.rules.dependency_manager import dependency_manager
from app.rules.rule_engine import rule_engine


class TestDependencyDAG(unittest.TestCase):
    def test_dag_is_strictly_acyclic(self):
        """Verifies the statutory validation graph has zero cycles."""
        self.assertTrue(nx.is_directed_acyclic_graph(dependency_manager.graph))
        self.assertGreaterEqual(len(dependency_manager.graph.nodes), 10)
        self.assertGreaterEqual(len(dependency_manager.graph.edges), 10)

    def test_downstream_dependency_tracing(self):
        """Updating annual_income must only trigger income and fee waiver checks, not academic or age checks."""
        downstream = dependency_manager.get_downstream_dependencies("annual_income")
        
        self.assertIn("statutory_income_check", downstream)
        self.assertIn("fee_waiver_tier_evaluation", downstream)
        self.assertIn("overall_statutory_readiness", downstream)

        # Must NOT evaluate independent checks
        self.assertNotIn("academic_merit_check", downstream)
        self.assertNotIn("age_eligibility_check", downstream)
        self.assertNotIn("caste_quota_check", downstream)

    def test_selective_dag_evaluation_skipped_nodes(self):
        """Tests that independent nodes are placed into skipped_nodes during field mutation."""
        fields = {
            "full_name": "Yash Sharma",
            "date_of_birth": "15/08/2004",
            "annual_income": 120000,
            "marks_percentage": 78.5,
            "category": "OBC",
            "institution_name": "Govt Polytechnic",
        }

        report = dependency_manager.execute_selective_revalidation("annual_income", fields)
        
        self.assertEqual(report["trigger_field"], "annual_income")
        self.assertTrue(report["is_valid"])
        self.assertIn("statutory_income_check", report["evaluated_nodes"])
        
        # Independent nodes must be in skipped_nodes
        self.assertIn("academic_merit_check", report["skipped_nodes"])
        self.assertIn("age_eligibility_check", report["skipped_nodes"])
        self.assertIn("caste_quota_check", report["skipped_nodes"])
        self.assertGreater(report["skipped_count"], 0)

    def test_conditional_benefit_tiers_in_dag(self):
        # 1. SC applicant with income <= 1,00,000 gets Tier 1 100% waiver
        sc_fields = {
            "annual_income": 75000,
            "category": "SC",
        }
        report_sc = dependency_manager.execute_selective_revalidation("annual_income", sc_fields)
        derived = report_sc["derived_data"].get("fee_waiver_tier_evaluation", {})
        self.assertEqual(derived.get("tier"), "TIER_1_FULL_WAIVER")
        self.assertIn("100%", derived.get("benefit_en", ""))

        # 2. OBC applicant with income 1,80,000 gets Tier 2 75% waiver
        obc_fields = {
            "annual_income": 180000,
            "category": "OBC",
        }
        report_obc = dependency_manager.execute_selective_revalidation("annual_income", obc_fields)
        derived_obc = report_obc["derived_data"].get("fee_waiver_tier_evaluation", {})
        self.assertEqual(derived_obc.get("tier"), "TIER_2_STANDARD_WAIVER")
        self.assertIn("75%", derived_obc.get("benefit_en", ""))

    def test_dag_flags_income_ceiling_breach(self):
        over_limit_fields = {
            "annual_income": 320000,  # Exceeds 250,000 limit
            "category": "OBC",
        }
        report = dependency_manager.execute_selective_revalidation("annual_income", over_limit_fields)
        self.assertFalse(report["is_valid"])
        self.assertEqual(len(report["issues"]), 1)
        self.assertEqual(report["issues"][0].rule_code, "INCOME_CEILING_EXCEEDED")


if __name__ == "__main__":
    unittest.main()

