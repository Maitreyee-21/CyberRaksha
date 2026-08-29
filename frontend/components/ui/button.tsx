import * as React from 'react';
import { cn } from '@/lib/types';

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'; size?: 'default' | 'sm' | 'lg' | 'icon' }>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-cyber-shield text-white hover:bg-cyber-shield/90 shadow-lg shadow-cyber-shield/20',
    destructive: 'bg-destructive text-white hover:bg-destructive/90',
    outline: 'border border-white/15 bg-white/5 hover:bg-white/10 text-white',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-white/10 text-white/80',
    link: 'text-cyber-accent underline-offset-4 hover:underline',
  } as const;
  const sizes = {
    default: 'h-11 px-5 py-2 text-sm',
    sm: 'h-9 px-4 text-xs',
    lg: 'h-12 px-8 text-base',
    icon: 'h-11 w-11',
  } as const;
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-shield focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50',
        variants[variant], sizes[size], className
      )}
      {...props}
    />
  );
});
Button.displayName = 'Button';
export { Button };
