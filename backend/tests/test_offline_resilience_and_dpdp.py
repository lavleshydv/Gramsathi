"""Phase 8 Verification: Offline Resilience, Resumable Chunked Uploads & DPDP Security."""
import unittest
import hashlib
from app.services.resilience_service import resumable_upload_manager, draft_checkpoint_manager
from app.services.privacy_service import privacy_service
from app.database.store import store


class TestOfflineResilienceAndDPDP(unittest.TestCase):
    def setUp(self):
        self.draft = store.create_draft("POST_MATRIC_STATE_SCHOLARSHIP", "2.0.0")

    def test_resumable_chunk_upload_and_stitching(self):
        """Tests that a file split into chunks can be uploaded out-of-order, query missing chunks, and stitch cleanly."""
        original_data = b"%PDF-1.4\n" + (b"GRAMSATHI_RESILIENT_OFFLINE_PAYLOAD_CHUNK_DATA_" * 200)  # ~9.6 KB
        total_size = len(original_data)
        chunk_size = total_size // 3
        chunks = [
            original_data[:chunk_size],
            original_data[chunk_size : chunk_size * 2],
            original_data[chunk_size * 2 :],
        ]

        # 1. Initiate upload
        init_res = resumable_upload_manager.initiate_upload(
            file_name="marksheet_chunked.pdf",
            file_type="application/pdf",
            total_chunks=3,
            total_size_bytes=total_size,
        )
        upload_id = init_res["upload_id"]

        # 2. Upload Chunk 0
        res0 = resumable_upload_manager.receive_chunk(
            upload_id=upload_id,
            chunk_index=0,
            chunk_bytes=chunks[0],
            client_chunk_sha256=hashlib.sha256(chunks[0]).hexdigest(),
        )
        self.assertEqual(res0["received_chunks"], 1)
        self.assertFalse(res0["is_complete"])

        # 3. Upload Chunk 2 first (simulate packet reordering / network jump)
        res2 = resumable_upload_manager.receive_chunk(
            upload_id=upload_id,
            chunk_index=2,
            chunk_bytes=chunks[2],
            client_chunk_sha256=hashlib.sha256(chunks[2]).hexdigest(),
        )
        self.assertEqual(res2["received_chunks"], 2)
        self.assertFalse(res2["is_complete"])

        # 4. Inquire status — chunk 1 must be flagged as missing
        status = resumable_upload_manager.get_upload_status(upload_id)
        self.assertEqual(status["missing_indices"], [1])
        self.assertFalse(status["is_complete"])

        # 5. Send missing Chunk 1
        res1 = resumable_upload_manager.receive_chunk(
            upload_id=upload_id,
            chunk_index=1,
            chunk_bytes=chunks[1],
            client_chunk_sha256=hashlib.sha256(chunks[1]).hexdigest(),
        )
        self.assertTrue(res1["is_complete"])

        # 6. Finalize and stitch
        doc_record = resumable_upload_manager.stitch_and_finalize(
            upload_id=upload_id,
            draft_id=self.draft.draft_id,
            document_type="marksheet",
        )
        self.assertEqual(doc_record.file_name, "marksheet_chunked.pdf")
        self.assertEqual(doc_record.sha256_hash, hashlib.sha256(original_data).hexdigest())

    def test_corrupted_chunk_hash_rejection(self):
        """Verifies that tampering with chunk bytes triggers an immediate integrity failure."""
        chunk = b"Valid chunk bytes"
        init_res = resumable_upload_manager.initiate_upload("test.pdf", "application/pdf", 1, len(chunk))
        upload_id = init_res["upload_id"]

        with self.assertRaises(ValueError):
            resumable_upload_manager.receive_chunk(
                upload_id=upload_id,
                chunk_index=0,
                chunk_bytes=chunk,
                client_chunk_sha256="0000000000000000000000000000000000000000000000000000000000000000",
            )

    def test_draft_checkpoint_tamper_evident_chain(self):
        """Verifies incremental checkpoints with cryptographic SHA-256 chaining."""
        draft_id = self.draft.draft_id

        # Checkpoint 1
        ckpt1 = draft_checkpoint_manager.save_checkpoint(
            draft_id,
            {"step": "PERSONAL_INFO", "full_name": "Yash Sharma", "dob": "15/08/2004"},
        )
        self.assertEqual(ckpt1["sequence_number"], 1)
        self.assertEqual(ckpt1["prev_hash"], "0" * 64)

        # Checkpoint 2
        ckpt2 = draft_checkpoint_manager.save_checkpoint(
            draft_id,
            {"step": "INCOME_INFO", "annual_income": 120000, "category": "OBC"},
        )
        self.assertEqual(ckpt2["sequence_number"], 2)
        self.assertEqual(ckpt2["prev_hash"], ckpt1["state_hash"])

        # Verify chain integrity
        self.assertTrue(draft_checkpoint_manager.verify_checkpoint_chain(draft_id))

        # Check latest
        latest = draft_checkpoint_manager.get_latest_checkpoint(draft_id)
        self.assertEqual(latest["sequence_number"], 2)
        self.assertEqual(latest["snapshot"]["annual_income"], 120000)

    def test_aadhaar_8_digit_masking_dpdp(self):
        """Verifies strict 8-digit masking of Aadhaar numbers across separated and contiguous forms."""
        # Hyphen separated
        res1 = privacy_service.mask_aadhaar("आवेदक का आधार: 5412-8921-9843 है")
        self.assertIn("XXXX-XXXX-9843", res1)
        self.assertNotIn("5412", res1)
        self.assertNotIn("8921", res1)

        # Space separated
        res2 = privacy_service.mask_aadhaar("Aadhaar Number 9876 5432 1098")
        self.assertIn("XXXX-XXXX-1098", res2)

        # Contiguous 12 digits
        res3 = privacy_service.mask_aadhaar("UID: 123456789012")
        self.assertIn("XXXXXXXX9012", res3)
        self.assertNotIn("12345678", res3)

    def test_dpdp_consent_receipt_generation(self):
        """Verifies statutory DPDP 2023 compliance receipt generation."""
        receipt = privacy_service.generate_consent_receipt(
            session_id="ses_abc123",
            citizen_phone="9876543210",
            purpose="POST_MATRIC_SCHOLARSHIP_2026",
        )
        self.assertIn("consent_token", receipt)
        self.assertEqual(receipt["legal_framework"], "Digital Personal Data Protection Act (DPDP), 2023")
        self.assertEqual(receipt["retention_period_days"], 180)
        self.assertIn("Right of grievance redressal", receipt["citizen_rights"])
        self.assertTrue(receipt["citizen_phone_masked"].endswith("3210"))


if __name__ == "__main__":
    unittest.main()
