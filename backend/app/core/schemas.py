from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Literal, Any
from enum import Enum


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class InputType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    URL = "url"
    QR = "qr"


class ScamDNA(BaseModel):
    urgency: int = Field(0, ge=0, le=100, description="Urgency tactic score")
    fear: int = Field(0, ge=0, le=100, description="Fear/threat tactic score")
    impersonation: int = Field(0, ge=0, le=100, description="Impersonation tactic score")
    suspicious_link: int = Field(0, ge=0, le=100, description="Suspicious link tactic score")
    payment_pressure: int = Field(0, ge=0, le=100, description="Payment pressure tactic score")


class GuidanceItem(BaseModel):
    title: str
    steps: List[str]


class MultilingualGuidance(BaseModel):
    en: GuidanceItem
    hi: GuidanceItem
    mr: GuidanceItem


class ScanRequest(BaseModel):
    input_type: InputType
    text_content: Optional[str] = None
    url: Optional[str] = None
    image_base64: Optional[str] = None


class SecurityURLRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=4096)
    risk_score: Optional[float] = Field(None, ge=0, le=100)
    risk_level: Optional[RiskLevel] = None
    guardian_score: Optional[float] = Field(None, ge=0, le=100)
    guardian_level: Optional[RiskLevel] = None


class QRPayloadRequest(BaseModel):
    qr_payload: str = Field(..., min_length=1, max_length=10000)
    risk_score: Optional[float] = Field(None, ge=0, le=100)


class ScanResult(BaseModel):
    risk_level: RiskLevel
    risk_score: int = Field(..., ge=0, le=100)
    scam_category: str
    red_flags: List[str]
    scam_dna: ScamDNA
    summary: str
    emergency_alert: bool
    safety_lock: bool
    detected_urls: List[str]
    guidance: MultilingualGuidance
    similarity_match: Optional[Dict] = None
    input_type_used: Optional[str] = None
    api_mode: Optional[str] = None
    qr_payload: Optional[str] = None
    security_evaluation: Optional[Dict[str, Any]] = None
