import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-600 shrink-0" />,
  };

  const borderMap = {
    success: 'border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100',
    error: 'border-rose-200 dark:border-rose-800/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100',
    warning: 'border-amber-200 dark:border-amber-800/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100',
    info: 'border-indigo-200 dark:border-indigo-800/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${borderMap[toast.type]}`}>
        {iconMap[toast.type]}
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{toast.title}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
        </div>
        <button
          onClick={hideToast}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
