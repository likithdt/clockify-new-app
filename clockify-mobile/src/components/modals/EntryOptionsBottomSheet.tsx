import React from "react";
import { Play, Copy, Split, Trash2 } from "lucide-react";
import type { TimeEntry } from "../../backend/types";

interface EntryOptionsBottomSheetProps {
  isOpen: boolean;
  entry: TimeEntry | null;
  onClose: () => void;
  onContinue: (entry: TimeEntry) => void;
  onDuplicate: (entry: TimeEntry) => void;
  onSplit: (entry: TimeEntry) => void;
  onDelete: (entry: TimeEntry) => void;
}

export const EntryOptionsBottomSheet: React.FC<EntryOptionsBottomSheetProps> = ({
  isOpen,
  entry,
  onClose,
  onContinue,
  onDuplicate,
  onSplit,
  onDelete,
}) => {
  if (!isOpen || !entry) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center select-none">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-[0.5px] animate-fadeIn"
        onClick={onClose}
      />

      {/* Bottom sheet matching WhatsApp Image 2026-09-06 at 11.33.29 AM.jpeg */}
      <div className="relative w-full bg-[#262a2e] rounded-t-[28px] pt-3 pb-6 px-4 shadow-2xl z-10 animate-slideInUp">
        {/* Drag handle */}
        <div className="w-9 h-1 bg-[#505a64] rounded-full mx-auto mb-4" />

        <div className="space-y-0.5">
          {/* Continue */}
          <button
            type="button"
            onClick={() => {
              onContinue(entry);
              onClose();
            }}
            className="w-full flex items-center gap-5 px-4 py-3.5 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
          >
            <Play className="w-5 h-5 text-white stroke-[2] fill-none" />
            <span className="text-[16px] font-normal text-white">Continue</span>
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={() => {
              onDuplicate(entry);
              onClose();
            }}
            className="w-full flex items-center gap-5 px-4 py-3.5 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
          >
            <Copy className="w-5 h-5 text-white stroke-[2]" />
            <span className="text-[16px] font-normal text-white">Duplicate</span>
          </button>

          {/* Split */}
          <button
            type="button"
            onClick={() => {
              onSplit(entry);
              onClose();
            }}
            className="w-full flex items-center gap-5 px-4 py-3.5 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
          >
            <Split className="w-5 h-5 text-white stroke-[2]" />
            <span className="text-[16px] font-normal text-white">Split</span>
          </button>

          {/* Delete - Red/Orange destructive styling */}
          <button
            type="button"
            onClick={() => {
              onDelete(entry);
              onClose();
            }}
            className="w-full flex items-center gap-5 px-4 py-3.5 rounded-xl hover:bg-red-500/10 active:bg-red-500/15 transition-colors"
          >
            <Trash2 className="w-5 h-5 text-[#ff5722] stroke-[2]" />
            <span className="text-[16px] font-normal text-[#ff5722]">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
