import logging
from typing import Dict, Any, List, Optional

from app.core.schemas import (
    RiskLevel,
    ScamDNA,
    ScamFingerprint,
    ScamClassification,
    VariantDetection,
    ScreenshotAnalysis,
    ScanResult,
    GuidanceItem,
    MultilingualGuidance,
)
from app.core.config import settings

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────

def _safe_int(value: Any, default: int = 0) -> int:
    try:
        return max(0, min(100, int(float(value))))
    except (TypeError, ValueError):
        return default


def _similarity_as_percent(similarity_match: Optional[Dict[str, Any]]) -> int:
    if not isinstance(similarity_match, dict):
        return 0

    raw = similarity_match.get("similarity_score", 0)

    try:
        value = float(raw)

        # Existing similarity implementation generally uses 0.0–1.0.
        if value <= 1:
            value *= 100

        return max(0, min(100, round(value)))
    except (TypeError, ValueError):
        return 0


def _build_scam_classification(
    scam_category: str,
    instruct: Dict[str, Any],
    similarity_match: Optional[Dict[str, Any]],
) -> ScamClassification:
    confidence = _safe_int(
        instruct.get("category_confidence"),
        _safe_int(instruct.get("confidence"), 0),
    )

    # If the model did not return a category confidence, use the strongest
    # available similarity signal as a conservative fallback.
    if confidence == 0:
        confidence = _similarity_as_percent(similarity_match)

    explanation = instruct.get("summary") or ""

    alternatives: List[str] = []

    if isinstance(similarity_match, dict):
        matched_category = similarity_match.get("category")

        if (
            matched_category
            and matched_category != scam_category
            and matched_category not in alternatives
        ):
            alternatives.append(str(matched_category))

    return ScamClassification(
        category=scam_category,
        confidence=confidence,
        explanation=explanation,
        alternative_categories=alternatives,
    )


def _build_variant_detection(
    scam_category: str,
    similarity_match: Optional[Dict[str, Any]],
    risk_score: int,
) -> VariantDetection:
    """
    Converts the existing scam-similarity result into a clear
    user-facing variant detection object.

    We deliberately do not claim an exact variant unless the
    similarity engine provides enough evidence.
    """

    if not isinstance(similarity_match, dict):
        return VariantDetection()

    similarity_score = _similarity_as_percent(similarity_match)

    if similarity_score <= 0:
        return VariantDetection()

    matched_category = (
        similarity_match.get("category")
        or scam_category
        or "Unknown Scam Family"
    )

    note = str(similarity_match.get("note") or "").strip()

    # High similarity = likely known scam family.
    if similarity_score >= 85:
        match_type = "exact_match"
        detected = True
    elif similarity_score >= 60:
        match_type = "variant"
        detected = True
    elif similarity_score >= 45 and risk_score >= 40:
        match_type = "related_pattern"
        detected = True
    else:
        match_type = "none"
        detected = False

    if not detected:
        return VariantDetection(
            detected=False,
            match_type="none",
            scam_family=str(matched_category),
            similarity_score=similarity_score,
            confidence=similarity_score,
            explanation=(
                "No strong known-scam match was found. "
                "The content is evaluated using its own behavioral signals."
            ),
            matched_indicators=[],
        )

    if match_type == "exact_match":
        explanation = (
            "This content strongly resembles a known scam pattern "
            "already present in the scam reference data."
        )
    elif match_type == "variant":
        explanation = (
            "This content resembles a known scam family but may use "
            "modified wording, details, or delivery methods."
        )
    else:
        explanation = (
            "This content shares behavioral characteristics with a "
            "known scam pattern."
        )

    if note:
        explanation = f"{explanation} {note}"

    return VariantDetection(
        detected=True,
        match_type=match_type,
        scam_family=str(matched_category),
        similarity_score=similarity_score,
        confidence=similarity_score,
        explanation=explanation,
        matched_indicators=[
            "Known scam similarity pattern",
            f"Similarity score: {similarity_score}%",
        ],
    )


