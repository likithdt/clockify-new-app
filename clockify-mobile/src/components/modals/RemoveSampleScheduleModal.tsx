import React from "react";
import { X, AlertTriangle } from "lucide-react";

interface RemoveSampleScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const RemoveSampleScheduleModal: React.FC<RemoveSampleScheduleModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 select-none animate-fadeIn">
      <div className="bg-[#181e25] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-[#262e37] animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#262e37] bg-[#14181f]">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-sm font-semibold text-white">Remove Sample Data</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8c9ba5] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3 text-xs text-[#c2cbd4] leading-relaxed">
          <ul className="space-y-2 list-disc list-inside text-[#94a3b8]">
            <li>
              All automatically generated sample schedules and assignments will be removed from your workspace.
            </li>
            <li>
              Any custom schedules created by you will remain intact.
            </li>
          </ul>

          <p className="pt-2 text-[11px] text-[#64748b]">
            You can restore sample data at any time from the Schedule screen banner.
          </p>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262e37] mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#8c9ba5] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 bg-[#00b0ff] hover:bg-[#0091ea] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
