import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { SecurityEvaluation } from './security';

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

export interface GuidanceItem {
  title: string;
  steps: string[];
}

/**
 * Backend returns guidance for all supported Indian languages.
 * The index signature keeps the frontend compatible with every language code.
 */
export interface MultilingualGuidance {
  en: GuidanceItem;
  hi: GuidanceItem;
  mr: GuidanceItem;
  [languageCode: string]: GuidanceItem;
}

export interface ScamFingerprint {
  name: string;
  description: string;
  confidence: number;
  tactics: ScamDNA;
  primary_tactic?: string | null;
  secondary_tactics: string[];
}

export interface ScamClassification {
  category: string;
  confidence: number;
  explanation: string;
  alternative_categories: string[];
}

export interface VariantDetection {
  detected: boolean;
  match_type: string;
  scam_family?: string | null;
  similarity_score: number;
  confidence: number;
  explanation: string;
  matched_indicators: string[];
}

export interface ScreenshotAnalysis {
  analyzed: boolean;
  method: string;
  extracted_text: string;
  text_detected: boolean;
  ocr_confidence?: number | null;
  detected_urls: string[];
  image_risk_score: number;
  explanation: string;
}

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

  // AI-powered scam intelligence
  scam_classification?: ScamClassification | null;
  scam_fingerprint?: ScamFingerprint | null;
  variant_detection?: VariantDetection | null;
  screenshot_analysis?: ScreenshotAnalysis | null;

  similarity_match?: {
    scam_id: string;
    category: string;
    similarity_score: number;
    note: string;
  } | null;

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

export const RISK_META: Record<
  RiskLevel,
  {
    label: string;
    color: string;
    bg: string;
    icon: 'shield' | 'triangle-alert' | 'siren';
  }
> = {
  LOW: {
    label: 'Low Risk',
    color: 'text-emerald-400',
    bg: 'bg-risk-low',
    icon: 'shield',
  },
  MEDIUM: {
    label: 'Suspicious',
    color: 'text-amber-400',
    bg: 'bg-risk-medium',
    icon: 'triangle-alert',
  },
  HIGH: {
    label: 'Dangerous',
    color: 'text-red-400',
    bg: 'bg-risk-high',
    icon: 'siren',
  },
};
