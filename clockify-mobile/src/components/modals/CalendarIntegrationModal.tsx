import React, { useState } from "react";
import type { CalendarSettings } from "../../backend/types.ts";
import { Switch } from "../ui/Switch.tsx";
import { Calendar as CalendarIcon, CheckCircle2, X } from "lucide-react";

interface CalendarIntegrationModalProps {
  isOpen: boolean;
  settings: CalendarSettings;
  onSave: (settings: CalendarSettings) => void;
  onClose: () => void;
}

const AVAILABLE_CALENDARS = [
  { id: "cal-google", name: "Google Calendar (work@clockify.me)" },
  { id: "cal-outlook", name: "Microsoft Outlook Calendar" },
  { id: "cal-apple", name: "Device / Local Calendar" },
];

export const CalendarIntegrationModal: React.FC<CalendarIntegrationModalProps> = ({
  isOpen,
  settings,
  onSave,
  onClose,
}) => {
  const [integrationEnabled, setIntegrationEnabled] = useState(settings.integrationEnabled);
  const [showWorkingDaysOnly, setShowWorkingDaysOnly] = useState(settings.showWorkingDaysOnly);
  const [syncedCalendars, setSyncedCalendars] = useState<string[]>(
    settings.syncedCalendars.length > 0 ? settings.syncedCalendars : ["cal-google"]
  );

  if (!isOpen) return null;

  const toggleCalendar = (calId: string) => {
    if (syncedCalendars.includes(calId)) {
      setSyncedCalendars(syncedCalendars.filter((id) => id !== calId));
    } else {
      setSyncedCalendars([...syncedCalendars, calId]);
    }
  };

  const handleSave = () => {
    onSave({
      integrationEnabled,
      calendarAccessStatus: integrationEnabled ? "enabled" : "disabled",
      showWorkingDaysOnly,
      syncedCalendars,
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
            <CalendarIcon className="w-5 h-5 text-[#03a9f4]" />
            <h3 className="text-base font-semibold text-white">Calendar integration</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8b98a5] hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Main access toggle */}
          <div className="flex items-center justify-between bg-[#121517] p-3.5 rounded-xl border border-[#262e38]">
            <div>
              <div className="text-sm font-medium text-white">Calendar access</div>
              <div className="text-xs text-[#8c9ba8]">
                {integrationEnabled ? "Calendar access enabled" : "Calendar access disabled"}
              </div>
            </div>
            <Switch checked={integrationEnabled} onChange={setIntegrationEnabled} />
          </div>

          {/* Working days toggle */}
          <div className="flex items-center justify-between bg-[#121517] p-3.5 rounded-xl border border-[#262e38]">
            <div>
              <div className="text-sm font-medium text-white">Show working days only</div>
              <div className="text-xs text-[#8c9ba8]">Show Monday to Friday on Calendar</div>
            </div>
            <Switch checked={showWorkingDaysOnly} onChange={setShowWorkingDaysOnly} />
          </div>

          {/* Calendars list */}
          {integrationEnabled && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#8c9ba8]">
                Connected Calendars
              </label>
              <div className="space-y-1.5">
                {AVAILABLE_CALENDARS.map((cal) => {
                  const isChecked = syncedCalendars.includes(cal.id);
                  return (
                    <button
                      key={cal.id}
                      type="button"
                      onClick={() => toggleCalendar(cal.id)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-[#121517] border border-[#262e38] hover:bg-[#232a34] transition-colors"
                    >
                      <span className="text-xs text-white font-medium text-left">{cal.name}</span>
                      <CheckCircle2
                        className={`w-4 h-4 transition-colors ${
                          isChecked ? "text-[#03a9f4]" : "text-[#4a5568]"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-[#121517] border border-[#262e38] rounded-xl p-3 text-xs text-[#8c9ba8] leading-relaxed">
            Connecting your calendar lets you visualize scheduled meetings and events directly in the Clockify calendar screen, making it effortless to track time against actual commitments.
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
