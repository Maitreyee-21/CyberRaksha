import json
import logging
from typing import Optional, Dict, Any, List
from app.core.config import settings
from app.core.schemas import ScamDNA

logger = logging.getLogger(__name__)


def _extract_json_object(value: Any) -> Optional[Dict[str, Any]]:
    """Extract the first valid JSON object from a Granite model response."""
    if not isinstance(value, str):
        return None

    raw = value.strip()
    if not raw:
        return None

    try:
        parsed = json.loads(raw)
        return parsed if isinstance(parsed, dict) else None
    except json.JSONDecodeError:
        pass

    cleaned = raw.replace("```json", "").replace("```", "").strip()
    try:
        parsed = json.loads(cleaned)
        return parsed if isinstance(parsed, dict) else None
    except json.JSONDecodeError:
        pass

    decoder = json.JSONDecoder()
    for index, char in enumerate(cleaned):
        if char != "{":
            continue
        try:
            parsed, _ = decoder.raw_decode(cleaned[index:])
            if isinstance(parsed, dict):
                return parsed
        except json.JSONDecodeError:
            continue

    return None


class MockWatsonXClient:
    """
    Local fallback implementation for development/offline demos.
    It is NOT an IBM model and must not be presented as a live Granite inference.
    When watsonx credentials are configured, WatsonXService uses the IBM SDK for
    Granite Instruct and Granite Guardian and reports that mode explicitly.
    """

    INDIAN_SCAM_KEYWORDS = {
        "otp_fraud": ["otp", "one time password", "verify otp", "send otp", "share otp", "कृपया OTP", "ओटीपी"],
        "kyc_fraud": ["kyc", "know your customer", "kyc expired", "kyc pending", "account suspended", "अकाउंट बंद", "KYC अपडेट"],
        "upi_fraud": ["upi", "upi id", "upi pin", "send money", "google pay", "phonepe", "paytm", "qr pay", "यूपीआई"],
        "lottery_scam": ["winner", "congratulations", "you won", "cash prize", "lottery", "lucky draw", "crore", "lakhs", "₹", "rs. ", "रुपये", "जीतें"],
        "fake_delivery": ["amazon", "flipkart", "delivery", "courier", "parcel", "confirm address", "order pending", "डिलीवरी", "ऑर्डर"],
        "tech_support": ["virus", "hacked", "tech support", "customer care", "toll free", "call now", "हेल्पलाइन"],
        "impersonation_gov": ["rbi", "income tax", "it department", "narcotics", "police", "court", "notice", "govt", "government", "आयकर", "आरबीआई"],
        "loan_scam": ["personal loan", "instant loan", "approved loan", "low interest", "processing fee", "लोन", "ऋण"],
        "job_scam": ["job offer", "joining letter", "interview", "joining fee", "refundable deposit", "नौकरी"],
        "quishing_scam": ["qr code", "qr pay", "scan qr", "scan to receive", "quishing", "upi://", "scan here", "क्यूआर कोड"],
    }

    DNA_KEYWORD_TRIGGERS = {
        "urgency": ["immediately", "within 1 hour", "within 2 hours", "today only", "last chance", "expires soon", "urgent", "now", "फौरन", "आज ही"],
        "fear": ["blocked", "suspend", "close", "terminate", "penalty", "legal action", "arrest", "fraud case", "police", "ब्लॉक", "क़ानूनी कार्रवाई", "गिरफ्तारी"],
        "impersonation": ["dear customer", "from rbi", "from sbi", "from hdfc", "from icici", "from amazon", "from flipkart", "government", "official", "वैधानिक", "सरकारी"],
        "suspicious_link": ["http", "bit.ly", "tinyurl", "t.co", "wa.me", "click here", "open link", "लिंक पर क्लिक", "qr code"],
        "payment_pressure": ["pay", "send rs", "transfer", "deposit", "fee", "processing charge", "gift card", "paytm no", "gpay no", "भुगतान", "शुल्क", "जमा करें", "upi://"],
    }

    @staticmethod
    def _count_matches(text_lower: str, keywords: List[str]) -> int:
        return sum(1 for k in keywords if k in text_lower)

    def granite_instruct_analyze(self, text: str) -> Dict[str, Any]:
        """
        Local fallback for the Granite 4.1 8B Instruct contract
        Performs scam category classification, red-flag extraction, plain-language summary,
        and multilingual guidance.
        """
        t = text.lower()
        scores: Dict[str, int] = {}
        for cat, kws in self.INDIAN_SCAM_KEYWORDS.items():
            scores[cat] = self._count_matches(t, kws)

        # Standalone, benign UPI QR or link check
        if "upi://" in t or "qr code" in t or "quishing" in t:
            is_suspicious_upi = any(kw in t for kw in [
                "subsidy", "refund", "cashback", "claim", "won", "prize", "gift", 
                "reward", "narcotics", "police", "arrest", "penalty", "block", 
                "suspend", "kyc", "verify", "pan", "aadhar", "tax", "urgent", 
                "immediate", "within", "threat", "block", "freeze"
            ])
            if not is_suspicious_upi:
                if "upi_fraud" in scores:
                    scores["upi_fraud"] = 0
                if "quishing_scam" in scores:
                    scores["quishing_scam"] = 0

        if not any(scores.values()):
            category = "Benign Message"
            category_confidence = 90
        else:
            category_map = {
                "otp_fraud": "OTP / Verification Fraud",
                "kyc_fraud": "Fake KYC / Account Scam",
                "upi_fraud": "UPI / Payment Fraud",
                "lottery_scam": "Fake Lottery / Prize Scam",
                "fake_delivery": "Fake Delivery / Parcel Scam",
                "tech_support": "Tech Support / Customer Care Scam",
                "impersonation_gov": "Government / RBI Impersonation Scam",
                "loan_scam": "Fraudulent Loan Offer Scam",
                "job_scam": "Fake Job Offer Scam",
                "quishing_scam": "QR Code Phishing / Quishing Scam",
            }
            top_cat = max(scores, key=scores.get)
            category = category_map[top_cat]
            category_confidence = min(95, 40 + scores[top_cat] * 20)

        red_flags = self._extract_red_flags(text)

        if category == "Benign Message":
            summary = "This message does not appear to match typical scam patterns. However, always remain cautious with unsolicited messages."
        else:
            summary = (f"Detected {category} pattern. The content uses manipulation tactics commonly seen in fraud messages "
                       f"targeting Indian users. Risk probability: ~{category_confidence}%.")

        guidance = self._generate_guidance(category, scores)

        risk_est = min(100, sum(scores.values()) * 18 + (20 if red_flags else 0))
        if category == "QR Code Phishing / Quishing Scam":
            risk_est = max(risk_est, 82)
        elif category == "UPI / Payment Fraud" and ("upi://" in t or "qr code" in t):
            risk_est = max(risk_est, 82)

        return {
            "scam_category": category,
            "category_confidence": category_confidence,
            "red_flags": red_flags,
            "summary": summary,
            "guidance": guidance,
            "granite_risk_score_estimate": risk_est,
            "input_type": "text",
        }

    def _extract_red_flags(self, text: str) -> List[str]:
        t = text.lower()
        flags = []

        if self._count_matches(t, self.INDIAN_SCAM_KEYWORDS["otp_fraud"]) > 0:
            flags.append("Requests OTP, PIN, or verification code — Legitimate companies NEVER ask for OTP over SMS/chat.")
        if self._count_matches(t, self.INDIAN_SCAM_KEYWORDS["impersonation_gov"]) > 0:
            flags.append("Claims to be from RBI / Income-Tax / Police / Government — Verify through official channels only.")
        if self._count_matches(t, self.DNA_KEYWORD_TRIGGERS["urgency"]) > 0:
            flags.append("Uses urgency pressure (time-limits, immediate-action wording) — Scammers rush victims to prevent rational thinking.")
        if self._count_matches(t, self.DNA_KEYWORD_TRIGGERS["fear"]) > 0:
            flags.append("Uses fear or threat (account-block, legal-action, arrest) — Classic scare tactic.")
        if self._count_matches(t, self.DNA_KEYWORD_TRIGGERS["suspicious_link"]) > 0:
            flags.append("Contains shortened or suspicious links — Do NOT click. Malicious URLs often lead to phishing pages.")
        if self._count_matches(t, self.DNA_KEYWORD_TRIGGERS["payment_pressure"]) > 0:
            flags.append("Demands immediate payment or money transfer — Real prizes never require advance fees.")
        if self._count_matches(t, self.INDIAN_SCAM_KEYWORDS["lottery_scam"]) > 0:
            flags.append("Unexpected prize / lottery claim — If you never bought a ticket, you cannot win.")
        if self._count_matches(t, self.INDIAN_SCAM_KEYWORDS["fake_delivery"]) > 0:
            flags.append("Unsolicited delivery / order confirmation — Always check your actual Amazon/Flipkart app.")
        if len(text.split()) < 50 and (t.count(".") > 3 or t.count("!") > 1):
            flags.append("Poor grammar / awkward phrasing — Hallmark of bulk scam campaigns from non-native speakers.")
        if "+" in text or "whatsapp" in t or "wa.me" in t:
            flags.append("Asks to contact on WhatsApp / unknown mobile number — Avoid communicating outside official apps.")
        if "qr code" in t or "quishing" in t or "upi://" in t:
            flags.append("QR Code (Quishing) Vector — Scammers encode deceptive URLs or direct UPI payment transfers in QR codes.")
        return flags

    def guardian_analyze(self, text: str) -> Dict[str, Any]:
        """
        Local fallback for the Granite Guardian 4.1 8B BYOC contract
        Computes numeric risk score 0-100, risk level (LOW/MEDIUM/HIGH), and Scam DNA.
        """
        t = text.lower()
        dna: Dict[str, int] = {}
        for tactic, kws in self.DNA_KEYWORD_TRIGGERS.items():
            cnt = self._count_matches(t, kws)
            dna[tactic] = min(100, cnt * 30 + (15 if any(k in t for k in kws) else 0))

        # Suspicious link detection: if URL pattern found, boost suspicious_link
        import re
        if re.search(r"https?://\S+|bit\.ly|tinyurl|t\.co|wa\.me|qr code", t):
            dna["suspicious_link"] = max(dna["suspicious_link"], 75)

        # Check if the text contains a UPI link or quishing but lacks coercive context
        is_suspicious_upi = True
        if "upi://" in t or "qr code" in t or "quishing" in t:
            is_suspicious_upi = any(kw in t for kw in [
                "subsidy", "refund", "cashback", "claim", "won", "prize", "gift", 
                "reward", "narcotics", "police", "arrest", "penalty", "block", 
                "suspend", "kyc", "verify", "pan", "aadhar", "tax", "urgent", 
                "immediate", "within", "threat", "block", "freeze"
            ])

        if ("upi://" in t or "qr code" in t or "quishing" in t) and not is_suspicious_upi:
            dna["suspicious_link"] = 0
            dna["payment_pressure"] = 0

        # Weighted composite
        weights = {"urgency": 0.18, "fear": 0.22, "impersonation": 0.20,
                   "suspicious_link": 0.22, "payment_pressure": 0.18}
        composite = sum(dna[k] * w for k, w in weights.items())

        # Extra penalty for specific known scam combos
        if dna["impersonation"] > 30 and dna["fear"] > 30:
            composite += 12
        if dna["urgency"] > 40 and dna["payment_pressure"] > 40:
            composite += 15
        if self._count_matches(t, self.INDIAN_SCAM_KEYWORDS["otp_fraud"]) >= 1:
            composite += 18
        if ("upi://" in t or "quishing" in t or "qr code threat analysis" in t) and is_suspicious_upi:
            composite = max(composite, 76)

        risk_score = min(100, int(round(composite)))
        if risk_score >= settings.HIGH_RISK_THRESHOLD:
            level = "HIGH"
        elif risk_score >= settings.MEDIUM_RISK_THRESHOLD:
            level = "MEDIUM"
        else:
            level = "LOW"

        return {
            "guardian_risk_score": risk_score,
            "risk_level": level,
            "scam_dna": ScamDNA(
                urgency=dna["urgency"],
                fear=dna["fear"],
                impersonation=dna["impersonation"],
                suspicious_link=dna["suspicious_link"],
                payment_pressure=dna["payment_pressure"],
            ).model_dump(),
            "byoc_evaluation": {
                "urgency_criteria_met": dna["urgency"] > 40,
                "fear_criteria_met": dna["fear"] > 40,
                "impersonation_criteria_met": dna["impersonation"] > 40,
                "suspicious_link_criteria_met": dna["suspicious_link"] > 50,
                "payment_pressure_criteria_met": dna["payment_pressure"] > 40,
            },
        }

    def _generate_guidance(self, category: str, cat_scores: Dict[str, int]) -> Dict[str, Any]:
        base_steps = [
            "Do NOT click any links, buttons, or attachments in this message.",
            "Do NOT reply to the sender. Block and delete the message.",
            "Never share OTP, UPI PIN, passwords, or CVV with anyone, even if they claim to be officials.",
            "If in doubt, call the official helpline of the organisation from their verified website/app.",
            "Report this scam on the National Cybercrime Reporting Portal: https://cybercrime.gov.in  or call 1930.",
        ]

        specific = {
            "OTP / Verification Fraud": {
                "title": "Safety Guidance — OTP / Verification Fraud",
                "steps": ["Remember: NO legitimate entity (bank, RBI, delivery, etc.) ever calls or messages to ask for OTP.",
                         "If you accidentally shared an OTP, immediately call your bank's helpline to freeze accounts."] + base_steps[2:],
            },
            "Fake KYC / Account Scam": {
                "title": "Safety Guidance — Fake KYC Scam",
                "steps": ["Always complete KYC only through your bank's OFFICIAL mobile app or branch — NEVER via SMS links.",
                         "Banks do NOT threaten account closure through unsolicited SMS."] + base_steps,
            },
            "UPI / Payment Fraud": {
                "title": "Safety Guidance — UPI / Payment Fraud",
                "steps": ["UPI PIN is ONLY for SENDING money, never for 'receiving' or 'verifying'.",
                         "Do NOT scan unknown QR codes. Do NOT install AnyDesk/TeamViewer on stranger's request."] + base_steps,
            },
            "QR Code Phishing / Quishing Scam": {
                "title": "Safety Guidance — QR Code (Quishing) Scam",
                "steps": [
                    "NEVER scan a QR code sent via WhatsApp, SMS, or email claiming you will 'receive' money or cashback.",
                    "Scanning a QR code and entering your UPI PIN always DEBITS money from your account, never credits it.",
                    "Inspect the decoded URL carefully before opening. Do NOT input login passwords or OTPs on unverified sites.",
                ] + base_steps[2:],
            },
            "Fake Lottery / Prize Scam": {
                "title": "Safety Guidance — Fake Lottery / Prize Scam",
                "steps": ["Rule #1: If you never bought a ticket, you CANNOT win a lottery.",
                         "REAL prizes never require 'processing fees', 'insurance charges', or 'tax deposits' to claim."] + base_steps,
            },
            "Fake Delivery / Parcel Scam": {
                "title": "Safety Guidance — Fake Delivery Scam",
                "steps": ["Open the official Amazon/Flipkart/Myntra app and check 'My Orders' directly. Do NOT trust SMS screenshots.",
                         "Avoid paying any 'customs duty', 'delivery charges' via random UPI links."] + base_steps,
            },
            "Government / RBI Impersonation Scam": {
                "title": "Safety Guidance — RBI / Govt Impersonation Scam",
                "steps": ["RBI / Income Tax / Police never call ordinary citizens demanding money or OTP.",
                         "If threatened with arrest/penalty, call the national cyber helpline 1930 immediately."] + base_steps,
            },
            "Benign Message": {
                "title": "General Safety Tips",
                "steps": ["Although this message appears safe, stay cautious with unsolicited communications.",
                         "Keep verifying sender details. When in doubt, verify independently.",
                         "Never share sensitive credentials (OTP, PIN, password) over calls/SMS."],
            },
        }
        chosen = specific.get(category, {
            "title": f"Safety Guidance — {category}",
            "steps": base_steps,
        })

        hi_translation = self._translate_guidance_hi(chosen["title"], chosen["steps"])
        mr_translation = self._translate_guidance_mr(chosen["title"], chosen["steps"])

        return {
            "en": {"title": chosen["title"], "steps": chosen["steps"]},
            "hi": {"title": hi_translation["title"], "steps": hi_translation["steps"]},
            "mr": {"title": mr_translation["title"], "steps": mr_translation["steps"]},
        }

    def _translate_guidance_hi(self, title: str, steps: List[str]) -> Dict[str, Any]:
        map_hi = {
            "Safety Guidance — OTP / Verification Fraud": "सुरक्षा मार्गदर्शन — OTP / सत्यापन धोखाधड़ी",
            "Safety Guidance — Fake KYC Scam": "सुरक्षा मार्गदर्शन — नकली KYC घोटाला",
            "Safety Guidance — UPI / Payment Fraud": "सुरक्षा मार्गदर्शन — UPI / भुगतान धोखाधड़ी",
            "Safety Guidance — QR Code (Quishing) Scam": "सुरक्षा मार्गदर्शन — QR कोड (क्विशिंग) धोखाधड़ी",
            "Safety Guidance — Fake Lottery / Prize Scam": "सुरक्षा मार्गदर्शन — नकली लॉटरी / पुरस्कार घोटाला",
            "Safety Guidance — Fake Delivery Scam": "सुरक्षा मार्गदर्शन — नकली डिलीवरी घोटाला",
            "Safety Guidance — RBI / Govt Impersonation Scam": "सुरक्षा मार्गदर्शन — RBI / सरकार का नकली हुनर घोटाला",
            "General Safety Tips": "सामान्य सुरक्षा सुझाव",
        }
        step_map_hi = {
            "Do NOT click any links, buttons, or attachments in this message.": "इस संदेश में किसी भी लिंक, बटन या अटैचमेंट पर क्लिक न करें।",
            "Do NOT reply to the sender. Block and delete the message.": "भेजने वाले को जवाब न दें। संदेश को ब्लॉक और हटा दें।",
            "Never share OTP, UPI PIN, passwords, or CVV with anyone, even if they claim to be officials.": "कभी भी OTP, UPI PIN, पासवर्ड या CVV किसी के साथ साझा न करें, भले ही वे अधिकारी होने का दावा करें।",
            "If in doubt, call the official helpline of the organisation from their verified website/app.": "संदेह होने पर संगठन की आधिकारिक हेल्पलाइन को उनकी सत्यापित वेबसाइट/ऐप से कॉल करें।",
            "Report this scam on the National Cybercrime Reporting Portal: https://cybercrime.gov.in  or call 1930.": "इस घोटाले की रिपोर्ट राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल: https://cybercrime.gov.in पर करें या 1930 पर कॉल करें।",
            "Remember: NO legitimate entity (bank, RBI, delivery, etc.) ever calls or messages to ask for OTP.": "याद रखें: कोई भी वैध संस्था (बैंक, RBI, डिलीवरी आदि) OTP मांगने के लिए कभी कॉल या संदेश नहीं भेजती।",
            "If you accidentally shared an OTP, immediately call your bank's helpline to freeze accounts.": "यदि आप गलती से OTP साझा कर दें, तो तुरंत अपने बैंक की हेल्पलाइन को कॉल करें और खाते फ्रीज करवाएं।",
            "Always complete KYC only through your bank's OFFICIAL mobile app or branch — NEVER via SMS links.": "KYC हमेशा केवल अपने बैंक की आधिकारिक मोबाइल ऐप या शाखा के माध्यम से पूरा करें — कभी भी SMS लिंक से नहीं।",
            "Banks do NOT threaten account closure through unsolicited SMS.": "बैंक अनचाहे SMS के माध्यम से खाता बंद करने की धमकी नहीं देते।",
            "UPI PIN is ONLY for SENDING money, never for 'receiving' or 'verifying'.": "UPI PIN केवल पैसे भेजने के लिए है, 'प्राप्त करने' या 'सत्यापित करने' के लिए नहीं।",
            "Do NOT scan unknown QR codes. Do NOT install AnyDesk/TeamViewer on stranger's request.": "अनजान QR कोड स्कैन न करें। अजनबी के अनुरोध पर AnyDesk/TeamViewer इंस्टॉल न करें।",
            "NEVER scan a QR code sent via WhatsApp, SMS, or email claiming you will 'receive' money or cashback.": "व्हाट्सएप, एसएमएस या ईमेल पर भेजे गए किसी भी QR कोड को स्कैन न करें जो पैसे या कैशबैक 'प्राप्त' करने का दावा करता हो।",
            "Scanning a QR code and entering your UPI PIN always DEBITS money from your account, never credits it.": "QR कोड स्कैन करके UPI PIN दर्ज करने से आपके खाते से पैसे हमेशा कटते हैं, कभी जमा नहीं होते।",
            "Inspect the decoded URL carefully before opening. Do NOT input login passwords or OTPs on unverified sites.": "खोलने से पहले डिकोड किए गए URL की सावधानीपूर्वक जांच करें। असत्यापित साइटों पर लॉगिन पासवर्ड या OTP दर्ज न करें।",
            "Rule #1: If you never bought a ticket, you CANNOT win a lottery.": "नियम #1: आपने टिकट नहीं खरीदा है, तो आप लॉटरी नहीं जीत सकते।",
            "REAL prizes never require 'processing fees', 'insurance charges', or 'tax deposits' to claim.": "असली पुरस्कारों को दावा करने के लिए कभी भी 'प्रोसेसिंग फीस', 'बीमा शुल्क' या 'कर जमा' की आवश्यकता नहीं होती।",
            "Open the official Amazon/Flipkart/Myntra app and check 'My Orders' directly. Do NOT trust SMS screenshots.": "आधिकारिक Amazon/Flipkart/Myntra ऐप खोलें और सीधे 'My Orders' चेक करें। SMS स्क्रीनशॉट पर भरोसा न करें।",
            "Avoid paying any 'customs duty', 'delivery charges' via random UPI links.": "बेतरतीब UPI लिंक्स के माध्यम से कोई भी 'सीमा शुल्क', 'डिलीवरी चार्ज' देने से बचें।",
            "RBI / Income Tax / Police never call ordinary citizens demanding money or OTP.": "RBI / आयकर / पुलिस आम नागरिकों को कभी भी पैसे या OTP मांगने के लिए कॉल नहीं करते।",
            "If threatened with arrest/penalty, call the national cyber helpline 1930 immediately.": "गिरफ्तारी/जुर्माने की धमकी मिलने पर तुरंत राष्ट्रीय साइबर हेल्पलाइन 1930 पर कॉल करें।",
            "Although this message appears safe, stay cautious with unsolicited communications.": "हालांकि यह संदेश सुरक्षित प्रतीत होता है, फिर भी अनचाहे संचारों के साथ सतर्क रहें।",
            "Keep verifying sender details. When in doubt, verify independently.": "भेजने वाले का विवरण सत्यापित करते रहें। संदेह होने पर स्वतंत्र रूप से सत्यापित करें।",
            "Never share sensitive credentials (OTP, PIN, password) over calls/SMS.": "कॉल/SMS के माध्यम से संवेदनशील क्रेडेंशियल (OTP, PIN, पासवर्ड) कभी भी साझा न करें।",
        }
        t = map_hi.get(title, f"सुरक्षा मार्गदर्शन — {title}")
        s = [step_map_hi.get(st, st) for st in steps]
        return {"title": t, "steps": s}

    def _translate_guidance_mr(self, title: str, steps: List[str]) -> Dict[str, Any]:
        map_mr = {
            "Safety Guidance — OTP / Verification Fraud": "सुरक्षा मार्गदर्शन — OTP / पडताळणी फसवणूक",
            "Safety Guidance — Fake KYC Scam": "सुरक्षा मार्गदर्शन — बनावट KYC घोटाळा",
            "Safety Guidance — UPI / Payment Fraud": "सुरक्षा मार्गदर्शन — UPI / पेमेंट फसवणूक",
            "Safety Guidance — QR Code (Quishing) Scam": "सुरक्षा मार्गदर्शन — QR कोड (क्विशिंग) फसवणूक",
            "Safety Guidance — Fake Lottery / Prize Scam": "सुरक्षा मार्गदर्शन — बनावट लॉटरी / बक्षीस घोटाळा",
            "Safety Guidance — Fake Delivery Scam": "सुरक्षा मार्गदर्शन — बनावट वितरण घोटाळा",
            "Safety Guidance — RBI / Govt Impersonation Scam": "सुरक्षा मार्गदर्शन — RBI / सरकारी अस्खलन घोटाळा",
            "General Safety Tips": "सामान्य सुरक्षा टिपा",
        }
        step_map_mr = {
            "Do NOT click any links, buttons, or attachments in this message.": "या संदेशातील कोणत्याही लिंकवर, बटणावर किंवा संलग्नकांवर क्लिक करू नका।",
            "Do NOT reply to the sender. Block and delete the message.": "प्रेषकाला उत्तर देऊ नका। संदेश अवरोधित करून हटवा।",
            "Never share OTP, UPI PIN, passwords, or CVV with anyone, even if they claim to be officials.": "कधीही OTP, UPI PIN, पासवर्ड किंवा CVV कोणाशीही शेअर करू नका, जरी ते अधिकारी असल्याचा दावा केला तरीही।",
            "If in doubt, call the official helpline of the organisation from their verified website/app.": "संशय असल्यास संस्थेच्या पडताळलेल्या वेबसाइट/अॅपवरून अधिकृत हेल्पलाइनवर कॉल करा।",
            "Report this scam on the National Cybercrime Reporting Portal: https://cybercrime.gov.in  or call 1930.": "या घोटाळ्याची नॅशनल सायबर क्राईम रिपोर्टिंग पोर्टल: https://cybercrime.gov.in वर तक्रार करा किंवा 1930 ला कॉल करा।",
            "Remember: NO legitimate entity (bank, RBI, delivery, etc.) ever calls or messages to ask for OTP.": "लक्षात ठेवा: कोणतीही वैध संस्था (बँक, RBI, वितरण इ.) कधीही OTP मागण्यासाठी कॉल किंवा संदेश पाठवत नाही।",
            "If you accidentally shared an OTP, immediately call your bank's helpline to freeze accounts.": "चुकून OTP शेअर केल्यास लगेचच आपल्या बँकेच्या हेल्पलाइनवर कॉल करून खाते फ्रीझ करा।",
            "Always complete KYC only through your bank's OFFICIAL mobile app or branch — NEVER via SMS links.": "KYC नेहमीच केवळ तुमच्या बँकेच्या अधिकृत मोबाइल अॅप किंवा शाखेद्वारे पूर्ण करा — कधीही SMS लिंकद्वारे नाही।",
            "Banks do NOT threaten account closure through unsolicited SMS.": "बँका अनपेक्षित SMS द्वारे खाते बंद करण्याची धमकी देत नाहीत।",
            "UPI PIN is ONLY for SENDING money, never for 'receiving' or 'verifying'.": "UPI PIN केवळ पैसे पाठवण्यासाठी आहे, 'प्राप्त करण्यासाठी' किंवा 'पडताळणीसाठी' नाही।",
            "Do NOT scan unknown QR codes. Do NOT install AnyDesk/TeamViewer on stranger's request.": "अज्ञात QR कोड स्कॅन करू नका। अनोळखी व्यक्तीच्या विनंतीवर AnyDesk/TeamViewer इंस्टॉल करू नका।",
            "NEVER scan a QR code sent via WhatsApp, SMS, or email claiming you will 'receive' money or cashback.": "व्हॉट्सअॅप, एसएमएस किंवा ईमेलवर पाठवलेला असा कोणताही QR कोड स्कॅन करू नका जो पैसे किंवा कॅशबॅक 'मिळेल' असा दावा करतो.",
            "Scanning a QR code and entering your UPI PIN always DEBITS money from your account, never credits it.": "QR कोड स्कॅन करून UPI PIN टाकल्यास तुमच्या खात्यातून पैसे नेहमी कापले जातात, जमा होत नाहीत.",
            "Inspect the decoded URL carefully before opening. Do NOT input login passwords or OTPs on unverified sites.": "उघडण्यापूर्वी डीकोड केलेल्या URL ची काळजीपूर्वक तपासणी करा. असत्यापित साइटवर लॉगिन पासवर्ड किंवा OTP टाकू नका.",
            "Rule #1: If you never bought a ticket, you CANNOT win a lottery.": "नियम #1: तुम्ही तिकिट विकत घेतले नाही तर तुम्ही लॉटरी जिंकू शकत नाही।",
            "REAL prizes never require 'processing fees', 'insurance charges', or 'tax deposits' to claim.": "खर्‍या बक्षीसांना दावा करण्यासाठी कधीही 'प्रोसेसिंग फीस', 'विमा शुल्क' किंवा 'कर ठेव' लागत नाही।",
            "Open the official Amazon/Flipkart/Myntra app and check 'My Orders' directly. Do NOT trust SMS screenshots.": "अधिकृत Amazon/Flipkart/Myntra अॅप उघडा आणि 'My Orders' थेट तपासा. SMS स्क्रीनशॉटवर विश्वास ठेवू नका।",
            "Avoid paying any 'customs duty', 'delivery charges' via random UPI links.": "यादृच्छिक UPI लिंकद्वारे कोणतेही 'सीमा शुल्क', 'वितरण शुल्क' देणे टाळा।",
            "RBI / Income Tax / Police never call ordinary citizens demanding money or OTP.": "RBI / आयकर / पोलीस सामान्य नागरिकांना पैसे किंवा OTP मागण्यासाठी कधीही कॉल करत नाहीत।",
            "If threatened with arrest/penalty, call the national cyber helpline 1930 immediately.": "अटक/दंडाची धमकी दिल्यास लगेचच राष्ट्रीय सायबर हेल्पलाइन 1930 ला कॉल करा।",
            "Although this message appears safe, stay cautious with unsolicited communications.": "जरी हा संदेश सुरक्षित दिसत असला तरी, अनपेक्षित संप्रेषणांबाबत सावध राहा।",
            "Keep verifying sender details. When in doubt, verify independently.": "प्रेषक तपशील पडताळत रहा. संशय असल्यास स्वतंत्रपणे पडताळा।",
            "Never share sensitive credentials (OTP, PIN, password) over calls/SMS.": "कॉल/SMS द्वारे संवेदनशील क्रेडेन्शियल (OTP, PIN, पासवर्ड) कधीही शेअर करू नका।",
        }
        t = map_mr.get(title, f"सुरक्षा मार्गदर्शन — {title}")
        s = [step_map_mr.get(st, st) for st in steps]
        return {"title": t, "steps": s}

    def granite_vision_analyze(self, image_base64: str) -> Dict[str, Any]:
        """
        Vision target is configured, but the current MVP does not perform a live
        Granite Vision inference. The main image path uses local OCR fallback instead.
        """
        return {
            "ocr_extracted_text": "",
            "vision_analysis": "Granite Vision target configured; live vision inference is not enabled in this MVP.",
            "vision_risk_score": 0,
            "status": "configured_not_live",
            "requires_api": True,
        }

    def granite_embedding_similarity(self, text: str) -> Optional[Dict[str, Any]]:
        """
        Uses the local known-scam similarity fallback. This is not a live Granite
        embedding/vector inference and is labeled accordingly in the result.
        """
        try:
            from app.scam_db.similarity import find_similar_scam
            return find_similar_scam(text)
        except Exception as e:
            logger.warning(f"Similarity lookup skipped: {e}")
            return None


