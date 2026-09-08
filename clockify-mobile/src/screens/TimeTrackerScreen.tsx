import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Square,
  MoreHorizontal,
  Tag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { InfoBanner } from "../components/InfoBanner";
import { SpeedDialMenu } from "../components/SpeedDialMenu";
import { EntryOptionsBottomSheet } from "../components/modals/EntryOptionsBottomSheet";
import {
  PomodoroSettingsScreen,
  type PomodoroSettings,
} from "./PomodoroSettingsScreen";
import type { DayGroup, Project, TaskItem, TimeEntry, TimerStatus } from "../backend/types";

interface TimeTrackerScreenProps {
  dayGroups: DayGroup[];
  timerStatus: TimerStatus | null;
  onStartTimer: (data: {
    description: string;
    projectId?: string;
    projectName?: string;
    projectColor?: string;
    isBillable: boolean;
    tags: string[];
  }) => void;
  onStopTimer: () => void;
  onDiscardTimer: () => void;
  onOpenNewEntryModal: () => void;
  onOpenManualEntryModal?: () => void;
  onSelectEntry: (entry: TimeEntry) => void;
  onContinueEntry?: (entry: TimeEntry) => void;
  onDuplicateEntry?: (entry: TimeEntry) => void;
  onSplitEntry?: (entry: TimeEntry) => void;
  onDeleteEntry?: (id: string) => void;
  onCreateBreakEntry?: () => void;
  onCreateTimeEntry?: (data: {
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
  }) => Promise<void>;
  onSeedData: () => void;
  projects: Project[];
  pomodoroSettings?: PomodoroSettings;
  onSavePomodoroSettings?: (settings: PomodoroSettings) => void;
  onOpenProjectModal?: () => void;
  onUpdateProject?: (id: string, updates: Partial<Project>) => void;
  onUpdateTask?: (projectId: string, taskId: string, updates: Partial<TaskItem>) => void;
  onCreateTask?: (projectId: string, name: string) => void;
}

