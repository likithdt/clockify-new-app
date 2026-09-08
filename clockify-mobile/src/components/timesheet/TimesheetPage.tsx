import React from "react";
import { MobileTimesheetScreen } from "./MobileTimesheetScreen";
import { AndroidFrame } from "@/components/AndroidFrame";

/**
 * Clockify Mobile Timesheet Page
 * 
 * Takes the comprehensive weekly timesheet engine from desktop and translates
 * it into an intuitive, responsive mobile experience:
 * - Daily horizontal swipeable day selector strip (Mo-Su)
 * - Project & Task time entry cards with quick duration & billable tags
 * - Weekly matrix grid view option for bird's-eye time reviews
 * - Interactive Add / Edit Time Entry bottom sheet with quick duration presets
 * - Teammates switcher & copy last week / template actions
 * - Encapsulated in the native Android mobile simulator frame
 */
interface TimesheetPageProps {
  onNavigateScreen?: (screen: string) => void;
}

export const TimesheetPage: React.FC<TimesheetPageProps> = ({ onNavigateScreen }) => {
  return (
    <div className="w-full h-full min-h-screen bg-[#0d1117] flex items-center justify-center sm:py-3 overflow-hidden select-none">
      {/* Mobile Device Shell Container matching other mobile features */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[880px] sm:max-h-[96vh] sm:rounded-[38px] bg-white flex flex-col overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] sm:border-[8px] sm:border-[#1e232d] relative">
        <AndroidFrame theme="light" time="9:46">
          <MobileTimesheetScreen onNavigateScreen={onNavigateScreen} />
        </AndroidFrame>
      </div>
    </div>
  );
};

export default TimesheetPage;
