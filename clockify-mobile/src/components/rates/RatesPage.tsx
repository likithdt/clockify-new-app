import React from "react";
import { MobileRatesScreen } from "./MobileRatesScreen";
import { AndroidFrame } from "@/components/AndroidFrame";

interface RatesPageProps {
  onNavigateScreen?: (screen: string) => void;
}

/**
 * Clockify Mobile Rates Page
 *
 * Translates the desktop Rates feature (Team (Billable rate).png & Team(CostRate).png)
 * into a mobile-first experience:
 * - Dual Mode Segment: Billable Rates vs Cost Rates
 * - Rate threshold filter: Exactly, Smaller than, Larger than
 * - Role filtering: Project manager, Team manager, Member, Admin
 * - Member Rate Cards with avatar, name, role badge, prominent active rate, and spread comparison
 * - Quick "Change" button launching EditRateModal with un-invoiced entries option
 * - Rates summary bar: Avg Billable Rate, Avg Cost Rate, Blended Margin Spread
 * - Mobile Android device shell container & drawer navigation
 */
export const RatesPage: React.FC<RatesPageProps> = ({ onNavigateScreen }) => {
  return (
    <div className="w-full h-full min-h-screen bg-[#0d1117] flex items-center justify-center sm:py-3 overflow-hidden select-none">
      {/* Mobile Device Shell Container */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[880px] sm:max-h-[96vh] sm:rounded-[38px] bg-white flex flex-col overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] sm:border-[8px] sm:border-[#1e232d] relative">
        <AndroidFrame theme="light" time="10:55">
          <MobileRatesScreen onNavigateScreen={onNavigateScreen} />
        </AndroidFrame>
      </div>
    </div>
  );
};

export default RatesPage;
