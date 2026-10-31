"""Resilience & Privacy Endpoints (v1)."""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Body
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.services.resilience_service import resumable_upload_manager, draft_checkpoint_manager
from app.services.privacy_service import privacy_service
from app.database.store import store

router = APIRouter(prefix="/v1", tags=["Resilience & DPDP Privacy"])


class InitiateUploadRequest(BaseModel):
    file_name: str
    file_type: str
    total_chunks: int
    total_size_bytes: int


class CheckpointRequest(BaseModel):
    snapshot: Dict[str, Any]


class MaskAadhaarRequest(BaseModel):
    text: str


@router.post("/uploads/initiate")
def initiate_resumable_upload(req: InitiateUploadRequest):
    """Initiates a resumable chunked upload session for weak 2G/3G network conditions."""
    return resumable_upload_manager.initiate_upload(
        file_name=req.file_name,
        file_type=req.file_type,
        total_chunks=req.total_chunks,
        total_size_bytes=req.total_size_bytes,
    )


@router.post("/uploads/chunk")
async def upload_file_chunk(
    upload_id: str = Form(...),
    chunk_index: int = Form(...),
    chunk_file: UploadFile = File(...),
    chunk_sha256: Optional[str] = Form(None),
):
    """Receives an individual chunk, records its SHA-256 integrity, and returns sync status."""
    content = await chunk_file.read()
    try:
        result = resumable_upload_manager.receive_chunk(
            upload_id=upload_id,
            chunk_index=chunk_index,
            chunk_bytes=content,
            client_chunk_sha256=chunk_sha256,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/uploads/{upload_id}/status")
def get_upload_status(upload_id: str):
    """Returns list of received vs missing chunks to allow resume after disconnection."""
    try:
        return resumable_upload_manager.get_upload_status(upload_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/uploads/{upload_id}/finalize")
def finalize_upload(upload_id: str, draft_id: str = Body(..., embed=True), document_type: str = Body(..., embed=True)):
    """Stitches all uploaded chunks, validates whole-file SHA-256, and stores in encrypted vault."""
    draft = store.get_draft(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    try:
        doc_record = resumable_upload_manager.stitch_and_finalize(
            upload_id=upload_id,
            draft_id=draft_id,
            document_type=document_type,
        )
        return {
            "upload_id": upload_id,
            "status": "FINALIZED",
            "document_id": doc_record.document_id,
            "file_name": doc_record.file_name,
            "sha256_hash": doc_record.sha256_hash,
            "document_type": doc_record.document_type,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/drafts/{draft_id}/checkpoint")
def save_draft_checkpoint(draft_id: str, req: CheckpointRequest):
    """Saves a client checkpoint with cryptographic tamper-evident SHA-256 chaining."""
    draft = store.get_draft(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    return draft_checkpoint_manager.save_checkpoint(draft_id, req.snapshot)


@router.get("/drafts/{draft_id}/checkpoint")
def get_latest_checkpoint(draft_id: str):
    """Fetches the latest draft checkpoint for instant recovery after browser/app crash."""
    draft = store.get_draft(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    ckpt = draft_checkpoint_manager.get_latest_checkpoint(draft_id)
    if not ckpt:
        raise HTTPException(status_code=404, detail="No checkpoint found for this draft.")
    return ckpt


@router.post("/privacy/mask-aadhaar")
def mask_aadhaar_endpoint(req: MaskAadhaarRequest):
    """Redacts first 8 digits of Aadhaar numbers for DPDP Act compliance."""
    masked = privacy_service.mask_aadhaar(req.text)
    return {"original_length": len(req.text), "masked_text": masked}

