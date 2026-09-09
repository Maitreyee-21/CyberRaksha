import { ScanResult } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export type Language = 'en' | 'hi' | 'mr';

function languageHeader(language: Language) {
  return {
    'X-CyberRaksha-Language': language,
  };
}

export async function runTextScan(
  text: string,
  language: Language = 'en'
): Promise<ScanResult> {
  return submitScan(
    {
      input_type: 'text',
      text_content: text,
    },
    language
  );
}

export async function runUrlScan(
  url: string,
  language: Language = 'en'
): Promise<ScanResult> {
  const normalizedUrl = url.trim().startsWith('http://') || url.trim().startsWith('https://')
    ? url.trim()
    : `https://${url.trim()}`;

  return submitScan(
    {
      input_type: 'url',
      url: normalizedUrl,
    },
    language
  );
}

export async function runImageScan(
  file: File,
  mode: 'image' | 'qr',
  language: Language = 'en'
): Promise<ScanResult> {
  const fd = new FormData();

  fd.append('input_type', mode);
  fd.append('image', file);

  const resp = await fetch(`${API_BASE}/api/scan/form`, {
    method: 'POST',
    headers: languageHeader(language),
    body: fd,
  });

  if (!resp.ok) {
    throw new Error(await resp.text());
  }

  return (await resp.json()) as ScanResult;
}

export async function runDocumentScan(
  file: File,
  language: Language = 'en'
): Promise<ScanResult> {
  // If file is plain text, markdown, csv, or json, extract text client-side
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const isTextLike = ['txt', 'md', 'csv', 'json', 'log', 'rtf', 'html', 'htm'].includes(ext) || file.type.startsWith('text/');

  if (isTextLike) {
    try {
      const textContent = await file.text();
      return submitScan(
        {
          input_type: 'document',
          text_content: `[Document: ${file.name}]\n\n${textContent.slice(0, 10000)}`,
        },
        language
      );
    } catch {
      // Fall through to multipart form upload
    }
  }

  // Multipart form upload to backend
  const fd = new FormData();
  fd.append('input_type', 'document');
  fd.append('image', file);
  fd.append('text_content', `Uploaded document: ${file.name}`);

  const resp = await fetch(`${API_BASE}/api/scan/form`, {
    method: 'POST',
    headers: languageHeader(language),
    body: fd,
  });

  if (!resp.ok) {
    throw new Error(await resp.text());
  }

  return (await resp.json()) as ScanResult;
}

async function submitScan(
  body: object,
  language: Language
): Promise<ScanResult> {
  const resp = await fetch(`${API_BASE}/api/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...languageHeader(language),
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    throw new Error(
      `HTTP ${resp.status}: ${await resp.text()}`
    );
  }

  return (await resp.json()) as ScanResult;
}

export interface ReportDraftResponse {
  draft_text: string;
  api_mode: string;
  model_used: string;
  generated_at: string;
}

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

