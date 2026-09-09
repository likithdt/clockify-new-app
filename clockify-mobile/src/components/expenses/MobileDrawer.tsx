import React, { useState } from "react";
import {
  Clock,
  Calendar,
  CalendarDays,
  Receipt,
  RotateCcw,
  BarChart3,
  Archive,
  Settings,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Activity,
  LayoutDashboard,
} from "lucide-react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreen?: string;
  onNavigate?: (screen: string) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeScreen = "expenses",
  onNavigate,
}) => {
  const [isManageExpanded, setIsManageExpanded] = useState(false);

  if (!isOpen) return null;

  const handleItemClick = (screen: string) => {
    onNavigate?.(screen);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex overflow-hidden select-none animate-fadeIn">
      {/* Dimmed Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel - Light Theme matching WhatsApp Screenshot 1 */}
      <div className="relative w-[82%] max-w-[320px] h-full bg-white text-[#1f2937] flex flex-col z-10 shadow-2xl overflow-y-auto animate-slideInLeft">
        {/* Top Header */}
        <div className="pt-5 px-5 pb-3">
          {/* Clockify Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00aaff] flex items-center justify-center shadow-sm">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.85-.51-3.58-1.39-5.07l-1.53.88C19.64 8.94 20 10.42 20 12c0 4.41-3.59 8-8 8s-8-3.59-8-8 3.59-8 8-8c1.58 0 3.06.46 4.31 1.25l.89-1.54C15.7 2.61 13.92 2 12 2zm-1 5v6h6v-2h-4V7h-2z" />
              </svg>
            </div>
            <span className="text-[22px] font-bold tracking-tight text-[#111827] font-sans lowercase">
              clockify
            </span>
          </div>

          {/* User Profile Card */}
          <div className="mt-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0288d1] flex items-center justify-center font-bold text-sm text-white shadow-sm shrink-0">
              SH
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[#111827] truncate">
                shivashankarbs1508
              </p>
              <button
                type="button"
                onClick={() => handleItemClick("profile")}
                className="text-xs text-[#6b7280] hover:text-[#0288d1] transition-colors"
              >
                View profile
              </button>
            </div>
          </div>

          {/* Workspace Dropdown */}
          <div className="mt-4 flex items-center justify-between py-1 cursor-pointer hover:opacity-80 transition-opacity">
            <span className="text-[13px] font-medium text-[#111827] truncate">
              gopalan college of engineering
            </span>
            <ChevronDown className="w-4 h-4 text-[#6b7280] shrink-0" />
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-[#e5e7eb] my-1" />

        {/* Menu Items */}
        <div className="flex-1 px-3 py-2 space-y-1">
          {/* Time Tracker */}
          <button
            type="button"
            onClick={() => handleItemClick("timeTracker")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-full text-[14px] font-medium transition-colors ${
              activeScreen === "timeTracker"
                ? "bg-[#e0f2fe] text-[#0369a1] font-semibold"
                : "text-[#374151] hover:bg-[#f3f4f6]"
            }`}
          >
            <Clock className="w-5 h-5 text-[#4b5563]" />
            <span>Time Tracker</span>
          </button>

          {/* Calendar */}
          <button
            type="button"
            onClick={() => handleItemClick("calendar")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-full text-[14px] font-medium transition-colors ${
              activeScreen === "calendar"
                ? "bg-[#e0f2fe] text-[#0369a1] font-semibold"
                : "text-[#374151] hover:bg-[#f3f4f6]"
            }`}
          >
            <Calendar className="w-5 h-5 text-[#4b5563]" />
            <span>Calendar</span>
          </button>

          {/* Timesheet */}
          <button
            type="button"
            onClick={() => handleItemClick("timesheet")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-full text-[14px] font-medium transition-colors ${
              activeScreen === "timesheet"
                ? "bg-[#e0f2fe] text-[#0369a1] font-semibold"
                : "text-[#374151] hover:bg-[#f3f4f6]"
            }`}
          >
            <CalendarDays className="w-5 h-5 text-[#4b5563]" />
            <span>Timesheet</span>
          </button>

          {/* Expenses - Highlighted Pill in Screenshot 1 */}
          <button
            type="button"
            onClick={() => handleItemClick("expenses")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-full text-[14px] font-medium transition-colors ${
              activeScreen === "expenses"
                ? "bg-[#e0f2fe] text-[#0f172a] font-semibold"
                : "text-[#374151] hover:bg-[#f3f4f6]"
            }`}
          >
            <Receipt className="w-5 h-5 text-[#374151]" />
            <span>Expenses</span>
          </button>

          {/* Time off */}
          <button
            type="button"
            onClick={() => handleItemClick("timeOff")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-full text-[14px] font-medium transition-colors ${
              activeScreen === "timeOff"
                ? "bg-[#e0f2fe] text-[#0369a1] font-semibold"
                : "text-[#374151] hover:bg-[#f3f4f6]"
            }`}
          >
            <RotateCcw className="w-5 h-5 text-[#4b5563]" />
            <span>Time off</span>
          </button>

          {/* Activity */}
          <button
            type="button"
            onClick={() => handleItemClick("activity")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-full text-[14px] font-medium transition-colors ${
              activeScreen === "activity"
                ? "bg-[#e0f2fe] text-[#0369a1] font-semibold"
                : "text-[#374151] hover:bg-[#f3f4f6]"
            }`}
          >
            <Activity className="w-5 h-5 text-[#4b5563]" />
            <span>Activity</span>
          </button>

          {/* Dashboard */}
          <button
            type="button"
            onClick={() => handleItemClick("dashboard")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-full text-[14px] font-medium transition-colors ${
              activeScreen === "dashboard"
                ? "bg-[#e0f2fe] text-[#0369a1] font-semibold"
                : "text-[#374151] hover:bg-[#f3f4f6]"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 text-[#4b5563]" />
            <span>Dashboard</span>
          </button>

          {/* Reports */}
          <button
            type="button"
            onClick={() => handleItemClick("reports")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-full text-[14px] font-medium transition-colors ${
              activeScreen === "reports"
                ? "bg-[#e0f2fe] text-[#0369a1] font-semibold"
                : "text-[#374151] hover:bg-[#f3f4f6]"
            }`}
          >
            <BarChart3 className="w-5 h-5 text-[#4b5563]" />
            <span>Reports</span>
          </button>

          {/* Manage Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setIsManageExpanded(!isManageExpanded)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-full text-[14px] font-medium text-[#374151] hover:bg-[#f3f4f6] transition-colors"
            >
              <div className="flex items-center gap-4">
                <Archive className="w-5 h-5 text-[#4b5563]" />
                <span>Manage</span>
              </div>
              {isManageExpanded ? (
                <ChevronUp className="w-4 h-4 text-[#6b7280]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#6b7280]" />
              )}
            </button>

            {isManageExpanded && (
              <div className="pl-6 space-y-1 mt-1">
                <button
                  type="button"
                  onClick={() => handleItemClick("kiosks")}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                    activeScreen === "kiosks"
                      ? "bg-[#e0f2fe] text-[#0369a1] font-semibold"
                      : "text-[#4b5563] hover:bg-[#f3f4f6]"
                  }`}
                >
                  Kiosks
                </button>
                <button
                  type="button"
                  onClick={() => handleItemClick("projects")}
                  className="w-full text-left px-4 py-2 rounded-lg text-sm text-[#4b5563] hover:bg-[#f3f4f6]"
                >
                  Projects
                </button>
                <button
                  type="button"
                  onClick={() => handleItemClick("team")}
                  className="w-full text-left px-4 py-2 rounded-lg text-sm text-[#4b5563] hover:bg-[#f3f4f6]"
                >
                  Team
                </button>
                <button
                  type="button"
                  onClick={() => handleItemClick("clients")}
                  className="w-full text-left px-4 py-2 rounded-lg text-sm text-[#4b5563] hover:bg-[#f3f4f6]"
                >
                  Clients
                </button>
                <button
                  type="button"
                  onClick={() => handleItemClick("tags")}
                  className="w-full text-left px-4 py-2 rounded-lg text-sm text-[#4b5563] hover:bg-[#f3f4f6]"
                >
                  Tags
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-b border-[#e5e7eb] my-2 pt-1" />

          {/* Settings */}
          <button
            type="button"
            onClick={() => handleItemClick("settings")}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-full text-[14px] font-medium text-[#374151] hover:bg-[#f3f4f6] transition-colors"
          >
            <Settings className="w-5 h-5 text-[#4b5563]" />
            <span>Settings</span>
          </button>

          {/* Help & Feedback */}
          <button
            type="button"
            onClick={() => {
              alert("Clockify Help & Feedback: https://clockify.me/help");
              onClose();
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-full text-[14px] font-medium text-[#374151] hover:bg-[#f3f4f6] transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-[#4b5563]" />
            <span>Help & Feedback</span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 text-[11px] text-[#9ca3af] border-t border-[#f3f4f6]">
          Clockify Android v2.7.4
        </div>
      </div>
    </div>
  );
};
