import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTimeOffStore } from '@/stores/useTimeOffStore';

export const ConfirmDialog: React.FC = () => {
  const { confirm, closeConfirm } = useTimeOffStore();

  if (!confirm.open) return null;

  const handleConfirm = () => {
    confirm.onConfirm();
    closeConfirm();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[80] p-4"
      onClick={(e) => { if (e.target === e.currentTarget) closeConfirm(); }}
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <h3 className="font-semibold text-slate-800 text-sm">{confirm.title}</h3>
          </div>
          <button
            type="button"
            onClick={closeConfirm}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm text-slate-600 leading-relaxed">{confirm.message}</p>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={closeConfirm}
            className="px-4 py-2 text-xs font-medium text-slate-600 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
