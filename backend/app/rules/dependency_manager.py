"""Dependency-Aware Validation Graph (DAG) using NetworkX for selective revalidation."""
import json
import os
from typing import Dict, Any, List, Set, Tuple, Optional
import networkx as nx
from app.models.schemas import ValidationIssueItem, ConflictSeverity


class ValidationDependencyManager:
    """Manages the Directed Acyclic Graph (DAG) for selective revalidation on field updates."""

    def __init__(self, config_path: Optional[str] = None):
        if not config_path:
            base_dir = os.path.dirname(__file__)
            config_path = os.path.join(base_dir, "scheme_configs", "post_matric_scholarship.json")
        
        self.config_path = config_path
        with open(config_path, "r", encoding="utf-8") as f:
            self.config = json.load(f)

        self.graph = nx.DiGraph()
        self._build_graph()

    def _build_graph(self):
        """Constructs the NetworkX DiGraph from config nodes and edges."""
        self.graph.clear()
        dag_data = self.config.get("dag_graph", {})
        
        # Add nodes with metadata
        for node in dag_data.get("nodes", []):
            self.graph.add_node(node["id"], node_type=node.get("type", "UNKNOWN"))

        # Add directed edges
        for u, v in dag_data.get("edges", []):
            self.graph.add_edge(u, v)

        # Assert graph is strictly acyclic
        if not nx.is_directed_acyclic_graph(self.graph):
            cycles = list(nx.simple_cycles(self.graph))
            raise ValueError(f"Cycle detected in Validation DAG: {cycles}")

    def get_all_nodes(self) -> List[str]:
        return list(self.graph.nodes)

    def get_downstream_dependencies(self, field_name: str) -> List[str]:
        """Returns all descendant nodes affected by a change to field_name, in topological order."""
        if field_name not in self.graph:
            return []
        
        descendants = nx.descendants(self.graph, field_name)
        # Sort descendants according to the DAG's topological order
        topo_order = list(nx.topological_sort(self.graph))
        return [node for node in topo_order if node in descendants]

    def evaluate_node(self, node_id: str, field_values: Dict[str, Any]) -> Tuple[bool, Optional[ValidationIssueItem], Optional[Dict[str, Any]]]:
        """Evaluates a single rule node or derived calculation node."""
        rules = self.config.get("validation_rules", {})

        if node_id == "identity_completeness_check":
            val = field_values.get("full_name")
            if not val or str(val).strip() == "":
                return False, ValidationIssueItem(
                    field_key="full_name",
                    severity=ConflictSeverity.BLOCKING_ERROR,
                    rule_code="NAME_MISSING",
                    message_hi="आवेदक का पूरा नाम दर्ज होना अनिवार्य है।",
                    message_en="Applicant full name is mandatory.",
                    is_resolved=False,
                ), None
            return True, None, None

        elif node_id == "statutory_income_check":
            val = field_values.get("annual_income")
            if val is None or str(val).strip() == "":
                return False, ValidationIssueItem(
                    field_key="annual_income",
                    severity=ConflictSeverity.BLOCKING_ERROR,
                    rule_code="INCOME_MISSING",
                    message_hi="वार्षिक आय का विवरण अनिवार्य है।",
                    message_en="Annual income is mandatory.",
                    is_resolved=False,
                ), None
            try:
                num = float(str(val).replace(",", "").replace("₹", "").strip())
                max_lim = rules["annual_income"]["max_limit"]
                if num > max_lim:
                    return False, ValidationIssueItem(
                        field_key="annual_income",
                        severity=ConflictSeverity.BLOCKING_ERROR,
                        rule_code="INCOME_CEILING_EXCEEDED",
                        message_hi=f"वार्षिक आय ₹{num:,.0f} निर्धारित सीमा ₹{max_lim:,.0f} से अधिक है।",
                        message_en=f"Annual income ₹{num:,.0f} exceeds statutory limit ₹{max_lim:,.0f}.",
                        is_resolved=False,
                    ), None
                return True, None, {"income_verified": True, "evaluated_income": num}
            except ValueError:
                return False, ValidationIssueItem(
                    field_key="annual_income",
                    severity=ConflictSeverity.BLOCKING_ERROR,
                    rule_code="INVALID_INCOME_NUMBER",
                    message_hi="वार्षिक आय एक वैध संख्या होनी चाहिए।",
                    message_en="Annual income must be a valid number.",
                    is_resolved=False,
                ), None

        elif node_id == "academic_merit_check":
            val = field_values.get("marks_percentage")
            if val is None or str(val).strip() == "":
                return False, ValidationIssueItem(
                    field_key="marks_percentage",
                    severity=ConflictSeverity.BLOCKING_ERROR,
                    rule_code="MARKS_MISSING",
                    message_hi="प्राप्तांक प्रतिशत अनिवार्य है।",
                    message_en="Marks percentage is mandatory.",
                    is_resolved=False,
                ), None
            try:
                pct = float(str(val).replace("%", "").strip())
                min_lim = rules["marks_percentage"]["min_limit"]
                max_lim = rules["marks_percentage"]["max_limit"]
                if pct < min_lim or pct > max_lim:
                    return False, ValidationIssueItem(
                        field_key="marks_percentage",
                        severity=ConflictSeverity.BLOCKING_ERROR,
                        rule_code="MARKS_OUT_OF_RANGE",
                        message_hi=f"अंक प्रतिशत ({pct}%) न्यूनतम {min_lim}% से कम है।",
                        message_en=f"Marks percentage ({pct}%) below minimum {min_lim}%.",
                        is_resolved=False,
                    ), None
                return True, None, {"merit_verified": True, "evaluated_pct": pct}
            except ValueError:
                return False, ValidationIssueItem(
                    field_key="marks_percentage",
                    severity=ConflictSeverity.BLOCKING_ERROR,
                    rule_code="INVALID_MARKS_NUMBER",
                    message_hi="प्रतिशत एक वैध संख्या होनी चाहिए।",
                    message_en="Percentage must be a valid number.",
                    is_resolved=False,
                ), None

        elif node_id == "caste_quota_check":
            cat = str(field_values.get("category") or "").strip().upper()
            allowed = rules["category"]["allowed_values"]
            if cat not in allowed:
                return False, ValidationIssueItem(
                    field_key="category",
                    severity=ConflictSeverity.BLOCKING_ERROR,
                    rule_code="INELIGIBLE_CATEGORY",
                    message_hi=f"वर्ग '{cat}' इस योजना के लिए पात्र नहीं है।",
                    message_en=f"Category '{cat}' is not eligible for this scholarship.",
                    is_resolved=False,
                ), None
            return True, None, {"category_verified": True, "evaluated_category": cat}

        elif node_id == "age_eligibility_check":
            dob_str = str(field_values.get("date_of_birth") or "").strip()
            if not dob_str:
                return False, ValidationIssueItem(
                    field_key="date_of_birth",
                    severity=ConflictSeverity.BLOCKING_ERROR,
                    rule_code="DOB_MISSING",
                    message_hi="जन्म तिथि अनिवार्य है।",
                    message_en="Date of birth is mandatory.",
                    is_resolved=False,
                ), None
            return True, None, {"age_verified": True}

        elif node_id == "institution_validity_check":
            inst = str(field_values.get("institution_name") or "").strip()
            if not inst:
                return False, ValidationIssueItem(
                    field_key="institution_name",
                    severity=ConflictSeverity.BLOCKING_ERROR,
                    rule_code="INSTITUTION_MISSING",
                    message_hi="महाविद्यालय / संस्थान का नाम अनिवार्य है।",
                    message_en="Institution name is mandatory.",
                    is_resolved=False,
                ), None
            return True, None, {"institution_verified": True}

        elif node_id == "fee_waiver_tier_evaluation":
            # Derived node: evaluates benefits based on category + income
            cat = str(field_values.get("category") or "").strip().upper()
            income_raw = str(field_values.get("annual_income") or "").replace(",", "").replace("₹", "").strip()
            try:
                income = float(income_raw) if income_raw else 999999
            except ValueError:
                income = 999999

            tiers = self.config.get("conditional_benefits", {})
            tier1 = tiers.get("tier_1_full_waiver", {})
            tier2 = tiers.get("tier_2_standard_waiver", {})

            if cat in tier1.get("condition_categories", []) and income <= tier1.get("max_income", 100000):
                return True, None, {
                    "tier": "TIER_1_FULL_WAIVER",
                    "benefit_hi": tier1.get("benefit_hi"),
                    "benefit_en": tier1.get("benefit_en"),
                }
            elif cat in tier2.get("condition_categories", []) and income <= tier2.get("max_income", 250000):
                return True, None, {
                    "tier": "TIER_2_STANDARD_WAIVER",
                    "benefit_hi": tier2.get("benefit_hi"),
                    "benefit_en": tier2.get("benefit_en"),
                }
            return True, None, {"tier": "NO_WAIVER", "benefit_en": "Standard Scholarship"}

        return True, None, None

    def execute_selective_revalidation(
        self,
        changed_field: str,
        field_values: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Selectively revalidates ONLY the downstream nodes affected by changed_field."""
        downstream = self.get_downstream_dependencies(changed_field)
        all_rule_nodes = [n for n, d in self.graph.nodes(data=True) if d.get("node_type") in ("RULE", "DERIVED", "DECISION")]
        
        evaluated_nodes = []
        skipped_nodes = [n for n in all_rule_nodes if n not in downstream]
        
        new_issues: List[ValidationIssueItem] = []
        derived_data: Dict[str, Any] = {}
        all_passed = True

        for node_id in downstream:
            evaluated_nodes.append(node_id)
            passed, issue, derived = self.evaluate_node(node_id, field_values)
            if not passed and issue:
                new_issues.append(issue)
                all_passed = False
            if derived:
                derived_data[node_id] = derived

        return {
            "trigger_field": changed_field,
            "evaluated_nodes": evaluated_nodes,
            "skipped_nodes": skipped_nodes,
            "evaluation_count": len(evaluated_nodes),
            "skipped_count": len(skipped_nodes),
            "is_valid": all_passed,
            "issues": new_issues,
            "derived_data": derived_data,
        }


# Global singleton DAG manager
dependency_manager = ValidationDependencyManager()
