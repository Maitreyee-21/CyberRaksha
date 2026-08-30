import sys, os, json, asyncio
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
if sys.platform.startswith("win"):
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from app.services.detect_pipeline import detect_content_type, heuristic_layer1_check
from app.services.watsonx_client import watsonx_service
from app.services.analysis_ensemble import ensemble_voting_and_build_result

test_cases = [
    ("HIGH - RBI Impersonation Scam", {
        "input_type": "text",
        "text_content": "FROM RBI GOVERNOR OFFICE: Your PAN card linked to 2 Crore Black Money Transaction. Submit Rs.45000 Tax penalty within 3 hours on UPI rbi@gov otherwise arrest warrant will be issued against you by Narcotics Dept. Call Officer Rajesh 9900099000 immediately or face legal consequences.",
    }),
    ("HIGH - Fake KYC", {
        "input_type": "text",
        "text_content": "Dear Customer Your SBI Bank Account KYC is Pending. Update KYC within 24 Hours to avoid permanent Account Block. Click link: http://sbi-kyc-update.xyz/verify now.",
    }),
    ("LOW - Benign Message", {
        "input_type": "text",
        "text_content": "Hi Mom, I'll be late for dinner today. Eating at friend's place. Don't wait for me. Love you!",
    }),
    ("MEDIUM - OTP Fraud", {
        "input_type": "text",
        "text_content": "Your Flipkart order OTP is 382911. Send this OTP back to 9876543210 immediately to confirm delivery today and get Rs.500 cashback URGENTLY within 30 minutes otherwise order will be cancelled and you will be BLOCKED from Flipkart forever!",
    }),
    ("HIGH - QR Code Quishing (LPG Subsidy Refund)", {
        "input_type": "qr",
        "text_content": "Scan this QR code to claim your LPG Gas Subsidy refund of Rs.4500 immediately.",
        "mock_qr_payload": "upi://pay?pa=lpg-subsidy@upi&am=4500&pn=Govt_LPG_Subsidy",
    }),
    ("LOW - Legitimate Standalone UPI QR Code", {
        "input_type": "qr",
        "text_content": "",
        "mock_qr_payload": "upi://pay?pa=honestmerchant@ybl&pn=TeaStallPayment&am=20",
    }),
]

async def main():
    print("=" * 80)
    print("  CyberRaksha Backend Pipeline — Smoke Test")
    print("=" * 80)
    all_pass = True
    for name, body in test_cases:
        print(f"\n> TEST CASE: {name}")
        print("-" * 80)
        itype, text, urls, qr_payload = detect_content_type(body)
        l1 = heuristic_layer1_check(text)
        out = await watsonx_service.analyze_text(text)
        r = ensemble_voting_and_build_result(
            layer1=l1, instruct=out["instruct"], guardian=out["guardian"],
            detected_urls=urls, similarity_match=out["similarity_match"],
            guidance=out["instruct"]["guidance"],
            qr_payload=qr_payload,
        )
        r.input_type_used = itype.value
        r.api_mode = out.get("api_mode")
        r.qr_payload = qr_payload

        print(f"  risk_level      : {r.risk_level.value}")
        print(f"  risk_score      : {r.risk_score} / 100")
        print(f"  api_mode        : {r.api_mode}")
        print(f"  api_error       : {out.get('api_error')}")
        print(f"  scam_category   : {r.scam_category}")
        print(f"  qr_payload      : {r.qr_payload}")
        print(f"  emergency_alert : {r.emergency_alert}")
        print(f"  safety_lock     : {r.safety_lock}")
        print(f"  detected_urls   : {r.detected_urls}")
        print(f"  red_flags (n)   : {len(r.red_flags)}")
        for f in r.red_flags[:3]:
            print(f"     [WARNING] {f[:110]}")
        d = r.scam_dna.model_dump()
        print(f"  scam_dna        : URG {d['urgency']:>3}  |  FEA {d['fear']:>3}  |  IMP {d['impersonation']:>3}  |  LIN {d['suspicious_link']:>3}  |  PAY {d['payment_pressure']:>3}")
        print(f"  guid languages  : EN={len(r.guidance.en.steps)} steps | HI={len(r.guidance.hi.steps)} steps | MR={len(r.guidance.mr.steps)} steps")
        print(f"  summary         : {r.summary[:150]}...")
        if "LOW" in name:
            passed = r.risk_level.value == "LOW"
        else:
            passed = r.risk_level.value in ["HIGH", "MEDIUM"]
        mark = "✅ PASS" if passed else "❌ FAIL"
        print(f"  RESULT: {mark}")
        all_pass = all_pass and passed
    print("\n" + "=" * 80)
    print(f"  OVERALL: {'ALL TESTS PASSED ✅' if all_pass else 'SOME TESTS FAILED ❌'}")
    print("=" * 80)

asyncio.run(main())