def _build_scam_fingerprint(
    scam_category: str,
    scam_dna: ScamDNA,
    instruct: Dict[str, Any],
) -> ScamFingerprint:
    """
    Converts the numerical Scam DNA into a human-readable
    behavioral fingerprint.
    """

    tactics = {
        "Urgency": scam_dna.urgency,
        "Fear / Threat": scam_dna.fear,
        "Impersonation": scam_dna.impersonation,
        "Suspicious Link": scam_dna.suspicious_link,
        "Payment Pressure": scam_dna.payment_pressure,
    }

    ordered = sorted(
        tactics.items(),
        key=lambda item: item[1],
        reverse=True,
    )

    active = [
        name
        for name, score in ordered
        if score >= 40
    ]

    primary_tactic = active[0] if active else None
    secondary_tactics = active[1:4]

    strongest_scores = [
        score
        for _, score in ordered
        if score > 0
    ]

    if strongest_scores:
        confidence = round(
            sum(strongest_scores[:3]) / min(3, len(strongest_scores))
        )
    else:
        confidence = _safe_int(
            instruct.get("category_confidence"),
            0,
        )

    confidence = max(0, min(100, confidence))

    if active:
        name = " + ".join(active[:3])
        description = (
            f"This {scam_category} uses "
            f"{', '.join(active[:3]).lower()} behavioral tactics."
        )
    else:
        name = "Low-Signal Communication Pattern"
        description = (
            "No strong scam manipulation tactic was detected "
            "from the available behavioral signals."
        )

    return ScamFingerprint(
        name=name,
        description=description,
        confidence=confidence,
        tactics=scam_dna,
        primary_tactic=primary_tactic,
        secondary_tactics=secondary_tactics,
    )


def _build_screenshot_analysis(
    input_type: Optional[str],
    instruct: Dict[str, Any],
    detected_urls: List[str],
) -> Optional[ScreenshotAnalysis]:
    """
    Builds screenshot-analysis metadata.

    The current backend uses OCR for IMAGE input. We do not claim
    Granite Vision was used unless the upstream service explicitly
    reports that it was.
    """

    if input_type != "image":
        return None

    extracted_text = str(
        instruct.get("ocr_extracted_text") or ""
    ).strip()

    return ScreenshotAnalysis(
        analyzed=True,
        method="ocr",
        extracted_text=extracted_text,
        text_detected=bool(extracted_text),
        ocr_confidence=None,
        detected_urls=list(detected_urls or []),
        # Live Granite Vision is not assumed. If no Vision score exists,
        # expose the already-computed ensemble score instead of reporting
        # a misleading zero-risk screenshot.
        image_risk_score=_safe_int(
            instruct.get("vision_risk_score"),
            0,
        ),
        explanation=(
            "Screenshot text was extracted with local OCR and "
            "then analyzed through the normal scam-detection pipeline."
        ),
    )


# ─────────────────────────────────────────────────────────────
# Main ensemble
# ─────────────────────────────────────────────────────────────

