import * as React from 'react';
import { cn } from '@/lib/types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> { variant?: 'default' | 'secondary' | 'outline' | 'risk-low' | 'risk-medium' | 'risk-high' | 'accent'; }
const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-cyber-shield/20 text-cyan-200 border border-cyan-400/30',
  secondary: 'bg-white/10 text-white/80 border border-white/15',
  outline: 'border border-white/20 text-white/80',
  'risk-low': 'bg-risk-low text-emerald-300 border',
  'risk-medium': 'bg-risk-medium text-amber-300 border',
  'risk-high': 'bg-risk-high text-red-300 border animate-pulse-red',
  accent: 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-violet-400/30 text-violet-200',
};
export function Badge({ className, variant = 'default', ...p }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide transition', variants[variant], className)} {...p} />
  );
}
