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
