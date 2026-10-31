"""Phase 9 Verification: Quantitative Comparative Benchmark Evaluation."""
import unittest
from app.evaluation.benchmark_evaluator import benchmark_evaluator


class TestQuantitativeBenchmarks(unittest.TestCase):
    def setUp(self):
        self.report = benchmark_evaluator.run_full_comparative_benchmark()

    def test_gramsathi_zero_false_acceptance_rate(self):
        """Verifies that GramSathi's hard gating prevents 100% of invalid/conflicted drafts (FAR = 0.0%)."""
        gramsathi_metrics = self.report["gramsathi"]
        baseline_metrics = self.report["baseline"]

        # Baseline blindly accepts flawed cases
        self.assertGreater(baseline_metrics["false_acceptance_rate_pct"], 50.0)

        # GramSathi must achieve strictly 0.0% False Acceptance Rate
        self.assertEqual(gramsathi_metrics["false_acceptance_rate_pct"], 0.0)

    def test_conflict_detection_precision_and_recall(self):
        """Verifies that 100% of cross-document discrepancies are caught by the 5-tier engine."""
        gramsathi = self.report["gramsathi"]
        baseline = self.report["baseline"]

        self.assertEqual(gramsathi["conflict_detection_recall_pct"], 100.0)
        self.assertEqual(gramsathi["conflict_detection_precision_pct"], 100.0)
        self.assertEqual(baseline["conflict_detection_recall_pct"], 0.0)

    def test_selective_dag_revalidation_efficiency(self):
        """Verifies that topological DAG revalidation avoids redundant full-graph recalculation."""
        gramsathi = self.report["gramsathi"]
        self.assertGreaterEqual(gramsathi["selective_revalidation_efficiency_pct"], 40.0)

    def test_complete_evidence_traceability(self):
        """Verifies that 100% of final draft fields retain cryptographic links to source documents."""
        gramsathi = self.report["gramsathi"]
        self.assertEqual(gramsathi["evidence_traceability_pct"], 100.0)


if __name__ == "__main__":
    unittest.main()

