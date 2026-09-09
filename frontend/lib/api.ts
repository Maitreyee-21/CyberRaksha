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
  return submitScan(
    {
      input_type: 'url',
      url,
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