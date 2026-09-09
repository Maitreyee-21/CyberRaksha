import logging
import base64
from typing import Dict, Any

from fastapi import APIRouter, HTTPException, UploadFile, File, Form

from app.core.schemas import (
    ScanRequest,
    ScanResult,
    RiskLevel,
    SecurityURLRequest,
    QRPayloadRequest,
)
from app.services.detect_pipeline import detect_content_type, heuristic_layer1_check
from app.services.watsonx_client import watsonx_service
from app.services.analysis_ensemble import ensemble_voting_and_build_result
from app.security import evaluate_safety_policy, analyze_qr_payload

router = APIRouter(prefix="/api", tags=["CyberRaksha Scan API"])
logger = logging.getLogger(__name__)


@router.post("/scan", response_model=ScanResult)
async def scan_endpoint(request: ScanRequest) -> ScanResult:
    body = request.model_dump()
    return await _run_pipeline(body)


@router.post("/scan/form", response_model=ScanResult)
async def scan_form_endpoint(
    input_type: str = Form(...),
    text_content: str = Form(None),
    url: str = Form(None),
    image: UploadFile = File(None),
):
    """
    Multipart-friendly endpoint for image and QR uploads.

    Supported upload input types:
    - image: screenshot analysis
    - qr: QR decoding + security analysis
    """
    image_b64 = None

    if image:
        raw = await image.read()
        if not raw:
            raise HTTPException(status_code=400, detail="Uploaded image is empty.")
        image_b64 = base64.b64encode(raw).decode("ascii")

    body = {
        "input_type": input_type,
        "text_content": text_content or "",
        "url": url or "",
        "image_base64": image_b64 or "",
    }

    return await _run_pipeline(body)


@router.post("/security/analyze-url")
async def analyze_url_security(request: SecurityURLRequest):
    """Deterministic URL analysis + Safety Lock policy."""
    return evaluate_safety_policy(
        request.url,
        risk_score=request.risk_score,
        risk_level=request.risk_level.value if request.risk_level else None,
        guardian_score=request.guardian_score,
        guardian_level=request.guardian_level.value if request.guardian_level else None,
    )


@router.post("/security/analyze-qr-payload")
async def analyze_qr_security(request: QRPayloadRequest):
    """Security analysis for an already-decoded QR payload."""
    return analyze_qr_payload(request.qr_payload, request.risk_score)


async def _run_pipeline(body: Dict[str, Any]) -> ScanResult:
    try:
        # ==========================================================
        # STEP 1: DETECT
        # ==========================================================
        input_type, normalized_text, detected_urls, qr_payload = detect_content_type(body)

        if not normalized_text and not detected_urls and not qr_payload:
            raise HTTPException(
                status_code=400,
                detail="No analysable content provided.",
            )

        layer1 = heuristic_layer1_check(normalized_text)

        # ==========================================================
        # STEP 2: EXPLAIN
        # Pass the actual detected input type to WatsonX so the new
        # Screenshot Analysis / QR / URL features know what they
        # are analyzing instead of guessing from the text.
        # ==========================================================
        watsonx_out = await watsonx_service.analyze_text(
            normalized_text,
            input_type=input_type.value,
        )

        instruct = watsonx_out["instruct"]
        guardian = watsonx_out["guardian"]
        similarity = watsonx_out.get("similarity_match")

        # Keep input-type metadata synchronized across the pipeline.
        instruct["input_type"] = input_type.value
        instruct["normalized_content"] = normalized_text

        # For screenshot scans, expose the OCR block to the downstream
        # ensemble so ScreenshotAnalysis can report what was actually read.
        if input_type.value == "image":
            ocr_text = ""
            marker = "--- OCR EXTRACTED TEXT ---"

            if marker in normalized_text:
                ocr_text = normalized_text.split(marker, 1)[1]

                context_marker = "--- DETECTED URLS FROM SCREENSHOT ---"
                if context_marker in ocr_text:
                    ocr_text = ocr_text.split(context_marker, 1)[0]

                ocr_text = ocr_text.strip()

            instruct["ocr_extracted_text"] = ocr_text
            instruct["screenshot_analyzed"] = True

        # ==========================================================
        # STEPS 2→3→4→5
        # EXPLAIN → ALERT → PREVENT → GUIDE
        #
        # The ensemble builds:
        # - Scam Fingerprint
        # - Scam Classification
        # - Variant Detection
        # - Screenshot Analysis
        # - Risk result
        # - Scam DNA
        # - Guidance
        # ==========================================================
        result = ensemble_voting_and_build_result(
            layer1=layer1,
            instruct=instruct,
            guardian=guardian,
            detected_urls=detected_urls,
            similarity_match=similarity,
            guidance=instruct.get("guidance", {}),
            qr_payload=qr_payload,
        )

        # ==========================================================
        # MEMBER 4 SECURITY LAYER
        # Deterministic URL enforcement runs after AI analysis.
        # AI/ensemble risk never directly authorizes navigation.
        # ==========================================================
        if detected_urls:
            primary_url = detected_urls[0]

            security_eval = evaluate_safety_policy(
                primary_url,
                risk_score=result.risk_score,
                risk_level=result.risk_level.value,
                guardian_score=guardian.get("guardian_risk_score"),
                guardian_level=guardian.get("risk_level"),
            )

            result.security_evaluation = security_eval

            # The deterministic security layer is authoritative for
            # URL-bearing scans so the UI cannot show LOW while
            # Safety Lock simultaneously says BLOCK.
            result.risk_score = int(
                max(0, min(100, security_eval["risk_score"]))
            )
            result.risk_level = RiskLevel(security_eval["risk_level"])
            result.emergency_alert = security_eval["risk_level"] == "HIGH"
            result.safety_lock = security_eval["action"] == "BLOCK"

        # ==========================================================
        # FINAL DIAGNOSTIC / UI METADATA
        # ==========================================================
        result.input_type_used = input_type.value
        result.api_mode = watsonx_out.get("api_mode")
        result.qr_payload = qr_payload

        return result

    except HTTPException:
        raise

    except Exception as exc:
        logger.exception("Pipeline failed")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis pipeline error: {exc}",
        )
