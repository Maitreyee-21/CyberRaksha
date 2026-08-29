import logging
from typing import Dict, Any
from app.core.schemas import RiskLevel, ScamDNA, ScanResult, GuidanceItem, MultilingualGuidance
from app.core.config import settings

logger = logging.getLogger(__name__)


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
    STEP 2: EXPLAIN  — Vote and produce final ScanResult.
    STEP 3: ALERT    — Trigger Emergency Alert if HIGH threshold crossed.
    STEP 4: PREVENT  — Activate Safety Lock if HIGH + suspicious_links.
    STEP 5: GUIDE    — Attach the pre-computed EN/HI/MR guidance object.
    """

    # ── Weighted ensemble risk score ──────────────────────────────
    guardian_risk = guardian.get("guardian_risk_score", 0)
    instruct_risk = instruct.get("granite_risk_score_estimate", 0)
    layer1_risk = layer1.get("layer1_risk_score", 0)
    sim_risk = 0
    if similarity_match and isinstance(similarity_match, dict):
        sim_risk = int(float(similarity_match.get("similarity_score", 0)) * 100)

    # Guardian: 45% (security expert), Instruct: 30%, Layer-1 heuristics: 15%, Similarity: 10%
    risk_score = round(
        guardian_risk * 0.45
        + instruct_risk * 0.30
        + layer1_risk * 0.15
        + sim_risk * 0.10
    )
    risk_score = max(0, min(100, risk_score))
    # ── Scam category ─────────────────────────────────────────────
    if similarity_match and risk_score > 50:
        scam_category = similarity_match.get("category") or instruct.get("scam_category", "Suspicious Content")
    else:
        scam_category = instruct.get("scam_category", "Suspicious Content")

    # Boost QR/UPI scam risk to High (74+) ONLY when combined with actual risk signals
    if risk_score > 35 and scam_category != "Benign Message":
        category_lower = (scam_category or "").lower()
        raw_dna = guardian.get("scam_dna") or {}
        is_suspicious = (
            int(raw_dna.get("urgency", 0)) > 30 
            or int(raw_dna.get("fear", 0)) > 30 
            or int(raw_dna.get("impersonation", 0)) > 30 
            or int(raw_dna.get("suspicious_link", 0)) >= 50
            or any(kw in str(layer1.get("layer1_flags", [])).lower() for kw in ["urgency", "threat", "impersonat", "phishing", "redirect"])
        )
        if is_suspicious:
            if "quishing" in category_lower or "qr code" in category_lower or (qr_payload and "upi://" in qr_payload.lower()):
                risk_score = max(risk_score, 74)

    # ── Risk level ────────────────────────────────────────────────
    if risk_score >= settings.HIGH_RISK_THRESHOLD:
        risk_level = RiskLevel.HIGH
    elif risk_score >= settings.MEDIUM_RISK_THRESHOLD:
        risk_level = RiskLevel.MEDIUM
    else:
        risk_level = RiskLevel.LOW

    # ── Red flags (deduplicated, max 8) ───────────────────────────
    merged_flags = []
    for src in [layer1.get("layer1_flags", []), instruct.get("red_flags", []), guardian.get("scam_dna", {})]:
        if isinstance(src, list):
            merged_flags.extend(src)
    if similarity_match and isinstance(similarity_match, dict):
        note = similarity_match.get("note")
        if note:
            merged_flags.insert(0, f"Database match: {note}")
    seen = set()
    dedup = []
    for f in merged_flags:
        if f and f not in seen:
            seen.add(f)
            dedup.append(f)
        if len(dedup) >= 8:
            break

    # ── Scam DNA ──────────────────────────────────────────────────
    dna = guardian.get("scam_dna") or {}
    urgency = int(dna.get("urgency", 0))
    fear = int(dna.get("fear", 0))
    impersonation = int(dna.get("impersonation", 0))
    suspicious_link = int(dna.get("suspicious_link", 0))
    payment_pressure = int(dna.get("payment_pressure", 0))

    # Dynamically align Scam DNA with detected red flags
    for flag in dedup:
        flag_lower = flag.lower()
        if any(x in flag_lower for x in ["urgency", "time-pressure", "deadline", "expire", "immediate", "hour", "minute"]):
            urgency = max(urgency, 75)
        if any(x in flag_lower for x in ["fear", "threat", "block", "suspend", "terminate", "close", "arrest", "penalty", "consequence", "prosecut", "legal"]):
            fear = max(fear, 75)
        if any(x in flag_lower for x in ["impersonat", "claim to be", "official", "government", "bank", "rbi", "police"]):
            impersonation = max(impersonation, 75)
        if any(x in flag_lower for x in ["link", "url", "phishing", "redirect", "click"]):
            suspicious_link = max(suspicious_link, 75)
        if any(x in flag_lower for x in ["payment", "money", "transfer", " upi", "fee", "penalty", "deposit", "pay "]):
            payment_pressure = max(payment_pressure, 75)

    scam_dna = ScamDNA(
        urgency=urgency,
        fear=fear,
        impersonation=impersonation,
        suspicious_link=suspicious_link,
        payment_pressure=payment_pressure,
    )

    # ── Emergency Alert (STEP 3) ──────────────────────────────────
    emergency_alert = risk_level == RiskLevel.HIGH

    # ── Safety Lock (STEP 4) ──────────────────────────────────────
    # Deterministic rule: activate on HIGH risk with any of:
    #   (a) suspicious link DNA >= 50
    #   (b) at least one detected URL
    #   (c) high payment pressure (demanding money / UPI)
    #   (d) high fear/threat (RBI/arrest style coercion)
    safety_lock = (
        emergency_alert
        and (
            scam_dna.suspicious_link >= 50
            or len(detected_urls) > 0
            or scam_dna.payment_pressure >= 55
            or scam_dna.fear >= 55
        )
    )

    # ── Summary ───────────────────────────────────────────────────
    summary = instruct.get("summary", "Analysis complete.")
    if emergency_alert:
        summary = "⚠️ HIGH RISK — " + summary
    elif risk_level == RiskLevel.MEDIUM:
        summary = "⚡ SUSPICIOUS — " + summary

    # ── Guidance (STEP 5) ─────────────────────────────────────────
    guidance_obj = MultilingualGuidance(
        en=GuidanceItem(**guidance["en"]),
        hi=GuidanceItem(**guidance["hi"]),
        mr=GuidanceItem(**guidance["mr"]),
    )

    # ── Final ScanResult ──────────────────────────────────────────
    result = ScanResult(
        risk_level=risk_level,
        risk_score=risk_score,
        scam_category=scam_category,
        red_flags=dedup,
        scam_dna=scam_dna,
        summary=summary,
        emergency_alert=emergency_alert,
        safety_lock=safety_lock,
        detected_urls=list(detected_urls or []),
        guidance=guidance_obj,
        similarity_match=similarity_match,
    )
    logger.info(f"Scan result: {risk_level.value} ({risk_score}) — {scam_category} — Lock:{safety_lock}")
    return result
