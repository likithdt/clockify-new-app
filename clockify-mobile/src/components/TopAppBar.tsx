import React from "react";
import {
  Menu,
  Search,
  Settings as SettingsIcon,
  MoreVertical,
  Filter,
  Download,
  Share2,
  X,
  ArrowLeft,
} from "lucide-react";

export type ScreenType =
  | "timeTracker"
  | "calendar"
  | "expenses"
  | "timeOff"
  | "reports"
  | "projects"
  | "team"
  | "clients"
  | "tags"
  | "settings"
  | "profile";

interface TopAppBarProps {
  currentScreen: ScreenType;
  title?: string;
  onOpenDrawer: () => void;
  onBackClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
  onToggleSearch?: () => void;
  onSettingsClick?: () => void;
  onMoreClick?: () => void;
  onFilterClick?: () => void;
  onExportClick?: () => void;
  onShareClick?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentScreen,
  title,
  onOpenDrawer,
  onBackClick,
  searchQuery = "",
  onSearchChange,
  showSearch = false,
  onToggleSearch,
  onSettingsClick,
  onMoreClick,
  onFilterClick,
  onExportClick,
  onShareClick,
}) => {
  const getScreenTitle = () => {
    if (title) return title;
    switch (currentScreen) {
      case "timeTracker":
        return "Time Tracker";
      case "calendar":
        return "Calendar";
      case "expenses":
        return "Expenses";
      case "timeOff":
        return "Time off";
      case "reports":
        return "Reports";
      case "projects":
        return "Projects";
      case "team":
        return "Team";
      case "clients":
        return "Clients";
      case "tags":
        return "Tags";
      case "settings":
        return "Settings";
      case "profile":
        return "Profile";
      default:
        return "Clockify";
    }
  };

  return (
    <header className="h-14 px-4 bg-[#0f1216] flex items-center justify-between shrink-0 border-b border-[#181c22]/80 z-30 select-none">
      {/* If Search is open on screens with search */}
      {showSearch ? (
        <div className="flex-1 flex items-center gap-2 bg-[#1b2027] rounded-xl px-3 py-1.5 animate-fadeIn">
          <Search className="w-4 h-4 text-[#8c9ba5]" />
          <input
            type="text"
            placeholder={`Search ${getScreenTitle().toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-white placeholder-[#8c9ba5] outline-none"
          />
          <button
            type="button"
            onClick={onToggleSearch}
            className="p-1 text-[#8c9ba5] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          {/* Left: Back button or Hamburger button with orange notification dot + Title */}
          <div className="flex items-center gap-3.5">
            {onBackClick && (currentScreen === "settings" || currentScreen === "profile") ? (
              <button
                type="button"
                onClick={onBackClick}
                className="p-1 -ml-1 text-white hover:text-gray-200 active:scale-95 transition-transform"
                title="Back"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenDrawer}
                className="relative p-1 -ml-1 text-white hover:text-gray-200 active:scale-95 transition-transform"
                title="Open Navigation Drawer"
              >
                <Menu className="w-6 h-6 text-white" />
                {/* Orange notification dot matching screenshots */}
                <span className="absolute top-1 right-0.5 w-2 h-2 rounded-full bg-[#ff5722] ring-2 ring-[#0f1216]"></span>
              </button>
            )}

            <h1 className="text-xl font-medium tracking-tight text-white">
              {getScreenTitle()}
            </h1>
          </div>

          {/* Right Action Icons matching reference screenshots */}
          <div className="flex items-center gap-1.5 text-white">
            {/* Search icon for Projects, Clients, Tags, Team */}
            {["projects", "clients", "tags", "team"].includes(currentScreen) && (
              <button
                type="button"
                onClick={onToggleSearch}
                className="p-2 text-white/90 hover:text-white active:scale-95 transition-transform"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Expenses: Settings Gear icon */}
            {currentScreen === "expenses" && (
              <button
                type="button"
                onClick={onSettingsClick}
                className="p-2 text-white/90 hover:text-white active:scale-95 transition-transform"
                title="Expense Settings"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            )}

            {/* Calendar: Three dots menu */}
            {currentScreen === "calendar" && (
              <button
                type="button"
                onClick={onMoreClick}
                className="p-2 text-white/90 hover:text-white active:scale-95 transition-transform"
                title="Calendar options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            )}

            {/* Time off: Filter icon */}
            {currentScreen === "timeOff" && (
              <button
                type="button"
                onClick={onFilterClick}
                className="p-2 text-white/90 hover:text-white active:scale-95 transition-transform"
                title="Filter Time off"
              >
                <Filter className="w-5 h-5" />
              </button>
            )}

            {/* Reports: Filter, Export, Share */}
            {currentScreen === "reports" && (
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={onFilterClick}
                  className="p-2 text-white/90 hover:text-white active:scale-95 transition-transform"
                  title="Filter Reports"
                >
                  <Filter className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={onExportClick}
                  className="p-2 text-white/90 hover:text-white active:scale-95 transition-transform"
                  title="Export"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={onShareClick}
                  className="p-2 text-white/90 hover:text-white active:scale-95 transition-transform"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};
