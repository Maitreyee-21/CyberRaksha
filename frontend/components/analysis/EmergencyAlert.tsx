'use client';

import * as React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { SecurityEvaluation } from '@/lib/security';

interface EmergencyAlertProps {
  open: boolean;
  onDismiss: () => void;
  security?: SecurityEvaluation | null;
  riskScore: number;
  scamCategory: string;
  detectedUrls: string[];
}

export function EmergencyAlert({ open, onDismiss, security, riskScore, scamCategory, detectedUrls }: EmergencyAlertProps) {
  const isHigh = security?.risk_level === 'HIGH' || security?.action === 'BLOCK' || (!security && riskScore >= 70);
  const reasons = security?.emergency_alert.reasons ?? [];
  const actions = security?.emergency_alert.safe_actions ?? [
    'Do not click the link or enter credentials.',
    'Verify the organization through an official channel.',
    'Report suspected cyber fraud through 1930 when appropriate.',
  ];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDismiss()}>
      <DialogContent className="max-w-xl bg-zinc-900 border-red-500/30 text-zinc-100 shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <ShieldAlert size={22} />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-red-400">
                {isHigh ? 'Emergency Cyber Alert' : 'Cyber Security Warning'}
              </div>
              <DialogTitle className="text-lg font-bold mt-0.5">{security ? 'Potentially Dangerous Destination' : 'High-Risk Scam Alert'}</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-sm text-zinc-300 leading-relaxed">
            {scamCategory} — risk score <b className="text-red-400 font-mono">{security?.risk_score ?? riskScore}/100</b>. CyberRaksha applies a deterministic safety policy before allowing navigation.
          </DialogDescription>
        </DialogHeader>

        {reasons.length > 0 && (
          <div className="p-3 rounded-xl bg-zinc-950 border border-red-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-red-300">
              <AlertTriangle size={14} /> Why this was flagged
            </div>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              {reasons.slice(0, 6).map((reason, i) => <li key={i}>• {reason}</li>)}
            </ul>
          </div>
        )}

        {detectedUrls.length > 0 && (
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="text-[11px] font-semibold text-zinc-400 mb-1.5">Blocked / flagged destination</div>
            <div className="font-mono text-[11px] text-zinc-300 break-all">{detectedUrls[0]}</div>
          </div>
        )}

        <div>
          <div className="text-xs font-semibold text-zinc-200 mb-2">What you should do</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {actions.slice(0, 4).map((action, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-300">
                <CheckCircle2 size={14} className="text-teal-400 shrink-0 mt-0.5" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button onClick={onDismiss} variant="secondary">Acknowledge & View Details</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
