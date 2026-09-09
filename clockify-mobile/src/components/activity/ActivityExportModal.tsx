import React, { useState } from "react";
import {
  X,
  Download,
  FileSpreadsheet,
  FileCode,
  Copy,
  Check,
  Table,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import type { ActivityRecord } from "../../backend/types.ts";

interface ActivityExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: ActivityRecord[];
  onNotifyToast?: (msg: string) => void;
}

export const ActivityExportModal: React.FC<ActivityExportModalProps> = ({
  isOpen,
  onClose,
  records,
  onNotifyToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeFormat, setActiveFormat] = useState<"csv" | "json">("csv");
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split("T")[0];

  const generateCSV = () => {
    const headers =
      "Member ID,Member Name,Task,Project,Project Color,Activity %,Active Window,Productivity Score,Status,Recorded At\n";
    const rows = records
      .map(
        (r) =>
          `"${r.member_id}","${r.member_name}","${r.task}","${r.project}","${r.project_color}",${r.activity_percent},"${r.active_window}","${r.score}","${r.status}","${r.recorded_at}"`
      )
      .join("\n");
    return headers + rows;
  };

  const generateJSON = () => {
    return JSON.stringify(records, null, 2);
  };

  const handleDownloadCSV = () => {
    try {
      const csv = generateCSV();
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Clockify_Activity_Report_${todayStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      onNotifyToast?.("Activity report downloaded as CSV (.csv)");
    } catch (err: any) {
      console.error("Failed to download CSV", err);
      // Fallback via direct browser navigation to API endpoint
      window.open("/api/activity/export?format=csv", "_blank");
    }
  };

  const handleDownloadJSON = () => {
    try {
      const json = generateJSON();
      const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Clockify_Activity_Report_${todayStr}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      onNotifyToast?.("Activity report downloaded as JSON (.json)");
    } catch (err: any) {
      console.error("Failed to download JSON", err);
      window.open("/api/activity/export?format=json", "_blank");
    }
  };

  const handleCopyClipboard = async () => {
    const textToCopy = activeFormat === "csv" ? generateCSV() : generateJSON();
    let copiedSuccess = false;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        copiedSuccess = true;
      } catch {
        // Continue to fallback
      }
    }

    if (!copiedSuccess) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        copiedSuccess = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        copiedSuccess = false;
      }
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    onNotifyToast?.(
      copiedSuccess
        ? `Copied ${activeFormat.toUpperCase()} data to clipboard!`
        : "Copied to clipboard"
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#181d24] border border-[#2e3947] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] text-white">
        {/* Header */}
        <div className="px-4 py-3.5 bg-[#13171c] border-b border-[#262e38] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#03a9f4]/20 border border-[#03a9f4]/40 flex items-center justify-center text-[#03a9f4]">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 id="export-modal-title" className="text-sm font-bold text-white">
                Export Activity Data
              </h3>
              <p className="text-[10px] text-[#8c9ba8]">
                {records.length} team members monitored · Live pulse metrics
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close export dialog"
            className="p-1 text-[#8c9ba8] hover:text-white rounded-lg hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 space-y-3.5 overflow-y-auto flex-1">
          {/* Export Options Cards */}
          <div className="space-y-2">
            {/* CSV File Option (Primary) */}
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="w-full p-3 bg-[#121518] hover:bg-[#1a2027] border border-[#2b3542] hover:border-[#03a9f4] rounded-xl flex items-center justify-between text-left transition group active:scale-98 shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white group-hover:text-[#03a9f4] transition-colors">
                    Download CSV Report (.csv)
                  </div>
                  <div className="text-[11px] text-[#8c9ba8] truncate">
                    Compatible with Microsoft Excel, Google Sheets &amp; Numbers
                  </div>
                </div>
              </div>
              <Download className="w-4 h-4 text-[#03a9f4] shrink-0 ml-2" />
            </button>

            {/* JSON File Option */}
            <button
              type="button"
              onClick={handleDownloadJSON}
              className="w-full p-3 bg-[#121518] hover:bg-[#1a2027] border border-[#2b3542] hover:border-purple-400 rounded-xl flex items-center justify-between text-left transition group active:scale-98 shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                  <FileCode className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                    Download Raw JSON (.json)
                  </div>
                  <div className="text-[11px] text-[#8c9ba8] truncate">
                    Structured developer object array with audit timestamps
                  </div>
                </div>
              </div>
              <Download className="w-4 h-4 text-purple-400 shrink-0 ml-2" />
            </button>
          </div>

          {/* Quick Copy to Clipboard Section */}
          <div className="p-3 bg-[#121518] border border-[#262e38] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#c2cbd4]">Copy to Clipboard</span>
              {/* Format pill toggle */}
              <div className="inline-flex rounded-lg bg-[#181d24] p-0.5 border border-[#2a333e]">
                <button
                  type="button"
                  onClick={() => setActiveFormat("csv")}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    activeFormat === "csv"
                      ? "bg-[#03a9f4] text-white"
                      : "text-[#8c9ba8] hover:text-white"
                  }`}
                >
                  CSV
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormat("json")}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    activeFormat === "json"
                      ? "bg-[#03a9f4] text-white"
                      : "text-[#8c9ba8] hover:text-white"
                  }`}
                >
                  JSON
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyClipboard}
              className="w-full py-2 bg-[#1e252e] hover:bg-[#28323e] border border-[#2e3947] text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#8c9ba8]" />
                  <span>Copy {activeFormat.toUpperCase()} to Clipboard</span>
                </>
              )}
            </button>
          </div>

          {/* Toggle Table Preview */}
          <div>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs font-semibold text-[#03a9f4] hover:underline flex items-center gap-1"
            >
              <Table className="w-3.5 h-3.5" />
              <span>{showPreview ? "Hide Data Preview" : "Preview Records Table"}</span>
            </button>

            {showPreview && (
              <div className="mt-2 bg-[#101316] border border-[#232932] rounded-xl overflow-x-auto max-h-40 text-[10px] p-2 divide-y divide-[#1e252e]">
                <div className="font-bold text-[#8c9ba8] pb-1 flex justify-between">
                  <span>Member</span>
                  <span>Task / Project</span>
                  <span>Activity</span>
                </div>
                {records.map((r) => (
                  <div key={r.id} className="py-1 flex justify-between gap-2 text-slate-300">
                    <span className="truncate max-w-[100px] font-medium">{r.member_name}</span>
                    <span className="truncate max-w-[130px] text-slate-400">{r.task}</span>
                    <span className="text-emerald-400 font-mono shrink-0">{r.activity_percent}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#13171c] border-t border-[#262e38] flex items-center justify-between text-[11px] text-[#8c9ba8]">
          <span>Endpoint: /api/activity/export</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-[#1e252e] hover:bg-[#28323e] text-white rounded-lg text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
