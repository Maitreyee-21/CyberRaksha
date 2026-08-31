# Security & Prevention Layer

The original  prototype was a standalone Vite/Express application. The main CyberRaksha project uses **FastAPI + Next.js**, so the security layer has been integrated into the existing stack instead of adding a second frontend/backend application.

## Integrated backend

`backend/app/security/`

- `url_analyzer.py` — deterministic URL structure and phishing-indicator analysis.
- `safety_policy.py` — combines URL indicators with AI/ensemble risk and decides LOW/MEDIUM/HIGH.
- `safety_lock.py` — deterministic navigation permission state.
- `emergency_alert.py` — structured alert reasons and safe actions.
- `qr_analyzer.py` — classifies decoded QR payloads and routes URL payloads through the security policy.
- `models.py` — security data structures.

## API

- `POST /api/security/analyze-url`
- `POST /api/security/analyze-qr-payload`
- `POST /api/scan` now attaches `security_evaluation` when a URL is detected.

## Decision model

```text
AI / Granite Guardian / Ensemble Risk
                |
                v
      Deterministic Security Policy
                |
       +--------+--------+
       |        |        |
      LOW    MEDIUM     HIGH
       |        |        |
    CAUTION   WARN      BLOCK
                |        |
          CONFIRMATION  Emergency Alert
                         Safety Lock
```

AI does not directly control navigation. Structural critical indicators can force a HIGH/BLOCK decision.

## QR flow

```text
QR image
  -> existing OpenCV/pyzbar decoder
  -> QR payload classification
  -> URL payload: URL Analyzer -> Safety Policy
  -> UPI payload: payment safety warning
  -> plain text: non-navigable display
```

## Navigation safety

The frontend `SafetyLock` component contains the single external-navigation gateway. HIGH-risk destinations cannot reach `window.open`; MEDIUM destinations require explicit confirmation; LOW destinations may proceed with caution.

## Important safety change

Remote URL page fetching is disabled by default with:

```text
ALLOW_REMOTE_URL_FETCH=false
```

This avoids making the server automatically request arbitrary user-supplied destinations during a normal hackathon scan. Enable only after a dedicated SSRF-safe fetcher is implemented.

## Existing-file integration

- The main project already had `frontend/components/analysis/SafetyLock.tsx` and `EmergencyAlert.tsx`. Their functionality was replaced/adapted using the security design while preserving the main project's Next.js architecture.
- The main project already had QR decoding in `backend/app/services/detect_pipeline.py`, so a second browser QR implementation was not copied into the main application. The QR classification/policy behavior was integrated on top of the existing decoder.
- The main project already had URL extraction, so the URL security heuristics were added as the dedicated deterministic security layer rather than duplicating URL extraction logic.

## Testing

Run from `backend/`:

```bash
PYTHONPATH=. python -m unittest discover -s tests -v
```

The integration includes focused security tests covering HIGH/MEDIUM/LOW policy, raw-IP blocking, credential indicators, malformed URLs, QR URL analysis, and plain-text QR handling.


## Model-status clarification

The repository configures four IBM Granite model targets, but the current MVP must distinguish configured targets from verified live inference:

- Granite 4.1 8B Instruct — live through watsonx.ai when valid credentials are configured; otherwise local fallback.
- Granite Guardian 4.1 8B — live through watsonx.ai when valid credentials are configured; otherwise local fallback.
- Granite 4.0 3B Vision — configured target, not a live inference path in the current MVP; screenshot handling uses local OCR fallback.
- Granite Embedding 107M Multilingual — configured target, not a live vector inference path in the current MVP; known-scam matching uses a deterministic local similarity fallback.

The application must not claim a model is live unless the corresponding IBM inference path has actually succeeded.

## UPI QR handling

UPI QR payloads are treated separately from web navigation. CyberRaksha parses only non-secret payment metadata (payee, name, amount and currency), never a UPI PIN or other credential. Approval is never automated; the UI warns the user to verify the payee and amount before authorizing payment.