def ensemble_voting_and_build_result(
    *,
    layer1: Dict[str, Any],
    instruct: Dict[str, Any],
    guardian: Dict[str, Any],
    detected_urls,
    similarity_match,
    guidance,
    qr_payload: str = None,
) -> ScanResult:
    """
    STEP 2: EXPLAIN
        Combine heuristic, Granite Instruct, Guardian and similarity signals.

    STEP 3: ALERT
        Trigger Emergency Alert when HIGH risk is reached.

    STEP 4: PREVENT
        Activate Safety Lock when HIGH risk has a meaningful
        security/payment/threat signal.

    STEP 5: GUIDE
        Attach multilingual guidance.

    NEW PRODUCT FEATURES
        - Scam Classification
        - Scam Fingerprint
        - Variant Detection
        - Screenshot Analysis metadata
    """

    detected_urls = list(detected_urls or [])

    # ─────────────────────────────────────────────────────────
    # 1. Weighted ensemble risk score
    # ─────────────────────────────────────────────────────────

    guardian_risk = _safe_int(
        guardian.get("guardian_risk_score"),
        0,
    )

    instruct_risk = _safe_int(
        instruct.get("granite_risk_score_estimate"),
        0,
    )

    layer1_risk = _safe_int(
        layer1.get("layer1_risk_score"),
        0,
    )

    sim_risk = _similarity_as_percent(
        similarity_match
    )

    # Guardian: 45%
    # Instruct: 30%
    # Layer-1 heuristics: 15%
    # Similarity: 10%
    risk_score = round(
        guardian_risk * 0.45
        + instruct_risk * 0.30
        + layer1_risk * 0.15
        + sim_risk * 0.10
    )

    risk_score = max(
        0,
        min(100, risk_score),
    )

    # ─────────────────────────────────────────────────────────
    # 2. Scam Classification
    # ─────────────────────────────────────────────────────────

    if similarity_match and risk_score > 50:
        scam_category = (
            similarity_match.get("category")
            or instruct.get(
                "scam_category",
                "Suspicious Content",
            )
        )
    else:
        scam_category = instruct.get(
            "scam_category",
            "Suspicious Content",
        )

    scam_category = str(
        scam_category or "Suspicious Content"
    )

    # ─────────────────────────────────────────────────────────
    # 3. QR / UPI risk protection
    # ─────────────────────────────────────────────────────────

    if (
        risk_score > 35
        and scam_category != "Benign Message"
    ):
        category_lower = scam_category.lower()
        raw_dna = guardian.get("scam_dna") or {}

        is_suspicious = (
            _safe_int(raw_dna.get("urgency")) > 30
            or _safe_int(raw_dna.get("fear")) > 30
            or _safe_int(raw_dna.get("impersonation")) > 30
            or _safe_int(raw_dna.get("suspicious_link")) >= 50
            or any(
                kw in str(
                    layer1.get(
                        "layer1_flags",
                        [],
                    )
                ).lower()
                for kw in [
                    "urgency",
                    "threat",
                    "impersonat",
                    "phishing",
                    "redirect",
                ]
            )
        )

        if is_suspicious:
            if (
                "quishing" in category_lower
                or "qr code" in category_lower
                or (
                    qr_payload
                    and "upi://" in qr_payload.lower()
                )
            ):
                risk_score = max(
                    risk_score,
                    74,
                )

    # ─────────────────────────────────────────────────────────
    # 4. Risk level
    # ─────────────────────────────────────────────────────────

    if risk_score >= settings.HIGH_RISK_THRESHOLD:
        risk_level = RiskLevel.HIGH
    elif risk_score >= settings.MEDIUM_RISK_THRESHOLD:
        risk_level = RiskLevel.MEDIUM
    else:
        risk_level = RiskLevel.LOW

    # ─────────────────────────────────────────────────────────
    # 5. Red flags
    # ─────────────────────────────────────────────────────────

    merged_flags: List[str] = []

    sources = [
        layer1.get("layer1_flags", []),
        instruct.get("red_flags", []),
    ]

    for src in sources:
        if isinstance(src, list):
            merged_flags.extend(src)

    if similarity_match and isinstance(
        similarity_match,
        dict,
    ):
        note = similarity_match.get("note")

        if note:
            merged_flags.insert(
                0,
                f"Database match: {note}",
            )

    seen = set()
    dedup: List[str] = []

    for flag in merged_flags:
        if not flag:
            continue

        flag_string = str(flag)

        if flag_string in seen:
            continue

        seen.add(flag_string)
        dedup.append(flag_string)

        if len(dedup) >= 8:
            break

    # ─────────────────────────────────────────────────────────
    # 6. Scam DNA
    # ─────────────────────────────────────────────────────────

    dna = guardian.get("scam_dna") or {}

    urgency = _safe_int(
        dna.get("urgency"),
    )

    fear = _safe_int(
        dna.get("fear"),
    )

    impersonation = _safe_int(
        dna.get("impersonation"),
    )

    suspicious_link = _safe_int(
        dna.get("suspicious_link"),
    )

    payment_pressure = _safe_int(
        dna.get("payment_pressure"),
    )

    # Align DNA with red flags.
    for flag in dedup:
        flag_lower = flag.lower()

        if any(
            x in flag_lower
            for x in [
                "urgency",
                "time-pressure",
                "deadline",
                "expire",
                "immediate",
                "hour",
                "minute",
            ]
        ):
            urgency = max(
                urgency,
                75,
            )

        if any(
            x in flag_lower
            for x in [
                "fear",
                "threat",
                "block",
                "suspend",
                "terminate",
                "close",
                "arrest",
                "penalty",
                "consequence",
                "prosecut",
                "legal",
            ]
        ):
            fear = max(
                fear,
                75,
            )

        if any(
            x in flag_lower
            for x in [
                "impersonat",
                "claim to be",
                "official",
                "government",
                "bank",
                "rbi",
                "police",
            ]
        ):
            impersonation = max(
                impersonation,
                75,
            )

        if any(
            x in flag_lower
            for x in [
                "link",
                "url",
                "phishing",
                "redirect",
                "click",
            ]
        ):
            suspicious_link = max(
                suspicious_link,
                75,
            )

        if any(
            x in flag_lower
            for x in [
                "payment",
                "money",
                "transfer",
                " upi",
                "fee",
                "penalty",
                "deposit",
                "pay ",
            ]
        ):
            payment_pressure = max(
                payment_pressure,
                75,
            )

    scam_dna = ScamDNA(
        urgency=urgency,
        fear=fear,
        impersonation=impersonation,
        suspicious_link=suspicious_link,
        payment_pressure=payment_pressure,
    )

    # ─────────────────────────────────────────────────────────
    # 7. 🧬 Scam Fingerprint
    # ─────────────────────────────────────────────────────────

    scam_fingerprint = _build_scam_fingerprint(
        scam_category=scam_category,
        scam_dna=scam_dna,
        instruct=instruct,
    )

    # ─────────────────────────────────────────────────────────
    # 8. 🔍 Scam Classification
    # ─────────────────────────────────────────────────────────

    scam_classification = _build_scam_classification(
        scam_category=scam_category,
        instruct=instruct,
        similarity_match=similarity_match,
    )

    # ─────────────────────────────────────────────────────────
    # 9. 🧩 Variant Detection
    # ─────────────────────────────────────────────────────────

    variant_detection = _build_variant_detection(
        scam_category=scam_category,
        similarity_match=similarity_match,
        risk_score=risk_score,
    )

    # ─────────────────────────────────────────────────────────
    # 10. 📸 Screenshot Analysis
    # ─────────────────────────────────────────────────────────

    # routes.py passes the authoritative input type to WatsonX and stores it
    # in the Instruct result. Keep a normalized fallback for older callers.
    input_type = str(
        instruct.get("input_type")
        or layer1.get("input_type")
        or "text"
    ).lower()

    screenshot_analysis = _build_screenshot_analysis(
        input_type=input_type,
        instruct=instruct,
        detected_urls=detected_urls,
    )

    # ─────────────────────────────────────────────────────────
    # 11. Emergency Alert
    # ─────────────────────────────────────────────────────────

    emergency_alert = (
        risk_level == RiskLevel.HIGH
    )

    # ─────────────────────────────────────────────────────────
    # 12. Safety Lock
    # ─────────────────────────────────────────────────────────

    safety_lock = (
        emergency_alert
        and (
            scam_dna.suspicious_link >= 50
            or len(detected_urls) > 0
            or scam_dna.payment_pressure >= 55
            or scam_dna.fear >= 55
        )
    )

    # ─────────────────────────────────────────────────────────
    # 13. Summary
    # ─────────────────────────────────────────────────────────

    summary = instruct.get(
        "summary",
        "Analysis complete.",
    )

    if emergency_alert:
        summary = (
            "⚠️ HIGH RISK — "
            + summary
        )
    elif risk_level == RiskLevel.MEDIUM:
        summary = (
            "⚡ SUSPICIOUS — "
            + summary
        )

    # ─────────────────────────────────────────────────────────
    # 14. Multilingual Guidance
    # ─────────────────────────────────────────────────────────

    # Keep the existing EN/HI/MR contract populated.
    # Additional languages are populated when the guidance
    # generator provides them.

    guidance = guidance or {}

    en_guidance = guidance.get(
        "en",
        {
            "title": "Safety Guidance",
            "steps": [
                "Do not click suspicious links.",
                "Do not share OTP, PIN, password or CVV.",
                "Verify the sender through an official channel.",
            ],
        },
    )

    hi_guidance = guidance.get(
        "hi",
        en_guidance,
    )

    mr_guidance = guidance.get(
        "mr",
        en_guidance,
    )

    multilingual_kwargs = {
        "en": GuidanceItem(
            **en_guidance
        ),
        "hi": GuidanceItem(
            **hi_guidance
        ),
        "mr": GuidanceItem(
            **mr_guidance
        ),
    }

    # Add any additional language guidance generated by
    # a future/updated WatsonX service.
    supported_extra_languages = [
        "as",
        "bn",
        "brx",
        "doi",
        "gu",
        "kn",
        "ks",
        "kok",
        "mai",
        "ml",
        "mni",
        "ne",
        "or",
        "pa",
        "sa",
        "sat",
        "sd",
        "ta",
        "te",
        "ur",
    ]

    for language_code in supported_extra_languages:
        language_guidance = guidance.get(
            language_code
        )

        if language_guidance:
            # Pydantic aliases allow "as" and "or" to be
            # represented by as_ and or_ in the Python model.
            if language_code == "as":
                multilingual_kwargs["as_"] = GuidanceItem(
                    **language_guidance
                )
            elif language_code == "or":
                multilingual_kwargs["or_"] = GuidanceItem(
                    **language_guidance
                )
            else:
                multilingual_kwargs[language_code] = GuidanceItem(
                    **language_guidance
                )

    guidance_obj = MultilingualGuidance(
        **multilingual_kwargs
    )

    # ─────────────────────────────────────────────────────────
    # 15. Final ScanResult
    # ─────────────────────────────────────────────────────────

    result = ScanResult(
        risk_level=risk_level,
        risk_score=risk_score,

        # Existing classification field.
        scam_category=scam_category,

        # 🆕 Structured classification.
        scam_classification=scam_classification,

        red_flags=dedup,

        scam_dna=scam_dna,

        # 🆕 Scam Fingerprint.
        scam_fingerprint=scam_fingerprint,

        # 🆕 Variant Detection.
        variant_detection=variant_detection,

        # 🆕 Screenshot Analysis.
        screenshot_analysis=screenshot_analysis,

        summary=summary,

        emergency_alert=emergency_alert,

        safety_lock=safety_lock,

        detected_urls=detected_urls,

        guidance=guidance_obj,

        similarity_match=similarity_match,

        qr_payload=qr_payload,
    )

    logger.info(
        "Scan result: %s (%s) — %s — "
        "Fingerprint:%s — Variant:%s — Lock:%s",
        risk_level.value,
        risk_score,
        scam_category,
        scam_fingerprint.name,
        variant_detection.match_type,
        safety_lock,
    )

    return result