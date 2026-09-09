import React from "react";
import {
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Laptop,
  Folder,
  Activity,
  Code2,
  Palette,
  Globe,
  Terminal,
  MessageSquare,
} from "lucide-react";
import type { ScreenshotItemDTO } from "../../backend/types.ts";

interface ScreenshotDetailModalProps {
  screenshot: ScreenshotItemDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  blurPrivacy: boolean;
}

export const ScreenshotDetailModal: React.FC<ScreenshotDetailModalProps> = ({
  screenshot,
  isOpen,
  onClose,
  onDelete,
  onNext,
  onPrevious,
  blurPrivacy,
}) => {
  if (!isOpen || !screenshot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#181d24] border border-[#2e3947] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-fadeIn">
        {/* Header */}
        <div className="px-4 py-3 bg-[#13171c] border-b border-[#262e38] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-[#03a9f4]" />
            <h3 className="text-xs font-bold text-white truncate">
              {screenshot.window_title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#8c9ba8] hover:text-white rounded-lg hover:bg-white/5 active:scale-95 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Screenshot Viewport */}
        <div className="p-4 bg-[#0e1114] flex-1 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
          <div
            className={`w-full h-56 rounded-xl border flex flex-col overflow-hidden transition ${
              blurPrivacy ? "filter blur-md select-none" : ""
            } ${
              screenshot.type === "code"
                ? "bg-[#181825] border-slate-700"
                : screenshot.type === "figma"
                ? "bg-[#252a34] border-[#3b4455]"
                : screenshot.type === "terminal"
                ? "bg-black border-slate-800 font-mono"
                : screenshot.type === "slack"
                ? "bg-[#1a1d21] border-[#35373b]"
                : "bg-slate-900 border-slate-700"
            }`}
          >
            {/* Simulated Window Titlebar */}
            <div className="h-6 px-3 bg-black/30 flex items-center justify-between border-b border-white/5 text-[10px] text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/70" />
                <span className="w-2 h-2 rounded-full bg-amber-500/70" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
                <span className="ml-2 truncate max-w-[200px]">{screenshot.app_name}</span>
              </div>
              <span>{screenshot.time_formatted}</span>
            </div>

            {/* Simulated App Content */}
            <div className="flex-1 p-3 flex flex-col justify-center items-center text-center space-y-2">
              {screenshot.type === "code" && (
                <div className="w-full text-left font-mono text-[11px] text-emerald-400 bg-black/40 p-3 rounded-lg border border-slate-800">
                  <div className="text-slate-500">// {screenshot.window_title}</div>
                  <div className="text-cyan-300 font-semibold">
                    {screenshot.code_snippet || "const tracker = new ActivityTimer();\nrecordAuditSnapshot();"}
                  </div>
                  <div className="text-emerald-400 mt-1">status: &quot;AUDIT_ACTIVE&quot;</div>
                </div>
              )}

              {screenshot.type === "figma" && (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-2 text-cyan-300">
                  <Palette className="w-8 h-8 opacity-60" />
                  <div className="text-xs font-semibold">{screenshot.window_title}</div>
                  <div className="text-[10px] text-slate-400">Mockup Canvas &amp; Design Specs</div>
                </div>
              )}

              {screenshot.type === "terminal" && (
                <div className="w-full text-left font-mono text-[11px] text-green-400 bg-black/60 p-3 rounded-lg">
                  <div className="text-slate-500">$ {screenshot.window_title}</div>
                  <div className="text-green-300 mt-1">✓ Compiled in 240ms</div>
                  <div className="text-cyan-400">Listening on port 5174...</div>
                </div>
              )}

              {screenshot.type === "slack" && (
                <div className="w-full text-left text-xs text-slate-300 space-y-1 bg-black/30 p-3 rounded-lg">
                  <div className="font-bold text-[#ec4899]">{screenshot.window_title}</div>
                  <div className="text-[11px] text-slate-400">Team sprint planning in progress.</div>
                </div>
              )}

              {screenshot.type === "browser" && (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-1 text-slate-300">
                  <Globe className="w-8 h-8 text-blue-400 opacity-60" />
                  <div className="text-xs font-semibold">{screenshot.window_title}</div>
                  <div className="text-[10px] text-slate-400">https://app.clockify.me</div>
                </div>
              )}
            </div>
          </div>

          {/* Privacy overlay label if active */}
          {blurPrivacy && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="bg-black/80 border border-white/20 text-white text-xs px-3 py-1.5 rounded-xl font-medium shadow-xl">
                Blur Privacy Enabled
              </span>
            </div>
          )}
        </div>

        {/* Info & Details */}
        <div className="px-4 py-3 bg-[#15191f] border-t border-[#262e38] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full text-white font-bold text-[10px] flex items-center justify-center shadow-sm"
                style={{ backgroundColor: "#03a9f4" }}
              >
                {screenshot.member_avatar || "US"}
              </div>
              <span className="font-bold text-white">{screenshot.member_name}</span>
            </div>

            <span className="text-[11px] font-mono text-[#8c9ba8] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#03a9f4]" />
              {screenshot.time_formatted}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            <span
              className="px-2.5 py-0.5 rounded-lg text-xs font-bold"
              style={{
                backgroundColor: `${screenshot.project_color}20`,
                color: screenshot.project_color,
              }}
            >
              {screenshot.project}
            </span>

            <span className="text-xs font-semibold text-[#10b981] bg-[#064e3b]/40 px-2 py-0.5 rounded-lg border border-[#059669]/50 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {screenshot.activity_percent}% Activity
            </span>
          </div>
        </div>

        {/* Footer Navigation & Actions */}
        <div className="px-4 py-3 bg-[#13171c] border-t border-[#262e38] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPrevious}
              className="px-3 py-1.5 bg-[#1e252e] hover:bg-[#28323e] text-white rounded-xl text-xs font-medium flex items-center gap-1 active:scale-95 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <button
              type="button"
              onClick={onNext}
              className="px-3 py-1.5 bg-[#1e252e] hover:bg-[#28323e] text-white rounded-xl text-xs font-medium flex items-center gap-1 active:scale-95 transition"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (confirm("Delete this screenshot record?")) {
                onDelete(screenshot.id);
                onClose();
              }
            }}
            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-medium flex items-center gap-1.5 active:scale-95 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
