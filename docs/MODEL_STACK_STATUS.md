# CyberRaksha — Model Stack Status

This document distinguishes **configured model targets** from **verified live inference** so the project does not overclaim capabilities during a hackathon demo.

| Component | Target | Current implementation | Demo wording |
|---|---|---|---|
| Scam text analysis | IBM Granite 4.1 8B Instruct | Live through watsonx.ai when valid credentials are configured; deterministic local fallback otherwise | "IBM Granite Live" only when the live call succeeds |
| Risk validation | IBM Granite Guardian 4.1 8B | Live through watsonx.ai when valid credentials are configured; deterministic local fallback otherwise | "IBM Granite Live" only when the live call succeeds |
| Screenshot vision | IBM Granite 4.0 3B Vision | Target configured; current MVP extracts screenshot text with local Tesseract OCR and sends that text through the normal analysis path | Do not claim live Granite Vision inference unless it is actually connected and verified |
| Scam similarity | IBM Granite Embedding 107M Multilingual | Target configured; current MVP uses deterministic keyword/n-gram similarity against a small local dataset | Do not claim live embedding/vector inference unless it is actually connected and verified |
| QR decoding | OpenCV + pyzbar | Local deterministic decoding | "QR decoder" |
| URL protection | CyberRaksha rules | Deterministic | "Safety Policy / Safety Lock" |

## Safety principle

AI provides risk information. Deterministic application policy controls navigation. A HIGH-risk result blocks navigation inside CyberRaksha; MEDIUM requires explicit confirmation; LOW allows cautious continuation.
