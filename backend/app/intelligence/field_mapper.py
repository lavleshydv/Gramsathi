"""Maps document-specific attribute labels (e.g. 'student_name', 'applicant_name') to canonical keys."""
from typing import Dict, Optional


DOCUMENT_ATTRIBUTE_MAP = {
    # Aadhaar mappings
    ("AADHAAR", "name"): "full_name",
    ("AADHAAR", "dob"): "date_of_birth",
    ("AADHAAR", "address"): "address",
    ("AADHAAR", "gender"): "gender",
    # Marksheet mappings
    ("MARKSHEET", "student_name"): "full_name",
    ("MARKSHEET", "dob"): "date_of_birth",
    ("MARKSHEET", "percentage"): "marks_percentage",
    ("MARKSHEET", "institution"): "institution_name",
    ("MARKSHEET", "category"): "category",
    # Income certificate mappings
    ("INCOME_CERTIFICATE", "applicant_name"): "full_name",
    ("INCOME_CERTIFICATE", "annual_income"): "annual_income",
    ("INCOME_CERTIFICATE", "certificate_no"): "income_cert_no",
    # Caste certificate mappings
    ("CASTE_CERTIFICATE", "applicant_name"): "full_name",
    ("CASTE_CERTIFICATE", "category"): "category",
}


class FieldMapper:
    @staticmethod
    def map_attribute(doc_type: str, raw_attribute: str) -> Optional[str]:
        return DOCUMENT_ATTRIBUTE_MAP.get((doc_type.upper(), raw_attribute.lower()))


field_mapper = FieldMapper()

