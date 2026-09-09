import React from "react";
import { Menu, Plus, RotateCcw } from "lucide-react";
import { useDashboardStore } from "@/stores/useDashboardStore";

interface DashboardHeaderProps {
  onOpenDrawer: () => void;
  workspaceName?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenDrawer,
  workspaceName = "GOPALAN COLLEGE OF ENGINEERING...",
}) => {
  const { hasSampleData, restoreSampleData, openQuickLogModal } = useDashboardStore();

  return (
    <header className="h-14 px-3 bg-white border-b border-[#E2E8F0] flex items-center justify-between shrink-0 shadow-2xs z-30 select-none">
      {/* Left: Hamburger menu + Clockify logo + Screen Title */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onOpenDrawer}
          className="p-2 -ml-1 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-lg transition active:scale-95 cursor-pointer"
          title="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-6 h-6 rounded bg-[#03A9F4] flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.85-.51-3.58-1.39-5.07l-1.53.88C19.64 8.94 20 10.42 20 12c0 4.41-3.59 8-8 8s-8-3.59-8-8 3.59-8 8-8c1.58 0 3.06.46 4.31 1.25l.89-1.54C15.7 2.61 13.92 2 12 2zm-1 5v6h6v-2h-4V7h-2z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-[15px] font-bold text-[#1E293B] leading-none tracking-tight">
              Dashboard
            </h1>
            <p className="text-[10px] text-[#94A3B8] font-medium truncate max-w-[130px] sm:max-w-[200px] leading-tight mt-0.5">
              {workspaceName}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {!hasSampleData && (
          <button
            type="button"
            onClick={restoreSampleData}
            className="flex items-center gap-1 px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-md text-[11px] font-medium transition cursor-pointer"
            title="Restore sample demo data"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restore Demo</span>
          </button>
        )}

        <button
          type="button"
          onClick={openQuickLogModal}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-[#03A9F4] hover:bg-[#0288D1] text-white rounded-lg text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
          title="Log new time entry"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Log Time</span>
        </button>
      </div>
    </header>
  );
};
