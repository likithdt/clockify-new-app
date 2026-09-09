import React from "react";
import { MobileDashboardScreen } from "./MobileDashboardScreen";
import { AndroidFrame } from "@/components/AndroidFrame";

interface DashboardPageProps {
  onNavigateScreen?: (screen: string) => void;
}

/**
 * Clockify Mobile Dashboard Page
 *
 * Translates the desktop Dashboard feature (Dashboard.png)
 * into a mobile experience:
 * - Top Sample Data exploration notice with 1-tap removal & restore
 * - Interactive filter bar (Project, Only me vs Team, Date period with stepper)
 * - KPI Metric Cards (Total time digital clock, Top Project, Top Client, Billable revenue)
 * - Weekly & daily time tracked bar chart with day inspector & Clockify empty state
 * - Most tracked activities card with Top 5 / Top 10 selector & progress bars
 * - Project distribution breakdown with client names and billable values
 * - Real-time team status & live timer indicators
 * - Quick Time Log modal
 * - Mobile Android device shell container & drawer navigation
 */
export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateScreen }) => {
  return (
    <div className="w-full h-full min-h-screen bg-[#0d1117] flex items-center justify-center sm:py-3 overflow-hidden select-none">
      {/* Mobile Device Shell Container */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[880px] sm:max-h-[96vh] sm:rounded-[38px] bg-white flex flex-col overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] sm:border-[8px] sm:border-[#1e232d] relative">
        <AndroidFrame theme="light" time="10:30">
          <MobileDashboardScreen onNavigateScreen={onNavigateScreen} />
        </AndroidFrame>
      </div>
    </div>
  );
};

export default DashboardPage;
