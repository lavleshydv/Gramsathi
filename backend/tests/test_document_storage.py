"""Phase 2 Verification: Test Private Encrypted Document Storage & DPDP Purge."""
import unittest
import os
from app.services.document_service import document_service, DocumentSecurityError
from app.database.store import store


class TestDocumentStorage(unittest.TestCase):
    def setUp(self):
        self.draft = store.create_draft(service_id="POST_MATRIC_STATE_SCHOLARSHIP")

    def test_file_size_and_format_validation(self):
        # Empty file check
        with self.assertRaises(DocumentSecurityError):
            document_service.validate_file_content(b"", "empty.pdf")

        # Unsupported format check (.exe)
        with self.assertRaises(DocumentSecurityError):
            document_service.validate_file_content(b"MZ\x90\x00\x03\x00\x00\x00", "malware.exe")

        # Valid PDF header
        mime = document_service.validate_file_content(b"%PDF-1.4 sample content", "marksheet.pdf")
        self.assertEqual(mime, "application/pdf")

    def test_sha256_hashing_and_encryption_at_rest(self):
        sample_bytes = b"%PDF-1.4 Fake Aadhaar Identity Document for Testing"
        doc = document_service.save_document(
            draft_id=self.draft.draft_id,
            document_type="AADHAAR",
            file_name="synthetic_aadhaar.pdf",
            file_bytes=sample_bytes,
        )

        self.assertTrue(doc.document_id.startswith("DOC-"))
        self.assertIsNotNone(doc.sha256_hash)
        self.assertEqual(len(doc.sha256_hash), 64)  # 64-character SHA-256 hex string

        # Verify physical file on disk is encrypted (raw text not present)
        with open(doc.storage_path, "rb") as f:
            raw_disk = f.read()
        self.assertNotIn(b"Fake Aadhaar Identity Document", raw_disk)

        # Verify temporary access token read allows decryption
        token = document_service.generate_signed_access_token(self.draft.draft_id, doc.document_id)
        decrypted_bytes, fname = document_service.read_decrypted_document(token)
        self.assertEqual(decrypted_bytes, sample_bytes)
        self.assertEqual(fname, "synthetic_aadhaar.pdf")

    def test_duplicate_document_rejection(self):
        sample_bytes = b"%PDF-1.4 Duplicate Document Test"
        document_service.save_document(
            draft_id=self.draft.draft_id,
            document_type="MARKSHEET",
            file_name="marksheet_v1.pdf",
            file_bytes=sample_bytes,
        )

        # Uploading exact identical content must be rejected
        with self.assertRaises(DocumentSecurityError):
            document_service.save_document(
                draft_id=self.draft.draft_id,
                document_type="MARKSHEET",
                file_name="marksheet_v2.pdf",
                file_bytes=sample_bytes,
            )

    def test_hard_purge_and_evidence_unlinking_dpdp(self):
        sample_bytes = b"%PDF-1.4 Income Certificate for Deletion"
        doc = document_service.save_document(
            draft_id=self.draft.draft_id,
            document_type="INCOME_CERTIFICATE",
            file_name="income_cert.pdf",
            file_bytes=sample_bytes,
        )

        # Attach an evidence record to field
        from app.models.domain import EvidenceRecord
        self.draft.fields["annual_income"].evidences.append(
            EvidenceRecord(document_id=doc.document_id, document_type="INCOME_CERTIFICATE", raw_text="120000")
        )
        self.assertEqual(len(self.draft.fields["annual_income"].evidences), 1)

        # Hard purge
        purged = document_service.purge_document(self.draft.draft_id, doc.document_id)
        self.assertTrue(purged)
        self.assertFalse(os.path.exists(doc.storage_path))

        # Check evidence was unlinked from field
        self.assertEqual(len(self.draft.fields["annual_income"].evidences), 0)


if __name__ == "__main__":
    unittest.main()

