import * as React from 'react';
import { cn } from '@/lib/types';
import { X } from 'lucide-react';

interface DialogProps { open: boolean; onOpenChange: (o: boolean) => void; children: React.ReactNode; className?: string; }
export function Dialog({ open, onOpenChange, children, className }: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => onOpenChange(false)} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn('relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b1220] shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-300', className)}
      >
        <button onClick={() => onOpenChange(false)} className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
export function DialogHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('p-6 pb-3', className)}>{children}</div>;
}
export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('p-6 pt-0', className)}>{children}</div>;
}
export function DialogFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('p-6 pt-0 flex flex-col sm:flex-row justify-end gap-2', className)}>{children}</div>;
}
export function DialogTitle({ className, ...p }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-xl font-bold', className)} {...p} />;
}
export function DialogDescription({ className, ...p }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-white/70 mt-2', className)} {...p} />;
}
