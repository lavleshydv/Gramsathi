"""Voice and Bilingual (Hindi & English) Speech API endpoints (v1)."""
from fastapi import APIRouter, HTTPException, UploadFile, File, Query
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from app.database.store import store
from app.services.speech_service import speech_service

router = APIRouter(prefix="/v1/voice", tags=["Voice Assistant"])


class VoiceQueryRequest(BaseModel):
    transcript_hi: Optional[str] = None
    transcript_en: Optional[str] = None
    transcript: Optional[str] = None
    query_text: Optional[str] = None
    language: Optional[str] = "auto"
    user_name: Optional[str] = None


@router.post("/transcribe")
async def transcribe_speech(
    audio_file: UploadFile = File(...),
    language: Optional[str] = Query("hi", description="Spoken language: 'hi' for Hindi, 'en' for English"),
    user_name: Optional[str] = Query(None, description="Optional applicant / citizen name")
):
    """Receives citizen audio bytes and returns editable transcript in Hindi or English."""
    content = await audio_file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Empty audio recording received.")

    result = speech_service.transcribe_audio(content, audio_file.filename, language=language, user_name=user_name)
    return result


@router.post("/intent")
def classify_voice_intent(req: VoiceQueryRequest):
    """Processes spoken transcript (in Hindi or English) and returns recognized intent with bilingual spoken guidance."""
    query = req.query_text or req.transcript or req.transcript_hi or req.transcript_en
    if not query or query.strip() == "":
        raise HTTPException(status_code=400, detail="Transcript/Query text cannot be empty.")

    preferred_lang = None if req.language == "auto" else req.language
    return speech_service.process_voice_query(query.strip(), language=preferred_lang, user_name=req.user_name)


@router.get("/guidance/{draft_id}")
def get_draft_audio_guidance(
    draft_id: str,
    language: Optional[str] = Query("hi", description="Preferred guidance language: 'hi' or 'en'"),
    user_name: Optional[str] = Query(None, description="Optional applicant / citizen name")
):
    """Generates empathetic spoken audio guidance (Hindi/English) for current draft conflicts and missing fields."""
    draft = store.get_draft(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    return speech_service.get_audio_guidance(draft, language=language, user_name=user_name)
