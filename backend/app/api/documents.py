"""Documents and OCR Extraction API endpoints (v1)."""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
from app.database.store import store
from app.services.document_service import document_service
from app.services.ocr_service import ocr_service
from app.intelligence.field_mapper import field_mapper
from app.intelligence.provenance_manager import provenance_manager
from app.intelligence.confidence_manager import confidence_manager
from app.models.domain import AuditRecord

router = APIRouter(tags=["Documents"])


@router.post("/v1/drafts/{draft_id}/documents")
async def upload_document(
    draft_id: str,
    document_type: str = Form(..., description="Document type: AADHAAR, MARKSHEET, INCOME_CERTIFICATE, etc."),
    file: UploadFile = File(...),
):
    draft = store.get_draft(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="File size exceeds maximum permitted limit (10MB).")

    doc_record = document_service.save_document(
        draft_id=draft_id,
        document_type=document_type,
        file_name=file.filename,
        file_bytes=content,
    )

    draft.audit_events.append(
        AuditRecord(
            draft_id=draft_id,
            event_type="DOCUMENT_UPLOADED",
            payload={"document_id": doc_record.document_id, "document_type": document_type, "file_name": file.filename},
        )
    )

    return {
        "document_id": doc_record.document_id,
        "draft_id": draft_id,
        "document_type": doc_record.document_type,
        "file_name": doc_record.file_name,
        "sha256_hash": doc_record.sha256_hash,
        "status": "UPLOADED",
    }


@router.post("/v1/documents/{document_id}/extract")
def run_ocr_extraction(document_id: str):
    # Find document across drafts
    target_draft = None
    target_doc = None
    for d in store.drafts.values():
        if document_id in d.documents:
            target_draft = d
            target_doc = d.documents[document_id]
            break

    if not target_doc:
        raise HTTPException(status_code=404, detail="Document not found")

    raw_extracted = ocr_service.extract_document(target_doc.file_name, target_doc.document_type)
    extracted_fields = []

    for attr, val_info in raw_extracted.items():
        canonical_key = field_mapper.map_attribute(target_doc.document_type, attr)
        if not canonical_key:
            continue

        raw_text = val_info.get("raw_text", "")
        conf = val_info.get("confidence", 0.95)
        box = val_info.get("box", [100, 100, 200, 30])

        if canonical_key in target_draft.fields:
            field = target_draft.fields[canonical_key]
        else:
            from app.models.domain import FieldRecord
            field = FieldRecord(key=canonical_key, display_name_hi=canonical_key, display_name_en=canonical_key)
            target_draft.fields[canonical_key] = field

        ev = provenance_manager.attach_evidence(
            field=field,
            document_id=target_doc.document_id,
            document_type=target_doc.document_type,
            raw_text=raw_text,
            ocr_confidence=conf,
            source_region={"x": box[0], "y": box[1], "width": box[2], "height": box[3]},
        )
        confidence_manager.evaluate_field_state(field)
        extracted_fields.append({"canonical_key": canonical_key, "raw_text": raw_text, "confidence": conf, "evidence_id": ev.evidence_id})

    target_doc.extracted = True
    target_draft.audit_events.append(
        AuditRecord(
            draft_id=target_draft.draft_id,
            event_type="OCR_EXTRACTED",
            payload={"document_id": document_id, "extracted_count": len(extracted_fields)},
        )
    )

    return {
        "document_id": document_id,
        "extracted_fields_count": len(extracted_fields),
        "fields": extracted_fields,
    }


@router.get("/v1/documents/{document_id}/fields")
def get_document_fields(document_id: str):
    found_evidences = []
    for d in store.drafts.values():
        if document_id in d.documents:
            for f in d.fields.values():
                for ev in f.evidences:
                    if ev.document_id == document_id:
                        found_evidences.append({
                            "field_key": f.key,
                            "raw_text": ev.raw_text,
                            "ocr_confidence": ev.ocr_confidence,
                            "source_region": ev.source_region,
                        })
    return {"document_id": document_id, "evidences": found_evidences}


@router.delete("/v1/drafts/{draft_id}/documents/{document_id}")
def delete_document(draft_id: str, document_id: str):
    success = document_service.purge_document(draft_id, document_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found or could not be removed")
    return {"message": "Document and derived evidence purged successfully", "document_id": document_id}

