import sys, os, json, asyncio
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.detect_pipeline import detect_content_type, heuristic_layer1_check
from app.services.watsonx_client import watsonx_service
from app.services.analysis_ensemble import ensemble_voting_and_build_result

body = {
    "input_type": "text",
    "text_content": "FROM RBI GOVERNOR OFFICE: Your PAN card linked to 2 Crore Black Money Transaction. Submit Rs.45000 Tax penalty within 3 hours on UPI rbi@gov otherwise arrest warrant will be issued against you by Narcotics Dept. Call Officer Rajesh 9900099000 immediately or face legal consequences.",
}

async def main():
    itype, text, urls = detect_content_type(body)
    l1 = heuristic_layer1_check(text)
    out = await watsonx_service.analyze_text(text)
    print("GUARDIAN OUTPUT:", json.dumps(out["guardian"], indent=2, default=str))
    print("DNA in ensemble:", out["guardian"].get("scam_dna"))
    print("fear value:", out["guardian"].get("scam_dna", {}).get("fear"))
    r = ensemble_voting_and_build_result(
        layer1=l1, instruct=out["instruct"], guardian=out["guardian"],
        detected_urls=urls, similarity_match=out["similarity_match"],
        guidance=out["instruct"]["guidance"],
    )
    print(f"Final fear in result scam_dna: {r.scam_dna.fear}")
    print(f"Final safety_lock        : {r.safety_lock}")
    print(f"Final emergency_alert    : {r.emergency_alert}")
    print(f"Check: emergency={r.emergency_alert}, fear>={r.scam_dna.fear}>=55={r.scam_dna.fear>=55}, so safety_lock should be {r.emergency_alert and r.scam_dna.fear>=55}")

asyncio.run(main())
