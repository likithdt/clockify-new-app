import React, { useState } from "react";
import {
  Clock,
  Calendar,
  Receipt,
  RotateCcw,
  BarChart3,
  Inbox,
  Folder,
  Users,
  User,
  Tag,
  Settings,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { ScreenType } from "./TopAppBar";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  userName?: string;
  userEmail?: string;
  workspaceName?: string;
  onOpenProfile?: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onNavigate,
  userName = "vishalkomi954",
  workspaceName = "gcem",
  onOpenProfile,
}) => {
  // Manage submenu is expanded by default (as seen in Manage.jpeg)
  const [isManageExpanded, setIsManageExpanded] = useState(true);

  if (!isOpen) return null;

  const handleItemClick = (screen: ScreenType) => {
    onNavigate(screen);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer Panel (matching Manage.jpeg and WhatsApp screenshot) */}
      <div className="relative w-[82%] max-w-[340px] h-full bg-[#1b2026] text-white flex flex-col z-10 shadow-2xl overflow-y-auto animate-slideInLeft border-r border-[#262e37]">
        
        {/* Top Header: Clockify Logo & Brand */}
        <div className="pt-5 px-5 pb-3">
          <div className="flex items-center gap-2.5">
            {/* Clockify Logo (Cyan rounded square with clock) */}
            <div className="w-8 h-8 rounded-lg bg-[#00b0ff] flex items-center justify-center shadow-md">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.85-.51-3.58-1.39-5.07l-1.53.88C19.64 8.94 20 10.42 20 12c0 4.41-3.59 8-8 8s-8-3.59-8-8 3.59-8 8-8c1.58 0 3.06.46 4.31 1.25l.89-1.54C15.7 2.61 13.92 2 12 2zm-1 5v6h6v-2h-4V7h-2z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-sans">
              clockify
            </span>
          </div>

          {/* User Profile Block */}
          <div
            onClick={() => {
              onOpenProfile?.();
              onClose();
            }}
            className="mt-4 flex items-center gap-3 cursor-pointer group p-1 -ml-1 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#00b0ff] flex items-center justify-center font-bold text-base text-white shadow-sm">
              VI
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              <p className="text-xs text-[#8c9ba5] group-hover:text-[#00b0ff] transition-colors">
                View profile
              </p>
            </div>
          </div>

          {/* Workspace Dropdown */}
          <div className="mt-4 flex items-center justify-between py-1 cursor-pointer hover:opacity-90">
            <span className="text-sm font-medium text-white">{workspaceName}</span>
            <ChevronDown className="w-4 h-4 text-[#8c9ba5]" />
          </div>
        </div>

        {/* Thin Divider */}
        <div className="border-b border-[#272e38] my-1" />

        {/* Navigation List Items */}
        <div className="flex-1 px-3 py-2 space-y-1">
          {/* Time Tracker */}
          <button
            type="button"
            onClick={() => handleItemClick("timeTracker")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
              currentScreen === "timeTracker"
                ? "bg-[#28343f] text-white font-semibold"
                : "text-[#c2cbd4] hover:bg-white/5 hover:text-white"
            }`}
          >
            <Clock className="w-5 h-5 text-[#8c9ba5]" />
            <span>Time Tracker</span>
          </button>

          {/* Calendar */}
          <button
            type="button"
            onClick={() => handleItemClick("calendar")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
              currentScreen === "calendar"
                ? "bg-[#28343f] text-white font-semibold"
                : "text-[#c2cbd4] hover:bg-white/5 hover:text-white"
            }`}
          >
            <Calendar className="w-5 h-5 text-[#8c9ba5]" />
            <span>Calendar</span>
          </button>

          {/* Expenses */}
          <button
            type="button"
            onClick={() => handleItemClick("expenses")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
              currentScreen === "expenses"
                ? "bg-[#28343f] text-white font-semibold"
                : "text-[#c2cbd4] hover:bg-white/5 hover:text-white"
            }`}
          >
            <Receipt className="w-5 h-5 text-[#8c9ba5]" />
            <span>Expenses</span>
          </button>

          {/* Time off */}
          <button
            type="button"
            onClick={() => handleItemClick("timeOff")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
              currentScreen === "timeOff"
                ? "bg-[#28343f] text-white font-semibold"
                : "text-[#c2cbd4] hover:bg-white/5 hover:text-white"
            }`}
          >
            <RotateCcw className="w-5 h-5 text-[#8c9ba5]" />
            <span>Time off</span>
          </button>

          {/* Reports */}
          <button
            type="button"
            onClick={() => handleItemClick("reports")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
              currentScreen === "reports"
                ? "bg-[#28343f] text-white font-semibold"
                : "text-[#c2cbd4] hover:bg-white/5 hover:text-white"
            }`}
          >
            <BarChart3 className="w-5 h-5 text-[#8c9ba5]" />
            <span>Reports</span>
          </button>

          {/* Manage Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setIsManageExpanded(!isManageExpanded)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-[#c2cbd4] hover:bg-white/5 hover:text-white transition-all"
            >
              <div className="flex items-center gap-4">
                <Inbox className="w-5 h-5 text-[#8c9ba5]" />
                <span>Manage</span>
              </div>
              {isManageExpanded ? (
                <ChevronUp className="w-4 h-4 text-[#8c9ba5]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#8c9ba5]" />
              )}
            </button>

            {/* Manage Sub-items (Projects, Team, Clients, Tags) */}
            {isManageExpanded && (
              <div className="pl-4 space-y-1 mt-0.5">
                {/* Projects */}
                <button
                  type="button"
                  onClick={() => handleItemClick("projects")}
                  className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                    currentScreen === "projects"
                      ? "bg-[#28343f] text-white font-semibold"
                      : "text-[#c2cbd4] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Folder className="w-5 h-5 text-[#8c9ba5]" />
                  <span>Projects</span>
                </button>

                {/* Team */}
                <button
                  type="button"
                  onClick={() => handleItemClick("team")}
                  className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                    currentScreen === "team"
                      ? "bg-[#28343f] text-white font-semibold"
                      : "text-[#c2cbd4] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Users className="w-5 h-5 text-[#8c9ba5]" />
                  <span>Team</span>
                </button>

                {/* Clients */}
                <button
                  type="button"
                  onClick={() => handleItemClick("clients")}
                  className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                    currentScreen === "clients"
                      ? "bg-[#28343f] text-white font-semibold"
                      : "text-[#c2cbd4] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <User className="w-5 h-5 text-[#8c9ba5]" />
                  <span>Clients</span>
                </button>

                {/* Tags */}
                <button
                  type="button"
                  onClick={() => handleItemClick("tags")}
                  className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                    currentScreen === "tags"
                      ? "bg-[#28343f] text-white font-semibold"
                      : "text-[#c2cbd4] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Tag className="w-5 h-5 text-[#8c9ba5]" />
                  <span>Tags</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Divider */}
          <div className="border-b border-[#272e38] my-2 pt-1" />

          {/* Settings */}
          <button
            type="button"
            onClick={() => handleItemClick("settings")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
              currentScreen === "settings"
                ? "bg-[#28343f] text-white font-semibold"
                : "text-[#c2cbd4] hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings className="w-5 h-5 text-[#8c9ba5]" />
            <span>Settings</span>
          </button>

          {/* Help & Feedback */}
          <button
            type="button"
            onClick={() => {
              alert("Clockify Help & Support: Visit https://clockify.me/help");
              onClose();
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium text-[#c2cbd4] hover:bg-white/5 hover:text-white transition-all"
          >
            <MessageSquare className="w-5 h-5 text-[#8c9ba5]" />
            <span>Help & Feedback</span>
          </button>
        </div>

        {/* Footer version text */}
        <div className="px-5 py-4 text-[11px] text-[#5e6b77] border-t border-[#272e38]">
          Clockify Android v2.7.4
        </div>

      </div>
    </div>
  );
};
