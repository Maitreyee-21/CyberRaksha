# Security Review — Merge Notes

## Issues found and addressed

1. **Standalone app was not connected to the real project stack.**
   - Resolved by integrating the security layer into FastAPI and the existing Next.js UI.

2. **Main project had a deterministic safety concept but did not expose a structured URL security evaluation.**
   - Resolved with `backend/app/security/` and `security_evaluation` in `ScanResult`.

3. **Safety Lock and Emergency Alert UI existed already.**
   - Replaced/adapted them rather than creating duplicate components.

4. **Main URL pipeline fetched arbitrary user-supplied pages by default.**
   - Disabled remote fetching by default through `ALLOW_REMOTE_URL_FETCH=false`.

5. **The alert implementation treated any active alert as HIGH visually.**
   - Corrected in the integrated Next.js alert component so severity is based on the actual risk level/action.

6. **Navigation needed one controlled gateway.**
   - Added `requestNavigation()` and made the integrated Safety Lock the only UI path for opening an analyzed destination.

7. **The main result could previously show a LOW ensemble score while a URL-specific safety decision should block.**
   - For URL-bearing scans, the deterministic security evaluation now becomes authoritative for the displayed final URL risk state.

## Known limitations

- URL analysis is heuristic, not a malicious-site verdict.
- No external threat-intelligence lookup is performed.
- QR image decoding remains based on the main project's OpenCV/pyzbar pipeline.
- UPI QR handling is a safety warning/classification layer, not a payment-verification service.
- Remote page fetching is disabled by default.
- Device-wide Wi-Fi/mobile-data blocking is intentionally not implemented.


## Additional fixes in the current revision

8. **Risk thresholds were inconsistent.**
   - Unified the AI ensemble and policy to MEDIUM >= 40 and HIGH >= 70.

9. **The backend CORS policy used a wildcard with credentials enabled.**
   - Replaced it with configurable localhost origins via `CORS_ORIGINS`.

10. **Security endpoints accepted untyped dictionaries.**
    - Added Pydantic request models with score ranges and URL/payload length limits.

11. **UPI QR payloads were treated as a web-URL concern.**
    - Added a separate deterministic UPI payment safety analysis and never allows automatic payment/navigation.

12. **Model-status wording could overstate live IBM inference.**
    - Local fallbacks are now labeled as local fallbacks; Vision and Embedding are explicitly reported as configured-but-not-live in the MVP.

13. **Protected-brand matching could over-trigger on substring matches.**
    - Tightened matching to DNS-label/hyphen boundaries.
