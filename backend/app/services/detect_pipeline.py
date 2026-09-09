import re
import logging
from typing import Tuple, List, Dict, Any, Optional
from app.core.schemas import InputType
from app.core.config import settings

logger = logging.getLogger(__name__)


URL_REGEX = re.compile(r'https?://(?:[-\w.]|%[\da-fA-F]{2})+(?::\d+)?(?:/[^\s]*)?|bit\.ly/\S+|tinyurl\.\S+|t\.co/\S+|wa\.me/\S+')

RED_FLAG_KEYWORDS_FAST = [
    "otp", "one time password", "kyc", "account suspended", "blocked",
    "you won", "winner", "cash prize", "lottery", "lucky draw",
    "processing fee", "send money", "urgent", "immediately",
    "call now", "toll free", "customs duty", "delivery charge",
    "share pin", "upi pin", "password", "cvv",
]


def detect_content_type(request_body: Dict[str, Any]) -> Tuple[InputType, str, List[str], Optional[str]]:
    """
    STEP 1: DETECT
    Routes the incoming scan request and normalises it to textual content
    that can be sent to Granite models. Also extracts any URLs and QR payload found.
    """
    itype_str = request_body.get("input_type", "text")
    try:
        itype = InputType(itype_str)
    except ValueError:
        itype = InputType.TEXT

    text_content: str = request_body.get("text_content") or ""
    image_b64: str = request_body.get("image_base64") or ""
    url: str = request_body.get("url") or ""

    detected_urls: List[str] = URL_REGEX.findall(text_content)
    if url:
        if url not in detected_urls:
            detected_urls.append(url)

    if itype == InputType.URL and url:
        if not url.startswith(("http://", "https://")):
            url = f"https://{url}"
        if url not in detected_urls:
            detected_urls.append(url)
        combined_text = f"URL TO ANALYZE: {url}\n\n"
        page_text = _scrape_url_text(url) if settings.ALLOW_REMOTE_URL_FETCH else "[Remote page fetch disabled by default; URL structure will be analyzed locally.]"
        combined_text += f"EXTRACTED PAGE CONTENT (first 4000 chars):\n{page_text[:4000]}"
        return itype, combined_text, detected_urls, None

    if itype == InputType.QR:
        qr_payload = request_body.get("mock_qr_payload") or _decode_qr(image_b64, text_content)
        if qr_payload:
            detected_urls.extend(URL_REGEX.findall(qr_payload))
            
            # If payload is a URL
            if URL_REGEX.search(qr_payload) or qr_payload.startswith("http"):
                urls_in_qr = URL_REGEX.findall(qr_payload) or [qr_payload]
                target_url = urls_in_qr[0]
                page_text = (_scrape_url_text(target_url) if settings.ALLOW_REMOTE_URL_FETCH else "[Remote page fetch disabled by default; URL structure will be analyzed locally.]") if target_url.startswith("http") else ""
                combined = (
                    f"QR CODE SCAN:\n"
                    f"--- SCANNED QR CODE PAYLOAD ---\n"
                    f"{qr_payload}\n\n"
                    f"--- DECODED DESTINATION URL ---\n"
                    f"{target_url}\n\n"
                    f"--- DESTINATION PREVIEW / PAGE CONTENT ---\n"
                    f"{page_text[:3000] if page_text else '[No live page content fetched]'}\n\n"
                    f"--- USER CONTEXT ---\n"
                    f"{text_content or 'None'}"
                )
                return itype, combined.strip(), list(set(detected_urls)), qr_payload
            
            # If payload is a UPI payment string
            elif "upi://" in qr_payload.lower():
                combined = (
                    f"QR CODE SCAN (UPI PAYMENT):\n"
                    f"--- SCANNED QR CODE PAYLOAD ---\n"
                    f"{qr_payload}\n\n"
                    f"Details: This encodes a direct UPI merchant/payee URI.\n"
                    f"--- USER CONTEXT ---\n"
                    f"{text_content or 'None'}"
                )
                return itype, combined.strip(), list(set(detected_urls)), qr_payload

            # Other text payload
            combined = (
                f"QR CODE SCAN:\n"
                f"--- SCANNED QR CODE PAYLOAD ---\n"
                f"{qr_payload}\n\n"
                f"--- USER CONTEXT ---\n"
                f"{text_content or 'None'}"
            )
            return itype, combined.strip(), list(set(detected_urls)), qr_payload
        else:
            return itype, f"[QR Code scan attempted — no data could be decoded from the provided image. User text: {text_content}]", detected_urls, None

    if itype == InputType.IMAGE:
        # Screenshot Analysis:
        # 1. Extract readable text locally with OCR.
        # 2. Extract URLs from both OCR text and optional user context.
        # 3. Keep the OCR text explicitly separated so Granite can distinguish
        #    evidence found in the screenshot from what the user typed.
        extracted_text = _ocr_fallback(image_b64).strip()
        user_context = text_content.strip()

        if extracted_text:
            detected_urls.extend(URL_REGEX.findall(extracted_text))

        if user_context:
            detected_urls.extend(URL_REGEX.findall(user_context))

        combined = (
            "SCREENSHOT / IMAGE ANALYSIS:\n"
            "--- OCR EXTRACTED TEXT ---\n"
            f"{extracted_text or '[No readable text detected in screenshot]'}\n\n"
            "--- DETECTED URLS FROM SCREENSHOT ---\n"
            f"{', '.join(dict.fromkeys(detected_urls)) or 'None'}\n\n"
            "--- USER PROVIDED CONTEXT ---\n"
            f"{user_context or 'None'}"
        )

        # Even when OCR finds nothing, return the image-analysis marker so the
        # downstream pipeline can report that the screenshot could not be read
        # instead of silently treating it as ordinary text.
        return itype, combined.strip(), list(dict.fromkeys(detected_urls)), None

    if itype == InputType.DOCUMENT:
        doc_text = text_content.strip()
        if not doc_text and image_b64:
            doc_text = _ocr_fallback(image_b64).strip()
        if doc_text:
            detected_urls.extend(URL_REGEX.findall(doc_text))
        combined = (
            "DOCUMENT CONTENT ANALYSIS:\n"
            "--- EXTRACTED DOCUMENT TEXT ---\n"
            f"{doc_text or '[No readable text content found in document]'}\n\n"
            "--- DETECTED URLS FROM DOCUMENT ---\n"
            f"{', '.join(dict.fromkeys(detected_urls)) or 'None'}"
        )
        return itype, combined.strip(), list(dict.fromkeys(detected_urls)), None

    return itype, text_content.strip(), detected_urls, None


