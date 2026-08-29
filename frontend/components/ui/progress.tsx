import * as React from 'react';
import { cn } from '@/lib/types';

interface ProgressProps { value: number; max?: number; variant?: 'default' | 'low' | 'medium' | 'high'; className?: string; showValue?: boolean; }
export function Progress({ value, max = 100, variant = 'default', className, showValue }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const bar = {
    default: 'from-cyan-400 to-sky-500',
    low: 'from-emerald-400 to-green-500',
    medium: 'from-amber-400 to-orange-500',
    high: 'from-red-500 via-rose-500 to-orange-500',
  }[variant];
  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className={cn('h-full bg-gradient-to-r transition-all duration-700 ease-out', bar)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showValue && (
        <div className="mt-1 flex justify-end text-[10px] font-mono text-white/50">
          {Math.round(pct)}%
        </div>
      )}
    </div>
  );
}
