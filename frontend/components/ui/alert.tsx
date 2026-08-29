import * as React from 'react';
import { cn } from '@/lib/types';
import { X } from 'lucide-react';

type Variant = 'default' | 'destructive' | 'success' | 'warning';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> { variant?: Variant; dismissible?: boolean; onDismiss?: () => void; }
const variantCls: Record<Variant, string> = {
  default: 'border-cyan-400/30 bg-cyan-500/10 text-cyan-200',
  destructive: 'border-red-500/50 bg-red-500/15 text-red-100',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  warning: 'border-amber-500/40 bg-amber-500/15 text-amber-100',
};

export function Alert({ className, variant = 'default', dismissible, onDismiss, children, ...p }: AlertProps) {
  return (
    <div role="alert" className={cn('relative rounded-2xl border p-4 pr-10', variantCls[variant], className)} {...p}>
      {children}
      {dismissible && (
        <button onClick={onDismiss} className="absolute right-3 top-3 rounded-md p-1 opacity-70 hover:opacity-100 transition">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export function AlertTitle({ className, ...p }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn('mb-1 font-semibold leading-none tracking-tight', className)} {...p} />;
}

export function AlertDescription({ className, ...p }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <div className={cn('text-sm opacity-90 space-y-2', className)} {...p} />;
}
