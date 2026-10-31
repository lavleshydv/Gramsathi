"""Scheme validation API endpoints (v1)."""
from fastapi import APIRouter, HTTPException
from typing import List
from app.database.store import store
from app.rules.rule_engine import rule_engine
from app.models.schemas import ValidationIssueItem

router = APIRouter(tags=["Validation & Schemes"])


@router.get("/v1/services/{service_id}")
def get_service_requirements(service_id: str):
    if service_id != "POST_MATRIC_STATE_SCHOLARSHIP":
        raise HTTPException(status_code=404, detail="Service not found")

    return {
        "service_id": rule_engine.config.get("service_id"),
        "service_name_hi": rule_engine.config.get("service_name_hi"),
        "service_name_en": rule_engine.config.get("service_name_en"),
        "rule_version": rule_engine.config.get("rule_version"),
        "required_fields": rule_engine.config.get("required_fields"),
        "validation_rules": rule_engine.config.get("validation_rules"),
    }


@router.post("/v1/drafts/{draft_id}/validate", response_model=List[ValidationIssueItem])
def validate_draft(draft_id: str):
    draft = store.get_draft(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    field_values = {k: f.candidate_value for k, f in draft.fields.items()}
    issues = rule_engine.validate_fields(field_values)

    return issues


@router.post("/v1/drafts/{draft_id}/dag-revalidate")
def dag_revalidate_field(draft_id: str, field_name: str):
    """Executes dependency-aware DAG revalidation on dirty descendants only."""
    draft = store.get_draft(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    field_values = {k: f.candidate_value for k, f in draft.fields.items()}
    report = rule_engine.revalidate_selective_dag(field_name, field_values)

    return {
        "draft_id": draft_id,
        "dag_report": report,
    }

