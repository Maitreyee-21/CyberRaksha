import { ScanResult } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function runTextScan(text: string): Promise<ScanResult> {
  return submitScan({ input_type: 'text', text_content: text });
}

export async function runUrlScan(url: string): Promise<ScanResult> {
  return submitScan({ input_type: 'url', url });
}

export async function runImageScan(file: File, mode: 'image' | 'qr'): Promise<ScanResult> {
  const fd = new FormData();
  fd.append('input_type', mode);
  fd.append('image', file);
  const resp = await fetch(`${API_BASE}/api/scan/form`, {
    method: 'POST',
    body: fd,
  });
  if (!resp.ok) throw new Error(await resp.text());
  return (await resp.json()) as ScanResult;
}

async function submitScan(body: object): Promise<ScanResult> {
  const resp = await fetch(`${API_BASE}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
  return (await resp.json()) as ScanResult;
}

export interface ReportDraftResponse {
  draft_text: string;
  api_mode: string;
  model_used: string;
  generated_at: string;
}

/**
 * Isolated call for the Automated Official Reporting Engine. Sends the
 * already-computed scan result to /api/generate-report; does not touch or
 * re-run the scan pipeline (runTextScan/runUrlScan/runImageScan above).
 */
export async function generateReportDraft(result: ScanResult): Promise<ReportDraftResponse> {
  const resp = await fetch(`${API_BASE}/api/generate-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      risk_level: result.risk_level,
      risk_score: result.risk_score,
      scam_category: result.scam_category,
      red_flags: result.red_flags,
      scam_dna: result.scam_dna,
      detected_urls: result.detected_urls,
      summary: result.summary,
      input_type_used: result.input_type_used,
      qr_payload: result.qr_payload,
      similarity_match: result.similarity_match,
      timestamp: new Date().toISOString(),
    }),
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
  return (await resp.json()) as ReportDraftResponse;
}
