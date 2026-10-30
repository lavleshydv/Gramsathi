"""Reconciliation and Conflict Detection API endpoints (v1)."""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.database.store import store
from app.intelligence.conflict_detector import conflict_detector
from app.intelligence.confidence_manager import confidence_manager
from app.models.schemas import ConflictItem, FieldReliabilityState
from app.models.domain import AuditRecord

router = APIRouter(prefix="/v1/drafts", tags=["Reconciliation"])


@router.post("/{draft_id}/reconcile")
def run_cross_document_reconciliation(draft_id: str):
    draft = store.get_draft(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    new_conflicts = []
    draft.conflicts.clear()

    for key, field in draft.fields.items():
        conflict = conflict_detector.evaluate_field_conflicts(key, field.evidences)
        if conflict:
            draft.conflicts.append(conflict)
            confidence_manager.evaluate_field_state(field, active_conflict=conflict)
            new_conflicts.append({
                "conflict_id": conflict.conflict_id,
                "field_key": key,
                "conflict_type": conflict.conflict_type,
                "severity": conflict.severity,
                "message_en": conflict.message_en,
            })
        else:
            confidence_manager.evaluate_field_state(field, active_conflict=None)

    draft.audit_events.append(
        AuditRecord(
            draft_id=draft_id,
            event_type="RECONCILIATION_RUN",
            payload={"detected_conflicts": len(new_conflicts)},
        )
    )

    return {
        "draft_id": draft_id,
        "conflicts_detected": len(new_conflicts),
        "conflicts": new_conflicts,
        "reconciliation_status": "COMPLETED",
    }


@router.get("/{draft_id}/conflicts", response_model=List[ConflictItem])
def get_draft_conflicts(draft_id: str):
    draft = store.get_draft(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    return [
        ConflictItem(
            conflict_id=c.conflict_id,
            field_key=c.field_key,
            conflict_type=c.conflict_type,
            severity=c.severity,
            status=c.status,
            message_hi=c.message_hi,
            message_en=c.message_en,
            evidence_ids=c.evidence_ids,
            conflicting_values=c.conflicting_values,
        )
        for c in draft.conflicts
    ]


@router.post("/{draft_id}/fields/{field_id}/confirm")
def confirm_field(draft_id: str, field_id: str, payload: Dict[str, Any]):
    draft = store.get_draft(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    target_field = None
    for f in draft.fields.values():
        if f.field_id == field_id or f.key == field_id:
            target_field = f
            break

    if not target_field:
        raise HTTPException(status_code=404, detail=f"Field '{field_id}' not found")

    confirmed_val = payload.get("confirmed_value", target_field.candidate_value)
    target_field.candidate_value = confirmed_val
    target_field.confirmed_value = confirmed_val
    target_field.user_confirmed = True
    target_field.status = FieldReliabilityState.USER_CONFIRMED

    # Mark associated conflict resolved if any
    for c in draft.conflicts:
        if c.field_key == target_field.key:
            c.status = "RESOLVED"

    draft.audit_events.append(
        AuditRecord(
            draft_id=draft_id,
            event_type="FIELD_USER_CONFIRMED",
            payload={"field_key": target_field.key, "confirmed_value": confirmed_val},
        )
    )

    return {
        "message": f"Field '{target_field.key}' confirmed by applicant",
        "field_id": target_field.field_id,
        "status": target_field.status,
        "confirmed_value": target_field.confirmed_value,
    }

