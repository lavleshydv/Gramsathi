"""Dependency-Aware Validation Graph (DAG) for selective revalidation upon field updates."""
from typing import Set, Dict, List


class ValidationDependencyManager:
    def __init__(self):
        # Maps field -> dependent validation checks
        self.dependencies: Dict[str, List[str]] = {
            "annual_income": ["income_ceiling_validation", "fee_reimbursement_tier", "overall_eligibility"],
            "marks_percentage": ["academic_merit_validation", "overall_eligibility"],
            "category": ["caste_quota_validation", "fee_waiver_eligibility", "overall_eligibility"],
            "date_of_birth": ["age_eligibility_validation"],
            "full_name": ["cross_document_identity_verification"],
        }
        self.dirty_nodes: Set[str] = set()

    def mark_dirty(self, changed_field: str) -> Set[str]:
        """Mark a field and its dependent checks dirty."""
        affected = set()
        affected.add(changed_field)
        for dep in self.dependencies.get(changed_field, []):
            affected.add(dep)
        self.dirty_nodes.update(affected)
        return affected

    def clear_dirty(self, node: str):
        self.dirty_nodes.discard(node)

    def get_dirty_nodes(self) -> Set[str]:
        return set(self.dirty_nodes)


dependency_manager = ValidationDependencyManager()

