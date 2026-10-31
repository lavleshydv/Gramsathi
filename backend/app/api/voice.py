"""Voice and Hindi Speech API endpoints (v1)."""
from fastapi import APIRouter, HTTPException, UploadFile, File, Body
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.database.store import store
from app.services.speech_service import speech_service

router = APIRouter(prefix="/v1/voice", tags=["Voice Assistant"])


class VoiceQueryRequest(BaseModel):
    transcript_hi: str


@router.post("/transcribe")
async def transcribe_speech(audio_file: UploadFile = File(...)):
    """Receives citizen audio bytes and returns editable Hindi Devanagari transcript."""
    content = await audio_file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Empty audio recording received.")

    result = speech_service.transcribe_audio(content, audio_file.filename)
    return result


@router.post("/intent")
def classify_voice_intent(req: VoiceQueryRequest):
    """Processes Hindi spoken transcript and returns recognized intent with spoken guidance."""
    if not req.transcript_hi or req.transcript_hi.strip() == "":
        raise HTTPException(status_code=400, detail="Transcript text cannot be empty.")

    return speech_service.process_voice_query(req.transcript_hi)


@router.get("/guidance/{draft_id}")
def get_draft_audio_guidance(draft_id: str):
    """Generates empathetic spoken Hindi audio guidance for current draft conflicts and missing fields."""
    draft = store.get_draft(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    return speech_service.get_audio_guidance(draft)

