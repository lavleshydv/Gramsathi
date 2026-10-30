"""Evidence API endpoints (v1)."""
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.database.store import store

router = APIRouter(prefix="/v1/drafts", tags=["Evidence"])


@router.get("/{draft_id}/evidence")
def get_draft_evidence(draft_id: str):
    draft = store.get_draft(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    result = {}
    for key, field in draft.fields.items():
        result[key] = [
            {
                "evidence_id": ev.evidence_id,
                "document_id": ev.document_id,
                "document_type": ev.document_type,
                "raw_text": ev.raw_text,
                "ocr_confidence": ev.ocr_confidence,
                "page_number": ev.page_number,
                "source_region": ev.source_region,
            }
            for ev in field.evidences
        ]

    return {"draft_id": draft_id, "evidence_matrix": result}

