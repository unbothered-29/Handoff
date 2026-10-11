import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'orange' | 'indigo';
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
    neutral: 'bg-white/[0.04] text-[#A0A09D] border-white/[0.08]',
    success: 'bg-emerald-950/30 text-emerald-300 border-emerald-800/40',
    warning: 'bg-amber-950/30 text-amber-300 border-amber-800/40',
    error: 'bg-rose-950/30 text-rose-300 border-rose-800/40',
    orange: 'bg-[#FF672E]/10 text-[#FF672E] border-[#FF672E]/30',
    indigo: 'bg-indigo-950/30 text-indigo-300 border-indigo-800/40',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
  };

  return (
    <span 
      className={`inline-flex items-center font-medium border rounded-md tracking-tight transition-colors ${variantStyles[variant as keyof typeof variantStyles] || variantStyles.neutral} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
