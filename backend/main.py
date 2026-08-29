import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import router as api_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("cyberraksha")

app = FastAPI(
    title="CyberRaksha — AI Cybersecurity Assistant API",
    version="1.0.0",
    description="Detect → Explain → Alert → Prevent → Guide. Indian scam analysis powered by IBM Granite 4 models.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/health", tags=["System"])
def health():
    return {
        "status": "ok",
        "service": "CyberRaksha Backend",
        "high_risk_threshold": settings.HIGH_RISK_THRESHOLD,
        "medium_risk_threshold": settings.MEDIUM_RISK_THRESHOLD,
        "models": {
            "granite_instruct": settings.MODEL_GRANITE_INSTRUCT,
            "granite_guardian": settings.MODEL_GRANITE_GUARDIAN,
            "granite_vision": settings.MODEL_GRANITE_VISION,
            "granite_embedding": settings.MODEL_GRANITE_EMBEDDING,
        },
        "capabilities": {
            "granite_instruct": "live_when_watsonx_credentials_are_configured",
            "granite_guardian": "live_when_watsonx_credentials_are_configured",
            "granite_vision": "configured_target_not_live_in_current_mvp",
            "granite_embedding": "configured_target_not_live_in_current_mvp",
            "qr_decoder": "opencv_then_pyzbar",
            "safety_policy": "deterministic",
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )
