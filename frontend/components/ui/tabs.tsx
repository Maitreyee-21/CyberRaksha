import * as React from 'react';
import { cn } from '@/lib/types';

interface TabsProps { value: string; onValueChange: (v: string) => void; children: React.ReactNode; className?: string; }
const TabsCtx = React.createContext<{ value: string; onValueChange: (v: string) => void } | null>(null);
export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsCtx.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}
export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('inline-flex h-12 items-center justify-center rounded-2xl bg-white/5 p-1.5 gap-1 w-full', className)} role="tablist">{children}</div>;
}
export function TabsTrigger({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsCtx)!;
  const active = ctx.value === value;
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all flex-1',
        active
          ? 'bg-cyber-shield text-white shadow-lg shadow-cyber-shield/25 scale-[1.01]'
          : 'text-white/60 hover:text-white hover:bg-white/5',
        className
      )}
    >
      {children}
    </button>
  );
}
export function TabsContent({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsCtx)!;
  if (ctx.value !== value) return null;
  return <div role="tabpanel" className={cn('mt-4', className)}>{children}</div>;
}
