from typing import Any, Dict, Optional

from app.core.config import settings

from .emergency_alert import create_emergency_alert
from .safety_lock import create_safety_lock
from .url_analyzer import analyze_url

DEFAULT_THRESHOLDS = {
    "low_max": settings.MEDIUM_RISK_THRESHOLD - 1,
    "medium_max": settings.HIGH_RISK_THRESHOLD - 1,
    "high_min": settings.HIGH_RISK_THRESHOLD,
}


def _normalize_level(level: Optional[str]) -> str:
    if not level:
        return "UNKNOWN"
    value = str(level).strip().upper()
    if "HIGH" in value or "CRITICAL" in value or "SEVERE" in value:
        return "HIGH"
    if "MED" in value or "MODERATE" in value:
        return "MEDIUM"
    if "LOW" in value or "SAFE" in value:
        return "LOW"
    return "UNKNOWN"


def evaluate_safety_policy(
    url: str,
    risk_score: Optional[float] = None,
    risk_level: Optional[str] = None,
    guardian_score: Optional[float] = None,
    guardian_level: Optional[str] = None,
    thresholds: Optional[Dict[str, int]] = None,
) -> Dict[str, Any]:
    thresholds = thresholds or DEFAULT_THRESHOLDS
    low_max = int(thresholds["low_max"])
    medium_max = int(thresholds["medium_max"])
    high_min = int(thresholds["high_min"])
    if not (0 <= low_max < medium_max < high_min <= 100):
        raise ValueError("Invalid safety thresholds: expected 0 <= low_max < medium_max < high_min <= 100")
    analysis = analyze_url(url)
    ai_score = None if risk_score is None else max(0, min(100, float(risk_score)))
    guardian_score = None if guardian_score is None else max(0, min(100, float(guardian_score)))
    supplied_level = _normalize_level(risk_level or guardian_level)

    score = analysis.derived_risk_modifier
    if ai_score is not None:
        score = max(score, ai_score)
    if guardian_score is not None:
        score = max(score, guardian_score)

    severe = any(i.type in {
        "RAW_IP_HOST", "CREDENTIAL_HARVESTING_PATTERN", "AT_SYMBOL_ABUSE", "MALFORMED_URL",
        "PUNYCODE_HOMOGLYPH", "OBFUSCATED_ENCODING",
    } for i in analysis.indicators)

    if severe:
        score = max(score, high_min)

    if not analysis.is_valid_url:
        final_level, action, nav_allowed, confirm = "HIGH", "BLOCK", False, False
        fail_safe = True
    elif score >= high_min or supplied_level == "HIGH" or severe:
        final_level, action, nav_allowed, confirm = "HIGH", "BLOCK", False, False
        fail_safe = False
    elif score > low_max or supplied_level == "MEDIUM" or analysis.indicators:
        final_level, action, nav_allowed, confirm = "MEDIUM", "WARN", False, True
        fail_safe = False
    else:
        final_level, action, nav_allowed, confirm = "LOW", "ALLOW_WITH_CAUTION", True, False
        fail_safe = False

    reasons = []
    for indicator in analysis.indicators:
        reasons.append(f"{indicator.type}: {indicator.description}")
    if guardian_score is not None:
        reasons.append(f"Granite Guardian score: {guardian_score:.0f}/100.")
    if ai_score is not None and ai_score != guardian_score:
        reasons.append(f"Ensemble/application risk score: {ai_score:.0f}/100.")
    if not reasons:
        reasons.append("No immediate URL heuristic threat detected.")

    evidence = [i.as_dict() for i in analysis.indicators]
    lock = create_safety_lock(action, final_level, nav_allowed, confirm)
    alert = create_emergency_alert(final_level, action, reasons, evidence)

    return {
        "url": analysis.url,
        "sanitized_url": analysis.sanitized_url,
        "risk_score": round(score),
        "risk_level": final_level,
        "action": action,
        "navigation_allowed": nav_allowed,
        "requires_confirmation": confirm,
        "url_indicators": evidence,
        "indicator_count": len(evidence),
        "safety_lock": lock,
        "emergency_alert": alert,
        "safe_actions": alert["safe_actions"],
        "reasons": reasons,
        "fail_safe_triggered": fail_safe,
        "guardian_score": guardian_score,
    }
