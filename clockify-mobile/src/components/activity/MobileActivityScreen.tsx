import React, { useState, useEffect } from "react";
import { useActivityStore } from "@/stores/useActivityStore";
import { ActivityMonitoringView } from "./ActivityMonitoringView";
import { ScreenshotsView } from "./ScreenshotsView";
import { LocationsView } from "./LocationsView";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { Menu } from "lucide-react";

interface MobileActivityScreenProps {
  onOpenDrawer?: () => void;
  onNavigateScreen?: (screen: string) => void;
}

export const MobileActivityScreen: React.FC<MobileActivityScreenProps> = ({
  onOpenDrawer,
  onNavigateScreen,
}) => {
  const {
    activeSubTab,
    isMonitoringActive,
    isScreenshotsActive,
    isGpsActive,
    loadFromBackend,
  } = useActivityStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    loadFromBackend();
  }, [loadFromBackend]);

  const anyActive = isMonitoringActive || isScreenshotsActive || isGpsActive;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F5F6F8] text-[#1E293B] overflow-hidden select-none relative font-sans">
      {/* 1. TOP APP BAR */}
      <header className="h-14 px-3 bg-white border-b border-[#E2E8F0] flex items-center justify-between shrink-0 shadow-2xs z-30">
        <div className="flex items-center gap-2">
          {/* Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => (onOpenDrawer ? onOpenDrawer() : setIsDrawerOpen(true))}
            className="p-2 -ml-1 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-lg transition cursor-pointer"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Clockify Logo & Activity Title */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded bg-[#03A9F4] flex items-center justify-center text-white font-bold text-xs shadow-xs">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.85-.51-3.58-1.39-5.07l-1.53.88C19.64 8.94 20 10.42 20 12c0 4.41-3.59 8-8 8s-8-3.59-8-8 3.59-8 8-8c1.58 0 3.06.46 4.31 1.25l.89-1.54C15.7 2.61 13.92 2 12 2zm-1 5v6h6v-2h-4V7h-2z" />
              </svg>
            </div>
            <h1 className="text-base font-bold text-[#1E293B] tracking-tight">
              Activity
            </h1>
          </div>
        </div>

        {/* Right Status Badge */}
        <div className="flex items-center gap-1.5">
          {anyActive ? (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-[#ecfdf5] border border-[#a7f3d0] rounded-full text-[11px] font-bold text-[#047857]">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span>Live Audit</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-full text-[11px] font-medium text-slate-500">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Inactive</span>
            </div>
          )}
        </div>
      </header>

      {/* 2. SUBTAB CONTENT */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {activeSubTab === "activity" && <ActivityMonitoringView />}
        {activeSubTab === "screenshots" && <ScreenshotsView />}
        {activeSubTab === "locations" && <LocationsView />}
      </div>

      {/* 3. UNIVERSAL MOBILE DRAWER */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentScreen="activity"
        onNavigate={(scr) => {
          onNavigateScreen?.(scr);
          setIsDrawerOpen(false);
        }}
      />
    </div>
  );
};
