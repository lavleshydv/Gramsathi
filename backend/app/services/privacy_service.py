"""DPDP (Digital Personal Data Protection Act) Privacy & Redaction Service."""
import re
import hashlib
import time
from typing import Dict, Any, Optional, List


class DPDPPrivacyService:
    """Provides PII redaction, Aadhaar 8-digit masking, and DPDP-compliant consent tracking."""

    # Regex patterns for 12-digit Aadhaar numbers (with optional space/hyphen separators)
    AADHAAR_SEPARATOR_PATTERN = re.compile(r"\b(\d{4})[ -](\d{4})[ -](\d{4})\b")
    AADHAAR_CONTIGUOUS_PATTERN = re.compile(r"\b(\d{8})(\d{4})\b")

    # Regex for 10-digit mobile numbers with optional +91 prefix
    PHONE_PATTERN = re.compile(r"(\+?91)?[ -]?([6-9]\d{5})(\d{4})\b")

    @classmethod
    def mask_aadhaar(cls, text_or_value: Any) -> str:
        """Masks first 8 digits of Aadhaar numbers, retaining only the last 4 digits (e.g., XXXX-XXXX-1234)."""
        if text_or_value is None:
            return ""
        
        val_str = str(text_or_value)
        # Replace separated format (1234-5678-9012 -> XXXX-XXXX-9012)
        masked = cls.AADHAAR_SEPARATOR_PATTERN.sub(r"XXXX-XXXX-\3", val_str)
        # Replace contiguous format (123456789012 -> XXXXXXXX9012)
        masked = cls.AADHAAR_CONTIGUOUS_PATTERN.sub(r"XXXXXXXX\2", masked)
        return masked

    @classmethod
    def mask_phone(cls, phone_str: str) -> str:
        """Masks phone number leaving only country prefix and last 4 digits."""
        if not phone_str:
            return ""
        return cls.PHONE_PATTERN.sub(r"+91-XXXXX-\3", phone_str)

    @classmethod
    def sanitize_dictionary(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        """Recursively sanitizes dictionary keys and values for audit logs and telemetry."""
        sanitized = {}
        for k, v in data.items():
            if isinstance(v, dict):
                sanitized[k] = cls.sanitize_dictionary(v)
            elif isinstance(v, list):
                sanitized[k] = [cls.sanitize_dictionary(item) if isinstance(item, dict) else cls.mask_aadhaar(item) for item in v]
            elif isinstance(v, str):
                if "aadhaar" in k.lower() or "uid" in k.lower() or "id_number" in k.lower():
                    sanitized[k] = cls.mask_aadhaar(v)
                elif "phone" in k.lower() or "mobile" in k.lower():
                    sanitized[k] = cls.mask_phone(v)
                else:
                    sanitized[k] = cls.mask_aadhaar(v)
            else:
                sanitized[k] = v
        return sanitized

    @classmethod
    def generate_consent_receipt(cls, session_id: str, citizen_phone: str, purpose: str = "POST_MATRIC_SCHOLARSHIP_2026") -> Dict[str, Any]:
        """Generates an immutable DPDP-compliant consent receipt."""
        timestamp = int(time.time())
        masked_phone = cls.mask_phone(citizen_phone)
        salt = f"{session_id}:{masked_phone}:{timestamp}"
        consent_token = hashlib.sha256(salt.encode("utf-8")).hexdigest()

        return {
            "consent_token": consent_token,
            "session_id": session_id,
            "citizen_phone_masked": masked_phone,
            "timestamp": timestamp,
            "purpose": purpose,
            "legal_framework": "Digital Personal Data Protection Act (DPDP), 2023",
            "data_fiduciary": "GramSathi Rural Welfare Service Platform",
            "retention_period_days": 180,
            "citizen_rights": [
                "Right to access summary of processed personal data",
                "Right to correction and erasure (cryptographic purge)",
                "Right of grievance redressal",
                "Right to nominate another individual in event of death/incapacity",
            ],
            "is_active": True,
        }


privacy_service = DPDPPrivacyService()

