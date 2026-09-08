import React from "react";
import type { AppTheme } from "../../backend/types.ts";
import { Check, X } from "lucide-react";

interface ThemeModalProps {
  isOpen: boolean;
  currentTheme: AppTheme;
  onSelect: (theme: AppTheme) => void;
  onClose: () => void;
}

const THEME_OPTIONS: { id: AppTheme; label: string; description: string }[] = [
  {
    id: "system",
    label: "System default",
    description: "Matches your device display settings",
  },
  {
    id: "dark",
    label: "Dark theme",
    description: "Reduced glare and battery conservation",
  },
  {
    id: "light",
    label: "Light theme",
    description: "Classic light background display",
  },
];

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  currentTheme,
  onSelect,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-sm bg-[#1a1f26] border border-[#2b3340] rounded-2xl shadow-2xl overflow-hidden animate-slideInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2b3340]">
          <h3 className="text-base font-semibold text-white">App theme</h3>
          <button
            onClick={onClose}
            className="text-[#8b98a5] hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-2 divide-y divide-[#262e3a]">
          {THEME_OPTIONS.map((opt) => {
            const isSelected = currentTheme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onSelect(opt.id);
                  onClose();
                }}
                className="w-full text-left px-4 py-3.5 flex items-center justify-between hover:bg-[#232a34] rounded-xl transition-colors"
              >
                <div>
                  <div className="text-sm font-medium text-white">{opt.label}</div>
                  <div className="text-xs text-[#8c9ba8] mt-0.5">{opt.description}</div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? "border-[#03a9f4] bg-[#03a9f4]"
                      : "border-[#4a5568] bg-transparent"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-5 py-3 bg-[#161a20] border-t border-[#262e3a] flex justify-end">
          <button
            onClick={onClose}
            className="text-sm font-medium text-[#03a9f4] hover:text-[#38bdf8] px-3 py-1.5 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
