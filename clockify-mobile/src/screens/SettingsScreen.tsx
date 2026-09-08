import React, { useState } from "react";
import { Bell, Moon, Shield, Globe, Smartphone, HelpCircle } from "lucide-react";

export const SettingsScreen: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#0f1216] text-white p-4 space-y-4">
      <h2 className="text-base font-bold text-white">Settings</h2>

      {/* General Settings */}
      <div className="bg-[#1a1f26] border border-[#27303c] rounded-2xl p-4 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8c9ba5]">Preferences</h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="w-4 h-4 text-[#00b0ff]" />
            <span className="text-sm font-medium text-white">Dark Theme</span>
          </div>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            className="rounded accent-[#00b0ff] w-4 h-4"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-[#00b0ff]" />
            <span className="text-sm font-medium text-white">Push Notifications</span>
          </div>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="rounded accent-[#00b0ff] w-4 h-4"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="w-4 h-4 text-[#00b0ff]" />
            <span className="text-sm font-medium text-white">Timer Reminder</span>
          </div>
          <input
            type="checkbox"
            checked={reminders}
            onChange={(e) => setReminders(e.target.checked)}
            className="rounded accent-[#00b0ff] w-4 h-4"
          />
        </div>
      </div>

      {/* App Info */}
      <div className="bg-[#1a1f26] border border-[#27303c] rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8c9ba5]">About</h3>
        <div className="flex items-center justify-between text-xs text-[#8c9ba5]">
          <span>App Version</span>
          <span className="text-white font-medium">1.0.0 (Mobile Web)</span>
        </div>
        <div className="flex items-center justify-between text-xs text-[#8c9ba5]">
          <span>Device Simulation</span>
          <span className="text-white font-medium">Android Material 3</span>
        </div>
      </div>
    </div>
  );
};
