'use client';

import * as React from 'react';
import { AlertCircle, ExternalLink, Lock, ShieldBan, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SecurityEvaluation } from '@/lib/security';
import { requestNavigation } from '@/lib/security';

interface SafetyLockProps {
  security: SecurityEvaluation;
  urls: string[];
}

export function SafetyLock({ security, urls }: SafetyLockProps) {
  const [confirmed, setConfirmed] = React.useState(false);
  const [status, setStatus] = React.useState<string | null>(null);
  const targetUrl = security.url || urls[0] || '';

  const locked = security.safety_lock.locked || security.action === 'BLOCK';
  const requiresConfirmation = security.requires_confirmation;
  const canNavigate = !locked && (!requiresConfirmation || confirmed);

  const handleNavigation = () => {
    const decision = requestNavigation(security, confirmed);
    if (!decision.permitted) {
      setStatus(`BLOCKED: ${decision.reason}`);
      return;
    }

    // This is the only navigation gateway in the CyberRaksha UI. HIGH-risk
    // destinations can never reach this branch because the server-side policy
    // and this client-side guard both reject them.
    window.open(security.sanitized_url || targetUrl, '_blank', 'noopener,noreferrer');
    setStatus('PERMITTED: Navigation opened after the required security checks.');
  };

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
            locked ? 'bg-red-500/10 border-red-500/30 text-red-400' :
            requiresConfirmation ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
            'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            {locked ? <Lock size={16} /> : requiresConfirmation ? <AlertCircle size={16} /> : <Unlock size={16} />}
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              Safety Lock
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${
                locked ? 'text-red-300 border-red-500/30 bg-red-500/10' :
                requiresConfirmation ? 'text-amber-300 border-amber-500/30 bg-amber-500/10' :
                'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'
              }`}>
                {locked ? 'ACTIVE — BLOCKED' : requiresConfirmation ? 'CONFIRMATION REQUIRED' : 'CAUTION'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">Deterministic navigation protection</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-zinc-500">{security.risk_score}/100</span>
      </div>

      <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 space-y-2 text-xs">
        <div className="flex items-start justify-between gap-3">
          <span className="text-zinc-500">Destination</span>
          <span className="font-mono text-zinc-300 break-all text-right">{targetUrl}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-zinc-500">Policy</span>
          <span className="font-mono font-semibold text-zinc-200">{security.action}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-zinc-500">Navigation</span>
          <span className={security.navigation_allowed ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
            {security.navigation_allowed ? 'ALLOWED WITH CAUTION' : 'BLOCKED'}
          </span>
        </div>
      </div>

      <p className="text-xs text-zinc-300 leading-relaxed">{security.safety_lock.message}</p>

      {requiresConfirmation && !locked && (
        <label className="flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => { setConfirmed(e.target.checked); setStatus(null); }}
            className="mt-0.5"
          />
          <span className="text-xs text-amber-200 leading-relaxed">
            I understand that this destination has security warnings and I want to continue.
          </span>
        </label>
      )}

      <Button
        type="button"
        onClick={handleNavigation}
        disabled={locked || !canNavigate}
        className={locked ? 'bg-zinc-800 text-zinc-500' : requiresConfirmation ? 'bg-amber-600 hover:bg-amber-500' : 'bg-teal-600 hover:bg-teal-500'}
      >
        {locked ? <ShieldBan size={15} className="mr-2" /> : <ExternalLink size={15} className="mr-2" />}
        {locked ? 'Navigation Blocked' : requiresConfirmation ? 'Continue After Warning' : 'Continue Carefully'}
      </Button>

      {status && (
        <div className={`rounded-lg border p-2.5 text-xs font-mono ${
          status.startsWith('BLOCKED') ? 'border-red-500/20 bg-red-500/5 text-red-300' : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300'
        }`}>
          {status}
        </div>
      )}
    </section>
  );
}
