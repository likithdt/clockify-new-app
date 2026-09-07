import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  FileText,
  Folder,
  ClipboardList,
  Tag as TagIcon,
  ChevronRight,
  Check,
} from "lucide-react";
import type { Project, Tag, TimeEntry } from "../backend/types";

interface NewTimeEntryScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    description: string;
    projectId?: string;
    projectName?: string;
    projectColor?: string;
    clientName?: string;
    taskId?: string;
    taskName?: string;
    tags: string[];
    isBillable: boolean;
    startTime: string;
    endTime: string;
    durationSeconds: number;
  }) => void;
  projects: Project[];
  tags: Tag[];
  initialEntry?: TimeEntry | null;
  initialDurationSeconds?: number;
}

export const NewTimeEntryScreen: React.FC<NewTimeEntryScreenProps> = ({
  isOpen,
  onClose,
  onSave,
  projects,
  tags,
  initialEntry,
  initialDurationSeconds,
}) => {
  // Form State
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [selectedTaskName, setSelectedTaskName] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isBillable, setIsBillable] = useState(false); // Default OFF matching screenshot 1

  // Duration & Times State
  const [durationSeconds, setDurationSeconds] = useState(0); // 00:00:00 matching screenshot 1
  const [startDate, setStartDate] = useState<Date>(new Date());

  // Duration Popup Modal State (matching screenshot 1 & 2)
  const [showDurationPopup, setShowDurationPopup] = useState(false);
  const [popupHours, setPopupHours] = useState("");
  const [popupMinutes, setPopupMinutes] = useState("00");
  const [activeDurationField, setActiveDurationField] = useState<"hours" | "minutes">("hours");

  // Pickers Modals
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const [showTaskPicker, setShowTaskPicker] = useState(false);
  const [customTaskInput, setCustomTaskInput] = useState("");
  const [showTagPicker, setShowTagPicker] = useState(false);

  // Initialize or reset form when opened
  useEffect(() => {
    if (!isOpen) return;

    if (initialEntry) {
      setDescription(initialEntry.description || "");
      setSelectedProjectId(initialEntry.projectId || "");
      setSelectedTaskId(initialEntry.taskId || "");
      setSelectedTaskName(initialEntry.taskName || "");
      setSelectedTags(initialEntry.tags || []);
      setIsBillable(initialEntry.isBillable ?? false);
      setDurationSeconds(initialEntry.durationSeconds || 0);
      setStartDate(initialEntry.startTime ? new Date(initialEntry.startTime) : new Date());
    } else {
      setDescription("");
      setSelectedProjectId("");
      setSelectedTaskId("");
      setSelectedTaskName("");
      setSelectedTags([]);
      setIsBillable(false);
      setDurationSeconds(initialDurationSeconds || 0);
      setStartDate(new Date());
    }
  }, [isOpen, initialEntry, initialDurationSeconds]);

  if (!isOpen) return null;

  // Formatting helpers
  const formatTimeHM = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatShortDate = (date: Date) => {
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return `${weekday}, ${day} ${month}`;
  };

  const formatDurationDisplay = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate End Time based on Start Date + durationSeconds
  const calculateEndTime = () => {
    return new Date(startDate.getTime() + durationSeconds * 1000);
  };

  // Adjust duration via controls: -1h, -15min, +15min, +1h
  const handleAdjustDuration = (deltaSeconds: number) => {
    setDurationSeconds((prev) => Math.max(0, prev + deltaSeconds));
  };

  // Open Duration Popup (matching screenshot 1)
  const handleOpenDurationPopup = () => {
    const hrs = Math.floor(durationSeconds / 3600);
    const mins = Math.floor((durationSeconds % 3600) / 60);
    setPopupHours(hrs > 0 ? String(hrs) : "");
    setPopupMinutes(mins.toString().padStart(2, "0"));
    setActiveDurationField("hours");
    setShowDurationPopup(true);
  };

  // Confirm Duration from popup
  const handleConfirmDuration = () => {
    const h = parseInt(popupHours, 10) || 0;
    const m = parseInt(popupMinutes, 10) || 0;
    const totalSecs = Math.max(0, h * 3600 + m * 60);
    setDurationSeconds(totalSecs);
    setShowDurationPopup(false);
  };

  // Handle Save
  const handleSave = () => {
    const finalDuration = durationSeconds > 0 ? durationSeconds : 60; // default 1 min if 0 entered
    const finalStart = startDate.toISOString();
    const finalEnd = new Date(startDate.getTime() + finalDuration * 1000).toISOString();

    const proj = projects.find((p) => p.id === selectedProjectId);

    onSave({
      description: description.trim() || "No description",
      projectId: proj?.id,
      projectName: proj?.name || "No project",
      projectColor: proj?.color || "#94a3b8",
      clientName: proj?.clientName,
      taskId: selectedTaskId || undefined,
      taskName: selectedTaskName || undefined,
      tags: selectedTags,
      isBillable,
      startTime: finalStart,
      endTime: finalEnd,
      durationSeconds: finalDuration,
    });

    onClose();
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const availableProjectTasks = selectedProject?.tasks || [];

  return (
    <div className="absolute inset-0 z-50 bg-[#121518] flex flex-col select-none overflow-hidden animate-fadeIn">
      {/* Top Bar matching screenshot 1 */}
      <div className="h-14 px-4 flex items-center shrink-0 border-b border-[#1b2026]">
        <button
          type="button"
          onClick={onClose}
          className="p-1 -ml-1 text-white hover:text-[#4fc3f7] transition-colors"
          title="Close"
        >
          <X className="w-6 h-6 stroke-[2.2]" />
        </button>
        <h1 className="text-[19px] font-normal text-white ml-5">New time entry</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Row 1: Start / End & Date matching Screenshot 1 */}
        <div className="px-5 py-4 border-b border-[#1c2128]">
          <div className="flex items-start gap-4">
            <Calendar className="w-5 h-5 text-[#78909c] mt-0.5 shrink-0" />
            <div className="flex-1">
              {/* Start & Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[15px] text-[#78909c] w-10">Start</span>
                  <span className="text-[15px] text-white font-normal">
                    {formatTimeHM(startDate)}
                  </span>
                </div>
                <span className="text-[15px] text-white font-normal">
                  {formatShortDate(startDate)}
                </span>
              </div>

              {/* End */}
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[15px] text-[#78909c] w-10">End</span>
                <span className="text-[15px] text-white font-normal">
                  {formatTimeHM(calculateEndTime())}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Duration matching Screenshot 1 */}
        <div className="px-5 pt-4 pb-5 border-b border-[#1c2128]">
          <div className="flex items-center gap-4">
            <Clock className="w-5 h-5 text-[#78909c] shrink-0" />
            <span className="text-[15px] text-white font-normal">Duration</span>
          </div>

          {/* Centered Large Duration Display - Clicking opens popup */}
          <div className="flex justify-center my-4">
            <button
              type="button"
              onClick={handleOpenDurationPopup}
              className="text-[44px] font-light tracking-wider text-white hover:text-[#4fc3f7] transition-colors focus:outline-none"
              title="Click to enter duration"
            >
              {formatDurationDisplay(durationSeconds)}
            </button>
          </div>

          {/* Duration Adjustment Controls matching Screenshot 1 */}
          <div className="flex items-center justify-center gap-8 select-none">
            <button
              type="button"
              onClick={() => handleAdjustDuration(-3600)}
              className={`text-[15px] font-normal transition-colors ${
                durationSeconds >= 3600
                  ? "text-[#78909c] hover:text-white"
                  : "text-[#47525d] cursor-default"
              }`}
            >
              -1h
            </button>
            <button
              type="button"
              onClick={() => handleAdjustDuration(-900)}
              className={`text-[15px] font-normal transition-colors ${
                durationSeconds >= 900
                  ? "text-[#78909c] hover:text-white"
                  : "text-[#47525d] cursor-default"
              }`}
            >
              -15min
            </button>
            <button
              type="button"
              onClick={() => handleAdjustDuration(900)}
              className="text-[15px] font-normal text-[#4fc3f7] hover:text-[#38bdf8] transition-colors"
            >
              +15min
            </button>
            <button
              type="button"
              onClick={() => handleAdjustDuration(3600)}
              className="text-[15px] font-normal text-[#4fc3f7] hover:text-[#38bdf8] transition-colors"
            >
              +1h
            </button>
          </div>
        </div>

        {/* Row 3: "What have you worked on?" */}
        <div className="px-5 py-4 flex items-center gap-4 border-b border-[#1c2128]">
          <FileText className="w-5 h-5 text-[#78909c] shrink-0" />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What have you worked on?"
            className="flex-1 bg-transparent text-[15px] text-white placeholder-[#78909c] outline-none"
          />
        </div>

        {/* Row 4: Project */}
        <div
          onClick={() => setShowProjectPicker(true)}
          className="px-5 py-3.5 flex items-center justify-between border-b border-[#1c2128] cursor-pointer hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-4 min-w-0">
            <Folder className="w-5 h-5 text-[#78909c] shrink-0" />
            <div className="min-w-0">
              <div className="text-[15px] text-white font-normal">Project</div>
              <div className="text-[13px] text-[#78909c] truncate">
                {selectedProject ? selectedProject.name : "Select project"}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#78909c] shrink-0" />
        </div>

        {/* Row 5: Task */}
        <div
          onClick={() => setShowTaskPicker(true)}
          className="px-5 py-3.5 flex items-center justify-between border-b border-[#1c2128] cursor-pointer hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-4 min-w-0">
            <ClipboardList className="w-5 h-5 text-[#78909c] shrink-0" />
            <div className="min-w-0">
              <div className="text-[15px] text-white font-normal">Task</div>
              <div className="text-[13px] text-[#78909c] truncate">
                {selectedTaskName || "Select task"}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#78909c] shrink-0" />
        </div>

        {/* Row 6: Tags */}
        <div
          onClick={() => setShowTagPicker(true)}
          className="px-5 py-3.5 flex items-center justify-between border-b border-[#1c2128] cursor-pointer hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-4 min-w-0">
            <TagIcon className="w-5 h-5 text-[#78909c] shrink-0" />
            <div className="min-w-0">
              <div className="text-[15px] text-white font-normal">Tags</div>
              <div className="text-[13px] text-[#78909c] truncate">
                {selectedTags.length > 0 ? selectedTags.join(", ") : "Select tags"}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#78909c] shrink-0" />
        </div>

        {/* Row 7: Billable */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#1c2128]">
          <div className="flex items-center gap-4">
            <div className="w-5 h-5 rounded-full border border-[#78909c] flex items-center justify-center text-[12px] font-medium text-[#78909c]">
              $
            </div>
            <span className="text-[15px] text-white font-normal">Billable</span>
          </div>

          {/* Toggle switch matching screenshot 1 (Default OFF) */}
          <button
            type="button"
            onClick={() => setIsBillable(!isBillable)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              isBillable ? "bg-[#4fc3f7]" : "bg-[#333a42]"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full transition-transform ${
                isBillable
                  ? "translate-x-6 bg-white shadow-md"
                  : "translate-x-0 bg-[#8c9ba5]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Floating Save Button at bottom right matching screenshot 1 */}
      <div className="absolute bottom-6 right-5 z-20">
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#5cc5f2] hover:bg-[#48bceb] active:scale-95 text-[#0c2336] px-6 py-3.5 rounded-2xl font-semibold shadow-xl transition-all"
        >
          <Check className="w-5 h-5 stroke-[2.8]" />
          <span className="text-[15px]">Save</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* ENTER DURATION POPUP - Matching Screenshot 1 exactly */}
      {/* ============================================================ */}
      {showDurationPopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 select-none">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-[0.5px] animate-fadeIn"
            onClick={() => setShowDurationPopup(false)}
          />

          <div className="relative w-full max-w-[320px] bg-[#212529] rounded-3xl p-6 shadow-2xl z-10 animate-scaleIn">
            <h3 className="text-[16px] font-semibold text-white mb-6">
              Enter duration
            </h3>

            {/* Inputs Container */}
            <div className="flex items-center justify-center gap-3 mb-8">
              {/* Hours Box */}
              <div>
                <div
                  onClick={() => setActiveDurationField("hours")}
                  className={`w-[100px] h-[76px] rounded-xl flex items-center justify-center transition-colors ${
                    activeDurationField === "hours"
                      ? "bg-[#1a1d21] border-2 border-[#4fc3f7]"
                      : "bg-[#2d3238] border-2 border-transparent"
                  }`}
                >
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={popupHours}
                    onChange={(e) => setPopupHours(e.target.value.slice(0, 2))}
                    onFocus={() => setActiveDurationField("hours")}
                    placeholder=""
                    autoFocus
                    className="w-full h-full bg-transparent text-center text-3xl font-normal text-white outline-none"
                  />
                </div>
                <div className="text-xs text-[#90a4ae] text-left mt-1.5 ml-1 font-medium">
                  Hours
                </div>
              </div>

              {/* Colon */}
              <span className="text-white text-3xl font-bold -mt-5">:</span>

              {/* Minutes Box */}
              <div>
                <div
                  onClick={() => setActiveDurationField("minutes")}
                  className={`w-[100px] h-[76px] rounded-xl flex items-center justify-center transition-colors ${
                    activeDurationField === "minutes"
                      ? "bg-[#1a1d21] border-2 border-[#4fc3f7]"
                      : "bg-[#2d3238] border-2 border-transparent"
                  }`}
                >
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={popupMinutes}
                    onChange={(e) => setPopupMinutes(e.target.value.slice(0, 2))}
                    onFocus={() => setActiveDurationField("minutes")}
                    placeholder="00"
                    className="w-full h-full bg-transparent text-center text-3xl font-normal text-white outline-none"
                  />
                </div>
                <div className="text-xs text-[#90a4ae] text-left mt-1.5 ml-1 font-medium">
                  Minutes
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-6">
              <button
                type="button"
                onClick={() => setShowDurationPopup(false)}
                className="text-[15px] font-medium text-[#4fc3f7] hover:text-[#38bdf8] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDuration}
                className="text-[15px] font-medium text-[#4fc3f7] hover:text-[#38bdf8] transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PROJECT PICKER MODAL */}
      {/* ============================================================ */}
      {showProjectPicker && (
        <div className="absolute inset-0 z-50 flex items-end justify-center select-none">
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-[0.5px] animate-fadeIn"
            onClick={() => setShowProjectPicker(false)}
          />
          <div className="relative w-full max-w-[430px] bg-[#202428] rounded-t-3xl p-5 shadow-2xl z-10 max-h-[70vh] flex flex-col animate-slideInUp">
            <div className="w-9 h-1 bg-[#47525d] rounded-full mx-auto mb-4" />
            <h3 className="text-base font-semibold text-white mb-3">Select Project</h3>
            <div className="flex-1 overflow-y-auto space-y-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedProjectId("");
                  setSelectedTaskId("");
                  setSelectedTaskName("");
                  setShowProjectPicker(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                  !selectedProjectId ? "bg-[#142e3e] text-[#00b0ff]" : "hover:bg-white/5 text-white"
                }`}
              >
                <span>No project</span>
                {!selectedProjectId && <Check className="w-4 h-4" />}
              </button>
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    setSelectedTaskId("");
                    setSelectedTaskName("");
                    setShowProjectPicker(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                    selectedProjectId === proj.id
                      ? "bg-[#142e3e] text-[#00b0ff]"
                      : "hover:bg-white/5 text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: proj.color }}
                    />
                    <span>{proj.name}</span>
                    {proj.clientName && (
                      <span className="text-xs text-[#78909c]">({proj.clientName})</span>
                    )}
                  </div>
                  {selectedProjectId === proj.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TASK PICKER MODAL */}
      {/* ============================================================ */}
      {showTaskPicker && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 select-none">
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-[0.5px] animate-fadeIn"
            onClick={() => setShowTaskPicker(false)}
          />
          <div className="relative w-full max-w-[320px] bg-[#212529] rounded-3xl p-5 shadow-2xl z-10 animate-scaleIn">
            <h3 className="text-base font-semibold text-white mb-3">Select / Enter Task</h3>

            {/* If project has tasks, show them */}
            {availableProjectTasks.length > 0 && (
              <div className="max-h-40 overflow-y-auto mb-3 divide-y divide-[#2d3238] border border-[#333a42] rounded-xl">
                {availableProjectTasks.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedTaskId(t.id);
                      setSelectedTaskName(t.name);
                      setShowTaskPicker(false);
                    }}
                    className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left text-sm hover:bg-white/5 transition-colors ${
                      selectedTaskId === t.id ? "text-[#4fc3f7] font-medium" : "text-white"
                    }`}
                  >
                    <span>{t.name}</span>
                    {selectedTaskId === t.id && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}

            <input
              type="text"
              value={customTaskInput}
              onChange={(e) => setCustomTaskInput(e.target.value)}
              placeholder="Or enter new task name..."
              className="w-full bg-[#16191d] border border-[#333a42] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#78909c] outline-none focus:border-[#4fc3f7] mb-4"
            />
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowTaskPicker(false)}
                className="text-sm font-medium text-[#78909c]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (customTaskInput.trim()) {
                    setSelectedTaskName(customTaskInput.trim());
                    setSelectedTaskId("");
                  }
                  setShowTaskPicker(false);
                }}
                className="text-sm font-medium text-[#4fc3f7]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAGS PICKER MODAL */}
      {/* ============================================================ */}
      {showTagPicker && (
        <div className="absolute inset-0 z-50 flex items-end justify-center select-none">
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-[0.5px] animate-fadeIn"
            onClick={() => setShowTagPicker(false)}
          />
          <div className="relative w-full max-w-[430px] bg-[#202428] rounded-t-3xl p-5 shadow-2xl z-10 max-h-[70vh] flex flex-col animate-slideInUp">
            <div className="w-9 h-1 bg-[#47525d] rounded-full mx-auto mb-4" />
            <h3 className="text-base font-semibold text-white mb-3">Select Tags</h3>
            <div className="flex-1 overflow-y-auto space-y-1">
              {tags.map((t) => {
                const isSelected = selectedTags.includes(t.name);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedTags(selectedTags.filter((tn) => tn !== t.name));
                      } else {
                        setSelectedTags([...selectedTags, t.name]);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                      isSelected
                        ? "bg-[#142e3e] text-[#00b0ff]"
                        : "hover:bg-white/5 text-white"
                    }`}
                  >
                    <span>{t.name}</span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setShowTagPicker(false)}
              className="mt-4 w-full py-3 bg-[#4fc3f7] text-[#0c2336] font-semibold rounded-xl text-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
