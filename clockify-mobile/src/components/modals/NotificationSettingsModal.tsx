import React, { useState } from "react";
import type { WorkspaceNotificationSettings } from "../../backend/types.ts";
import { Switch } from "../ui/Switch.tsx";
import { Bell, Mail, Clock, CalendarCheck, ShieldAlert, X } from "lucide-react";

interface NotificationSettingsModalProps {
  isOpen: boolean;
  notifications: WorkspaceNotificationSettings;
  onSave: (notifications: WorkspaceNotificationSettings) => void;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  notifications,
  onSave,
  onClose,
}) => {
  const [state, setState] = useState<WorkspaceNotificationSettings>({ ...notifications });

  if (!isOpen) return null;

  const update = (key: keyof WorkspaceNotificationSettings, value: boolean) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(state);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-sm bg-[#1a1f26] border border-[#2b3340] rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-slideInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2b3340]">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-[#03a9f4]" />
            <h3 className="text-base font-semibold text-white">Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8b98a5] hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Push */}
          <div className="flex items-center justify-between bg-[#121517] p-3.5 rounded-xl border border-[#262e38]">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-[#03a9f4]" />
              <div>
                <div className="text-sm font-medium text-white">Push notifications</div>
                <div className="text-xs text-[#8c9ba8]">Alerts on device lock screen</div>
              </div>
            </div>
            <Switch
              checked={state.pushNotifications}
              onChange={(val) => update("pushNotifications", val)}
            />
          </div>

          {/* Email */}
          <div className="flex items-center justify-between bg-[#121517] p-3.5 rounded-xl border border-[#262e38]">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#03a9f4]" />
              <div>
                <div className="text-sm font-medium text-white">Email notifications</div>
                <div className="text-xs text-[#8c9ba8]">Daily digests & updates</div>
              </div>
            </div>
            <Switch
              checked={state.emailNotifications}
              onChange={(val) => update("emailNotifications", val)}
            />
          </div>

          {/* Time tracking reminders */}
          <div className="flex items-center justify-between bg-[#121517] p-3.5 rounded-xl border border-[#262e38]">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#03a9f4]" />
              <div>
                <div className="text-sm font-medium text-white">Timer reminders</div>
                <div className="text-xs text-[#8c9ba8]">Nudges to track working hours</div>
              </div>
            </div>
            <Switch
              checked={state.timeTrackingReminders}
              onChange={(val) => update("timeTrackingReminders", val)}
            />
          </div>

          {/* Timer auto-stop */}
          <div className="flex items-center justify-between bg-[#121517] p-3.5 rounded-xl border border-[#262e38]">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-[#03a9f4]" />
              <div>
                <div className="text-sm font-medium text-white">Timer auto-stop alert</div>
                <div className="text-xs text-[#8c9ba8]">Notify if timer exceeds 10h</div>
              </div>
            </div>
            <Switch
              checked={state.timerAutoStop}
              onChange={(val) => update("timerAutoStop", val)}
            />
          </div>

          {/* Time Off Alerts */}
          <div className="flex items-center justify-between bg-[#121517] p-3.5 rounded-xl border border-[#262e38]">
            <div className="flex items-center gap-3">
              <CalendarCheck className="w-4 h-4 text-[#03a9f4]" />
              <div>
                <div className="text-sm font-medium text-white">Time off & leave alerts</div>
                <div className="text-xs text-[#8c9ba8]">Approval status changes</div>
              </div>
            </div>
            <Switch
              checked={state.timeOffAlerts}
              onChange={(val) => update("timeOffAlerts", val)}
            />
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
