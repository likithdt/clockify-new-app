import React, { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import type { DayGroup, Project, Tag, TimerStatus } from "../backend/types";

export interface CalendarScreenProps {
  dayGroups: DayGroup[];
  projects: Project[];
  tags: Tag[];
  timerStatus: TimerStatus | null;
  onStartTimer: (data: any) => void;
  onStopTimer: () => void;
  onOpenNewEntryModal: (durationSec?: number) => void;
  isCalendarMenuOpen?: boolean;
  onCloseCalendarMenu?: () => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  dayGroups,
  onOpenNewEntryModal,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#0f1216] text-white p-4 space-y-4">
      {/* Date Header */}
      <div className="flex items-center justify-between bg-[#1a1f26] border border-[#27303c] rounded-2xl p-3">
        <button
          type="button"
          onClick={() => {
            const d = new Date(currentDate);
            d.setDate(d.getDate() - 1);
            setCurrentDate(d);
          }}
          className="p-1 text-[#8c9ba5] hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold">{formattedDate}</span>
        <button
          type="button"
          onClick={() => {
            const d = new Date(currentDate);
            d.setDate(d.getDate() + 1);
            setCurrentDate(d);
          }}
          className="p-1 text-[#8c9ba5] hover:text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Schedule / Time Entries for Day */}
      <div className="space-y-3">
        {dayGroups.length === 0 ? (
          <div className="text-center py-12 text-[#8c9ba5] space-y-3">
            <Clock className="w-10 h-10 mx-auto text-[#4a5568]" />
            <p className="text-sm">No scheduled events or entries</p>
            <button
              type="button"
              onClick={() => onOpenNewEntryModal(3600)}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#00b0ff] text-white text-xs font-semibold hover:bg-[#009ee6]"
            >
              <Plus className="w-4 h-4" /> Add Time Entry
            </button>
          </div>
        ) : (
          dayGroups.map((group) => {
            const h = Math.floor(group.totalSeconds / 3600);
            const m = Math.floor((group.totalSeconds % 3600) / 60);
            return (
              <div key={group.date} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#8c9ba5] px-1">
                  <span>{group.fullDateLabel || group.dayLabel}</span>
                  <span>{h}h {m}m</span>
                </div>
                <div className="bg-[#1a1f26] border border-[#27303c] rounded-2xl divide-y divide-[#242b36] overflow-hidden">
                  {group.entries.map((entry) => (
                    <div key={entry.id} className="p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{entry.description || "(No description)"}</p>
                        <p className="text-xs text-[#8c9ba5] flex items-center gap-1 mt-0.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.projectColor }} />
                          {entry.projectName}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-[#00b0ff] font-semibold">
                        {Math.floor(entry.durationSeconds / 3600)}h {Math.floor((entry.durationSeconds % 3600) / 60)}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
