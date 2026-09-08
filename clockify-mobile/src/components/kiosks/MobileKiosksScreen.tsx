import React, { useState } from "react";
import { useKioskStore } from "@/stores/useKioskStore";
import { KiosksWelcomeCards } from "./KiosksWelcomeCards";
import { CreateKioskModal } from "./CreateKioskModal";
import { KioskDevicesTable } from "./KioskDevicesTable";
import { KioskAttendanceTerminal } from "./KioskAttendanceTerminal";
import { MobileDrawer } from "@/components/expenses/MobileDrawer";
import { Menu, Plus, Monitor, ChevronDown, ChevronUp } from "lucide-react";

interface MobileKiosksScreenProps {
  onOpenDrawer?: () => void;
  onNavigateScreen?: (screen: string) => void;
}

export const MobileKiosksScreen: React.FC<MobileKiosksScreenProps> = ({
  onOpenDrawer,
  onNavigateScreen,
}) => {
  const {
    kiosks,
    isCreateModalOpen,
    activeTerminalKioskId,
    openCreateModal,
  } = useKioskStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isGuideExpanded, setIsGuideExpanded] = useState(true);

  // If viewing the interactive terminal mode
  if (activeTerminalKioskId) {
    return <KioskAttendanceTerminal />;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F5F6F8] text-[#1E293B] overflow-hidden select-none relative font-sans">
      {/* 1. TOP APP BAR */}
      <header className="h-14 px-3 bg-white border-b border-[#E2E8F0] flex items-center justify-between shrink-0 shadow-2xs z-30">
        <div className="flex items-center gap-2">
          {/* Hamburger Menu */}
          <button
            type="button"
            onClick={() => (onOpenDrawer ? onOpenDrawer() : setIsDrawerOpen(true))}
            className="p-2 -ml-1 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-lg transition cursor-pointer"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Clockify Logo & Title */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded bg-[#03A9F4] flex items-center justify-center text-white font-bold text-xs shadow-xs">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.85-.51-3.58-1.39-5.07l-1.53.88C19.64 8.94 20 10.42 20 12c0 4.41-3.59 8-8 8s-8-3.59-8-8 3.59-8 8-8c1.58 0 3.06.46 4.31 1.25l.89-1.54C15.7 2.61 13.92 2 12 2zm-1 5v6h6v-2h-4V7h-2z" />
              </svg>
            </div>
            <h1 className="text-base font-bold text-[#1E293B] tracking-tight">
              Kiosks
            </h1>
          </div>
        </div>

        {/* Right Action: Create Kiosk Button if stations exist */}
        {kiosks.length > 0 && (
          <button
            type="button"
            onClick={openCreateModal}
            className="h-8 px-2.5 bg-[#03A9F4] hover:bg-[#0288D1] text-white rounded text-xs font-semibold flex items-center gap-1 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Kiosk</span>
          </button>
        )}
      </header>

      {/* 2. MAIN SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto p-3.5 pb-24 space-y-4">
        {kiosks.length === 0 ? (
          /* ================= EMPTY / INTRO STATE (Kiosks.png) ================= */
          <div className="space-y-4">
            {/* Center Hero Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#E1F5FE] text-[#03A9F4] flex items-center justify-center mx-auto shadow-xs">
                <Monitor className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-[#1E293B] leading-snug">
                Simplify time tracking with kiosk
              </h2>
              <p className="text-xs text-[#64748B] max-w-xs mx-auto leading-relaxed">
                Set up a kiosk to enable clock in and clock out using a shared device.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="px-6 py-2.5 bg-[#03A9F4] hover:bg-[#0288D1] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md shadow-[#03A9F4]/25 transition cursor-pointer active:scale-95"
                >
                  CREATE KIOSK
                </button>
              </div>
            </div>

            {/* 3 Step Visual Explanatory Cards */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-1">
                How Kiosks Work
              </div>
              <KiosksWelcomeCards />
            </div>
          </div>
        ) : (
          /* ================= CONFIGURED KIOSKS VIEW ================= */
          <div className="space-y-4">
            {/* Active Kiosk Stations */}
            <KioskDevicesTable kiosks={kiosks} />

            {/* Collapsible Guide Reference Section */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs space-y-3">
              <button
                type="button"
                onClick={() => setIsGuideExpanded(!isGuideExpanded)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1E293B]">
                    How Kiosk Terminals Work
                  </span>
                  <span className="text-[10px] bg-[#E1F5FE] text-[#0288D1] font-semibold px-2 py-0.5 rounded-full">
                    Guide
                  </span>
                </div>
                {isGuideExpanded ? (
                  <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                )}
              </button>

              {isGuideExpanded && (
                <div className="pt-2 border-t border-[#F1F5F9]">
                  <KiosksWelcomeCards />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. FLOATING ACTION BUTTON (FAB) */}
      <div className="absolute bottom-4 right-4 z-40">
        <button
          type="button"
          onClick={openCreateModal}
          className="h-11 px-4 bg-[#03A9F4] hover:bg-[#0288d1] text-white rounded-full shadow-lg shadow-[#03A9F4]/35 font-bold text-xs flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create Kiosk</span>
        </button>
      </div>

      {/* 4. CREATE KIOSK MODAL */}
      {isCreateModalOpen && <CreateKioskModal />}

      {/* 5. UNIVERSAL MOBILE DRAWER */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeScreen="kiosks"
        onNavigate={(scr) => {
          onNavigateScreen?.(scr);
          setIsDrawerOpen(false);
        }}
      />
    </div>
  );
};
