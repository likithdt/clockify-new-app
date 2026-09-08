import React, { useState } from "react";
import type { AppLanguage } from "../../backend/types.ts";
import { Check, Search, X } from "lucide-react";

interface LanguageModalProps {
  isOpen: boolean;
  currentLanguage: AppLanguage;
  onSelect: (lang: AppLanguage) => void;
  onClose: () => void;
}

const LANGUAGES: { id: AppLanguage; label: string; nativeName: string }[] = [
  { id: "auto", label: "Set automatically", nativeName: "Device default" },
  { id: "en", label: "English", nativeName: "English (US)" },
  { id: "es", label: "Español", nativeName: "Spanish" },
  { id: "fr", label: "Français", nativeName: "French" },
  { id: "de", label: "Deutsch", nativeName: "German" },
  { id: "pt", label: "Português", nativeName: "Portuguese (Brazil)" },
  { id: "ru", label: "Русский", nativeName: "Russian" },
  { id: "ja", label: "日本語", nativeName: "Japanese" },
  { id: "it", label: "Italiano", nativeName: "Italian" },
];

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  currentLanguage,
  onSelect,
  onClose,
}) => {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filtered = LANGUAGES.filter(
    (l) =>
      l.label.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-sm bg-[#1a1f26] border border-[#2b3340] rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-slideInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2b3340]">
          <h3 className="text-base font-semibold text-white">Language</h3>
          <button
            onClick={onClose}
            className="text-[#8b98a5] hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-3 border-b border-[#2b3340]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8b98a5] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language..."
              className="w-full bg-[#121517] border border-[#2b3340] text-sm text-white rounded-xl pl-9 pr-3 py-2 outline-none focus:border-[#03a9f4] transition-colors"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-[#262e3a]">
          {filtered.map((opt) => {
            const isSelected = currentLanguage === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onSelect(opt.id);
                  onClose();
                }}
                className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-[#232a34] rounded-xl transition-colors"
              >
                <div>
                  <div className="text-sm font-medium text-white">{opt.label}</div>
                  <div className="text-xs text-[#8c9ba8] mt-0.5">{opt.nativeName}</div>
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
