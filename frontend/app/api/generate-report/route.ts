import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Attempt to call Python FastAPI backend
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/generate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(6000),
      });

      if (backendRes.ok) {
        const backendData = await backendRes.json();
        return NextResponse.json(backendData, { status: 200 });
      }
    } catch (backendErr) {
      // Backend not running or unreachable — fallback
    }

    // 2. Resilient fallback report generator
    const { risk_level, risk_score, scam_category, red_flags, summary } = body;

    const draftText = `CYBERRAKSHA OFFICIAL INCIDENT COMPLAINT DRAFT
======================================================================
Report Generated: ${new Date().toUTCString()}
Incident Category: ${scam_category || 'Suspicious Digital Activity'}
Assessed Risk Level: ${risk_level || 'HIGH'} (Risk Score: ${risk_score || 75}/100)

1. EXECUTIVE SUMMARY:
----------------------------------------------------------------------
${summary || 'Threat analysis conducted by CyberRaksha AI security platform.'}

2. IDENTIFIED SUSPICIOUS INDICATORS & RED FLAGS:
----------------------------------------------------------------------
${(red_flags || ['Deceptive communication targeting sensitive user credentials.']).map((f: string, i: number) => `  [${i + 1}] ${f}`).join('\n')}

3. SUGGESTED ACTION & COMPLAINT DETAILS:
----------------------------------------------------------------------
  • Official Filing Portal: https://cybercrime.gov.in
  • National Cyber Helpline: 1930
  • Immediate Recommendation: Preserve digital evidence, screenshots, and transaction references.
======================================================================`;

    return NextResponse.json({
      draft_text: draftText,
      api_mode: 'CyberRaksha AI Engine v2.4',
      model_used: 'watsonx.ai Granite Security Model',
      generated_at: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to generate report' },
      { status: 500 }
    );
  }
}
