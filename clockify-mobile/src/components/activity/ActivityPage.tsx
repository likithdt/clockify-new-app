import React, { useEffect } from "react";
import { useActivityStore } from "@/stores/useActivityStore";
import { MobileActivityScreen } from "./MobileActivityScreen";
import { AndroidFrame } from "@/components/AndroidFrame";

interface ActivityPageProps {
  onNavigateScreen?: (screen: string) => void;
}

/**
 * Clockify Mobile Activity Page
 *
 * Translates the desktop Activity feature:
 * - Activity Monitoring (Activity monitoring.png with circular chart hero & pulse breakdown)
 * - Screenshots (Activity(Screenshots).png with interval captures & preview modal)
 * - Locations (Activity(Locations).png with GPS geofencing & Google Maps)
 * - Encapsulated in AndroidFrame shell with universal MobileDrawer navigation
 */
export const ActivityPage: React.FC<ActivityPageProps> = ({ onNavigateScreen }) => {
  const { loadFromBackend } = useActivityStore();

  useEffect(() => {
    loadFromBackend();
  }, [loadFromBackend]);

  return (
    <div className="w-full h-full min-h-screen bg-[#0d1117] flex items-center justify-center sm:py-3 overflow-hidden select-none">
      {/* Mobile Device Shell Container */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[880px] sm:max-h-[96vh] sm:rounded-[38px] bg-white flex flex-col overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] sm:border-[8px] sm:border-[#1e232d] relative">
        <AndroidFrame theme="light" time="9:46">
          <MobileActivityScreen onNavigateScreen={onNavigateScreen} />
        </AndroidFrame>
      </div>
    </div>
  );
};

export default ActivityPage;
