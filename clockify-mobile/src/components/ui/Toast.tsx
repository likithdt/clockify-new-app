import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useTimeOffStore } from '@/stores/useTimeOffStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTimeOffStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} id={toast.id} message={toast.message} type={toast.type} onDismiss={removeToast} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ id, message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 3500);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const styles = {
    success: {
      bg: 'bg-white border-l-4 border-emerald-500',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />,
    },
    error: {
      bg: 'bg-white border-l-4 border-rose-500',
      icon: <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />,
    },
    info: {
      bg: 'bg-white border-l-4 border-sky-500',
      icon: <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />,
    },
  };

  const { bg, icon } = styles[type];

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded shadow-lg text-xs text-slate-800 min-w-[260px] max-w-sm ${bg} animate-in slide-in-from-right-5 fade-in duration-200`}
    >
      {icon}
      <span className="flex-1 leading-relaxed">{message}</span>
      <button
        onClick={() => onDismiss(id)}
        className="ml-1 text-slate-400 hover:text-slate-600 p-0.5 rounded shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
