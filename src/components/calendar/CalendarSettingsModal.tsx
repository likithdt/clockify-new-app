import React, { useState, useEffect } from 'react';
import { X, Settings } from 'lucide-react';
import { useCalendarStore } from '@/stores/useCalendarStore';
import type { CalendarSettings } from '@/types/calendar';

export const CalendarSettingsModal: React.FC = () => {
  const { isSettingsModalOpen, closeSettingsModal, settings, updateSettings } = useCalendarStore();

  const [formSettings, setFormSettings] = useState<CalendarSettings>(settings);

  useEffect(() => {
    setFormSettings(settings);
  }, [settings, isSettingsModalOpen]);

  if (!isSettingsModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formSettings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-600" />
            <h3 className="font-semibold text-sm text-slate-800">Calendar Settings</h3>
          </div>
          <button
            onClick={closeSettingsModal}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Week Start Day */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Week Start Day
            </label>
            <select
              value={formSettings.week_start}
              onChange={(e) =>
                setFormSettings({
                  ...formSettings,
                  week_start: e.target.value as 'monday' | 'sunday',
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-hidden focus:border-[#03a9f4] bg-white text-slate-800"
            >
              <option value="monday">Monday (Default)</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>

          {/* Time Format */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Time Format
            </label>
            <select
              value={formSettings.time_format}
              onChange={(e) =>
                setFormSettings({
                  ...formSettings,
                  time_format: e.target.value as '24h' | '12h',
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-hidden focus:border-[#03a9f4] bg-white text-slate-800"
            >
              <option value="24h">24-hour (18:00)</option>
              <option value="12h">12-hour (6:00 PM)</option>
            </select>
          </div>

          {/* Default Duration */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Default Entry Duration
            </label>
            <select
              value={formSettings.default_duration}
              onChange={(e) =>
                setFormSettings({
                  ...formSettings,
                  default_duration: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-hidden focus:border-[#03a9f4] bg-white text-slate-800"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes (Standard)</option>
              <option value={60}>1 hour</option>
            </select>
          </div>

          {/* Working Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Working Hours Start
              </label>
              <input
                type="time"
                value={formSettings.working_hours_start}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    working_hours_start: e.target.value,
                  })
                }
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-hidden focus:border-[#03a9f4]"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Working Hours End
              </label>
              <input
                type="time"
                value={formSettings.working_hours_end}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    working_hours_end: e.target.value,
                  })
                }
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-hidden focus:border-[#03a9f4]"
              />
            </div>
          </div>

          {/* Show Weekends */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="show_weekends"
              checked={formSettings.show_weekends}
              onChange={(e) =>
                setFormSettings({
                  ...formSettings,
                  show_weekends: e.target.checked,
                })
              }
              className="rounded text-[#03a9f4] focus:ring-[#03a9f4] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="show_weekends" className="text-slate-700 font-medium cursor-pointer">
              Show weekends (Saturday & Sunday)
            </label>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeSettingsModal}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded font-semibold shadow-xs transition-colors"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
