"""Documents and OCR Extraction API endpoints (v1)."""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query
from fastapi.responses import Response
from typing import Optional
from app.database.store import store
from app.services.document_service import document_service, DocumentSecurityError
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
    try:
        doc_record = document_service.save_document(
            draft_id=draft_id,
            document_type=document_type,
            file_name=file.filename,
            file_bytes=content,
        )
    except DocumentSecurityError as e:
        raise HTTPException(status_code=400, detail=str(e))

    signed_token = document_service.generate_signed_access_token(draft_id, doc_record.document_id)

    return {
        "document_id": doc_record.document_id,
        "draft_id": draft_id,
        "document_type": doc_record.document_type,
        "file_name": doc_record.file_name,
        "sha256_hash": doc_record.sha256_hash,
        "status": "UPLOADED_AND_ENCRYPTED",
        "access_token": signed_token,
        "expires_in_minutes": 15,
    }


@router.post("/v1/documents/{document_id}/extract")
def run_ocr_extraction(document_id: str):
    target_draft = None
    target_doc = None
    for d in store.drafts.values():
        if document_id in d.documents:
            target_draft = d
            target_doc = d.documents[document_id]
            break

    if not target_doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Read decrypted bytes for OCR preprocessing
    signed_token = document_service.generate_signed_access_token(target_draft.draft_id, document_id)
    file_bytes, _ = document_service.read_decrypted_document(signed_token)

    # Run OCR Pipeline
    ocr_result = ocr_service.extract_document(
        file_bytes=file_bytes,
        file_name=target_doc.file_name,
        doc_type=target_doc.document_type,
    )
    raw_extracted = ocr_result.get("extracted_fields", {})
    engine_name = ocr_result.get("engine", "Default-OCR")

    extracted_fields = []
    for attr, val_info in raw_extracted.items():
        canonical_key = field_mapper.map_attribute(target_doc.document_type, attr)
        if not canonical_key:
            continue

        raw_text = val_info.get("raw_text", "")
        conf = float(val_info.get("confidence", 0.95))
        box = val_info.get("box", [100, 100, 200, 30])
        page = val_info.get("page", 1)

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
            page_number=page,
            source_region={"x": box[0], "y": box[1], "width": box[2], "height": box[3]},
        )
        confidence_manager.evaluate_field_state(field)
        extracted_fields.append({
            "canonical_key": canonical_key,
            "raw_text": raw_text,
            "confidence": conf,
            "bounding_box": ev.source_region,
            "page_number": page,
            "evidence_id": ev.evidence_id,
            "field_status": field.status,
        })

    target_doc.extracted = True
    target_draft.audit_events.append(
        AuditRecord(
            draft_id=target_draft.draft_id,
            event_type="OCR_EXTRACTED",
            payload={"document_id": document_id, "engine": engine_name, "extracted_count": len(extracted_fields)},
        )
    )

    return {
        "document_id": document_id,
        "engine": engine_name,
        "preprocessing": ocr_result.get("preprocessing", {}),
        "extracted_fields_count": len(extracted_fields),
        "fields": extracted_fields,
    }


@router.get("/v1/documents/{document_id}/view")
def view_decrypted_document(document_id: str, token: str = Query(..., description="15-minute temporary access token")):
    """Returns decrypted document bytes for client preview."""
    try:
        file_bytes, filename = document_service.read_decrypted_document(token)
    except DocumentSecurityError as e:
        raise HTTPException(status_code=403, detail=str(e))

    mime = "application/pdf" if filename.lower().endswith(".pdf") else "image/jpeg"
    return Response(content=file_bytes, media_type=mime)


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
                            "page_number": ev.page_number,
                        })
    return {"document_id": document_id, "evidences": found_evidences}


@router.delete("/v1/drafts/{draft_id}/documents/{document_id}")
def delete_document(draft_id: str, document_id: str):
    success = document_service.purge_document(draft_id, document_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found or could not be removed")
    return {
        "message": "Document file cryptographically purged and derived evidence unlinked",
        "document_id": document_id,
        "compliance": "DPDP_ACT_2023",
    }
