"""
Local known-scam database used by the similarity fallback when live embedding inference is unavailable.
In production this would be a vector database (e.g., pgvector) populated with
thousands of verified scam reports (1930 helpline, user submissions, etc.).
For MVP we hand-curated 12 common Indian scam templates in 3 languages.
"""

KNOWN_SCAMS = [
    {
        "id": "ind_kyc_001",
        "category": "Fake KYC / Account Scam",
        "languages": ["en"],
        "templates": [
            "Dear Customer Your SBI Bank Account KYC is Pending. Update KYC within 24 Hours to avoid permanent Account Block. Click link: http://sbi-kyc-update.xyz/verify",
            "IMPORTANT: HDFC Bank has suspended your account due to incomplete KYC. Reactivate immediately by clicking the link - http://hdfc-rekyc.in",
            "Dear Customer, Your ICICI Aadhaar Seeding is pending. Complete now to keep account active: http://icici-update-kyc.site",
        ],
    },
    {
        "id": "ind_otp_002",
        "category": "OTP / Verification Fraud",
        "languages": ["en", "hi"],
        "templates": [
            "Dear Customer 854729 is your One Time Password for transaction of Rs.4999. DO NOT SHARE WITH ANYONE. If NOT done by you CALL 1800-000-0000",
            "Your Flipkart order OTP is 382911. Send this OTP back to confirm delivery today to get Rs.500 cashback.",
            "Paytm KYC verification OTP bhejo 9999999999 per turant - account freeze ho jayega varna.",
        ],
    },
    {
        "id": "ind_lottery_003",
        "category": "Fake Lottery / Prize Scam",
        "languages": ["en"],
        "templates": [
            "🎉 CONGRATULATIONS !!! Your Mobile No has won ₹25,00,000 /- in Amazon Lucky Draw 2026. To claim your Prize Send your NAME,ADDRESS,Aadhaar to WhatsApp 9876543210. Send Registration Fee Rs.2500 immediately to process the cheque.",
            "Dear Winner, You are selected for Flipkart Grand Prize - Swift Dzire Car + Rs.5 Lakh Cash. Pay Rs.6500 for RTO and GST to our Paytm number 7000000000 before 5 PM today.",
        ],
    },
    {
        "id": "ind_upi_004",
        "category": "UPI / Payment Fraud",
        "languages": ["en", "mr"],
        "templates": [
            "Send Rs.1 to this UPI ID: test@upi to VERIFY your account and you will receive Rs.5000 cashback within 10 minutes. Limited time offer!",
            "UPI Reward - You have a pending cashback of ₹1,250/-. Open GPay & request 1 rupee to claimreward@okaxis to unlock reward instantly.",
            "तुमच्या UPI मध्ये रु.२००० बक्षीस राहिले आहे. आताच १ रुपया पाठवा unlock करा prize@upi वर.",
        ],
    },
    {
        "id": "ind_rbi_005",
        "category": "Government / RBI Impersonation Scam",
        "languages": ["en", "hi"],
        "templates": [
            "FROM RBI GOVERNOR OFFICE: Your PAN card linked to 2 Crore Black Money Transaction. Submit Rs.45000 Tax penalty within 3 hours on UPI rbi@gov otherwise arrest warrant will be issued against you by Narcotics Dept. Call Officer Rajesh 9900099000 immediately.",
            "INCOME TAX DEPARTMENT NOTICE: Assessment year 2024-25 mismatch found. Pay Rs.18,500 online settlement fee now to avoid high penalty + 7 yr jail. Call IT helpline: +91-9876543210. Don't ignore legal notice.",
        ],
    },
    {
        "id": "ind_delivery_006",
        "category": "Fake Delivery / Parcel Scam",
        "languages": ["en"],
        "templates": [
            "Amazon: Your parcel AWB 2841999 out for delivery but customs duty Rs.899 pending. Pay now on http://amazon-pay.customs-delivery.tk to receive today.",
            "Dear Customer Your courier has arrived at local post office. Delivery address needs confirmation. Click link to update phone no: http://courier-india.co.in",
            "Flipkart Order #FK8327SH Delayed. Click http://fk-delayed.site to reschedule your free delivery tonight and get Rs.200 gift voucher.",
        ],
    },
    {
        "id": "ind_loan_007",
        "category": "Fraudulent Loan Offer Scam",
        "languages": ["en"],
        "templates": [
            "Congratulations! You are pre-approved for Instant Personal Loan ₹5,00,000 @ 0.9% interest. Pay processing fee Rs.2999 on Paytm 8888800000 and get loan in 30 min. Call 8888800001 Agent Priya.",
            "CIBIL score (782) detected! You qualify for Business Loan 15 Lakh. Click http://easy-loan-bank.in and submit Aadhaar+PAN + Rs.1,500 login fee to disburse same day.",
        ],
    },
    {
        "id": "ind_job_008",
        "category": "Fake Job Offer Scam",
        "languages": ["en", "mr"],
        "templates": [
            "SELECTED! Your CV shortlisted for TCS Back Office Job, Salary 35000/month. Deposit Refundable Registration Rs.1850 on whatsapp 7000011111 today and get offer letter within 1 hour.",
            "WIPRO Direct Joining Letter - Pay Rs.2500 security & Rs.1000 documentation on Interview panel UPI. Final Interview after payment. 100% Job Guarantee!",
        ],
    },
    {
        "id": "ind_tech_009",
        "category": "Tech Support / Customer Care Scam",
        "languages": ["en"],
        "templates": [
            "ALERT: Your phone has 5 viruses detected! Battery will be damaged tonight. Tap OK to install cleanmaster now - http://mobile-protect.xyz",
            "Dear Amazon Customer - Refund Rs.1299 pending for order. Call our Customer Care immediately for refund: +91 80000-80000. Install AnyDesk to get instant refund process.",
        ],
    },
    {
        "id": "ind_wh_010",
        "category": "WhatsApp Forwarding Scam",
        "languages": ["hi", "mr"],
        "templates": [
            "🚨 Modi sarkar ne naya yojana lauwaya hai - har mobile user ko Rs.2000 milenge. 10 logo ko forward karo aur link par click karo apna paisa pao. http://pm-cash-scheme.in",
            "व्हाट्सअप्प बंद होणार आहे 24 तासांत. तुमचे नोंदणीकरण आधीच करा अन्यथा खाते काढून टाकले जाईल. हा संदेश 10 जणांना पाठवा अन् लिंक क्लिक करा सेव्व्ह करायला http://whatsapp-verification.xyz",
        ],
    },
]


def find_similar_scam(text: str):
    """
    Local similarity fallback for the configured Granite Embedding target.
    The current MVP does not generate live Granite embedding vectors; it uses
    deterministic keyword / n-gram overlap against a small curated dataset.
    """
    if not text or len(text.strip()) < 10:
        return None
    tl = text.lower()
    tl_words = set(tl.split())

    best = None
    best_score = 0.0
    for scam in KNOWN_SCAMS:
        for template in scam["templates"]:
            tmpl_words = set(template.lower().split())
            if len(tmpl_words) == 0:
                continue
            overlap = len(tl_words & tmpl_words) / max(1, len(tmpl_words))
            # Substring match bonus
            substring_hits = sum(1 for kw in tmpl_words if len(kw) > 4 and kw in tl)
            score = min(1.0, 0.55 * overlap + 0.45 * min(1.0, substring_hits / 6.0))
            if score > best_score:
                best_score = score
                best = scam

    if best is None or best_score < 0.22:
        return None

    return {
        "scam_id": best["id"],
        "category": best["category"],
        "similarity_score": round(best_score, 3),
        "note": f"Matches pattern seen in {len(best['templates'])} verified {best['category']} case(s).",
    }
