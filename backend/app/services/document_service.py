"""Private Document Management & Storage Service."""
import hashlib
import os
import uuid
from typing import Tuple
from app.models.domain import DocumentRecord
from app.database.store import store


class DocumentService:
    def __init__(self, storage_dir: str = None):
        if not storage_dir:
            base_dir = os.path.dirname(__file__)
            storage_dir = os.path.join(base_dir, "..", "..", "storage", "private_documents")
        self.storage_dir = os.path.abspath(storage_dir)
        os.makedirs(self.storage_dir, exist_ok=True)

    def save_document(self, draft_id: str, document_type: str, file_name: str, file_bytes: bytes) -> DocumentRecord:
        sha256 = hashlib.sha256(file_bytes).hexdigest()
        unique_id = uuid.uuid4().hex[:12]
        dest_filename = f"{unique_id}_{file_name}"
        storage_path = os.path.join(self.storage_dir, dest_filename)

        with open(storage_path, "wb") as f:
            f.write(file_bytes)

        doc_record = DocumentRecord(
            draft_id=draft_id,
            document_type=document_type.upper(),
            file_name=file_name,
            sha256_hash=sha256,
            storage_path=storage_path,
        )

        draft = store.get_draft(draft_id)
        if draft:
            draft.documents[doc_record.document_id] = doc_record

        return doc_record

    def purge_document(self, draft_id: str, document_id: str) -> bool:
        draft = store.get_draft(draft_id)
        if not draft or document_id not in draft.documents:
            return False

        doc = draft.documents.pop(document_id)
        if os.path.exists(doc.storage_path):
            os.remove(doc.storage_path)

        # Remove associated evidence from fields
        for field in draft.fields.values():
            field.evidences = [ev for ev in field.evidences if ev.document_id != document_id]

        return True


document_service = DocumentService()

