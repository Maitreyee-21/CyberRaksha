import { clsx, type ClassValue } from 'clsx';
import type { SecurityEvaluation } from './security';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type InputType = 'text' | 'image' | 'url' | 'qr';

export interface ScamDNA {
  urgency: number;
  fear: number;
  impersonation: number;
  suspicious_link: number;
  payment_pressure: number;
}

export interface GuidanceItem { title: string; steps: string[]; }
export interface MultilingualGuidance { en: GuidanceItem; hi: GuidanceItem; mr: GuidanceItem; }

export interface ScanResult {
  risk_level: RiskLevel;
  risk_score: number;
  scam_category: string;
  red_flags: string[];
  scam_dna: ScamDNA;
  summary: string;
  emergency_alert: boolean;
  safety_lock: boolean;
  detected_urls: string[];
  guidance: MultilingualGuidance;
  similarity_match?: { scam_id: string; category: string; similarity_score: number; note: string } | null;
  input_type_used?: string;
  api_mode?: string;
  qr_payload?: string;
  security_evaluation?: SecurityEvaluation | null;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  inputType: InputType;
  snippet: string;
  result: ScanResult;
}

export const RISK_META: Record<RiskLevel, { label: string; color: string; bg: string; icon: 'shield' | 'triangle-alert' | 'siren' }> = {
  LOW:    { label: 'Low Risk',     color: 'text-emerald-400',   bg: 'bg-risk-low',    icon: 'shield' },
  MEDIUM: { label: 'Suspicious',   color: 'text-amber-400',     bg: 'bg-risk-medium', icon: 'triangle-alert' },
  HIGH:   { label: 'Dangerous',    color: 'text-red-400',       bg: 'bg-risk-high',   icon: 'siren' },
};