def heuristic_layer1_check(text: str) -> Dict[str, Any]:
    """
    Fast deterministic pre-scan: runs regex, keyword lists, grammar heuristics.
    Returns an initial risk score and early red-flags before Granite models run.
    """
    t = text.lower()
    score = 0
    flags: List[str] = []
    urls_found = URL_REGEX.findall(t)

    kw_matches = sum(1 for kw in RED_FLAG_KEYWORDS_FAST if kw in t)
    score += kw_matches * 8

    # Specific QR Code (Quishing) heuristics
    if "qr code threat analysis" in t or "scanned qr code payload" in t:
        flags.append("QR code (Quishing) vector: Payload extracted and analyzed for deceptive redirects or unauthorized payment requests.")
        if "upi://" in t or "upi payment" in t:
            score += 25
            flags.append("QR code encodes a direct UPI payment transfer string — Scanning and entering UPI PIN will DEBIT funds from your account.")
        if any(x in t for x in ["bit.ly", "tinyurl", "t.co", ".xyz", ".top", ".tk", ".ml", ".cf", ".ga", ".gq"]):
            score += 30
            flags.append("QR code redirects to a shortened or high-risk domain commonly used in phishing.")

    # Screenshot evidence should be treated as the same analyzable content as
    # text, while retaining a clear signal that OCR was involved.
    if "screenshot / image analysis:" in t:
        flags.append("Screenshot content was analyzed using extracted text (OCR).")

    if len(urls_found) > 0:
        suspicious_shorteners = any(x in u.lower() for u in urls_found for x in ["bit.ly", "tinyurl", "t.co", "wa.me", "cutt.ly"])
        if suspicious_shorteners:
            score += 18
            flags.append("Message uses shortened / redirection URLs — common phishing trick to hide destination.")
        score += 8

    if any(x in t for x in ["1 hour", "2 hour", "within", "today only", "last chance", "immediate", "asap"]):
        score += 10
        flags.append("Time-pressure wording detected.")

    if any(x in t for x in ["block", "suspend", "terminate", "close account", "legal action", "arrest", "penalty", "court"]):
        score += 15
        flags.append("Threat / fear-inducing language detected.")

    if any(x in t for x in ["dear customer", "from sbi", "from hdfc", "from icici", "rbi", "income tax", "amazon", "flipkart"]):
        score += 12

    if t.count("!") >= 2 or t.count("‼") > 0:
        score += 5
    if t.count("₹") + t.count("rs.") + t.count("rs ") >= 1:
        score += 6

    typos = sum(1 for w in ["recieve", "winnder", "congratulation", "your eligible", "garenty", "assured"])
    score += typos * 5

    return {
        "layer1_risk_score": min(100, score),
        "layer1_flags": flags,
        "kw_matches": kw_matches,
        "urls_found": urls_found,
    }


