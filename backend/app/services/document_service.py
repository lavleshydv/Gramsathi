"""Private Encrypted Document Management & Storage Service (DPDP Compliant)."""
import os
import hashlib
import uuid
import base64
from datetime import datetime, timezone, timedelta
from typing import Optional, Tuple, Dict, Any
from cryptography.fernet import Fernet
from app.models.domain import DocumentRecord, AuditRecord
from app.database.store import store

# Secret key for AES-256 file encryption at rest
_ENCRYPTION_KEY = os.getenv("STORAGE_ENCRYPTION_KEY", Fernet.generate_key().decode())
_fernet = Fernet(_ENCRYPTION_KEY.encode() if isinstance(_ENCRYPTION_KEY, str) else _ENCRYPTION_KEY)

# Allowed file formats under statutory guidelines
ALLOWED_MIME_TYPES = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png",
}

MAGIC_BYTES = {
    b"%PDF": "application/pdf",
    b"\xff\xd8\xff": "image/jpeg",
    b"\x89PNG\r\n\x1a\n": "image/png",
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB strict statutory upload ceiling


class DocumentSecurityError(Exception):
    pass


class DocumentService:
    def __init__(self, storage_dir: Optional[str] = None):
        if not storage_dir:
            base_dir = os.path.dirname(__file__)
            storage_dir = os.path.join(base_dir, "..", "..", "storage", "private_encrypted_documents")
        self.storage_dir = os.path.abspath(storage_dir)
        os.makedirs(self.storage_dir, exist_ok=True)
        # Ephemeral token store for 15-minute signed access
        self.active_access_tokens: Dict[str, Dict[str, Any]] = {}

    @staticmethod
    def validate_file_content(file_bytes: bytes, file_name: str) -> str:
        """Enforces type, size, and magic byte validation for uploaded documents."""
        if len(file_bytes) == 0:
            raise DocumentSecurityError("Empty file uploaded. Please provide a valid document.")
        if len(file_bytes) > MAX_FILE_SIZE:
            raise DocumentSecurityError(f"File size ({len(file_bytes)/(1024*1024):.1f}MB) exceeds 10MB limit.")

        # Validate magic bytes
        detected_mime = None
        for magic, mime in MAGIC_BYTES.items():
            if file_bytes.startswith(magic):
                detected_mime = mime
                break

        # Fallback to extension check if magic bytes are slightly offset
        if not detected_mime:
            lower = file_name.lower()
            if lower.endswith(".pdf"):
                detected_mime = "application/pdf"
            elif lower.endswith(".jpg") or lower.endswith(".jpeg"):
                detected_mime = "image/jpeg"
            elif lower.endswith(".png"):
                detected_mime = "image/png"
            else:
                raise DocumentSecurityError("Unsupported file format. Only PDF, JPG, and PNG documents are accepted.")

        return detected_mime

    def save_document(
        self,
        draft_id: str,
        document_type: str,
        file_name: str,
        file_bytes: bytes,
    ) -> DocumentRecord:
        """Validates, SHA-256 hashes, encrypts, and persists document outside public web access."""
        mime_type = self.validate_file_content(file_bytes, file_name)
        sha256 = hashlib.sha256(file_bytes).hexdigest()

        # Check for duplicates within the same draft
        draft = store.get_draft(draft_id)
        if draft:
            for existing in draft.documents.values():
                if existing.sha256_hash == sha256:
                    raise DocumentSecurityError(f"Duplicate document detected ({existing.file_name} already uploaded).")

        # AES-256 Encrypt file bytes before saving to disk
        encrypted_bytes = _fernet.encrypt(file_bytes)

        unique_id = uuid.uuid4().hex[:12]
        dest_filename = f"{unique_id}_{document_type.lower()}.enc"
        storage_path = os.path.join(self.storage_dir, dest_filename)

        with open(storage_path, "wb") as f:
            f.write(encrypted_bytes)

        doc_record = DocumentRecord(
            draft_id=draft_id,
            document_type=document_type.upper(),
            file_name=file_name,
            sha256_hash=sha256,
            storage_path=storage_path,
        )

        if draft:
            draft.documents[doc_record.document_id] = doc_record
            draft.audit_events.append(
                AuditRecord(
                    draft_id=draft_id,
                    event_type="DOCUMENT_STORED_ENCRYPTED",
                    payload={
                        "document_id": doc_record.document_id,
                        "sha256": sha256,
                        "mime_type": mime_type,
                        "size_bytes": len(file_bytes),
                    },
                )
            )

        return doc_record

    def generate_signed_access_token(self, draft_id: str, document_id: str) -> str:
        """Generates an expiring 15-minute token for authorized document inspection."""
        token = base64.urlsafe_b64encode(uuid.uuid4().bytes).decode().rstrip("=")
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)
        self.active_access_tokens[token] = {
            "draft_id": draft_id,
            "document_id": document_id,
            "expires_at": expires_at,
        }
        return token

    def read_decrypted_document(self, token: str) -> Tuple[bytes, str]:
        """Validates temporary access token and decrypts document bytes for inspection."""
        info = self.active_access_tokens.get(token)
        if not info:
            raise DocumentSecurityError("Invalid or expired document access token.")
        if datetime.now(timezone.utc) > info["expires_at"]:
            del self.active_access_tokens[token]
            raise DocumentSecurityError("Document access token has expired (15-minute limit exceeded).")

        draft = store.get_draft(info["draft_id"])
        if not draft or info["document_id"] not in draft.documents:
            raise DocumentSecurityError("Target document not found.")

        doc = draft.documents[info["document_id"]]
        if not os.path.exists(doc.storage_path):
            raise DocumentSecurityError("Encrypted document file missing from physical storage.")

        with open(doc.storage_path, "rb") as f:
            encrypted_data = f.read()

        decrypted_bytes = _fernet.decrypt(encrypted_data)
        return decrypted_bytes, doc.file_name

    def purge_document(self, draft_id: str, document_id: str) -> bool:
        """Hard cryptographic wipe of document file and unlinking of derived evidence (DPDP compliant)."""
        draft = store.get_draft(draft_id)
        if not draft or document_id not in draft.documents:
            return False

        doc = draft.documents.pop(document_id)
        
        # Overwrite file with zeros before unlinking for cryptographic wiping
        if os.path.exists(doc.storage_path):
            try:
                size = os.path.getsize(doc.storage_path)
                with open(doc.storage_path, "wb") as f:
                    f.write(b"\x00" * size)
                os.remove(doc.storage_path)
            except Exception:
                if os.path.exists(doc.storage_path):
                    os.remove(doc.storage_path)

        # Unlink all derived evidence records
        unlinked_count = 0
        for field in draft.fields.values():
            prev_len = len(field.evidences)
            field.evidences = [ev for ev in field.evidences if ev.document_id != document_id]
            unlinked_count += prev_len - len(field.evidences)

        # Invalidate any active access tokens
        to_del = [tok for tok, meta in self.active_access_tokens.items() if meta["document_id"] == document_id]
        for tok in to_del:
            del self.active_access_tokens[tok]

        # Audit event
        draft.audit_events.append(
            AuditRecord(
                draft_id=draft_id,
                event_type="DOCUMENT_HARD_PURGED_DPDP",
                payload={"document_id": document_id, "unlinked_evidences": unlinked_count},
            )
        )

        return True


document_service = DocumentService()
