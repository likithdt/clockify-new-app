import React, { useState } from "react";
import type { ReminderSettings } from "../../backend/types.ts";
import { Switch } from "../ui/Switch.tsx";
import { Clock, Calendar, Bell, X } from "lucide-react";

interface ReminderModalProps {
  isOpen: boolean;
  settings: ReminderSettings;
  onSave: (settings: ReminderSettings) => void;
  onClose: () => void;
}

const DAYS_OF_WEEK = [
  { id: 1, label: "M" },
  { id: 2, label: "T" },
  { id: 3, label: "W" },
  { id: 4, label: "T" },
  { id: 5, label: "F" },
  { id: 6, label: "S" },
  { id: 7, label: "S" },
];

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  settings,
  onSave,
  onClose,
}) => {
  const [enabled, setEnabled] = useState(settings.enabled);
  const [startTime, setStartTime] = useState(settings.startTime || "09:00");
  const [endTime, setEndTime] = useState(settings.endTime || "17:00");
  const [workDays, setWorkDays] = useState<number[]>(settings.workDays || [1, 2, 3, 4, 5]);
  const [intervalMinutes, setIntervalMinutes] = useState(settings.intervalMinutes || 120);

  if (!isOpen) return null;

  const toggleDay = (dayId: number) => {
    if (workDays.includes(dayId)) {
      if (workDays.length > 1) {
        setWorkDays(workDays.filter((d) => d !== dayId));
      }
    } else {
      setWorkDays([...workDays, dayId].sort((a, b) => a - b));
    }
  };

  const handleSave = () => {
    onSave({
      enabled,
      startTime,
      endTime,
      workDays,
      intervalMinutes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-sm bg-[#1a1f26] border border-[#2b3340] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2b3340]">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-[#03a9f4]" />
            <h3 className="text-base font-semibold text-white">Remind to track time</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8b98a5] hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Main switch */}
          <div className="flex items-center justify-between bg-[#121517] p-3.5 rounded-xl border border-[#262e38]">
            <div>
              <div className="text-sm font-medium text-white">Enable reminders</div>
              <div className="text-xs text-[#8c9ba8]">Notify on workday start and end</div>
            </div>
            <Switch checked={enabled} onChange={setEnabled} />
          </div>

          {/* Time pickers */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8c9ba8]">
              Reminder Schedule
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#121517] p-3 rounded-xl border border-[#262e38]">
                <div className="flex items-center gap-1.5 text-xs text-[#8c9ba8] mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#03a9f4]" />
                  <span>Start reminder</span>
                </div>
                <input
                  type="time"
                  disabled={!enabled}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-transparent text-white font-medium text-base outline-none disabled:opacity-40"
                />
              </div>

              <div className="bg-[#121517] p-3 rounded-xl border border-[#262e38]">
                <div className="flex items-center gap-1.5 text-xs text-[#8c9ba8] mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#03a9f4]" />
                  <span>End reminder</span>
                </div>
                <input
                  type="time"
                  disabled={!enabled}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-transparent text-white font-medium text-base outline-none disabled:opacity-40"
                />
              </div>
            </div>
          </div>

          {/* Days of week */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8c9ba8]">
              <Calendar className="w-3.5 h-3.5 text-[#03a9f4]" />
              <span>Remind on days</span>
            </div>

            <div className="flex items-center justify-between gap-1">
              {DAYS_OF_WEEK.map((day) => {
                const active = workDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    disabled={!enabled}
                    onClick={() => toggleDay(day.id)}
                    className={`w-9 h-9 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                      active
                        ? "bg-[#03a9f4] text-white shadow-md shadow-[#03a9f4]/20"
                        : "bg-[#121517] text-[#8c9ba8] border border-[#262e38]"
                    } ${!enabled ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Periodic reminder interval */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8c9ba8]">
              Periodic Inactivity Check
            </label>
            <select
              disabled={!enabled}
              value={intervalMinutes}
              onChange={(e) => setIntervalMinutes(Number(e.target.value))}
              className="w-full bg-[#121517] border border-[#262e38] text-sm text-white rounded-xl px-3 py-2.5 outline-none focus:border-[#03a9f4] disabled:opacity-40"
            >
              <option value={30}>Every 30 minutes</option>
              <option value={60}>Every 1 hour</option>
              <option value={120}>Every 2 hours</option>
              <option value={240}>Every 4 hours</option>
            </select>
          </div>
        </div>

        <div className="px-5 py-3 bg-[#161a20] border-t border-[#262e3a] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm font-medium text-[#8c9ba8] hover:text-white px-3 py-1.5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="text-sm font-medium bg-[#03a9f4] hover:bg-[#0288d1] text-white px-4 py-1.5 rounded-xl shadow transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
