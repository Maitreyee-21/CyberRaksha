# CyberRaksha

**AI Cybersecurity Awareness & Emergency Protection Assistant**

CyberRaksha follows the safety loop:

**Detect → Explain → Alert → Prevent → Guide**

## Project structure

```text
CyberRaksha/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── scam_db/
│   │   ├── security/          # Member 4 — Security & Prevention Layer
│   │   └── services/
│   └── tests/
├── frontend/                  # Next.js application
├── docs/
│   ├── MEMBER_4_SECURITY_INTEGRATION.md
│   ├── SECURITY_REVIEW.md
│   ├── MODEL_STACK_STATUS.md
│   ├── CyberRaksha_Hackathon_Project_Report.pdf
│   └── audit_pm-20.csv
└── README.md
```

## IBM Granite model status

The project configures these IBM Granite targets:

- Granite 4.1 8B Instruct — live through watsonx.ai when credentials are configured; local fallback otherwise.
- Granite Guardian 4.1 8B — live through watsonx.ai when credentials are configured; local fallback otherwise.
- Granite 4.0 3B Vision — configured target; current MVP uses local Tesseract OCR fallback for screenshot text extraction rather than claiming live vision inference.
- Granite Embedding 107M Multilingual — configured target; current MVP uses deterministic local similarity rather than claiming live embedding inference.

Only verified live watsonx calls are labeled **IBM Granite Live** in the UI.

## Member 4 security layer

The security layer is integrated into the main FastAPI + Next.js project. It provides:

- deterministic URL analysis
- HIGH/MEDIUM/LOW safety policy
- Safety Lock
- Emergency Cyber Alert
- QR payload classification
- controlled navigation gateway
- fail-safe behavior

AI/Granite risk is treated as an input. **AI does not directly authorize navigation.**

## Run backend

```bash
cd backend
python -m pip install -r requirements.txt
PYTHONPATH=. python main.py
```

Backend default: `http://127.0.0.1:8000`

## Run frontend

```bash
cd frontend
npm ci
npm run dev
```

Frontend default: `http://localhost:3000`

Set `NEXT_PUBLIC_API_URL` if the frontend and backend are hosted separately.

## Test Member 4 security layer

From `backend/`:

```bash
PYTHONPATH=. python -m unittest discover -s tests -v
```

## Security note

Remote fetching of arbitrary user-supplied URLs is disabled by default:

```text
ALLOW_REMOTE_URL_FETCH=false
```

Do not commit `.env` files or API keys. Use `.env.example` as the template.
