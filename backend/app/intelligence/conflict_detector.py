"""Deterministic Conflict Detection Engine: Classifies multi-source field evidence variations."""
import re
from typing import List, Tuple, Optional, Dict, Any
from app.models.schemas import ConflictType, ConflictSeverity
from app.models.domain import EvidenceRecord, ConflictRecord


class ConflictDetector:
    @staticmethod
    def normalize_string(val: str) -> str:
        if not val:
            return ""
        # Lowercase, strip punctuation and extra spaces
        val = val.lower().strip()
        val = re.sub(r"[^\w\s]", "", val)
        return " ".join(val.split())

    @staticmethod
    def classify_pair(
        val_a: str,
        val_b: str,
        field_key: str,
    ) -> Tuple[ConflictType, ConflictSeverity, str, str]:
        """Classifies variation between two extracted values for the same canonical field."""
        if not val_a or not val_b or "?" in val_a or "?" in val_b:
            return (
                ConflictType.UNREADABLE_OR_MISSING,
                ConflictSeverity.WARNING,
                "दस्तावेज़ में अक्षर अस्पष्ट या गायब हैं।",
                "Unreadable or missing text in one or more documents.",
            )

        norm_a = ConflictDetector.normalize_string(val_a)
        norm_b = ConflictDetector.normalize_string(val_b)

        # 1. Exact Match
        if norm_a == norm_b:
            return (
                ConflictType.EXACT_MATCH,
                ConflictSeverity.INFO,
                "सभी दस्तावेज़ों में जानकारी बिल्कुल समान है।",
                "Exact match across supporting documents.",
            )

        # 2. Date of Birth Comparison: Material contradiction if different
        if field_key == "date_of_birth":
            # Check format variation e.g. 15-08-2004 vs 15/08/2004
            clean_a = val_a.replace("-", "/").strip()
            clean_b = val_b.replace("-", "/").strip()
            if clean_a == clean_b:
                return (
                    ConflictType.FORMAT_VARIATION,
                    ConflictSeverity.INFO,
                    "जन्म तिथि का प्रारूप भिन्न है (उदा. '-' बनाम '/') परंतु तारीख समान है।",
                    "Format variation in date of birth (same calendar date).",
                )
            else:
                return (
                    ConflictType.MATERIAL_CONTRADICTION,
                    ConflictSeverity.BLOCKING_ERROR,
                    f"जन्म तिथि में गंभीर विसंगति है: '{val_a}' बनाम '{val_b}'।",
                    f"Material contradiction in date of birth: '{val_a}' vs '{val_b}'.",
                )

        # 3. Numeric comparison (e.g. income or percentage)
        num_re = r"[^\d.]"
        num_a = re.sub(num_re, "", str(val_a))
        num_b = re.sub(num_re, "", str(val_b))
        if num_a and num_b:
            try:
                if float(num_a) == float(num_b):
                    return (
                        ConflictType.FORMAT_VARIATION,
                        ConflictSeverity.INFO,
                        "संख्यात्मक मान समान है (केवल मुद्रा या अल्पविराम का अंतर)।",
                        "Format variation in numerical value.",
                    )
                else:
                    return (
                        ConflictType.MATERIAL_CONTRADICTION,
                        ConflictSeverity.BLOCKING_ERROR,
                        f"संख्यात्मक मान में विसंगति: '{val_a}' बनाम '{val_b}'।",
                        f"Material contradiction in numerical value: '{val_a}' vs '{val_b}'.",
                    )
            except ValueError:
                pass

        # 4. Name / Text comparison
        tokens_a = set(norm_a.split())
        tokens_b = set(norm_b.split())

        # Check for initials or subset variation (e.g. Yash Sharma vs Yash S Sharma)
        if tokens_a.issubset(tokens_b) or tokens_b.issubset(tokens_a) or len(tokens_a.symmetric_difference(tokens_b)) <= 1:
            return (
                ConflictType.SPELLING_OR_TRANSLITERATION_VARIATION,
                ConflictSeverity.WARNING,
                f"नाम की वर्तनी/मध्य नाम में अंतर पाया गया: '{val_a}' बनाम '{val_b}'।",
                f"Spelling/initials variation detected: '{val_a}' vs '{val_b}'.",
            )

        # 5. Default to Material Contradiction
        return (
            ConflictType.MATERIAL_CONTRADICTION,
            ConflictSeverity.BLOCKING_ERROR,
            f"गंभीर विसंगति: '{val_a}' बनाम '{val_b}'।",
            f"Material contradiction: '{val_a}' vs '{val_b}'.",
        )

    @classmethod
    def evaluate_field_conflicts(cls, field_key: str, evidences: List[EvidenceRecord]) -> Optional[ConflictRecord]:
        if len(evidences) < 2:
            return None

        # Compare pairwise
        highest_severity = ConflictSeverity.INFO
        worst_conflict_type = ConflictType.EXACT_MATCH
        msg_hi = ""
        msg_en = ""
        conflicting_values = []

        for i in range(len(evidences)):
            conflicting_values.append({
                "evidence_id": evidences[i].evidence_id,
                "document_type": evidences[i].document_type,
                "raw_text": evidences[i].raw_text,
            })
            for j in range(i + 1, len(evidences)):
                c_type, c_sev, m_hi, m_en = cls.classify_pair(
                    evidences[i].raw_text,
                    evidences[j].raw_text,
                    field_key,
                )
                if c_sev == ConflictSeverity.BLOCKING_ERROR:
                    highest_severity = ConflictSeverity.BLOCKING_ERROR
                    worst_conflict_type = c_type
                    msg_hi = m_hi
                    msg_en = m_en
                    break
                elif c_sev == ConflictSeverity.WARNING and highest_severity != ConflictSeverity.BLOCKING_ERROR:
                    highest_severity = ConflictSeverity.WARNING
                    worst_conflict_type = c_type
                    msg_hi = m_hi
                    msg_en = m_en

        if worst_conflict_type in (
            ConflictType.SPELLING_OR_TRANSLITERATION_VARIATION,
            ConflictType.MATERIAL_CONTRADICTION,
            ConflictType.UNREADABLE_OR_MISSING,
        ):
            return ConflictRecord(
                field_key=field_key,
                conflict_type=worst_conflict_type,
                severity=highest_severity,
                message_hi=msg_hi,
                message_en=msg_en,
                evidence_ids=[e.evidence_id for e in evidences],
                conflicting_values=conflicting_values,
            )

        return None


conflict_detector = ConflictDetector()

