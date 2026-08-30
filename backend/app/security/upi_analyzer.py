"""Deterministic safety checks for UPI QR payloads.

This module never processes or stores a UPI PIN, password, OTP, CVV, or bank credential.
It only parses the public payment URI fields needed to warn the user before approval.
"""
from typing import Any, Dict
from urllib.parse import parse_qs, urlsplit


def analyze_upi_payload(payload: str) -> Dict[str, Any]:
    value = (payload or "").strip()
    if not value.lower().startswith("upi://pay"):
        return {"valid": False, "risk_level": "HIGH", "action": "BLOCK", "reasons": ["Unsupported or malformed UPI payload."]}

    parsed = urlsplit(value)
    params = parse_qs(parsed.query, keep_blank_values=True)
    payee = params.get("pa", [""])[0].strip()
    name = params.get("pn", [""])[0].strip()
    amount = params.get("am", [""])[0].strip()
    currency = params.get("cu", ["INR"])[0].strip().upper() or "INR"

    reasons = []
    if not payee:
        reasons.append("The UPI payment request does not contain a payee address.")
    if amount:
        try:
            if float(amount) <= 0:
                reasons.append("The payment amount is invalid or non-positive.")
        except ValueError:
            reasons.append("The payment amount is not a valid number.")
    if currency != "INR":
        reasons.append(f"The QR specifies currency {currency}; verify it before approving.")

    # Scanning a QR does not itself debit funds; approval with a UPI PIN does.
    reasons.append("Verify the payee and amount before approving. Entering a UPI PIN authorizes the payment.")

    risk_level = "MEDIUM" if payee and not any("invalid" in r.lower() or "does not contain" in r.lower() for r in reasons[:-1]) else "HIGH"
    return {
        "valid": not any("invalid" in r.lower() or "does not contain" in r.lower() for r in reasons),
        "risk_level": risk_level,
        "action": "WARN" if risk_level == "MEDIUM" else "BLOCK",
        "payee": payee,
        "payee_name": name,
        "amount": amount or None,
        "currency": currency,
        "reasons": reasons,
        "navigation_allowed": False,
        "requires_confirmation": True,
    }
