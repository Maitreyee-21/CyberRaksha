'use client';

import * as React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { RISK_META, RiskLevel } from '@/lib/types';
import { cn } from '@/lib/types';

export function RiskMeter({ level, score }: { level: RiskLevel; score: number }) {
  const meta = RISK_META[level];
  const Icon = level === 'LOW' ? ShieldCheck : level === 'MEDIUM' ? AlertTriangle : AlertOctagon;
  const variant = level === 'LOW' ? 'low' : level === 'MEDIUM' ? 'medium' : 'high';

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border',
            level === 'LOW' && 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
            level === 'MEDIUM' && 'bg-amber-500/10 border-amber-500/30 text-amber-400',
            level === 'HIGH' && 'bg-red-500/10 border-red-500/30 text-red-400'
          )}>
            <Icon size={20} />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-400">Risk Assessment</div>
            <div className={cn('text-base font-semibold mt-0.5', meta.color)}>{meta.label}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-zinc-400">Threat Score</div>
          <div className={cn('font-mono text-2xl font-bold tabular-nums', meta.color)}>
            {score}<span className="text-zinc-400 text-sm font-normal">/100</span>
          </div>
        </div>
      </div>

      <div className="mt-3.5">
        <Progress value={score} variant={variant} showValue={false} />
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
        <span>0 Safe</span>
        <span>35 Moderate</span>
        <span>70 High Risk</span>
        <span>100 Critical</span>
      </div>
    </div>
  );
}
