"""Resilience Service: Resumable Chunked Uploads & Client Checkpoint Recovery."""
import os
import time
import uuid
import hashlib
from typing import Dict, Any, List, Optional
from app.services.document_service import document_service


class ResumableUploadSession:
    def __init__(self, upload_id: str, file_name: str, file_type: str, total_chunks: int, total_size_bytes: int):
        self.upload_id = upload_id
        self.file_name = file_name
        self.file_type = file_type
        self.total_chunks = total_chunks
        self.total_size_bytes = total_size_bytes
        self.received_chunks: Dict[int, bytes] = {}
        self.chunk_hashes: Dict[int, str] = {}
        self.created_at = time.time()
        self.is_finalized = False


class ResumableUploadManager:
    """Manages chunked uploads for unstable 2G/3G connections, allowing recovery from interruptions."""

    def __init__(self):
        self.sessions: Dict[str, ResumableUploadSession] = {}

    def initiate_upload(self, file_name: str, file_type: str, total_chunks: int, total_size_bytes: int) -> Dict[str, Any]:
        upload_id = f"upl_{uuid.uuid4().hex[:12]}"
        session = ResumableUploadSession(
            upload_id=upload_id,
            file_name=file_name,
            file_type=file_type,
            total_chunks=total_chunks,
            total_size_bytes=total_size_bytes,
        )
        self.sessions[upload_id] = session

        return {
            "upload_id": upload_id,
            "file_name": file_name,
            "total_chunks": total_chunks,
            "total_size_bytes": total_size_bytes,
            "status": "INITIATED",
        }

    def receive_chunk(self, upload_id: str, chunk_index: int, chunk_bytes: bytes, client_chunk_sha256: Optional[str] = None) -> Dict[str, Any]:
        session = self.sessions.get(upload_id)
        if not session:
            raise ValueError(f"Upload session '{upload_id}' not found.")

        if chunk_index < 0 or chunk_index >= session.total_chunks:
            raise ValueError(f"Invalid chunk index {chunk_index}. Total chunks: {session.total_chunks}")

        # Verify integrity of the chunk
        actual_sha256 = hashlib.sha256(chunk_bytes).hexdigest()
        if client_chunk_sha256 and actual_sha256.lower() != client_chunk_sha256.lower():
            raise ValueError(f"Chunk hash mismatch for chunk {chunk_index}.")

        session.received_chunks[chunk_index] = chunk_bytes
        session.chunk_hashes[chunk_index] = actual_sha256

        received_count = len(session.received_chunks)
        progress = round((received_count / session.total_chunks) * 100, 1)

        return {
            "upload_id": upload_id,
            "chunk_index": chunk_index,
            "received_chunks": received_count,
            "total_chunks": session.total_chunks,
            "progress_percent": progress,
            "is_complete": received_count == session.total_chunks,
        }

    def get_upload_status(self, upload_id: str) -> Dict[str, Any]:
        session = self.sessions.get(upload_id)
        if not session:
            raise ValueError(f"Upload session '{upload_id}' not found.")

        received_indices = sorted(list(session.received_chunks.keys()))
        all_indices = set(range(session.total_chunks))
        missing_indices = sorted(list(all_indices - set(received_indices)))

        return {
            "upload_id": upload_id,
            "file_name": session.file_name,
            "total_chunks": session.total_chunks,
            "received_indices": received_indices,
            "missing_indices": missing_indices,
            "is_complete": len(missing_indices) == 0,
            "progress_percent": round((len(received_indices) / session.total_chunks) * 100, 1),
        }

    def stitch_and_finalize(self, upload_id: str, draft_id: str, document_type: str):
        session = self.sessions.get(upload_id)
        if not session:
            raise ValueError(f"Upload session '{upload_id}' not found.")

        if len(session.received_chunks) != session.total_chunks:
            missing = sorted(list(set(range(session.total_chunks)) - set(session.received_chunks.keys())))
            raise ValueError(f"Cannot finalize upload. Missing chunks: {missing}")

        # Assemble chunks in exact numerical order
        stitched_bytes = b"".join(session.received_chunks[i] for i in range(session.total_chunks))

        # Store in encrypted document storage pipeline
        doc_record = document_service.save_document(
            draft_id=draft_id,
            document_type=document_type,
            file_name=session.file_name,
            file_bytes=stitched_bytes,
        )

        session.is_finalized = True
        return doc_record


class CheckpointRecord:
    def __init__(self, checkpoint_id: str, draft_id: str, sequence_number: int, timestamp: int, snapshot: Dict[str, Any], state_hash: str, prev_hash: str):
        self.checkpoint_id = checkpoint_id
        self.draft_id = draft_id
        self.sequence_number = sequence_number
        self.timestamp = timestamp
        self.snapshot = snapshot
        self.state_hash = state_hash
        self.prev_hash = prev_hash

    def to_dict(self) -> Dict[str, Any]:
        return {
            "checkpoint_id": self.checkpoint_id,
            "draft_id": self.draft_id,
            "sequence_number": self.sequence_number,
            "timestamp": self.timestamp,
            "snapshot": self.snapshot,
            "state_hash": self.state_hash,
            "prev_hash": self.prev_hash,
        }


class DraftCheckpointManager:
    """Provides client draft checkpointing with tamper-evident SHA-256 hash chaining."""

    def __init__(self):
        self.checkpoints: Dict[str, List[CheckpointRecord]] = {}

    def save_checkpoint(self, draft_id: str, snapshot_data: Dict[str, Any]) -> Dict[str, Any]:
        history = self.checkpoints.setdefault(draft_id, [])
        seq = len(history) + 1
        ts = int(time.time())
        prev_hash = history[-1].state_hash if history else "0" * 64

        # Compute deterministic state hash
        repr_bytes = str(sorted(snapshot_data.items())).encode("utf-8")
        state_hash = hashlib.sha256(repr_bytes + prev_hash.encode("utf-8")).hexdigest()

        ckpt = CheckpointRecord(
            checkpoint_id=f"ckpt_{uuid.uuid4().hex[:10]}",
            draft_id=draft_id,
            sequence_number=seq,
            timestamp=ts,
            snapshot=snapshot_data,
            state_hash=state_hash,
            prev_hash=prev_hash,
        )
        history.append(ckpt)
        return ckpt.to_dict()

    def get_latest_checkpoint(self, draft_id: str) -> Optional[Dict[str, Any]]:
        history = self.checkpoints.get(draft_id, [])
        if not history:
            return None
        return history[-1].to_dict()

    def verify_checkpoint_chain(self, draft_id: str) -> bool:
        history = self.checkpoints.get(draft_id, [])
        if not history:
            return True

        for i, ckpt in enumerate(history):
            expected_prev = "0" * 64 if i == 0 else history[i - 1].state_hash
            if ckpt.prev_hash != expected_prev:
                return False
            repr_bytes = str(sorted(ckpt.snapshot.items())).encode("utf-8")
            expected_hash = hashlib.sha256(repr_bytes + expected_prev.encode("utf-8")).hexdigest()
            if ckpt.state_hash != expected_hash:
                return False

        return True


resumable_upload_manager = ResumableUploadManager()
draft_checkpoint_manager = DraftCheckpointManager()
