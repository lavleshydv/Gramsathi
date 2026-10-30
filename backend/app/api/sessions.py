"""Session API endpoints (v1)."""
from fastapi import APIRouter, HTTPException
from app.models.schemas import CreateSessionRequest, SessionResponse
from app.database.store import store

router = APIRouter(prefix="/v1/sessions", tags=["Sessions"])


@router.post("", response_model=SessionResponse)
def create_session(req: CreateSessionRequest):
    if not req.consent_given:
        raise HTTPException(status_code=400, detail="DPDP Consent is mandatory to initiate application processing.")
    session = store.create_session(
        citizen_phone=req.citizen_phone,
        purpose_id=req.purpose_id,
        consent_given=req.consent_given,
    )
    return SessionResponse(
        session_id=session.session_id,
        citizen_phone=session.citizen_phone,
        consent_timestamp=session.consent_timestamp,
        active_draft_id=session.active_draft_id,
    )

