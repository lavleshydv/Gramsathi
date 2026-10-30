"""OCR Pipeline Service Orchestrator: Combines Image Preprocessing and Pluggable Adapters."""
import os
from typing import Dict, Any, Optional
from app.services.image_preprocessor import image_preprocessor
from app.services.ocr_adapters import (
    BaseOCRAdapter,
    SyntheticFixtureOCRAdapter,
    TesseractOCRAdapter,
    EasyOCRAdapter,
)


class OCRService:
    """Pluggable OCR service coordinating quality check, deskewing, and token extraction."""

    def __init__(self, primary_adapter: Optional[BaseOCRAdapter] = None):
        self.adapter: BaseOCRAdapter = primary_adapter or SyntheticFixtureOCRAdapter()

    def set_adapter(self, adapter: BaseOCRAdapter):
        self.adapter = adapter

    def extract_document(
        self,
        file_bytes: bytes,
        file_name: str,
        doc_type: str,
    ) -> Dict[str, Any]:
        """Preprocesses document and extracts structured attribute candidates."""
        # 1. Preprocess (deskew, binarization, blur detection)
        prep_metadata = image_preprocessor.preprocess_document_bytes(file_bytes, file_name)

        # 2. Extract using active adapter
        raw_candidates = self.adapter.extract_fields(file_bytes, file_name, doc_type)

        # 3. Penalize confidence if document was detected as significantly blurry
        if prep_metadata.get("is_blurry", False):
            for attr, val in raw_candidates.items():
                val["confidence"] = min(val.get("confidence", 0.95), 0.60)
                if "?" not in val.get("raw_text", ""):
                    # Mark uncertainty in text
                    val["raw_text"] = val.get("raw_text", "") + " [BLURRY]"

        return {
            "engine": self.adapter.get_engine_name(),
            "preprocessing": prep_metadata,
            "extracted_fields": raw_candidates,
        }


# Global singleton OCR service
ocr_service = OCRService()
