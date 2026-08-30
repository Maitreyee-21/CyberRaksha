"""
Schemas for the Automated Official Reporting Engine.

Kept in its own file, separate from app/core/schemas.py, so the existing
scan-pipeline schemas are never touched by this feature.
"""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ScamDNAInput(BaseModel):
    urgency: int = 0
    fear: int = 0
    impersonation: int = 0
    suspicious_link: int = 0
    payment_pressure: int = 0


class ReportDraftRequest(BaseModel):
    """
    Mirrors the fields already present on a completed ScanResult. The frontend
    sends these straight from the scan it already has in hand — this endpoint
    never re-runs or reaches into the scan pipeline itself.
    """
    risk_level: str
    risk_score: int = Field(..., ge=0, le=100)
    scam_category: str
    red_flags: List[str] = []
    scam_dna: ScamDNAInput = ScamDNAInput()
    detected_urls: List[str] = []
    summary: Optional[str] = ""
    input_type_used: Optional[str] = None
    qr_payload: Optional[str] = None
    similarity_match: Optional[Dict[str, Any]] = None
    timestamp: Optional[str] = None


class ReportDraftResponse(BaseModel):
    draft_text: str
    api_mode: str
    model_used: str
    generated_at: str
