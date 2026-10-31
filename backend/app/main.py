"""GramSathi AI — FastAPI Main Application Entrypoint."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.sessions import router as sessions_router
from app.api.drafts import router as drafts_router
from app.api.documents import router as documents_router
from app.api.evidence import router as evidence_router
from app.api.reconciliation import router as reconciliation_router
from app.api.validation import router as validation_router
from app.api.voice import router as voice_router

app = FastAPI(
    title="GramSathi AI — Evidence Intelligence Backend",
    description="Voice-first government application preparation and evidence-linked documentation assistant.",
    version="1.0.0",
)

# Configure CORS for Flutter, Web, and local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers (all conform to /v1 contract)
app.include_router(sessions_router)
app.include_router(drafts_router)
app.include_router(documents_router)
app.include_router(evidence_router)
app.include_router(reconciliation_router)
app.include_router(validation_router)
app.include_router(voice_router)


@app.get("/")
def root():
    return {
        "project": "GramSathi AI (ग्राम साथी)",
        "status": "ONLINE",
        "version": "1.0.0",
        "core_innovation": "Evidence-Linked, Confidence-Gated Application Generation",
        "docs_url": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "HEALTHY", "service": "gramsathi-backend"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

