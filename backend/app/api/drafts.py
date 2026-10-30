"""Drafts API endpoints (v1)."""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.models.schemas import (
    CreateDraftRequest,
    SaveFieldsRequest,
    FieldCorrectionRequest,
    DraftSummaryResponse,
    FinalDraftPackageResponse,
    FieldReliabilityState,
)
from app.database.store import store
from app.services.draft_service import draft_service
from app.models.domain import AuditRecord
from app.rules.dependency_manager import dependency_manager

router = APIRouter(prefix="/v1/drafts", tags=["Drafts"])


@router.post("")
def create_draft(req: CreateDraftRequest):
    draft = store.create_draft(service_id=req.service_id, rule_version=req.rule_version)
    return {
        "draft_id": draft.draft_id,
        "service_id": draft.service_id,
        "rule_version": draft.rule_version,
        "status": draft.status,
        "created_at": draft.created_at,
    }


@router.get("/{draft_id}")
def get_draft(draft_id: str):
    draft = store.get_draft(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    return {
        "draft_id": draft.draft_id,
        "service_id": draft.service_id,
        "status": draft.status,
        "is_ready_for_draft": draft.is_ready_for_draft,
        "fields": {k: f.candidate_value for k, f in draft.fields.items()},
    }


@router.patch("/{draft_id}/fields")
def save_draft_fields(draft_id: str, req: SaveFieldsRequest):
    draft = store.get_draft(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    for key, val in req.fields.items():
        if key in draft.fields:
            draft.fields[key].candidate_value = val
            draft.fields[key].status = FieldReliabilityState.ELIGIBLE_FOR_DRAFT
            draft.fields[key].user_confirmed = True
        else:
            from app.models.domain import FieldRecord
            draft.fields[key] = FieldRecord(key=key, display_name_hi=key, display_name_en=key, candidate_value=val, status=FieldReliabilityState.ELIGIBLE_FOR_DRAFT)
        dependency_manager.mark_dirty(key)

    draft.audit_events.append(AuditRecord(draft_id=draft.draft_id, event_type="FIELDS_UPDATED", payload=req.fields))
    return {"message": "Fields successfully saved", "draft_id": draft_id, "updated_count": len(req.fields)}


@router.patch("/{draft_id}/fields/{field_id}")
def correct_field(draft_id: str, field_id: str, req: FieldCorrectionRequest):
    draft = store.get_draft(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    target_field = None
    for f in draft.fields.values():
        if f.field_id == field_id or f.key == field_id:
            target_field = f
            break

    if not target_field:
        raise HTTPException(status_code=404, detail=f"Field '{field_id}' not found in draft")

    prev_val = target_field.candidate_value
    target_field.candidate_value = req.corrected_value
    target_field.confirmed_value = req.corrected_value
    target_field.user_confirmed = True
    target_field.status = FieldReliabilityState.USER_CORRECTED

    # Re-evaluate dependent validation rules
    dependency_manager.mark_dirty(target_field.key)

    # Record audit event
    draft.audit_events.append(
        AuditRecord(
            draft_id=draft.draft_id,
            event_type="FIELD_USER_CORRECTED",
            payload={"field_key": target_field.key, "previous_value": prev_val, "new_value": req.corrected_value},
        )
    )

    return {
        "message": f"Field '{target_field.key}' updated successfully",
        "field_id": target_field.field_id,
        "new_value": target_field.candidate_value,
        "status": target_field.status,
    }


@router.get("/{draft_id}/summary", response_model=DraftSummaryResponse)
def get_draft_summary(draft_id: str):
    draft = store.get_draft(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    return draft_service.get_summary(draft)


@router.post("/{draft_id}/generate", response_model=FinalDraftPackageResponse)
def generate_draft_package(draft_id: str):
    draft = store.get_draft(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    from app.intelligence.draft_controller import draft_controller, DraftGatingException
    try:
        package = draft_controller.generate_final_draft_package(draft)
        return package
    except DraftGatingException as e:
        raise HTTPException(status_code=422, detail=str(e))

