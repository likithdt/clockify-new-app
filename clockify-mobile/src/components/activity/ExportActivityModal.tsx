import React, { useState } from "react";
import { Download, X, Check, FileSpreadsheet, FileCode, CheckCircle2 } from "lucide-react";

export interface ActivityMemberRecord {
  id: string;
  name: string;
  avatar?: string;
  avatarColor?: string;
  task: string;
  project: string;
  activityPercent: number;
  pulseText: string;
  activeWindow: string;
  score: string;
  status: string;
}

interface ExportActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: ActivityMemberRecord[];
}

export const ExportActivityModal: React.FC<ExportActivityModalProps> = ({
  isOpen,
  onClose,
  members,
}) => {
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [includeWindowTitles, setIncludeWindowTitles] = useState(true);
  const [includeProductivity, setIncludeProductivity] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    const todayStr = new Date().toISOString().split("T")[0];

    if (format === "csv") {
      const headers = [
        "Member Name",
        "Project",
        "Current Task",
        "Activity %",
        "Pulse Status",
        ...(includeWindowTitles ? ["Active Window Title"] : []),
        ...(includeProductivity ? ["Productivity Score", "Status"] : []),
        "Exported Timestamp",
      ];

      const rows = members.map((m) => [
        `"${m.name.replace(/"/g, '""')}"`,
        `"${m.project.replace(/"/g, '""')}"`,
        `"${m.task.replace(/"/g, '""')}"`,
        `"${m.activityPercent}%"`,
        `"${m.pulseText.replace(/"/g, '""')}"`,
        ...(includeWindowTitles ? [`"${m.activeWindow.replace(/"/g, '""')}"`] : []),
        ...(includeProductivity ? [`"${m.score}"`, `"${m.status}"`] : []),
        `"${new Date().toLocaleString()}"`,
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const fileName = `clockify-activity-audit-${todayStr}.csv`;

      triggerFileDownload(blob, fileName);
      setDownloadSuccess(fileName);
    } else {
      const jsonData = {
        exportDate: new Date().toISOString(),
        workspace: "Gopalan College of Engineering",
        totalMembers: members.length,
        averageProductivity: "88.4%",
        records: members.map((m) => ({
          name: m.name,
          project: m.project,
          task: m.task,
          activityPercent: m.activityPercent,
          pulse: m.pulseText,
          ...(includeWindowTitles ? { activeWindow: m.activeWindow } : {}),
          ...(includeProductivity ? { productivityScore: m.score, status: m.status } : {}),
        })),
      };

      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
      const fileName = `clockify-activity-audit-${todayStr}.json`;

      triggerFileDownload(blob, fileName);
      setDownloadSuccess(fileName);
    }
  };

  const triggerFileDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] w-full max-w-sm flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#03a9f4] text-white flex items-center justify-center shadow-xs">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#1e293b]">Export Activity Log</h3>
              <p className="text-[10px] text-[#64748b]">Generate report for {members.length} members</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#64748b] hover:text-[#1e293b] hover:bg-[#f1f5f9] rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 text-xs text-[#334155]">
          {/* Format Selector */}
          <div>
            <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1.5">
              File Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormat("csv");
                  setDownloadSuccess(null);
                }}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition cursor-pointer ${
                  format === "csv"
                    ? "border-[#03a9f4] bg-[#e1f5fe]/60 text-[#0288d1]"
                    : "border-[#cbd5e1] hover:bg-[#f8fafc] text-[#475569]"
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 shrink-0 text-[#03a9f4]" />
                <div>
                  <div className="font-bold text-xs">CSV File</div>
                  <div className="text-[10px] text-[#64748b]">Excel / Sheets</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormat("json");
                  setDownloadSuccess(null);
                }}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition cursor-pointer ${
                  format === "json"
                    ? "border-[#03a9f4] bg-[#e1f5fe]/60 text-[#0288d1]"
                    : "border-[#cbd5e1] hover:bg-[#f8fafc] text-[#475569]"
                }`}
              >
                <FileCode className="w-5 h-5 shrink-0 text-[#8b5cf6]" />
                <div>
                  <div className="font-bold text-xs">JSON Data</div>
                  <div className="text-[10px] text-[#64748b]">Structured Raw</div>
                </div>
              </button>
            </div>
          </div>

          {/* Included Fields */}
          <div>
            <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1.5">
              Include In Export
            </label>
            <div className="space-y-1.5 bg-[#f8fafc] p-2.5 rounded-xl border border-[#e2e8f0]">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={includeWindowTitles}
                  onChange={(e) => setIncludeWindowTitles(e.target.checked)}
                  className="rounded border-[#cbd5e1] text-[#03a9f4] focus:ring-0 cursor-pointer"
                />
                <span>Active application &amp; window titles</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={includeProductivity}
                  onChange={(e) => setIncludeProductivity(e.target.checked)}
                  className="rounded border-[#cbd5e1] text-[#03a9f4] focus:ring-0 cursor-pointer"
                />
                <span>Productivity scores &amp; tracking status</span>
              </label>
            </div>
          </div>

          {/* Quick Preview summary */}
          <div className="bg-[#f1f5f9] px-3 py-2 rounded-lg text-[11px] text-[#475569] flex items-center justify-between">
            <span>Ready to export:</span>
            <span className="font-bold text-[#1e293b]">{members.length} team records</span>
          </div>

          {/* Download Success Banner */}
          {downloadSuccess && (
            <div className="bg-[#ecfdf5] border border-[#a7f3d0] text-[#047857] p-2.5 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
              <div className="truncate">
                <div className="font-bold truncate">File downloaded successfully!</div>
                <div className="text-[10px] text-[#065f46] font-mono truncate">{downloadSuccess}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-[#64748b] hover:text-[#1e293b] font-medium transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {format.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
