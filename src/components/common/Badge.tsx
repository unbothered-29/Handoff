import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'indigo' | 'ocean';
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral', 
  size = 'sm',
  className = '' 
}) => {
  const variantStyles = {
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60',
    error: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60',
    indigo: 'bg-[#D3EBF9]/70 dark:bg-[#4987A4]/30 text-[#1A435A] dark:text-[#D3EBF9] border-[#4987A4]/30 dark:border-[#4987A4]/50',
    ocean: 'bg-[#D3EBF9]/70 dark:bg-[#4987A4]/30 text-[#1A435A] dark:text-[#D3EBF9] border-[#4987A4]/30 dark:border-[#4987A4]/50',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span 
      className={`inline-flex items-center font-medium border rounded-md transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
