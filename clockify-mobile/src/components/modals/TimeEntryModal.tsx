import React, { useState, useEffect } from "react";
import { X, Play, DollarSign, Tag as TagIcon, Folder, Trash2 } from "lucide-react";
import type { Project, Tag, TimeEntry } from "../../backend/types";

interface TimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTimer: (data: {
    description: string;
    projectId?: string;
    isBillable: boolean;
    tags: string[];
  }) => void;
  onCreateManualEntry?: (data: {
    description: string;
    projectId?: string;
    isBillable: boolean;
    tags: string[];
    startTime: string;
    endTime: string;
    durationSeconds: number;
  }) => void;
  onDeleteEntry?: (id: string) => void;
  editingEntry?: TimeEntry | null;
  projects: Project[];
  tags: Tag[];
}

export const TimeEntryModal: React.FC<TimeEntryModalProps> = ({
  isOpen,
  onClose,
  onStartTimer,
  onCreateManualEntry,
  onDeleteEntry,
  editingEntry,
  projects,
  tags,
}) => {
  const [mode, setMode] = useState<"timer" | "manual">("timer");
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [isBillable, setIsBillable] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [manualHours, setManualHours] = useState("1");
  const [manualMinutes, setManualMinutes] = useState("0");

  useEffect(() => {
    if (editingEntry) {
      setDescription(editingEntry.description || "");
      setSelectedProjectId(editingEntry.projectId || "");
      setIsBillable(editingEntry.isBillable ?? true);
      setSelectedTags(editingEntry.tags || []);
      setMode("manual");
      const hrs = Math.floor(editingEntry.durationSeconds / 3600);
      const mins = Math.floor((editingEntry.durationSeconds % 3600) / 60);
      setManualHours(String(hrs));
      setManualMinutes(String(mins));
    } else {
      setDescription("");
      setSelectedProjectId("");
      setIsBillable(true);
      setSelectedTags([]);
      setMode("timer");
      setManualHours("1");
      setManualMinutes("0");
    }
  }, [editingEntry, isOpen]);

  if (!isOpen) return null;

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "timer" && !editingEntry) {
      onStartTimer({
        description,
        projectId: selectedProjectId || undefined,
        isBillable,
        tags: selectedTags,
      });
    } else {
      const h = parseInt(manualHours, 10) || 0;
      const m = parseInt(manualMinutes, 10) || 0;
      const totalSecs = Math.max(60, h * 3600 + m * 60);
      const now = new Date();
      const startTime = new Date(now.getTime() - totalSecs * 1000).toISOString();
      const endTime = now.toISOString();

      onCreateManualEntry?.({
        description,
        projectId: selectedProjectId || undefined,
        isBillable,
        tags: selectedTags,
        startTime,
        endTime,
        durationSeconds: totalSecs,
      });
    }
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />
      
      <div className="relative w-full max-w-[430px] bg-[#1a1f26] border-t sm:border border-[#28313d] rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl z-10 animate-slideInUp max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#252d37]">
          <h2 className="text-base font-semibold text-white">
            {editingEntry ? "Edit Time Entry" : "Track Time"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#8c9ba5] hover:text-white rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector (Timer vs Manual) */}
        {!editingEntry && (
          <div className="flex bg-[#121518] p-1 rounded-xl border border-[#28313d] my-4">
            <button
              type="button"
              onClick={() => setMode("timer")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === "timer"
                  ? "bg-[#00b0ff] text-black shadow-sm"
                  : "text-[#8c9ba5] hover:text-white"
              }`}
            >
              Timer Mode
            </button>
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === "manual"
                  ? "bg-[#00b0ff] text-black shadow-sm"
                  : "text-[#8c9ba5] hover:text-white"
              }`}
            >
              Manual Log
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Description Input */}
          <div>
            <label className="block text-xs font-medium text-[#8c9ba5] mb-1.5">
              What are you working on?
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description..."
              className="w-full bg-[#121518] border border-[#28313d] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#5e6b77] focus:outline-none focus:border-[#00b0ff]"
            />
          </div>

          {/* Project Selector */}
          <div>
            <label className="block text-xs font-medium text-[#8c9ba5] mb-1.5 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-[#00b0ff]" />
              Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full bg-[#121518] border border-[#28313d] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00b0ff]"
            >
              <option value="">No Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.clientName ? `${p.clientName} > ` : ""}{p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Manual Duration Inputs */}
          {mode === "manual" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#8c9ba5] mb-1">Hours</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={manualHours}
                  onChange={(e) => setManualHours(e.target.value)}
                  className="w-full bg-[#121518] border border-[#28313d] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00b0ff]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#8c9ba5] mb-1">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={manualMinutes}
                  onChange={(e) => setManualMinutes(e.target.value)}
                  className="w-full bg-[#121518] border border-[#28313d] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00b0ff]"
                />
              </div>
            </div>
          )}

          {/* Billable & Tags row */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setIsBillable(!isBillable)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                isBillable
                  ? "bg-[#142e3e] border-[#00b0ff]/40 text-[#00b0ff]"
                  : "bg-[#121518] border-[#28313d] text-[#8c9ba5]"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>{isBillable ? "Billable" : "Non-billable"}</span>
            </button>

            <span className="text-xs text-[#8c9ba5]">
              {selectedTags.length > 0 ? `${selectedTags.length} tag(s)` : "No tags"}
            </span>
          </div>

          {/* Tags quick selector */}
          {tags.length > 0 && (
            <div>
              <label className="block text-[11px] font-medium text-[#8c9ba5] mb-1.5 flex items-center gap-1.5">
                <TagIcon className="w-3 h-3 text-[#00b0ff]" />
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                {tags.map((t) => {
                  const isSelected = selectedTags.includes(t.name);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTag(t.name)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        isSelected
                          ? "bg-[#142e3e] border-[#00b0ff]/50 text-[#00b0ff]"
                          : "bg-[#121518] border-[#28313d] text-[#8c9ba5] hover:text-white"
                      }`}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            {editingEntry && onDeleteEntry && (
              <button
                type="button"
                onClick={() => {
                  onDeleteEntry(editingEntry.id);
                  onClose();
                }}
                className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-400 hover:bg-red-900/60"
                title="Delete entry"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-[#56ccf2] hover:bg-[#40bde3] active:scale-95 text-black font-semibold text-sm py-3 rounded-xl shadow-lg transition-all"
            >
              {mode === "timer" && !editingEntry ? (
                <>
                  <Play className="w-4 h-4 fill-black" />
                  <span>Start Timer</span>
                </>
              ) : (
                <span>{editingEntry ? "Save Changes" : "Log Time"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
