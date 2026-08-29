import { ScanHistoryItem, ScanResult, InputType } from './types';

const STORAGE_KEY = 'cyberraksha_scan_history_v1';

export function loadScanHistory(): ScanHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (err) {
    console.error('Failed to load scan history:', err);
    return [];
  }
}

export function saveScanHistoryItem(
  inputType: InputType,
  inputPreview: string,
  result: ScanResult
): ScanHistoryItem {
  const item: ScanHistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    inputType,
    snippet: (inputPreview || result.scam_category || 'Analysis Scan').slice(0, 60),
    result,
  };

  if (typeof window !== 'undefined') {
    try {
      const current = loadScanHistory();
      const updated = [item, ...current.filter((i) => i.id !== item.id)].slice(0, 40);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save scan history item:', err);
    }
  }

  return item;
}

export function deleteScanHistoryItem(id: string): ScanHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = loadScanHistory();
    const updated = current.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete history item:', err);
    return [];
  }
}

export function clearAllScanHistory(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  }
}
