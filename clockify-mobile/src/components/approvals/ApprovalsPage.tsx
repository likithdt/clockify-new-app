import React from "react";
import { MobileApprovalsScreen } from "./MobileApprovalsScreen";
import { AndroidFrame } from "@/components/AndroidFrame";

interface ApprovalsPageProps {
  onNavigateScreen?: (screen: string) => void;
}

/**
 * Clockify Mobile Approvals Page
 *
 * Translates the desktop Approvals feature (Approvals Timesheet.png & Approvals Expenses.png)
 * into a mobile experience:
 * - Dual Mode: Timesheet Approvals & Expense Approvals tabs
 * - Status Filter Tabs: PENDING | UNSUBMITTED | ARCHIVE
 * - Period-grouped weekly list (Aug 31 - Sep 6, Jul 13 - Jul 19, Jul 6 - Jul 12)
 * - Interactive single-tap Approve and Reject actions
 * - Detailed expandable daily time breakdown & receipt inspection
 * - Multi-item batch approval & reminder floating actions
 * - Rejection reason modal with confirmation flow
 * - Mobile Android device shell container & drawer navigation
 */
export const ApprovalsPage: React.FC<ApprovalsPageProps> = ({ onNavigateScreen }) => {
  return (
    <div className="w-full h-full min-h-screen bg-[#0d1117] flex items-center justify-center sm:py-3 overflow-hidden select-none">
      {/* Mobile Device Shell Container */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[880px] sm:max-h-[96vh] sm:rounded-[38px] bg-white flex flex-col overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] sm:border-[8px] sm:border-[#1e232d] relative">
        <AndroidFrame theme="light" time="10:45">
          <MobileApprovalsScreen onNavigateScreen={onNavigateScreen} />
        </AndroidFrame>
      </div>
    </div>
  );
};

export default ApprovalsPage;
