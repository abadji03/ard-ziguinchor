import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const variants = {
  default: 'bg-slate-100 text-slate-700 border border-slate-200/80',
  success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
  warning: 'bg-amber-50 text-amber-800 border border-amber-200/60',
  error:   'bg-rose-50 text-rose-800 border border-rose-200/60',
  info:    'bg-blue-50 text-blue-800 border border-blue-200/60',
};

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-2xs',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
