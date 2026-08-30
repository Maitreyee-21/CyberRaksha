from datetime import datetime, timezone
import secrets
from typing import Dict, Any


def create_safety_lock(action: str, risk_level: str, navigation_allowed: bool, requires_confirmation: bool) -> Dict[str, Any]:
    locked = action == "BLOCK" or risk_level == "HIGH"
    return {
        "locked": locked,
        "navigation_allowed": False if locked else navigation_allowed,
        "requires_confirmation": False if locked else requires_confirmation,
        "action": "BLOCK" if locked else action,
        "message": (
            "Navigation blocked for your safety. Destination identified as high-risk."
            if locked else
            "Explicit user confirmation is required before continuing."
            if requires_confirmation else
            "Low immediate risk detected. Proceed with standard cyber caution."
        ),
        "lock_id": f"LOCK-{secrets.token_hex(4).upper()}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


def verify_navigation_permission(lock_state: Dict[str, Any], explicit_user_confirmed: bool = False) -> Dict[str, Any]:
    if lock_state.get("locked") or lock_state.get("action") == "BLOCK":
        return {"permitted": False, "reason": "Safety Lock is active; high-risk navigation is blocked."}
    if lock_state.get("requires_confirmation") and not explicit_user_confirmed:
        return {"permitted": False, "reason": "Explicit user confirmation is required."}
    if lock_state.get("navigation_allowed"):
        return {"permitted": True, "reason": "Navigation permitted by the current security policy."}
    return {"permitted": False, "reason": "Current Safety Lock state does not permit navigation."}
