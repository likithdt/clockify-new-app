import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Check, Square } from "lucide-react";
import { SpeedDialMenu } from "../components/SpeedDialMenu";
import { EntryOptionsBottomSheet } from "../components/modals/EntryOptionsBottomSheet";
import { EditEntryDetailsModal } from "../components/modals/EditEntryDetailsModal";
import { DatePickerModal } from "../components/modals/DatePickerModal";
import type { DayGroup, Project, Tag, TimerStatus, TimeEntry } from "../backend/types";

interface CalendarScreenProps {
  dayGroups: DayGroup[];
  projects: Project[];
  tags?: Tag[];
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
  onOpenNewEntryModal: (initialDurationSeconds?: number) => void;
  onContinueEntry?: (entry: TimeEntry) => void;
  onDuplicateEntry?: (entry: TimeEntry) => void;
  onSplitEntry?: (entry: TimeEntry) => void;
  onDeleteEntry?: (id: string) => void;
  onUpdateEntry?: (entry: TimeEntry) => void;
  isCalendarMenuOpen?: boolean;
  onCloseCalendarMenu?: () => void;
}

interface WeekDay {
  dayLetter: string;
  dayNumber: number;
  dateKey: string; // YYYY-MM-DD
  isCurrentMonth: boolean;
}

interface ScheduledAssignment {
  id: string;
  projectName: string;
  projectColor: string;
  title: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  dateKey: string;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  dayGroups,
  projects,
  tags = [],
  timerStatus,
  onStartTimer,
  onStopTimer,
  onOpenNewEntryModal,
  onContinueEntry,
  onDuplicateEntry,
  onSplitEntry,
  onDeleteEntry,
  onUpdateEntry,
  isCalendarMenuOpen = false,
  onCloseCalendarMenu = () => {},
}) => {
  // Matching Screenshot 3: Mon, Sep 7, 2026
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date(2026, 8, 7));

  // Speed Dial & Timer states
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

  // Manual Duration Popup State
  const [showDurationPopup, setShowDurationPopup] = useState(false);
  const [popupHours, setPopupHours] = useState("");
  const [popupMinutes, setPopupMinutes] = useState("00");
  const [activeDurationField, setActiveDurationField] = useState<"hours" | "minutes">("hours");

  // "Show in calendar" Bottom Sheet State
  const [showInCalendarSheet, setShowInCalendarSheet] = useState(false);
  const [showScheduledAssignments, setShowScheduledAssignments] = useState(true);

  // Date Picker Modal state (opened when clicking Mon, Sep 7)
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);

  // Toast Snackbar message (e.g. "Time entry successfully created.")
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Time Entry options & edit modals
  const [selectedEntryForOptions, setSelectedEntryForOptions] = useState<TimeEntry | null>(null);
  const [editingEntryDetails, setEditingEntryDetails] = useState<TimeEntry | null>(null);

  // Long press handling
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const handleEntryPointerDown = (entry: TimeEntry) => {
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setEditingEntryDetails(entry);
    }, 500);
  };

  const handleEntryPointerUp = (entry: TimeEntry) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (!isLongPressRef.current) {
      setSelectedEntryForOptions(entry);
    }
  };

  const handleEntryPointerCancel = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleStopWithToast = () => {
    onStopTimer();
    setToastMessage("Time entry successfully created.");
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Live timer tick for active tracking
  const [elapsed, setElapsed] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

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

  // Initial scroll to afternoon (around hour 15:00 as seen in screenshots)
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollTop = 920;
    }
  }, []);

  // Compute dynamic week days around selectedDate (Monday to Sunday)
  const getWeekDays = (baseDate: Date): WeekDay[] => {
    const d = new Date(baseDate);
    const day = d.getDay(); // 0 is Sun, 1 is Mon...
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMonday);

    const days: WeekDay[] = [];
    const letters = ["M", "T", "W", "T", "F", "S", "S"];
    for (let i = 0; i < 7; i++) {
      const current = new Date(monday);
      current.setDate(monday.getDate() + i);
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, "0");
      const dt = String(current.getDate()).padStart(2, "0");
      days.push({
        dayLetter: letters[i],
        dayNumber: current.getDate(),
        dateKey: `${y}-${m}-${dt}`,
        isCurrentMonth: current.getMonth() === baseDate.getMonth(),
      });
    }
    return days;
  };

  const weekDays = getWeekDays(selectedDate);
  const selectedDateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

  const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "short" });
  const monthName = selectedDate.toLocaleDateString("en-US", { month: "short" });
  const subheaderDateStr = `${dayName}, ${monthName} ${selectedDate.getDate()}`;

  const handleSelectDay = (wd: WeekDay) => {
    const [y, m, d] = wd.dateKey.split("-").map(Number);
    setSelectedDate(new Date(y, m - 1, d));
  };

  // Filter entries for the selected day
  const allEntries = dayGroups.flatMap((g) => g.entries);
  const dayEntries = allEntries.filter((e) =>
    e.startTime?.startsWith(selectedDateKey)
  );
  const totalDaySeconds = dayEntries.reduce(
    (sum, e) => sum + (e.durationSeconds || 0),
    0
  );

  const formatDuration = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatActiveTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Scheduled assignments data (shown when "Scheduled assignments" is checked)
  const scheduledAssignments: ScheduledAssignment[] = [
    {
      id: "sched-1",
      dateKey: "2026-09-06",
      title: "Sprint Planning",
      projectName: "Mobile App",
      projectColor: "#00b0ff",
      startHour: 10,
      startMinute: 0,
      endHour: 12,
      endMinute: 0,
    },
    {
      id: "sched-2",
      dateKey: "2026-09-06",
      title: "Feature Implementation",
      projectName: "Frontend Dev",
      projectColor: "#4caf50",
      startHour: 14,
      startMinute: 0,
      endHour: 16,
      endMinute: 30,
    },
    {
      id: "sched-3",
      dateKey: "2026-09-05",
      title: "Client Consultation",
      projectName: "Clockify App",
      projectColor: "#ff9800",
      startHour: 11,
      startMinute: 0,
      endHour: 13,
      endMinute: 0,
    },
  ];

  const currentDayAssignments = scheduledAssignments.filter(
    (a) => a.dateKey === selectedDateKey
  );

  // 24 hours grid
  const hours = Array.from({ length: 24 }, (_, i) => {
    return `${i.toString().padStart(2, "0")}:00`;
  });

  // Current time line
  const now = new Date();
  const currentHourDecimal = now.getHours() + now.getMinutes() / 60;
  const currentLineTop = currentHourDecimal * 64;

  // Speed Dial Handlers
  const handleSelectBreak = () => {
    setIsSpeedDialOpen(false);
    onStartTimer({
      description: "Break",
      projectName: "No project",
      isBillable: true,
      tags: ["Break"],
    });
  };

  const handleSelectTimer = () => {
    setIsSpeedDialOpen(false);
    onStartTimer({
      description: "",
      projectName: "No project",
      isBillable: true,
      tags: [],
    });
  };

  const handleSelectManual = () => {
    setIsSpeedDialOpen(false);
    setPopupHours("");
    setPopupMinutes("00");
    setActiveDurationField("hours");
    setShowDurationPopup(true);
  };

  const handleConfirmDuration = () => {
    const h = parseInt(popupHours, 10) || 0;
    const m = parseInt(popupMinutes, 10) || 0;
    const totalSecs = h * 3600 + m * 60;
    setShowDurationPopup(false);
    onOpenNewEntryModal(totalSecs);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white relative select-none font-sans text-gray-900">
      {/* Three-Dot Menu Popup matching Screenshot 1 in Light Theme */}
      {isCalendarMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={onCloseCalendarMenu}
          />
          <div className="absolute top-2 right-3 z-50 w-[210px] bg-white rounded-2xl py-2 shadow-2xl border border-gray-200 animate-scaleIn select-none">
            {/* Option 1: Show in calendar */}
            <button
              type="button"
              onClick={() => {
                onCloseCalendarMenu();
                setShowInCalendarSheet(true);
              }}
              className="w-full flex items-center gap-3.5 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-gray-500 stroke-current fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round shrink-0"
              >
                <path d="M8 2v4M16 2v4" />
                <path d="M4 8h16" />
                <path d="M4 4h16c1.1 0 2 .9 2 2v6" />
                <path d="M4 4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8" />
                <path d="M21 17a4 4 0 1 1-4-4v2" />
                <path d="M19 13l-2 2-2-2" />
              </svg>
              <span className="text-[15px] text-gray-900 font-normal">
                Show in calendar
              </span>
            </button>

            {/* Option 2: Calendar sync */}
            <button
              type="button"
              onClick={() => {
                onCloseCalendarMenu();
              }}
              className="w-full flex items-center gap-3.5 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-gray-500 stroke-current fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round shrink-0"
              >
                <rect x="3" y="4" width="18" height="16" rx="3" />
                <path d="M3 9h18" />
                <circle cx="12" cy="14.5" r="1.5" />
                <path d="M7.5 14.5s2-3 4.5-3 4.5 3 4.5 3-2 3-4.5 3-4.5-3-4.5-3z" />
              </svg>
              <span className="text-[15px] text-gray-900 font-normal">
                Calendar sync
              </span>
            </button>
          </div>
        </>
      )}

      {/* Subheader: clicking date/day (e.g. Mon, Sep 7) opens DatePickerModal */}
      <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
        <div
          onClick={() => setShowDatePickerModal(true)}
          className="cursor-pointer group select-none"
          title="Click to choose date"
        >
          <p className="text-xs text-gray-500 font-medium group-hover:text-[#00b0ff] transition-colors">
            {subheaderDateStr}
          </p>
          <p className="text-sm font-bold text-gray-900 font-mono tracking-tight">
            Total: {formatDuration(totalDaySeconds)}
          </p>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
          <button
            type="button"
            onClick={() =>
              setSelectedDate(
                (prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1)
              )
            }
            className="p-1 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              setSelectedDate(
                (prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1)
              )
            }
            className="p-1 hover:text-gray-900 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday Row matching Screenshot 3 in Light Theme */}
      <div className="flex items-center justify-around py-3 px-2 border-b border-gray-200 bg-white shrink-0">
        {weekDays.map((wd) => {
          const isSelected = wd.dateKey === selectedDateKey;
          return (
            <button
              key={wd.dateKey}
              type="button"
              onClick={() => handleSelectDay(wd)}
              className="flex flex-col items-center gap-1.5 focus:outline-none"
            >
              <span className="text-[11px] font-medium text-gray-500 uppercase">
                {wd.dayLetter}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  isSelected
                    ? "bg-[#00b0ff] text-white shadow-sm font-bold"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                {wd.dayNumber}
              </div>
            </button>
          );
        })}
      </div>

      {/* Timeline Grid in Light Theme */}
      <div ref={timelineRef} className="flex-1 overflow-y-auto relative bg-white">
        <div className="relative" style={{ height: `${24 * 64}px` }}>
          {/* Hour grid lines */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="relative flex items-center h-16 border-b border-gray-100"
            >
              {/* Hour label */}
              <div className="w-16 pl-4 text-xs font-mono text-gray-400 shrink-0">
                {hour}
              </div>

              {/* Grid area with center column line */}
              <div className="flex-1 h-full border-l border-gray-100 relative">
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-50" />
              </div>
            </div>
          ))}

          {/* Current Time Indicator Line with circle handle */}
          <div
            className="absolute left-14 right-0 flex items-center pointer-events-none z-20"
            style={{ top: `${currentLineTop}px` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#00b0ff] shadow -ml-1 shrink-0" />
            <div className="flex-1 h-[1.5px] bg-[#00b0ff]/80" />
          </div>

          {/* Left Column: Tracked Time Entries in Light Theme with Click and Long-Press */}
          {dayEntries.map((entry) => {
            const entryDate = new Date(entry.startTime);
            const startHour = entryDate.getHours();
            const startMin = entryDate.getMinutes();
            const topPx = (startHour + startMin / 60) * 64;
            const durationSec = entry.durationSeconds || 60;
            const heightPx = Math.max(38, (durationSec / 3600) * 64);

            return (
              <div
                key={entry.id}
                style={{
                  top: `${topPx}px`,
                  height: `${heightPx}px`,
                  left: "68px",
                  width: "calc(50% - 38px)",
                }}
                onPointerDown={() => handleEntryPointerDown(entry)}
                onPointerUp={() => handleEntryPointerUp(entry)}
                onPointerLeave={handleEntryPointerCancel}
                onPointerCancel={handleEntryPointerCancel}
                className="absolute z-10 bg-white rounded-2xl px-3 py-2 flex items-center justify-between shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 active:scale-[0.99] transition-all select-none"
                title={`${entry.description || "Entry"} - ${formatDuration(entry.durationSeconds)}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-1.5 h-4 rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        entry.description?.toLowerCase() === "break"
                          ? "#9ca3af"
                          : entry.projectColor || "#00b0ff",
                    }}
                  />
                  <span className="text-[13px] font-medium text-gray-900 truncate">
                    {entry.description || entry.projectName || "No description"}
                  </span>
                </div>
                <span className="text-[12px] font-mono text-gray-500 shrink-0 ml-2">
                  {formatDuration(entry.durationSeconds)}
                </span>
              </div>
            );
          })}

          {/* Right Column: Scheduled Assignments in Light Theme */}
          {showScheduledAssignments &&
            currentDayAssignments.map((assignment) => {
              const topPx =
                (assignment.startHour + assignment.startMinute / 60) * 64;
              const durationHours =
                assignment.endHour +
                assignment.endMinute / 60 -
                (assignment.startHour + assignment.startMinute / 60);
              const heightPx = Math.max(48, durationHours * 64);

              return (
                <div
                  key={assignment.id}
                  style={{
                    top: `${topPx}px`,
                    height: `${heightPx}px`,
                    left: "calc(50% + 36px)",
                    right: "12px",
                    borderLeftColor: assignment.projectColor,
                  }}
                  className="absolute z-10 bg-sky-50/90 rounded-xl p-2.5 flex flex-col justify-between border-l-[3.5px] shadow-sm cursor-pointer hover:bg-sky-100/90 transition-colors select-none"
                >
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-gray-900 truncate">
                      {assignment.title}
                    </div>
                    <div className="text-[11px] text-gray-600 truncate">
                      {assignment.projectName}
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-[#00b0ff]">
                    {assignment.startHour.toString().padStart(2, "0")}:
                    {assignment.startMinute.toString().padStart(2, "0")} -{" "}
                    {assignment.endHour.toString().padStart(2, "0")}:
                    {assignment.endMinute.toString().padStart(2, "0")}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* ACTIVE TIMER BOTTOM BAR - Light Theme */}
      {/* ============================================================ */}
      {timerStatus?.isTracking && (
        <div className="shrink-0 w-full bg-white border-t border-gray-200 rounded-t-[20px] px-5 pt-2.5 pb-3 shadow-2xl z-30 animate-slideInUp select-none">
          {/* Drag handle pill */}
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-2" />

          <div className="flex items-center justify-between">
            {/* Left: Description */}
            <span className="text-[17px] font-normal text-gray-900 truncate max-w-[190px]">
              {timerStatus.description || "No description"}
            </span>

            {/* Right: Elapsed Time & Red-Orange Stop Button */}
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-[18px] font-bold text-gray-900 font-sans tracking-wide">
                {formatActiveTimer(elapsed)}
              </span>
              <button
                type="button"
                onClick={handleStopWithToast}
                className="w-11 h-11 rounded-full bg-[#f4511e] hover:bg-[#ff5722] active:scale-95 text-white flex items-center justify-center shadow-lg transition-transform"
                title="Stop Timer"
              >
                <Square className="w-3.5 h-3.5 fill-white text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification matching Screenshot 3: "Time entry successfully created." */}
      {toastMessage && (
        <div className="absolute bottom-6 left-4 right-4 z-50 bg-[#323232] text-white text-[14px] px-4 py-3 rounded-lg shadow-xl flex items-center justify-between animate-fadeIn select-none">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Speed Dial Menu (+ Button) */}
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

      {/* ============================================================ */}
      {/* MANUAL DURATION POPUP - Light Theme */}
      {/* ============================================================ */}
      {showDurationPopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 select-none">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[0.5px] animate-fadeIn"
            onClick={() => setShowDurationPopup(false)}
          />

          <div className="relative w-full max-w-[320px] bg-white rounded-3xl p-6 shadow-2xl z-10 animate-scaleIn border border-gray-200">
            <h3 className="text-[16px] font-semibold text-gray-900 mb-6">
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
                      ? "bg-gray-50 border-2 border-[#00b0ff]"
                      : "bg-gray-100 border-2 border-transparent"
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
                    className="w-full h-full bg-transparent text-center text-3xl font-normal text-gray-900 outline-none"
                  />
                </div>
                <div className="text-xs text-gray-500 text-left mt-1.5 ml-1 font-medium">
                  Hours
                </div>
              </div>

              {/* Colon */}
              <span className="text-gray-900 text-3xl font-bold -mt-5">:</span>

              {/* Minutes Box */}
              <div>
                <div
                  onClick={() => setActiveDurationField("minutes")}
                  className={`w-[100px] h-[76px] rounded-xl flex items-center justify-center transition-colors ${
                    activeDurationField === "minutes"
                      ? "bg-gray-50 border-2 border-[#00b0ff]"
                      : "bg-gray-100 border-2 border-transparent"
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
                    className="w-full h-full bg-transparent text-center text-3xl font-normal text-gray-900 outline-none"
                  />
                </div>
                <div className="text-xs text-gray-500 text-left mt-1.5 ml-1 font-medium">
                  Minutes
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-6">
              <button
                type="button"
                onClick={() => setShowDurationPopup(false)}
                className="text-[15px] font-medium text-[#00b0ff] hover:text-[#0288d1] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDuration}
                className="text-[15px] font-medium text-[#00b0ff] hover:text-[#0288d1] transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* "SHOW IN CALENDAR" BOTTOM SHEET - Light Theme */}
      {/* ============================================================ */}
      {showInCalendarSheet && (
        <div className="absolute inset-0 z-50 flex items-end justify-center select-none">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[0.5px] animate-fadeIn"
            onClick={() => setShowInCalendarSheet(false)}
          />
          <div className="relative w-full max-w-[430px] bg-white rounded-t-[28px] p-5 pb-7 shadow-2xl z-10 animate-slideInUp border-t border-gray-200">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />

            <h3 className="text-[20px] font-medium text-gray-900 mb-6">
              Show in calendar
            </h3>

            <div
              onClick={() =>
                setShowScheduledAssignments(!showScheduledAssignments)
              }
              className="flex items-center gap-3.5 cursor-pointer py-2 hover:opacity-90"
            >
              <div
                className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                  showScheduledAssignments
                    ? "bg-[#00b0ff]"
                    : "border border-gray-400 bg-transparent"
                }`}
              >
                {showScheduledAssignments && (
                  <Check className="w-4 h-4 stroke-[3] text-white" />
                )}
              </div>
              <span className="text-[16px] text-gray-900 font-normal">
                Scheduled assignments
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DATE PICKER MODAL (Month Grid, 3-Col Years 2026-2055, Manual dd/MM/yyyy) */}
      {/* ============================================================ */}
      {showDatePickerModal && (
        <DatePickerModal
          isOpen={showDatePickerModal}
          initialDate={selectedDate}
          onClose={() => setShowDatePickerModal(false)}
          onConfirm={(newDate) => {
            setSelectedDate(newDate);
            setShowDatePickerModal(false);
          }}
        />
      )}

      {/* ============================================================ */}
      {/* ENTRY OPTIONS BOTTOM SHEET (Screenshot 7: Continue, Duplicate, Edit, Split, Delete) */}
      {/* ============================================================ */}
      {selectedEntryForOptions && (
        <EntryOptionsBottomSheet
          isOpen={!!selectedEntryForOptions}
          entry={selectedEntryForOptions}
          onClose={() => setSelectedEntryForOptions(null)}
          onContinue={() => {
            const entry = selectedEntryForOptions;
            setSelectedEntryForOptions(null);
            onContinueEntry?.(entry);
          }}
          onDuplicate={() => {
            const entry = selectedEntryForOptions;
            setSelectedEntryForOptions(null);
            onDuplicateEntry?.(entry);
          }}
          onEdit={() => {
            const entry = selectedEntryForOptions;
            setSelectedEntryForOptions(null);
            setEditingEntryDetails(entry);
          }}
          onSplit={() => {
            const entry = selectedEntryForOptions;
            setSelectedEntryForOptions(null);
            onSplitEntry?.(entry);
          }}
          onDelete={() => {
            const entry = selectedEntryForOptions;
            setSelectedEntryForOptions(null);
            onDeleteEntry?.(entry.id);
            setToastMessage("Time entry deleted.");
            setTimeout(() => setToastMessage(null), 3500);
          }}
        />
      )}

      {/* ============================================================ */}
      {/* EDIT ENTRY DETAILS MODAL (Screenshot 8) */}
      {/* ============================================================ */}
      {editingEntryDetails && (
        <EditEntryDetailsModal
          isOpen={!!editingEntryDetails}
          entry={editingEntryDetails}
          projects={projects}
          tags={tags}
          onClose={() => setEditingEntryDetails(null)}
          onSave={(updated) => {
            setEditingEntryDetails(null);
            onUpdateEntry?.(updated);
            setToastMessage("Time entry successfully updated.");
            setTimeout(() => setToastMessage(null), 3500);
          }}
          onDelete={(id: string) => {
            setEditingEntryDetails(null);
            onDeleteEntry?.(id);
            setToastMessage("Time entry deleted.");
            setTimeout(() => setToastMessage(null), 3500);
          }}
        />
      )}
    </div>
  );
};