export const TimeTrackerScreen: React.FC<TimeTrackerScreenProps> = ({
  dayGroups,
  timerStatus,
  onStartTimer,
  onStopTimer,
  onDiscardTimer,
  onOpenNewEntryModal,
  onOpenManualEntryModal,
  onSelectEntry,
  onContinueEntry,
  onDuplicateEntry,
  onSplitEntry,
  onDeleteEntry,
  onCreateBreakEntry,
  onCreateTimeEntry,
  onSeedData,
  projects,
  pomodoroSettings = {
    focusMinutes: 25,
    shortBreakMinutes: 5,
    automaticBreak: true,
    defaultBreakProject: false,
  },
  onSavePomodoroSettings,
  onOpenProjectModal,
  onUpdateProject,
  onUpdateTask,
  onCreateTask,
}) => {
  const [activeTab, setActiveTab] = useState<"list" | "pomodoro">("list");
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [selectedEntryForOptions, setSelectedEntryForOptions] =
    useState<TimeEntry | null>(null);
  const [isEntryOptionsOpen, setIsEntryOptionsOpen] = useState(false);

  // Accordion state for grouped cards
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Pomodoro state
  const [pomoSettingsState, setPomoSettingsState] =
    useState<PomodoroSettings>(pomodoroSettings);
  const [focusTask, setFocusTask] = useState("");
  const [pomoPhase, setPomoPhase] = useState<"idle" | "focus" | "break">("idle");
  const [pomoSeconds, setPomoSeconds] = useState(
    (pomodoroSettings?.focusMinutes || 25) * 60
  );
  const [breakSeconds, setBreakSeconds] = useState(
    (pomodoroSettings?.shortBreakMinutes || 5) * 60
  );
  const [showPomoSettings, setShowPomoSettings] = useState(false);
  const [showFinishFocusModal, setShowFinishFocusModal] = useState(false);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [showFinishBreakModal, setShowFinishBreakModal] = useState(false);
  const [showSkipBreakModal, setShowSkipBreakModal] = useState(false);
  const pomoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const focusStartTimeRef = useRef<string | null>(null);
  const breakStartTimeRef = useRef<string | null>(null);

  // Sync external Pomodoro settings
  useEffect(() => {
    if (pomodoroSettings) {
      setPomoSettingsState(pomodoroSettings);
      if (pomoPhase === "idle") {
        setPomoSeconds((pomodoroSettings.focusMinutes || 25) * 60);
      }
    }
  }, [pomodoroSettings, pomoPhase]);

  // Save focus interval entry
  const saveFocusEntry = async () => {
    const startIso = focusStartTimeRef.current;
    if (!startIso) return;
    const elapsed = Math.max(
      1,
      Math.floor((Date.now() - new Date(startIso).getTime()) / 1000)
    );

    const defProj =
      pomoSettingsState.defaultBreakProject && pomoSettingsState.defaultBreakProjectId
        ? projects.find((p) => p.id === pomoSettingsState.defaultBreakProjectId)
        : undefined;

    const desc = focusTask.trim() || "No description";
    const entryData = {
      description: desc,
      projectId: defProj?.id,
      projectName: defProj?.name || "No project",
      projectColor: defProj?.color || "#94a3b8",
      clientName: defProj?.clientName,
      isBillable: true,
      tags: ["Pomodoro"],
      startTime: startIso,
      endTime: new Date().toISOString(),
      durationSeconds: elapsed,
    };

    if (onCreateTimeEntry) {
      await onCreateTimeEntry(entryData);
    } else {
      try {
        await fetch("/api/time-entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entryData),
        });
      } catch (e) {
        console.error("Failed to save pomodoro entry:", e);
      }
    }
    focusStartTimeRef.current = null;
  };

  // Save break interval entry
  const saveBreakEntry = async () => {
    const startIso = breakStartTimeRef.current;
    if (!startIso) return;
    const elapsed = Math.max(
      1,
      Math.floor((Date.now() - new Date(startIso).getTime()) / 1000)
    );

    const defProj =
      pomoSettingsState.defaultBreakProject && pomoSettingsState.defaultBreakProjectId
        ? projects.find((p) => p.id === pomoSettingsState.defaultBreakProjectId)
        : undefined;

    const entryData = {
      description: "Break",
      projectId: defProj?.id,
      projectName: defProj?.name || "No project",
      projectColor: defProj?.color || "#94a3b8",
      clientName: defProj?.clientName,
      isBillable: true,
      tags: ["Break"],
      startTime: startIso,
      endTime: new Date().toISOString(),
      durationSeconds: elapsed,
    };

    if (onCreateTimeEntry) {
      await onCreateTimeEntry(entryData);
    } else {
      try {
        await fetch("/api/time-entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entryData),
        });
      } catch (e) {
        console.error("Failed to save break entry:", e);
      }
    }
    breakStartTimeRef.current = null;
  };

  // Pomodoro countdown timer (handles focus and break)
  useEffect(() => {
    if (pomoPhase === "idle") {
      if (pomoTimerRef.current) clearInterval(pomoTimerRef.current);
      return;
    }

    pomoTimerRef.current = setInterval(() => {
      if (pomoPhase === "focus") {
        setPomoSeconds((prev) => Math.max(0, prev - 1));
      } else if (pomoPhase === "break") {
        setBreakSeconds((prev) => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => {
      if (pomoTimerRef.current) clearInterval(pomoTimerRef.current);
    };
  }, [pomoPhase]);

  // Automatic transition when focus countdown reaches 0
  useEffect(() => {
    if (pomoPhase === "focus" && pomoSeconds === 0) {
      saveFocusEntry();
      breakStartTimeRef.current = new Date().toISOString();
      setBreakSeconds((pomoSettingsState.shortBreakMinutes || 5) * 60);
      setPomoPhase("break");
    }
  }, [pomoPhase, pomoSeconds]);

  // Automatic transition when break countdown reaches 0
  useEffect(() => {
    if (pomoPhase === "break" && breakSeconds === 0) {
      saveBreakEntry();
      setPomoPhase("idle");
      setPomoSeconds((pomoSettingsState.focusMinutes || 25) * 60);
    }
  }, [pomoPhase, breakSeconds]);

  const handleStartSession = () => {
    focusStartTimeRef.current = new Date().toISOString();
    setPomoSeconds((pomoSettingsState.focusMinutes || 25) * 60);
    setPomoPhase("focus");
  };

  const handleStopFocusClick = () => {
    setShowFinishFocusModal(true);
  };

  const handleConfirmFinishFocus = async () => {
    setShowFinishFocusModal(false);
    await saveFocusEntry();
    breakStartTimeRef.current = new Date().toISOString();
    setBreakSeconds((pomoSettingsState.shortBreakMinutes || 5) * 60);
    setPomoPhase("break");
  };

  const handleEndSessionClick = () => {
    setShowEndSessionModal(true);
  };

  const handleConfirmEndSession = async () => {
    setShowEndSessionModal(false);
    await saveFocusEntry();
    setPomoPhase("idle");
    setPomoSeconds((pomoSettingsState.focusMinutes || 25) * 60);
  };

  const handleStopBreakClick = () => {
    setShowFinishBreakModal(true);
  };

  const handleConfirmFinishBreak = async () => {
    setShowFinishBreakModal(false);
    await saveBreakEntry();
    setPomoPhase("idle");
    setPomoSeconds((pomoSettingsState.focusMinutes || 25) * 60);
  };

  const handleSkipBreakClick = () => {
    setShowSkipBreakModal(true);
  };

  const handleConfirmSkipBreak = () => {
    setShowSkipBreakModal(false);
    breakStartTimeRef.current = null;
    setPomoPhase("idle");
    setPomoSeconds((pomoSettingsState.focusMinutes || 25) * 60);
  };

  // Live timer tick for active tracking - drift-free based on startTime
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (timerStatus?.isTracking) {
      const calculateElapsed = () => {
        if (timerStatus.startTime) {
          const startMs = new Date(timerStatus.startTime).getTime();
          return Math.max(0, Math.floor((Date.now() - startMs) / 1000));
        }
        return timerStatus.elapsedSeconds || 0;
      };

      setElapsed(calculateElapsed());

      const ticker = setInterval(() => {
        setElapsed(calculateElapsed());
      }, 1000);
      return () => clearInterval(ticker);
    } else {
      setElapsed(0);
    }
  }, [timerStatus]);

  const formatPomoTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatDuration = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Format active running timer: mm:ss if under 1h (e.g. 00:04), hh:mm:ss if >= 1h
  const formatActiveTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTimeHM = (isoStr?: string) => {
    if (!isoStr) return "12:00";
    const d = new Date(isoStr);
    const hours = d.getHours().toString().padStart(2, "0");
    const mins = d.getMinutes().toString().padStart(2, "0");
    return `${hours}:${mins}`;
  };

  const formatEntryRange = (entry: TimeEntry) => {
    const startHM = formatTimeHM(entry.startTime);
    let endHM = entry.endTime ? formatTimeHM(entry.endTime) : startHM;
    if (!entry.endTime && entry.startTime && entry.durationSeconds) {
      const endD = new Date(
        new Date(entry.startTime).getTime() + entry.durationSeconds * 1000
      );
      endHM = formatTimeHM(endD.toISOString());
    }
    return `${startHM} - ${endHM}`;
  };

  // Flatten all entries and calculate totals
  const allEntries = dayGroups.flatMap((g) => g.entries);
  const hasEntries = allEntries.length > 0;

  const todayStr = new Date().toISOString().slice(0, 10);
  const totalTodaySeconds = allEntries
    .filter((e) => e.startTime?.slice(0, 10) === todayStr)
    .reduce((sum, e) => sum + (e.durationSeconds || 0), 0);

  const totalWeekSeconds = allEntries.reduce(
    (sum, e) => sum + (e.durationSeconds || 0),
    0
  );

  // Group entries by project + description
  interface EntryGroup {
    key: string;
    projectName: string;
    projectColor?: string;
    description: string;
    isBreak: boolean;
    totalSeconds: number;
    entries: TimeEntry[];
  }

  const groupedCards: EntryGroup[] = [];
  const groupMap = new Map<string, EntryGroup>();

  for (const entry of allEntries) {
    const projName = entry.projectName || "No project";
    const desc = entry.description || "No description";
    const key = `${projName}:::${desc}`;

    if (!groupMap.has(key)) {
      const isBreak =
        desc.trim().toLowerCase() === "break" ||
        (entry.tags && entry.tags.includes("Break"));

      const group: EntryGroup = {
        key,
        projectName: projName,
        projectColor: entry.projectColor,
        description: desc,
        isBreak,
        totalSeconds: 0,
        entries: [],
      };
      groupMap.set(key, group);
      groupedCards.push(group);
    }

    const grp = groupMap.get(key)!;
    grp.totalSeconds += entry.durationSeconds || 0;
    grp.entries.push(entry);
  }

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Speed Dial Action Handlers
  // 1. Break: start break timer immediately matching Requirement 1!
  const handleSelectBreak = () => {
    setIsSpeedDialOpen(false);
    onStartTimer({
      description: "Break",
      projectName: "No project",
      isBillable: true,
      tags: ["Break"],
    });
  };

  // 2. Manual: open New time entry screen matching Requirement 3!
  const handleSelectManual = () => {
    setIsSpeedDialOpen(false);
    if (onOpenManualEntryModal) {
      onOpenManualEntryModal();
    } else {
      onOpenNewEntryModal();
    }
  };

  // 3. Timer: start normal timer matching Requirement 2!
  const handleSelectTimer = () => {
    setIsSpeedDialOpen(false);
    onStartTimer({
      description: "",
      projectName: "No project",
      isBillable: true,
      tags: [],
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0f1216] relative">
      {/* Top Tabs: List and Pomodoro */}
      <div className="flex border-b border-[#1f242c] bg-[#0f1216] shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("list")}
          className={`flex-1 py-3 text-[15px] font-medium text-center transition-all relative ${
            activeTab === "list" ? "text-white" : "text-[#78909c] hover:text-white"
          }`}
        >
          List
          {activeTab === "list" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#00b0ff]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pomodoro")}
          className={`flex-1 py-3 text-[15px] font-medium text-center transition-all relative ${
            activeTab === "pomodoro" ? "text-white" : "text-[#78909c] hover:text-white"
          }`}
        >
          Pomodoro
          {activeTab === "pomodoro" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#00b0ff]" />
          )}
        </button>
      </div>

      {/* ===================== LIST TAB ===================== */}
      {activeTab === "list" && (
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Scrollable list content area */}
          <div className="flex-1 flex flex-col overflow-y-auto relative">
            {/* Info Banner */}
            <InfoBanner bannerKey="clockify_banner_tracker" />

            {/* Empty State */}
            {!hasEntries ? (
              <div className="flex-1 flex flex-col items-center justify-center my-auto py-12 px-6 text-center select-none">
                <div className="w-[88px] h-[88px] rounded-full bg-[#52606d] flex items-center justify-center mb-6 shadow-inner">
                  <svg viewBox="0 0 100 100" className="w-16 h-16 fill-none">
                    <line
                      x1="50"
                      y1="50"
                      x2="50"
                      y2="18"
                      stroke="#000000"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                    <line
                      x1="50"
                      y1="50"
                      x2="68"
                      y2="68"
                      stroke="#000000"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                    <circle cx="50" cy="50" r="4.5" fill="#000000" />
                  </svg>
                </div>

                <h2 className="text-[22px] font-bold text-[#cfd8dc] mb-2 tracking-tight">
                  No time entries yet
                </h2>
                <p className="text-[14px] text-[#78909c] max-w-[260px] leading-relaxed">
                  All your tracked time will show up here.
                </p>
              </div>
            ) : (
              /* Entries List */
              <div className="flex-1 flex flex-col pb-6">
                {/* Header Summary: This week / Submit / Today */}
                <div className="px-4 pt-3.5 pb-2 select-none">
                  {/* Row 1: This week + Submit + total */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[15px] font-normal text-[#eceff1]">
                      This week
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => alert("Timesheet submitted")}
                        className="text-[15px] font-medium text-[#00b0ff] hover:text-[#40c4ff] active:opacity-80 transition-colors"
                      >
                        Submit
                      </button>
                      <span className="text-[15px] font-normal font-mono text-[#eceff1]">
                        {formatDuration(totalWeekSeconds)}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Today + total */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[14px] font-normal text-[#78909c]">
                      Today
                    </span>
                    <span className="text-[14px] font-normal font-mono text-[#78909c]">
                      {formatDuration(totalTodaySeconds)}
                    </span>
                  </div>
                </div>

                {/* Grouped Entry Cards */}
                <div className="space-y-2 mt-1">
                  {groupedCards.map((group) => {
                    const isExpanded =
                      expandedGroups[group.key] !== undefined
                        ? expandedGroups[group.key]
                        : true;

                    const primaryEntry = group.entries[0];

                    return (
                      <div
                        key={group.key}
                        className="mx-4 bg-[#202428] rounded-2xl p-4 select-none transition-colors"
                      >
                        {/* Header Row: Project Name & Group Duration + Options/Chevron */}
                        <div
                          onClick={() => toggleGroup(group.key)}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {group.projectColor &&
                              group.projectName &&
                              group.projectName !== "No project" && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: group.projectColor }}
                                />
                              )}
                            <span className="text-[15px] font-medium text-[#eceff1] truncate">
                              {group.projectName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[15px] font-normal font-mono text-[#eceff1]">
                              {formatDuration(group.totalSeconds)}
                            </span>

                            {/* Three-dot menu directly accessible for single entries */}
                            {group.entries.length === 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEntryForOptions(group.entries[0]);
                                  setIsEntryOptionsOpen(true);
                                }}
                                className="p-1 text-[#90a4ae] hover:text-white transition-colors"
                                title="Entry options"
                              >
                                <MoreHorizontal className="w-5 h-5" />
                              </button>
                            )}

                            {/* Chevron for multi-entry groups */}
                            {group.entries.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleGroup(group.key);
                                }}
                                className="p-1 text-[#90a4ae] hover:text-white transition-colors"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Description Row: "No description" or "Break" */}
                        <div
                          onClick={() => toggleGroup(group.key)}
                          className="mt-1 cursor-pointer"
                        >
                          <p className="text-[14px] text-[#90a4ae] truncate">
                            {group.description}
                          </p>
                        </div>

                        {/* Icons & Play Button Row */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-[#78909c]">
                            {/* Tag icon */}
                            <Tag className="w-4 h-4 text-[#78909c]" />

                            {/* Dollar icon */}
                            <div className="w-4 h-4 rounded-full border border-[#78909c] flex items-center justify-center text-[10px] font-semibold text-[#78909c] leading-none">
                              $
                            </div>

                            {/* Coffee Cup Icon matching Screenshot 3 (if Break) */}
                            {group.isBreak && (
                              <svg
                                viewBox="0 0 24 24"
                                className="w-4 h-4 text-[#78909c] stroke-current fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round"
                              >
                                <path d="M17 8h1a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1" />
                                <path d="M5 8h12v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8z" />
                                <line x1="3" y1="20" x2="19" y2="20" />
                              </svg>
                            )}
                          </div>

                          {/* Play button: Continue/Start timer with this entry's details */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onContinueEntry && primaryEntry) {
                                onContinueEntry(primaryEntry);
                              } else {
                                onStartTimer({
                                  description:
                                    group.description === "No description"
                                      ? ""
                                      : group.description,
                                  projectName: group.projectName,
                                  projectColor: group.projectColor,
                                  isBillable: primaryEntry?.isBillable ?? true,
                                  tags: primaryEntry?.tags || [],
                                });
                              }
                            }}
                            className="p-1 text-[#90a4ae] hover:text-[#00b0ff] active:scale-95 transition-all"
                            title="Continue timer"
                          >
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </button>
                        </div>

                        {/* Expanded Individual Entries for multi-entry groups */}
                        {isExpanded && group.entries.length > 1 && (
                          <div className="mt-3 pt-2 border-t border-[#2d343c] space-y-2.5">
                            {group.entries.map((entry) => (
                              <div
                                key={entry.id}
                                className="flex items-center justify-between text-[14px]"
                              >
                                <span className="text-[#eceff1] font-normal">
                                  {formatEntryRange(entry)}
                                </span>

                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="font-mono text-[#eceff1]">
                                    {formatDuration(entry.durationSeconds)}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedEntryForOptions(entry);
                                      setIsEntryOptionsOpen(true);
                                    }}
                                    className="p-1 -mr-1 text-[#90a4ae] hover:text-white transition-colors"
                                    title="Entry options"
                                  >
                                    <MoreHorizontal className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* ACTIVE TIMER BOTTOM BAR - Attached above bottom navigation! */}
          {/* Guaranteed to be inside the visible viewport and above nav bar */}
          {/* ============================================================ */}
          {timerStatus?.isTracking && (
            <div className="shrink-0 w-full bg-[#1c2024] border-t border-[#2a3038] rounded-t-[20px] px-5 pt-2.5 pb-3 shadow-2xl z-30 animate-slideInUp select-none">
              {/* Drag handle pill */}
              <div className="w-10 h-1 bg-[#47525d] rounded-full mx-auto mb-2" />

              <div className="flex items-center justify-between">
                {/* Left: Description ("Break", etc.) */}
                <span className="text-[17px] font-normal text-white truncate max-w-[190px]">
                  {timerStatus.description || "No description"}
                </span>

                {/* Right: Elapsed Time & Red-Orange Stop Button */}
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[18px] font-bold text-white font-sans tracking-wide">
                    {formatActiveTimer(elapsed)}
                  </span>
                  <button
                    type="button"
                    onClick={onStopTimer}
                    className="w-11 h-11 rounded-full bg-[#f4511e] hover:bg-[#ff5722] active:scale-95 text-white flex items-center justify-center shadow-lg transition-transform"
                    title="Stop Timer"
                  >
                    <Square className="w-3.5 h-3.5 fill-white text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Floating '+' Button & Speed Dial Menu (ONLY on List Tab & when NOT tracking!) */}
          {!timerStatus?.isTracking && (
            <SpeedDialMenu
              isOpen={isSpeedDialOpen}
              onToggle={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
              onClose={() => setIsSpeedDialOpen(false)}
              onSelectBreak={handleSelectBreak}
              onSelectManual={handleSelectManual}
              onSelectTimer={handleSelectTimer}
            />
          )}

          {/* Entry Options Bottom Sheet (Requirement 4) */}
          <EntryOptionsBottomSheet
            isOpen={isEntryOptionsOpen}
            entry={selectedEntryForOptions}
            onClose={() => {
              setIsEntryOptionsOpen(false);
              setSelectedEntryForOptions(null);
            }}
            onContinue={(entry) => {
              if (onContinueEntry) {
                onContinueEntry(entry);
              } else {
                onStartTimer({
                  description: entry.description,
                  projectId: entry.projectId,
                  projectName: entry.projectName,
                  projectColor: entry.projectColor,
                  isBillable: entry.isBillable,
                  tags: entry.tags,
                });
              }
            }}
            onDuplicate={(entry) => {
              onDuplicateEntry?.(entry);
            }}
            onSplit={(entry) => {
              onSplitEntry?.(entry);
            }}
            onDelete={(entry) => {
              onDeleteEntry?.(entry.id);
            }}
          />
        </div>
      )}

      {/* ===================== POMODORO TAB ===================== */}
      {activeTab === "pomodoro" && (
        <div className="flex-1 flex flex-col justify-between pt-6 pb-6 px-4 select-none animate-fadeIn overflow-y-auto relative">
          {/* Top Card */}
          {pomoPhase === "break" ? (
            /* Break Header Card matching Screenshot 3 */
            <div className="w-full bg-[#1c2024] rounded-2xl h-14 flex items-center justify-center px-4">
              <span className="text-[16px] font-normal text-white">Break</span>
            </div>
          ) : (
            /* Focus / Idle Header Card matching Screenshot 0 */
            <div className="w-full bg-[#1c2024] rounded-2xl h-14 flex items-center justify-center px-4">
              <input
                type="text"
                value={focusTask}
                onChange={(e) => setFocusTask(e.target.value)}
                placeholder="What are you focusing on?"
                className="w-full bg-transparent text-center text-[15px] text-white placeholder-[#8c9ba5] outline-none"
              />
            </div>
          )}

          {/* Circular Focus / Break Timer */}
          <div className="my-auto flex flex-col items-center justify-center py-6">
            <div className="relative w-[265px] h-[265px] flex items-center justify-center">
              {/* SVG Progress Ring */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 280 280">
                {pomoPhase === "break" ? (
                  <>
                    {/* Background light-gray track for elapsed time matching Screenshot 3 */}
                    <circle
                      cx="140"
                      cy="140"
                      r="126"
                      stroke="#c8c7cc"
                      strokeWidth="10"
                      fill="none"
                    />
                    {/* Green remaining stroke matching Screenshot 3 */}
                    <circle
                      cx="140"
                      cy="140"
                      r="126"
                      stroke="#689f39"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${
                        2 *
                        Math.PI *
                        126 *
                        (breakSeconds /
                          Math.max(1, (pomoSettingsState.shortBreakMinutes || 5) * 60))
                      } ${2 * Math.PI * 126}`}
                      strokeDashoffset={
                        -2 *
                        Math.PI *
                        126 *
                        (1 -
                          breakSeconds /
                            Math.max(1, (pomoSettingsState.shortBreakMinutes || 5) * 60))
                      }
                      className="transition-all duration-1000 ease-linear"
                    />
                  </>
                ) : pomoPhase === "focus" ? (
                  <>
                    {/* Dark track */}
                    <circle
                      cx="140"
                      cy="140"
                      r="126"
                      stroke="#1c2024"
                      strokeWidth="10"
                      fill="none"
                    />
                    {/* Coral Red ring matching Screenshot 0 */}
                    <circle
                      cx="140"
                      cy="140"
                      r="126"
                      stroke="#ff5448"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 126}
                      strokeDashoffset={
                        2 *
                        Math.PI *
                        126 *
                        (1 -
                          pomoSeconds /
                            Math.max(1, pomoSettingsState.focusMinutes * 60))
                      }
                      className="transition-all duration-1000 ease-linear"
                    />
                  </>
                ) : (
                  <>
                    {/* Idle state - Blue ring */}
                    <circle
                      cx="140"
                      cy="140"
                      r="126"
                      stroke="#1c2024"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="140"
                      cy="140"
                      r="126"
                      stroke="#4fc3f7"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 126}
                      strokeDashoffset={0}
                    />
                  </>
                )}
              </svg>

              {/* Inside Center: Time and Subtitle */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-bold tracking-tight text-white font-sans">
                  {pomoPhase === "break"
                    ? formatPomoTime(breakSeconds)
                    : formatPomoTime(pomoSeconds)}
                </span>
                <span className="text-[16px] text-[#8c9ba5] font-normal mt-2">
                  {pomoPhase === "break"
                    ? "Break"
                    : pomoPhase === "focus"
                    ? "Running..."
                    : "Focus"}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="w-full flex flex-col items-center space-y-4">
            {pomoPhase === "break" ? (
              /* Break Controls matching Screenshot 3 */
              <>
                <button
                  type="button"
                  onClick={handleStopBreakClick}
                  className="w-full h-[52px] bg-[#689f39] hover:bg-[#5f9333] active:scale-[0.99] text-white font-semibold text-[16px] rounded-full shadow-md transition-all flex items-center justify-center"
                >
                  Stop
                </button>

                <button
                  type="button"
                  onClick={handleSkipBreakClick}
                  className="text-[15px] font-medium text-[#ffb3ab] hover:opacity-80 py-1 transition-colors"
                >
                  Skip this break
                </button>
              </>
            ) : pomoPhase === "focus" ? (
              /* Focus Running Controls matching Screenshot 0 */
              <>
                <button
                  type="button"
                  onClick={handleStopFocusClick}
                  className="w-full h-[52px] bg-[#ff5448] hover:bg-[#fa4336] active:scale-[0.99] text-white font-semibold text-[16px] rounded-full shadow-md transition-all flex items-center justify-center"
                >
                  Stop
                </button>

                <button
                  type="button"
                  onClick={handleEndSessionClick}
                  className="text-[15px] font-medium text-[#ffb3ab] hover:opacity-80 py-1 transition-colors"
                >
                  End session
                </button>
              </>
            ) : (
              /* Idle Controls */
              <>
                <button
                  type="button"
                  onClick={handleStartSession}
                  className="w-full h-[52px] bg-[#4fc3f7] hover:bg-[#38bdf8] active:scale-[0.99] text-[#0c2336] font-semibold text-[16px] rounded-full shadow-md transition-all flex items-center justify-center"
                >
                  Start session
                </button>

                <button
                  type="button"
                  onClick={() => setShowPomoSettings(true)}
                  className="text-[15px] font-medium text-[#4fc3f7] hover:text-[#38bdf8] py-1 transition-colors"
                >
                  Pomodoro settings
                </button>
              </>
            )}
          </div>

          {/* Dialog 1: "Finish focus early" Modal matching Screenshot 1 */}
          {showFinishFocusModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center px-6 bg-black/60 select-none animate-fadeIn">
              <div
                className="absolute inset-0"
                onClick={() => setShowFinishFocusModal(false)}
              />
              <div className="relative w-full max-w-[340px] bg-[#252628] rounded-[28px] p-6 shadow-2xl z-10 animate-scaleIn">
                <h3 className="text-[20px] font-semibold text-white tracking-tight">
                  Finish focus early
                </h3>
                <p className="text-[14px] text-[#a6adb4] leading-relaxed mt-3.5">
                  You&apos;ll go to break, and time tracked during focus interval will be saved.
                </p>
                <div className="mt-8 flex items-center justify-end gap-7">
                  <button
                    type="button"
                    onClick={() => setShowFinishFocusModal(false)}
                    className="text-[15px] font-medium text-[#71d2ff] hover:opacity-80 transition-opacity"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmFinishFocus}
                    className="text-[15px] font-medium text-[#71d2ff] hover:opacity-80 transition-opacity"
                  >
                    Finish
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dialog 2: "End session early" Modal matching Screenshot 2 */}
          {showEndSessionModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center px-6 bg-black/60 select-none animate-fadeIn">
              <div
                className="absolute inset-0"
                onClick={() => setShowEndSessionModal(false)}
              />
              <div className="relative w-full max-w-[340px] bg-[#252628] rounded-[28px] p-6 shadow-2xl z-10 animate-scaleIn">
                <h3 className="text-[20px] font-semibold text-white tracking-tight">
                  End session early
                </h3>
                <p className="text-[14px] text-[#a6adb4] leading-relaxed mt-3.5">
                  You&apos;ll be able to start a new session and time tracked during this session will be saved.
                </p>
                <div className="mt-8 flex items-center justify-end gap-7">
                  <button
                    type="button"
                    onClick={() => setShowEndSessionModal(false)}
                    className="text-[15px] font-medium text-[#71d2ff] hover:opacity-80 transition-opacity"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmEndSession}
                    className="text-[15px] font-medium text-[#71d2ff] hover:opacity-80 transition-opacity"
                  >
                    End session
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dialog 3: "Finish break early" Modal matching WhatsApp Image 2026-09-06 at 8.49.15 PM (1).jpeg */}
          {showFinishBreakModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center px-6 bg-black/60 select-none animate-fadeIn">
              <div
                className="absolute inset-0"
                onClick={() => setShowFinishBreakModal(false)}
              />
              <div className="relative w-full max-w-[340px] bg-[#252628] rounded-[28px] p-6 shadow-2xl z-10 animate-scaleIn">
                <h3 className="text-[20px] font-semibold text-white tracking-tight">
                  Finish break early
                </h3>
                <p className="text-[14px] text-[#a6adb4] leading-relaxed mt-3.5">
                  Time tracked during this break interval will be saved.
                </p>
                <div className="mt-8 flex items-center justify-end gap-7">
                  <button
                    type="button"
                    onClick={() => setShowFinishBreakModal(false)}
                    className="text-[15px] font-medium text-[#71d2ff] hover:opacity-80 transition-opacity"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmFinishBreak}
                    className="text-[15px] font-medium text-[#71d2ff] hover:opacity-80 transition-opacity"
                  >
                    Finish
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dialog 4: "Skip break" Modal matching WhatsApp Image 2026-09-06 at 8.49.15 PM.jpeg */}
          {showSkipBreakModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center px-6 bg-black/60 select-none animate-fadeIn">
              <div
                className="absolute inset-0"
                onClick={() => setShowSkipBreakModal(false)}
              />
              <div className="relative w-full max-w-[340px] bg-[#252628] rounded-[28px] p-6 shadow-2xl z-10 animate-scaleIn">
                <h3 className="text-[20px] font-semibold text-white tracking-tight">
                  Skip break
                </h3>
                <p className="text-[14px] text-[#a6adb4] leading-relaxed mt-3.5">
                  Time tracked during this break interval will not be saved.
                </p>
                <div className="mt-8 flex items-center justify-end gap-7">
                  <button
                    type="button"
                    onClick={() => setShowSkipBreakModal(false)}
                    className="text-[15px] font-medium text-[#71d2ff] hover:opacity-80 transition-opacity"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSkipBreak}
                    className="text-[15px] font-medium text-[#71d2ff] hover:opacity-80 transition-opacity"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dedicated Pomodoro Settings Screen matching Image 3 */}
          <PomodoroSettingsScreen
            isOpen={showPomoSettings}
            onClose={() => setShowPomoSettings(false)}
            settings={pomoSettingsState}
            onSaveSettings={(newSettings) => {
              setPomoSettingsState(newSettings);
              if (pomoPhase === "idle") {
                setPomoSeconds((newSettings.focusMinutes || 25) * 60);
              }
              onSavePomodoroSettings?.(newSettings);
            }}
            projects={projects}
            onOpenProjectModal={onOpenProjectModal}
            onUpdateProject={onUpdateProject}
            onUpdateTask={onUpdateTask}
            onCreateTask={onCreateTask}
          />
        </div>
      )}
    </div>
  );
};
