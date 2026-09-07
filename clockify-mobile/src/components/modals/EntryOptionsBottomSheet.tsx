import React from "react";
import { Play, Copy, FileEdit, Split, Trash2 } from "lucide-react";
import type { TimeEntry } from "../../backend/types";

interface EntryOptionsBottomSheetProps {
  isOpen: boolean;
  entry: TimeEntry | null;
  onClose: () => void;
  onContinue: (entry: TimeEntry) => void;
  onDuplicate: (entry: TimeEntry) => void;
  onEdit: (entry: TimeEntry) => void;
  onSplit: (entry: TimeEntry) => void;
  onDelete: (entry: TimeEntry) => void;
}

export const EntryOptionsBottomSheet: React.FC<EntryOptionsBottomSheetProps> = ({
  isOpen,
  entry,
  onClose,
  onContinue,
  onDuplicate,
  onEdit,
  onSplit,
  onDelete,
}) => {
  if (!isOpen || !entry) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center select-none animate-fadeIn">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[0.5px]"
        onClick={onClose}
      />

      {/* Bottom sheet matching WhatsApp Image 2026-09-07 at 11.35.14 AM.jpeg */}
      <div className="relative w-full bg-white rounded-t-[28px] pt-3 pb-6 px-4 shadow-2xl z-10 animate-slideInUp border-t border-gray-100">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

        <div className="space-y-0.5">
          {/* Continue */}
          <button
            type="button"
            onClick={() => {
              onContinue(entry);
              onClose();
            }}
            className="w-full flex items-center gap-5 px-4 py-3.5 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <Play className="w-5 h-5 text-gray-800 fill-gray-800" />
            <span className="text-[16px] font-normal text-gray-900">Continue</span>
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={() => {
              onDuplicate(entry);
              onClose();
            }}
            className="w-full flex items-center gap-5 px-4 py-3.5 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <Copy className="w-5 h-5 text-gray-800 stroke-[2]" />
            <span className="text-[16px] font-normal text-gray-900">Duplicate</span>
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={() => {
              onEdit(entry);
              onClose();
            }}
            className="w-full flex items-center gap-5 px-4 py-3.5 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <FileEdit className="w-5 h-5 text-gray-800 stroke-[2]" />
            <span className="text-[16px] font-normal text-gray-900">Edit</span>
          </button>

          {/* Split */}
          <button
            type="button"
            onClick={() => {
              onSplit(entry);
              onClose();
            }}
            className="w-full flex items-center gap-5 px-4 py-3.5 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <Split className="w-5 h-5 text-gray-800 stroke-[2]" />
            <span className="text-[16px] font-normal text-gray-900">Split</span>
          </button>

          {/* Delete - Red/Orange destructive styling matching screenshot 7 */}
          <button
            type="button"
            onClick={() => {
              onDelete(entry);
              onClose();
            }}
            className="w-full flex items-center gap-5 px-4 py-3.5 rounded-xl hover:bg-red-50 active:bg-red-100 transition-colors"
          >
            <Trash2 className="w-5 h-5 text-[#f4511e] stroke-[2]" />
            <span className="text-[16px] font-normal text-[#f4511e]">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

