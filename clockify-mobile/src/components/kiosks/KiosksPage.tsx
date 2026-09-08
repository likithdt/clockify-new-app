import React, { useEffect } from "react";
import { useKioskStore } from "@/stores/useKioskStore";
import { MobileKiosksScreen } from "./MobileKiosksScreen";
import { AndroidFrame } from "@/components/AndroidFrame";

interface KiosksPageProps {
  onNavigateScreen?: (screen: string) => void;
}

/**
 * Clockify Mobile Kiosks Page
 *
 * Translates the desktop Kiosks feature (Kiosks.png & Creation of Kiosk.png)
 * into a mobile experience:
 * - Empty / Intro hero with 3 step explanatory cards
 * - Create Kiosk bottom sheet matching Creation of Kiosk.png
 * - Active Kiosk stations list with 1-tap "Launch Station"
 * - Interactive Kiosk Attendance Terminal mode with PIN keypad & Clock in/out
 * - Full Android device shell container & drawer navigation
 */
export const KiosksPage: React.FC<KiosksPageProps> = ({ onNavigateScreen }) => {
  const { loadFromBackend } = useKioskStore();

  useEffect(() => {
    loadFromBackend();
  }, [loadFromBackend]);

  return (
    <div className="w-full h-full min-h-screen bg-[#0d1117] flex items-center justify-center sm:py-3 overflow-hidden select-none">
      {/* Mobile Device Shell Container */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[880px] sm:max-h-[96vh] sm:rounded-[38px] bg-white flex flex-col overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] sm:border-[8px] sm:border-[#1e232d] relative">
        <AndroidFrame theme="light" time="9:46">
          <MobileKiosksScreen onNavigateScreen={onNavigateScreen} />
        </AndroidFrame>
      </div>
    </div>
  );
};

export default KiosksPage;