class WatsonXService:
    def __init__(self):
        self.client = MockWatsonXClient()
        self._api_available = bool(settings.IBM_WATSONX_API_KEY and settings.IBM_WATSONX_API_KEY != "your_ibm_cloud_api_key_here")
        self._credentials = {
            "url": settings.IBM_WATSONX_REGION_URL,
            "apikey": settings.IBM_WATSONX_API_KEY
        } if self._api_available else None

    async def analyze_text(self, text: str, input_type: Optional[str] = None) -> Dict[str, Any]:
        # Call local analysis first as a deterministic baseline/fallback.
        instruct_result = self.client.granite_instruct_analyze(text)
        guardian_result = self.client.guardian_analyze(text)
        similarity = self.client.granite_embedding_similarity(text)

        # routes.py may provide the input type explicitly. If it does not,
        # preserve the existing marker-based detection for backward compatibility.
        normalized_upper = (text or "").upper()
        if input_type:
            detected_input_type = input_type.strip().lower()
        elif "SCREENSHOT / IMAGE ANALYSIS:" in normalized_upper:
            detected_input_type = "image"
        elif "QR CODE SCAN" in normalized_upper:
            detected_input_type = "qr"
        elif "URL TO ANALYZE:" in normalized_upper:
            detected_input_type = "url"
        else:
            detected_input_type = "text"

        instruct_result["input_type"] = detected_input_type
        instruct_result["normalized_content"] = text

        # Make OCR output available to the result layer for screenshot metadata.
        if detected_input_type == "image":
            marker = "--- OCR EXTRACTED TEXT ---"
            start = normalized_upper.find(marker)
            if start >= 0:
                actual_start = start + len(marker)
                end = normalized_upper.find(
                    "--- USER PROVIDED CONTEXT ---",
                    actual_start,
                )
                if end < 0:
                    end = len(text)
                instruct_result["ocr_extracted_text"] = text[actual_start:end].strip()
        
        api_mode = "local_fallback"
        api_error = None
        instruct_live = False
        guardian_live = False
        
        if self._api_available:
            try:
                from ibm_watsonx_ai.foundation_models import ModelInference

                generate_params = {
                    "max_new_tokens": 400,
                }
                
                # Prefer space_id over project_id if both are set
                space_id = getattr(settings, "IBM_WATSONX_SPACE_ID", "") or None
                project_id = settings.IBM_WATSONX_PROJECT_ID or None
                scope_kwargs = {"space_id": space_id} if space_id else {"project_id": project_id}

                logger.info(f"Watsonx scope: {'space_id=' + space_id if space_id else 'project_id=' + str(project_id)}")

                # 1. Query Granite Instruct
                instruct_model = ModelInference(
                    model_id=settings.MODEL_GRANITE_INSTRUCT,
                    params=generate_params,
                    credentials=self._credentials,
                    **scope_kwargs
                )
                
                prompt = (
                    "You are CyberRaksha, a cybersecurity scam-analysis assistant. "
                    "Analyze the supplied content carefully and return ONLY valid JSON.\n\n"
                    f"CONTENT TO ANALYZE:\n{text}\n\n"
                    "Choose exactly one primary category from:\n"
                    "- OTP / Verification Fraud\n"
                    "- Fake KYC / Account Scam\n"
                    "- UPI / Payment Fraud\n"
                    "- QR Code Phishing / Quishing Scam\n"
                    "- Fake Lottery / Prize Scam\n"
                    "- Fake Delivery / Parcel Scam\n"
                    "- Tech Support / Customer Care Scam\n"
                    "- Government / RBI Impersonation Scam\n"
                    "- Fraudulent Loan Offer Scam\n"
                    "- Fake Job Offer Scam\n"
                    "- Benign Message\n\n"
                    "Identify concrete behavioral red flags. Do not invent evidence that "
                    "is not present in the content. Estimate risk from 0 to 100.\n\n"
                    "Return exactly this JSON structure:\n"
                    "{\n"
                    "  \"scam_category\": \"one category from the list\",\n"
                    "  \"category_confidence\": 0,\n"
                    "  \"red_flags\": [\"evidence-based flag\"],\n"
                    "  \"summary\": \"short plain-language explanation\",\n"
                    "  \"granite_risk_score_estimate\": 0\n"
                    "}\n\n"
                    "All numeric values must be integers from 0 to 100. "
                    "JSON only, with no markdown fences or extra text."
                )
                
                res = instruct_model.generate_text(prompt=prompt)
                
                try:
                    parsed = _extract_json_object(res)
                    if parsed is None:
                        raise ValueError(
                            "Granite Instruct response did not contain a valid JSON object"
                        )
                    
                    instruct_result["scam_category"] = str(
                        parsed.get(
                            "scam_category",
                            instruct_result["scam_category"],
                        )
                    )
                    instruct_result["category_confidence"] = max(
                        0,
                        min(
                            100,
                            int(
                                float(
                                    parsed.get(
                                        "category_confidence",
                                        instruct_result["category_confidence"],
                                    )
                                )
                            ),
                        ),
                    )
                    parsed_flags = parsed.get(
                        "red_flags",
                        instruct_result["red_flags"],
                    )
                    if isinstance(parsed_flags, list):
                        instruct_result["red_flags"] = [
                            str(flag).strip()
                            for flag in parsed_flags
                            if str(flag).strip()
                        ][:8]

                    instruct_result["summary"] = str(
                        parsed.get(
                            "summary",
                            instruct_result["summary"],
                        )
                    )
                    instruct_result["granite_risk_score_estimate"] = max(
                        0,
                        min(
                            100,
                            int(
                                float(
                                    parsed.get(
                                        "granite_risk_score_estimate",
                                        instruct_result["granite_risk_score_estimate"],
                                    )
                                )
                            ),
                        ),
                    )
                    instruct_live = True
                except Exception as parse_err:
                    logger.warning(
                        "Failed to parse Granite Instruct JSON response: %s. "
                        "Response: %s",
                        parse_err,
                        res,
                    )

                # 2. Query Granite Guardian
                try:
                    guardian_model = ModelInference(
                        model_id=settings.MODEL_GRANITE_GUARDIAN,
                        params=generate_params,
                        credentials=self._credentials,
                        **scope_kwargs,
                    )

                    guardian_prompt = (
                        "Analyze this message to determine if it is unsafe "
                        "(e.g. contains social engineering, phishing, fraud, or spam):\n"
                        f'"{text}"\n\n'
                        "Respond with either 'safe' or 'unsafe'.\n"
                        "Result: "
                    )

                    guardian_raw = guardian_model.generate_text(prompt=guardian_prompt)
                    guardian_res = str(guardian_raw or "").strip().lower()

                    # Check unsafe first because the word "unsafe" contains "safe".
                    # Accept exact labels and short explanatory responses.
                    import re

                    if re.search(r"\bunsafe\b", guardian_res):
                        guardian_result["risk_level"] = "HIGH"
                        guardian_result["guardian_risk_score"] = max(
                            guardian_result["guardian_risk_score"],
                            80,
                        )
                        guardian_live = True
                    elif re.search(r"\bsafe\b", guardian_res):
                        guardian_result["risk_level"] = "LOW"
                        guardian_result["guardian_risk_score"] = min(
                            guardian_result["guardian_risk_score"],
                            20,
                        )
                        guardian_live = True
                    else:
                        logger.warning(
                            "Granite Guardian returned an unrecognized result; "
                            "keeping local fallback result. Response: %s",
                            guardian_raw,
                        )

                except Exception as guard_err:
                    logger.warning(
                        "Granite Guardian call skipped or failed: %s",
                        guard_err,
                    )
            except Exception as e:
                logger.error(f"Failed to query live Watsonx.ai models: {e}. Falling back to local analysis.")
                api_error = str(e)
                api_mode = f"local_fallback (watsonx unavailable: {api_error})"

        if instruct_live and guardian_live:
            api_mode = "live_watsonx"
        elif instruct_live or guardian_live:
            api_mode = "partial_watsonx"
                
        return {
            "instruct": instruct_result,
            "guardian": guardian_result,
            "similarity_match": similarity,
            "api_mode": api_mode,
            "api_error": api_error,
            "model_status": {
                "granite_instruct": "live" if instruct_live else "local_fallback",
                "granite_guardian": "live" if guardian_live else "local_fallback",
                "granite_vision": "configured_not_live",
                "granite_embedding": "configured_not_live",
            },
        }

    async def analyze_image(self, image_base64: str) -> Dict[str, Any]:
        return self.client.granite_vision_analyze(image_base64)


watsonx_service = WatsonXService()
