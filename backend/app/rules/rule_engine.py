"""Deterministic Scheme Validation Engine for statutory criteria evaluation."""
import json
import os
import re
from typing import List, Dict, Any, Tuple
from app.models.schemas import ValidationIssueItem, ConflictSeverity


class SchemeRuleEngine:
    def __init__(self, config_path: str = None):
        if not config_path:
            base_dir = os.path.dirname(__file__)
            config_path = os.path.join(base_dir, "scheme_configs", "post_matric_scholarship.json")
        with open(config_path, "r", encoding="utf-8") as f:
            self.config = json.load(f)

    def validate_fields(self, field_values: Dict[str, Any]) -> List[ValidationIssueItem]:
        issues: List[ValidationIssueItem] = []
        rules = self.config.get("validation_rules", {})
        required = self.config.get("required_fields", [])

        # Check required fields
        for req in required:
            val = field_values.get(req)
            if val is None or str(val).strip() == "":
                issues.append(
                    ValidationIssueItem(
                        field_key=req,
                        severity=ConflictSeverity.BLOCKING_ERROR,
                        rule_code="REQUIRED_FIELD_MISSING",
                        message_hi=f"आवश्यक फ़ील्ड '{req}' खाली है। कृपया इसे भरें।",
                        message_en=f"Mandatory field '{req}' is missing.",
                        is_resolved=False,
                    )
                )

        # Evaluate specific field rules
        # 1. annual_income
        if "annual_income" in field_values and field_values["annual_income"] is not None:
            raw_income = str(field_values["annual_income"]).replace(",", "").replace("₹", "").strip()
            try:
                income = float(raw_income)
                max_income = rules["annual_income"]["max_limit"]
                if income > max_income:
                    issues.append(
                        ValidationIssueItem(
                            field_key="annual_income",
                            severity=ConflictSeverity.BLOCKING_ERROR,
                            rule_code="INCOME_CEILING_EXCEEDED",
                            message_hi=f"वार्षिक आय ₹{income:,.0f} निर्धारित सीमा (₹{max_income:,.0f}) से अधिक है।",
                            message_en=f"Annual income ₹{income:,.0f} exceeds scheme ceiling of ₹{max_income:,.0f}.",
                            is_resolved=False,
                        )
                    )
            except ValueError:
                issues.append(
                    ValidationIssueItem(
                        field_key="annual_income",
                        severity=ConflictSeverity.BLOCKING_ERROR,
                        rule_code="INVALID_NUMERIC_FORMAT",
                        message_hi="वार्षिक आय एक वैध संख्या होनी चाहिए।",
                        message_en="Annual income must be a valid number.",
                        is_resolved=False,
                    )
                )

        # 2. marks_percentage
        if "marks_percentage" in field_values and field_values["marks_percentage"] is not None:
            raw_pct = str(field_values["marks_percentage"]).replace("%", "").strip()
            try:
                pct = float(raw_pct)
                min_pct = rules["marks_percentage"]["min_limit"]
                max_pct = rules["marks_percentage"]["max_limit"]
                if pct < min_pct or pct > max_pct:
                    issues.append(
                        ValidationIssueItem(
                            field_key="marks_percentage",
                            severity=ConflictSeverity.BLOCKING_ERROR,
                            rule_code="MARKS_PERCENTAGE_OUT_OF_RANGE",
                            message_hi=f"प्राप्तांक ({pct}%) न्यूनतम {min_pct}% से कम या अमान्य है।",
                            message_en=f"Marks ({pct}%) below statutory threshold of {min_pct}%.",
                            is_resolved=False,
                        )
                    )
            except ValueError:
                issues.append(
                    ValidationIssueItem(
                        field_key="marks_percentage",
                        severity=ConflictSeverity.BLOCKING_ERROR,
                        rule_code="INVALID_PERCENTAGE_FORMAT",
                        message_hi="प्रतिशत एक वैध संख्या होनी चाहिए।",
                        message_en="Percentage must be a valid number.",
                        is_resolved=False,
                    )
                )

        # 3. category
        if "category" in field_values and field_values["category"]:
            cat = str(field_values["category"]).strip().upper()
            allowed = rules["category"]["allowed_values"]
            if cat not in allowed:
                issues.append(
                    ValidationIssueItem(
                        field_key="category",
                        severity=ConflictSeverity.BLOCKING_ERROR,
                        rule_code="INELIGIBLE_CATEGORY",
                        message_hi=f"वर्ग '{cat}' इस छात्रवृत्ति के लिए पात्र नहीं है ({', '.join(allowed)} अनिवार्य)।",
                        message_en=f"Category '{cat}' is not eligible for this scholarship.",
                        is_resolved=False,
                    )
                )

        return issues


rule_engine = SchemeRuleEngine()

