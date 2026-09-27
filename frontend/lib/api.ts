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

async function extractErrorMessage(resp: Response): Promise<string> {
  try {
    const raw = await resp.text();
    try {
      const parsed = JSON.parse(raw);
      return parsed.detail || parsed.error || parsed.message || raw;
    } catch {
      return raw;
    }
  } catch {
    return `Request failed with status ${resp.status}`;
  }
}

export async function runUrlScan(
  url: string,
  language: Language = 'en'
): Promise<ScanResult> {
  const trimmed = url.trim();
  if (!trimmed) {
    throw new Error('Please enter a website link or URL to check.');
  }

  // Basic check for valid URL or domain
  const hasDomain = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/.*)?$/i.test(trimmed) || /^https?:\/\/.+/i.test(trimmed);
  if (!hasDomain) {
    throw new Error('Invalid URL format. Please enter a valid web link or domain (e.g., https://example.com or verify-portal.xyz).');
  }

  const normalizedUrl = trimmed.startsWith('http://') || trimmed.startsWith('https://')
    ? trimmed
    : `https://${trimmed}`;

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
  if (!file) {
    throw new Error(mode === 'qr' ? 'Please choose a QR code image to scan.' : 'Please choose an image or screenshot to scan.');
  }
  if (file.size === 0) {
    throw new Error('The selected image is empty (0 bytes). Please upload a valid image file.');
  }

  const fd = new FormData();

  fd.append('input_type', mode);
  fd.append('image', file);

  const resp = await fetch(`${API_BASE}/api/scan/form`, {
    method: 'POST',
    headers: languageHeader(language),
    body: fd,
  });

  if (!resp.ok) {
    throw new Error(await extractErrorMessage(resp));
  }

  return (await resp.json()) as ScanResult;
}

export async function runDocumentScan(
  file: File,
  language: Language = 'en'
): Promise<ScanResult> {
  if (!file) {
    throw new Error('Please choose a document to check.');
  }
  if (file.size === 0) {
    throw new Error('The selected document is empty (0 bytes). Please upload a valid document.');
  }

  // If file is plain text, markdown, csv, or json, extract text client-side
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const isTextLike = ['txt', 'md', 'csv', 'json', 'log', 'rtf', 'html', 'htm'].includes(ext) || file.type.startsWith('text/');

  if (isTextLike) {
    try {
      const textContent = await file.text();
      if (!textContent.trim()) {
        throw new Error('The document contains no readable text. Please upload a valid document.');
      }
      return submitScan(
        {
          input_type: 'document',
          text_content: `[Document: ${file.name}]\n\n${textContent.slice(0, 10000)}`,
        },
        language
      );
    } catch (err: any) {
      if (err?.message?.includes('no readable text') || err?.message?.includes('empty')) throw err;
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
    throw new Error(await extractErrorMessage(resp));
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
    throw new Error(await extractErrorMessage(resp));
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

