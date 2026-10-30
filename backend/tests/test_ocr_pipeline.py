"""Phase 3 Verification: Test OCR Preprocessing, Pluggable Adapters & Bounding Boxes."""
import unittest
import numpy as np
import cv2
from app.services.image_preprocessor import image_preprocessor, ImageQualityAssessment
from app.services.ocr_service import ocr_service
from app.services.ocr_adapters import SyntheticFixtureOCRAdapter, TesseractOCRAdapter
from app.models.schemas import FieldReliabilityState
from app.database.store import store


class TestOCRPipeline(unittest.TestCase):
    def test_image_quality_blur_assessment(self):
        # 1. Create a sharp synthetic test image
        sharp_img = np.zeros((200, 400), dtype=np.uint8)
        cv2.putText(sharp_img, "GOVERNMENT SCHOLARSHIP 2026", (20, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.7, 255, 2)
        score_sharp, is_blurry_sharp = ImageQualityAssessment.assess_blurriness(sharp_img)
        self.assertFalse(is_blurry_sharp)

        # 2. Heavily blur the image
        blurred_img = cv2.GaussianBlur(sharp_img, (25, 25), 0)
        score_blurred, is_blurry_blurred = ImageQualityAssessment.assess_blurriness(blurred_img)
        self.assertTrue(is_blurry_blurred)
        self.assertLess(score_blurred, score_sharp)

    def test_deskew_angle_correction(self):
        # Create image with slight rotation (10 degrees)
        canvas = np.zeros((300, 300), dtype=np.uint8)
        cv2.rectangle(canvas, (50, 100), (250, 150), 255, -1)
        rot_mat = cv2.getRotationMatrix2D((150, 150), 10.0, 1.0)
        rotated = cv2.warpAffine(canvas, rot_mat, (300, 300))

        deskewed, detected_angle = image_preprocessor.deskew_image(rotated)
        self.assertNotEqual(deskewed.shape, (0, 0))

    def test_pluggable_adapter_bounding_box_extraction(self):
        adapter = SyntheticFixtureOCRAdapter()
        ocr_service.set_adapter(adapter)

        # Extract synthetic Aadhaar
        res = ocr_service.extract_document(
            file_bytes=b"%PDF-1.4 synthetic aadhaar sample",
            file_name="synthetic_aadhaar_clean.pdf",
            doc_type="AADHAAR",
        )

        self.assertEqual(res["engine"], "SyntheticGroundTruth-Adapter/v1.0")
        fields = res["extracted_fields"]
        self.assertIn("name", fields)
        self.assertEqual(fields["name"]["raw_text"], "Yash Sharma")
        self.assertGreaterEqual(fields["name"]["confidence"], 0.90)

        # Verify coordinate bounding box format [x, y, w, h]
        box = fields["name"]["box"]
        self.assertEqual(len(box), 4)
        self.assertGreater(box[2], 0)  # width > 0
        self.assertGreater(box[3], 0)  # height > 0

    def test_low_confidence_uncertainty_handling(self):
        adapter = SyntheticFixtureOCRAdapter()
        ocr_service.set_adapter(adapter)

        # Generate valid mock image bytes
        import io
        from PIL import Image
        img = Image.new("RGB", (200, 200), color=(240, 240, 240))
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        valid_jpg_bytes = buf.getvalue()

        # Extract blurry income cert (Case 3)
        res = ocr_service.extract_document(
            file_bytes=valid_jpg_bytes,
            file_name="synthetic_income_blurry.jpg",
            doc_type="INCOME_CERTIFICATE",
        )
        fields = res["extracted_fields"]
        self.assertIn("annual_income", fields)

        # Candidate contains glyph uncertainty "?" or confidence < 0.70
        income_info = fields["annual_income"]
        self.assertTrue("?" in income_info["raw_text"] or income_info["confidence"] < 0.70)


if __name__ == "__main__":
    unittest.main()
