from typing import Any, Dict, Optional
from .safety_policy import evaluate_safety_policy
from .upi_analyzer import analyze_upi_payload


def categorize_qr_payload(payload: str) -> Dict[str, Any]:
    value = (payload or "").strip()
    if not value:
        return {"type": "EMPTY"}
    lower = value.lower()
    if lower.startswith("upi://") or ("pa=" in lower and "pn=" in lower):
        return {"type": "UPI_PAYMENT", "extracted_url": value}
    if lower.startswith(("http://", "https://")):
        return {"type": "URL", "extracted_url": value}
    # Domain-like payloads are normalized for analysis but are not auto-opened.
    if "." in value and " " not in value:
        candidate = value if "://" in value else f"https://{value}"
        try:
            parsed = __import__("urllib.parse", fromlist=["urlsplit"]).urlsplit(candidate)
            if parsed.hostname and "." in parsed.hostname:
                return {"type": "URL", "extracted_url": candidate}
        except ValueError:
            pass
    return {"type": "PLAIN_TEXT"}


def analyze_qr_payload(payload: str, risk_score: Optional[float] = None) -> Dict[str, Any]:
    value = (payload or "").strip()
    if not value:
        return {"success": False, "raw_payload": "", "payload_type": "EMPTY", "error": "QR payload is empty."}
    category = categorize_qr_payload(value)
    result = {
        "success": True,
        "raw_payload": value,
        "payload_type": category["type"],
        "extracted_url": category.get("extracted_url"),
    }
    if category["type"] == "URL":
        result["security_evaluation"] = evaluate_safety_policy(category["extracted_url"], risk_score=risk_score)
    elif category["type"] == "UPI_PAYMENT":
        result["security_evaluation"] = None
        result["payment_security"] = analyze_upi_payload(value)
        result["payment_warning"] = result["payment_security"]["reasons"][-1]
    return result
