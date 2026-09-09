from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, ConfigDict


# ============================================================
# Risk
# ============================================================

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class InputType(str, Enum):
    TEXT = "text"
    URL = "url"
    IMAGE = "image"
    QR = "qr"
    DOCUMENT = "document"


# ============================================================
# Scam DNA
# ============================================================

class ScamDNA(BaseModel):
    urgency: int = Field(default=0, ge=0, le=100)
    fear: int = Field(default=0, ge=0, le=100)
    impersonation: int = Field(default=0, ge=0, le=100)
    suspicious_link: int = Field(default=0, ge=0, le=100)
    payment_pressure: int = Field(default=0, ge=0, le=100)


class ScamFingerprint(BaseModel):
    name: str = "Low-Signal Communication Pattern"
    description: str = ""
    confidence: int = Field(default=0, ge=0, le=100)
    tactics: ScamDNA = Field(default_factory=ScamDNA)
    primary_tactic: Optional[str] = None
    secondary_tactics: List[str] = Field(default_factory=list)


class ScamClassification(BaseModel):
    category: str = "Suspicious Content"
    confidence: int = Field(default=0, ge=0, le=100)
    explanation: str = ""
    alternative_categories: List[str] = Field(default_factory=list)


class VariantDetection(BaseModel):
    detected: bool = False
    match_type: str = "none"
    scam_family: Optional[str] = None
    similarity_score: int = Field(default=0, ge=0, le=100)
    confidence: int = Field(default=0, ge=0, le=100)
    explanation: str = ""
    matched_indicators: List[str] = Field(default_factory=list)


class ScreenshotAnalysis(BaseModel):
    analyzed: bool = False
    method: str = "ocr"
    extracted_text: str = ""
    text_detected: bool = False
    ocr_confidence: Optional[float] = None
    detected_urls: List[str] = Field(default_factory=list)
    image_risk_score: int = Field(default=0, ge=0, le=100)
    explanation: str = ""


# ============================================================
# Guidance
# ============================================================

class GuidanceItem(BaseModel):
    title: str = "Safety Guidance"
    steps: List[str] = Field(
        default_factory=lambda: [
            "Do not click suspicious links.",
            "Do not share OTP, PIN, password or CVV.",
            "Verify the sender through an official channel.",
        ]
    )


class MultilingualGuidance(BaseModel):
    """
    Guidance for all 22 supported Indian languages.

    as_ and or_ use aliases because `as` and `or` are Python keywords.
    """

    model_config = ConfigDict(populate_by_name=True)

    en: GuidanceItem = Field(default_factory=GuidanceItem)
    as_: GuidanceItem = Field(default_factory=GuidanceItem, alias="as")
    bn: GuidanceItem = Field(default_factory=GuidanceItem)
    brx: GuidanceItem = Field(default_factory=GuidanceItem)
    doi: GuidanceItem = Field(default_factory=GuidanceItem)
    gu: GuidanceItem = Field(default_factory=GuidanceItem)
    hi: GuidanceItem = Field(default_factory=GuidanceItem)
    kn: GuidanceItem = Field(default_factory=GuidanceItem)
    ks: GuidanceItem = Field(default_factory=GuidanceItem)
    kok: GuidanceItem = Field(default_factory=GuidanceItem)
    mai: GuidanceItem = Field(default_factory=GuidanceItem)
    ml: GuidanceItem = Field(default_factory=GuidanceItem)
    mni: GuidanceItem = Field(default_factory=GuidanceItem)
    mr: GuidanceItem = Field(default_factory=GuidanceItem)
    ne: GuidanceItem = Field(default_factory=GuidanceItem)
    or_: GuidanceItem = Field(default_factory=GuidanceItem, alias="or")
    pa: GuidanceItem = Field(default_factory=GuidanceItem)
    sa: GuidanceItem = Field(default_factory=GuidanceItem)
    sat: GuidanceItem = Field(default_factory=GuidanceItem)
    sd: GuidanceItem = Field(default_factory=GuidanceItem)
    ta: GuidanceItem = Field(default_factory=GuidanceItem)
    te: GuidanceItem = Field(default_factory=GuidanceItem)
    ur: GuidanceItem = Field(default_factory=GuidanceItem)


# ============================================================
# Scan Request
# ============================================================

class ScanRequest(BaseModel):
    input_type: str = "text"
    text_content: str = ""
    url: str = ""
    image_base64: str = ""


# ============================================================
# Security Requests
# ============================================================

class SecurityURLRequest(BaseModel):
    url: str
    risk_score: Optional[int] = Field(default=None, ge=0, le=100)
    risk_level: Optional[RiskLevel] = None
    guardian_score: Optional[int] = Field(default=None, ge=0, le=100)
    guardian_level: Optional[RiskLevel] = None


class QRPayloadRequest(BaseModel):
    qr_payload: str
    risk_score: Optional[int] = Field(default=None, ge=0, le=100)


# ============================================================
# Scan Result
# ============================================================

class ScanResult(BaseModel):
    risk_level: RiskLevel = RiskLevel.LOW
    risk_score: int = Field(default=0, ge=0, le=100)

    # Existing result contract
    scam_category: str = "Suspicious Content"
    red_flags: List[str] = Field(default_factory=list)
    scam_dna: ScamDNA = Field(default_factory=ScamDNA)
    summary: str = "Analysis complete."

    # Product feature objects
    scam_classification: ScamClassification = Field(
        default_factory=ScamClassification
    )
    scam_fingerprint: ScamFingerprint = Field(
        default_factory=ScamFingerprint
    )
    variant_detection: VariantDetection = Field(
        default_factory=VariantDetection
    )
    screenshot_analysis: Optional[ScreenshotAnalysis] = None

    # Safety / prevention
    emergency_alert: bool = False
    safety_lock: bool = False

    # Detection metadata
    detected_urls: List[str] = Field(default_factory=list)
    qr_payload: Optional[str] = None
    similarity_match: Optional[Dict[str, Any]] = None

    # Multilingual guidance
    guidance: MultilingualGuidance = Field(
        default_factory=MultilingualGuidance
    )

    # Pipeline metadata
    input_type_used: Optional[str] = None
    api_mode: Optional[str] = None

    # URL security evaluation
    security_evaluation: Optional[Dict[str, Any]] = None
