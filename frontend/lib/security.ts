export type SecurityAction = 'ALLOW_WITH_CAUTION' | 'WARN' | 'BLOCK' | 'REVIEW_REQUIRED';
export type SecurityRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface SecurityIndicator {
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  evidence?: string;
}

export interface SafetyLockState {
  locked: boolean;
  navigation_allowed: boolean;
  requires_confirmation: boolean;
  action: SecurityAction;
  message: string;
  lock_id?: string;
  timestamp: string;
}

export interface EmergencyAlertState {
  active: boolean;
  severity: SecurityRiskLevel;
  title: string;
  message: string;
  reasons: string[];
  safe_actions: string[];
  evidence_summary: string[];
}

export interface SecurityEvaluation {
  url: string;
  sanitized_url: string;
  risk_score: number;
  risk_level: SecurityRiskLevel;
  action: SecurityAction;
  navigation_allowed: boolean;
  requires_confirmation: boolean;
  url_indicators: SecurityIndicator[];
  indicator_count: number;
  safety_lock: SafetyLockState;
  emergency_alert: EmergencyAlertState;
  safe_actions: string[];
  reasons: string[];
  fail_safe_triggered: boolean;
  guardian_score?: number | null;
}

/**
 * Single client-side navigation gateway. Every external navigation initiated by
 * CyberRaksha should pass through this function after server-side evaluation.
 */
export function requestNavigation(
  security: SecurityEvaluation,
  explicitUserConfirmed = false,
): { permitted: boolean; reason: string } {
  if (security.safety_lock.locked || security.action === 'BLOCK' || security.risk_level === 'HIGH') {
    return { permitted: false, reason: 'Safety Lock is active; high-risk navigation is blocked.' };
  }

  if (security.requires_confirmation && !explicitUserConfirmed) {
    return { permitted: false, reason: 'Explicit user confirmation is required before navigation.' };
  }

  if (!security.navigation_allowed && !explicitUserConfirmed) {
    return { permitted: false, reason: 'Navigation is not permitted by the current security policy.' };
  }

  return { permitted: true, reason: 'Navigation permitted by the current security policy.' };
}
