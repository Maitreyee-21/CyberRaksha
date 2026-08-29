from typing import Any, Dict, List

HIGH_RISK_SAFE_ACTIONS = [
    "Do not click the link or allow automatic redirection.",
    "Do not enter passwords, PINs, CVVs, or OTPs.",
    "Do not make payments or transfer funds.",
    "Verify the organization using an official website or phone number.",
    "If money or credentials were exposed, contact your bank immediately.",
    "Report suspected cyber fraud through the national helpline 1930.",
]

MEDIUM_RISK_SAFE_ACTIONS = [
    "Inspect the exact domain before entering any information.",
    "Do not share passwords, PINs, CVVs, or OTPs on an unverified page.",
    "Verify the sender independently before continuing.",
]

LOW_RISK_SAFE_ACTIONS = [
    "Confirm that the domain matches the organization you intended to visit.",
    "Continue following normal cyber-hygiene practices.",
]


def create_emergency_alert(risk_level: str, action: str, reasons: List[str], evidence: List[Dict[str, Any]]) -> Dict[str, Any]:
    if risk_level == "HIGH" or action == "BLOCK":
        return {
            "active": True,
            "severity": "HIGH",
            "title": "Emergency Cyber Alert",
            "message": "Navigation blocked for your safety. High-risk indicators were detected.",
            "reasons": reasons or ["High-risk security indicators detected."],
            "safe_actions": HIGH_RISK_SAFE_ACTIONS,
            "evidence_summary": [f"[{e['severity']}] {e['description']}" for e in evidence],
        }
    if risk_level == "MEDIUM" or action == "WARN":
        return {
            "active": True,
            "severity": "MEDIUM",
            "title": "Cyber Security Warning",
            "message": "Caution advised. This destination requires explicit confirmation.",
            "reasons": reasons or ["Elevated risk or URL anomalies detected."],
            "safe_actions": MEDIUM_RISK_SAFE_ACTIONS,
            "evidence_summary": [f"[{e['severity']}] {e['description']}" for e in evidence],
        }
    return {
        "active": False,
        "severity": "LOW",
        "title": "Safety Verification Notice",
        "message": "No immediate high-risk URL indicators were detected.",
        "reasons": reasons or ["No immediate URL heuristic threat detected."],
        "safe_actions": LOW_RISK_SAFE_ACTIONS,
        "evidence_summary": [f"[{e['severity']}] {e['description']}" for e in evidence],
    }