def _scrape_url_text(url: str) -> str:
    try:
        import requests
        from bs4 import BeautifulSoup
        headers = {"User-Agent": "Mozilla/5.0 (CyberRaksha-Scanner; +https://cyberraksha.local)"}
        r = requests.get(url, timeout=8, headers=headers, allow_redirects=True)
        if r.status_code != 200:
            return f"[Unable to fetch URL — HTTP {r.status_code}]"
        soup = BeautifulSoup(r.text, "lxml")
        for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
            tag.extract()
        text = soup.get_text(separator="\n", strip=True)
        return text[:6000]
    except Exception as e:
        return f"[Could not retrieve page content: {e}]"


def _decode_qr(image_b64: str, text_content: str) -> str:
    if not image_b64:
        return text_content or ""

    # 1. Try OpenCV QRCodeDetector with various pre-processing steps
    try:
        import base64
        import numpy as np
        import cv2

        b64_str = image_b64
        if "," in b64_str:
            b64_str = b64_str.split(",", 1)[1]

        img_bytes = base64.b64decode(b64_str)
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is not None:
            detector = cv2.QRCodeDetector()
            
            # Direct decode
            data, _, _ = detector.detectAndDecode(img)
            if data and data.strip():
                return data.strip()
            
            # Grayscale decode
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            data, _, _ = detector.detectAndDecode(gray)
            if data and data.strip():
                return data.strip()

            # Thresholded decode
            _, thresh = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
            data, _, _ = detector.detectAndDecode(thresh)
            if data and data.strip():
                return data.strip()
                
            # Equalized decode
            eq = cv2.equalizeHist(gray)
            data, _, _ = detector.detectAndDecode(eq)
            if data and data.strip():
                return data.strip()
    except Exception as e:
        logger.warning(f"OpenCV QR decode attempt failed: {e}")

    # 2. Try pyzbar if available
    try:
        import base64
        from io import BytesIO
        from PIL import Image
        from pyzbar.pyzbar import decode as pyzbar_decode
        b64_str = image_b64
        if "," in b64_str:
            b64_str = b64_str.split(",", 1)[1]
        img_bytes = base64.b64decode(b64_str)
        img = Image.open(BytesIO(img_bytes))
        codes = pyzbar_decode(img)
        if codes:
            return codes[0].data.decode("utf-8", errors="replace").strip()
    except Exception:
        pass

    return text_content or ""


def _ocr_fallback(image_b64: str) -> str:
    """Local OCR fallback for screenshot scans.

    Granite Vision remains a separate optional capability. Until live vision
    inference is configured, OCR converts readable screenshot text into evidence
    that the normal Granite Instruct + Guardian pipeline can analyze.
    """
    if not image_b64:
        return ""

    try:
        import base64
        from io import BytesIO

        from PIL import Image, ImageOps
        import numpy as np
        import cv2
        import pytesseract

        b64_str = image_b64.split(",", 1)[-1].strip()
        if not b64_str:
            return ""

        img_bytes = base64.b64decode(b64_str, validate=True)
        img = Image.open(BytesIO(img_bytes)).convert("RGB")

        # Upscale small screenshots because OCR accuracy can drop sharply on
        # compressed chat/payment screenshots.
        width, height = img.size
        scale = 1.5
        if width < 1200:
            scale = max(scale, min(2.5, 1200 / max(width, 1)))

        gray = ImageOps.grayscale(img)
        cv_image = cv2.cvtColor(np.array(gray), cv2.COLOR_GRAY2BGR)
        cv_image = cv2.resize(
            cv_image,
            None,
            fx=scale,
            fy=scale,
            interpolation=cv2.INTER_CUBIC,
        )

        gray_cv = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)

        # Otsu thresholding improves text/background separation while keeping
        # the implementation lightweight and local.
        _, thresh = cv2.threshold(
            gray_cv,
            0,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU,
        )

        # Devanagari covers common Hindi/Marathi screenshots; English remains
        # supported. If the local Tesseract installation lacks Devanagari,
        # fall back to English rather than failing the whole scan.
        try:
            text = pytesseract.image_to_string(
                thresh,
                lang="eng+Devanagari",
                config="--psm 6",
            )
        except Exception:
            text = pytesseract.image_to_string(
                thresh,
                lang="eng",
                config="--psm 6",
            )

        # Normalize excessive blank lines without destroying the actual OCR
        # wording that downstream scam analysis needs.
        cleaned = re.sub(r"\n{3,}", "\n\n", text or "")
        return cleaned.strip()

    except Exception as exc:
        logger.warning("Local OCR fallback failed: %s", exc)
        return ""
