import React from "react";
import { Info, ExternalLink, ShieldCheck, X } from "lucide-react";

interface AppVersionModalProps {
  isOpen: boolean;
  version: string;
  onClose: () => void;
}

export const AppVersionModal: React.FC<AppVersionModalProps> = ({
  isOpen,
  version,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-sm bg-[#1a1f26] border border-[#2b3340] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2b3340]">
          <div className="flex items-center gap-2.5">
            <Info className="w-5 h-5 text-[#03a9f4]" />
            <h3 className="text-base font-semibold text-white">About Clockify</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8b98a5] hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-center py-2">
            <div className="w-12 h-12 rounded-2xl bg-[#03a9f4]/15 border border-[#03a9f4]/30 flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-black text-[#03a9f4]">C</span>
            </div>
            <h4 className="text-base font-bold text-white">Clockify Mobile</h4>
            <p className="text-xs text-[#8c9ba8] mt-0.5">Version {version}</p>
          </div>

          <div className="bg-[#121517] p-3.5 rounded-xl border border-[#262e38] space-y-2 text-xs">
            <div className="flex justify-between text-[#8c9ba8]">
              <span>Build Channel:</span>
              <span className="text-white font-medium">Production Mobile</span>
            </div>
            <div className="flex justify-between text-[#8c9ba8]">
              <span>Architecture:</span>
              <span className="text-white font-medium">React 19 + TypeScript</span>
            </div>
            <div className="flex justify-between text-[#8c9ba8]">
              <span>Sync Engine:</span>
              <span className="text-emerald-400 font-medium">Online (Realtime)</span>
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <a
              href="https://clockify.me/terms"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#232a34] text-xs text-[#03a9f4] transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Terms of Service & Privacy Policy</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="px-5 py-3 bg-[#161a20] border-t border-[#262e3a] flex justify-end">
          <button
            onClick={onClose}
            className="text-sm font-medium text-[#03a9f4] hover:text-[#38bdf8] px-3 py-1.5 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
