import React, { useState, useMemo } from "react";
import { X, Search, Clock, DollarSign, Check, Trash2 } from "lucide-react";
import { useProjectStore, Project } from "@/stores/useProjectStore";

interface AddTimeEntrySheetProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  dayLabel: string;
  onSave: (data: {
    projectId: string;
    projectName: string;
    projectColor: string;
    client: string | null;
    taskId: string | null;
    taskName: string | null;
    description: string;
    isBillable: boolean;
    durationSeconds: number;
  }) => void;
  initialData?: {
    rowId?: string;
    projectId?: string | null;
    description?: string;
    isBillable?: boolean;
    seconds?: number;
  };
  onDelete?: () => void;
}

// Convert seconds to "hh:mm" or "Xh Ym"
function secondsToHms(secs: number): string {
  if (!secs || secs <= 0) return "00:00";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Parse input (e.g. "2", "2.5", "1h 30m", "01:30") to seconds
function parseTimeToSeconds(val: string): number {
  const str = val.trim().toLowerCase();
  if (!str) return 0;

  if (str.endsWith("h")) {
    const num = parseFloat(str.replace("h", ""));
    return isNaN(num) ? 0 : Math.round(num * 3600);
  }
  if (str.endsWith("m")) {
    const num = parseFloat(str.replace("m", ""));
    return isNaN(num) ? 0 : Math.round(num * 60);
  }
  if (str.includes(":")) {
    const parts = str.split(":").map((p) => parseInt(p, 10) || 0);
    if (parts.length >= 2) {
      return parts[0] * 3600 + parts[1] * 60 + (parts[2] || 0);
    }
  }
  const num = parseFloat(str);
  if (!isNaN(num)) {
    return Math.round(num * 3600);
  }
  return 0;
}

export const AddTimeEntrySheet: React.FC<AddTimeEntrySheetProps> = ({
  isOpen,
  onClose,
  dateStr,
  dayLabel,
  onSave,
  initialData,
  onDelete,
}) => {
  const { projects } = useProjectStore();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialData?.projectId || (projects[0]?.id ?? "")
  );
  const [description, setDescription] = useState(initialData?.description || "");
  const [timeInput, setTimeInput] = useState(
    initialData?.seconds ? secondsToHms(initialData.seconds) : "01:00"
  );
  const [isBillable, setIsBillable] = useState(
    initialData?.isBillable !== undefined ? initialData.isBillable : true
  );
  const [projectSearch, setProjectSearch] = useState("");
  const [isProjectPickerOpen, setIsProjectPickerOpen] = useState(false);

  if (!isOpen) return null;

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      (p.client && p.client.toLowerCase().includes(projectSearch.toLowerCase()))
  );

  const handlePresetAdd = (addedSeconds: number) => {
    const current = parseTimeToSeconds(timeInput);
    const updated = Math.max(0, current + addedSeconds);
    setTimeInput(secondsToHms(updated));
  };

  const handleSave = () => {
    const seconds = parseTimeToSeconds(timeInput);
    if (!selectedProject || seconds <= 0) return;

    onSave({
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      projectColor: selectedProject.color,
      client: selectedProject.client,
      taskId: null,
      taskName: null,
      description: description.trim(),
      isBillable,
      durationSeconds: seconds,
    });
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-[1px] animate-fadeIn select-none">
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl shadow-2xl max-h-[90%] flex flex-col overflow-hidden animate-slideUp text-slate-800">
        {/* Sheet Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 shrink-0" />

        {/* Sheet Header */}
        <div className="px-5 pt-3 pb-3 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {initialData?.rowId ? "Edit Time Entry" : "Add Time Entry"}
            </h3>
            <p className="text-xs text-slate-500">{dayLabel}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sheet Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Project Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Project <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setIsProjectPickerOpen(!isProjectPickerOpen)}
              className="w-full h-12 px-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex items-center justify-between text-left transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: selectedProject?.color || "#03A9F4" }}
                />
                <div className="truncate">
                  <span className="text-sm font-semibold text-slate-900 truncate">
                    {selectedProject?.name || "Select project"}
                  </span>
                  {selectedProject?.client && (
                    <span className="text-xs text-slate-400 ml-2">
                      ({selectedProject.client})
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-[#00b0ff] font-medium">Change</span>
            </button>

            {/* Project Picker Dropdown */}
            {isProjectPickerOpen && (
              <div className="mt-2 p-2 border border-slate-200 rounded-xl bg-white shadow-lg space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="w-full h-9 pl-8 pr-3 text-xs rounded-lg border border-slate-200 outline-none focus:border-[#00b0ff]"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {filteredProjects.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedProjectId(p.id);
                        setIsProjectPickerOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-left flex items-center justify-between text-xs transition cursor-pointer ${
                        selectedProjectId === p.id
                          ? "bg-sky-50 text-[#0288d1] font-semibold"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: p.color }}
                        />
                        <span className="truncate">{p.name}</span>
                        {p.client && (
                          <span className="text-[10px] text-slate-400 truncate">
                            - {p.client}
                          </span>
                        )}
                      </div>
                      {selectedProjectId === p.id && (
                        <Check className="w-3.5 h-3.5 text-[#0288d1] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Description / Task
            </label>
            <input
              type="text"
              placeholder="What did you work on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-[#00b0ff] outline-none transition"
            />
          </div>

          {/* Time Duration Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Duration (hh:mm)
              </label>
              <span className="text-[11px] text-slate-400">e.g. 2:30 or 2.5h</span>
            </div>
            <div className="relative">
              <Clock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                placeholder="00:00"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-200 text-base font-semibold font-mono text-slate-900 focus:border-[#00b0ff] outline-none"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
              {[
                { label: "+30m", sec: 1800 },
                { label: "+1h", sec: 3600 },
                { label: "+2h", sec: 7200 },
                { label: "+4h", sec: 14400 },
                { label: "8h Full Day", sec: 28800 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() =>
                    preset.label === "8h Full Day"
                      ? setTimeInput("08:00")
                      : handlePresetAdd(preset.sec)
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-medium text-slate-600 transition shrink-0 cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Billable Toggle */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isBillable ? "bg-[#03A9F4]/15 text-[#0288D1]" : "bg-slate-100 text-slate-400"
                }`}
              >
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-800">Billable Entry</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isBillable}
              onClick={() => setIsBillable(!isBillable)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                isBillable ? "bg-[#03A9F4]" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  isBillable ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Sheet Actions */}
        <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3">
          {initialData?.rowId && onDelete && (
            <button
              type="button"
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="h-12 px-4 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 flex items-center justify-center transition cursor-pointer"
              title="Delete Entry"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={!selectedProject || parseTimeToSeconds(timeInput) <= 0}
            className="flex-1 h-12 rounded-xl bg-[#00b0ff] hover:bg-[#0288d1] disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm transition flex items-center justify-center shadow-md shadow-[#00b0ff]/20 cursor-pointer"
          >
            Save Time Entry
          </button>
        </div>
      </div>
    </div>
  );
};
