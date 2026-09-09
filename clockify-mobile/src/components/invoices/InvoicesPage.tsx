import React from "react";
import { MobileInvoicesScreen } from "./MobileInvoicesScreen";
import { AndroidFrame } from "@/components/AndroidFrame";

interface InvoicesPageProps {
  onNavigateScreen?: (screen: string) => void;
}

/**
 * Clockify Mobile Invoices Page
 *
 * Translates the desktop Invoices feature (Invoices.png & Creation of Invoice.png)
 * into a mobile-first experience:
 * - Status Filters: All | Sent | Overdue | Paid | Draft
 * - Client filtering & search query
 * - Comprehensive Invoice Cards with issue date, due date, overdue warning, amount & balance
 * - Direct "Mark as Paid", "Mark as Sent", "Download PDF", "Duplicate", and "Delete"
 * - Mobile Create Invoice modal with client, currency, issue date, due date
 * - Remove sample data explore banner and restore workflow
 * - Financial summary metrics: Total Invoiced, Outstanding Balance, Overdue Invoices
 * - Mobile Android device shell container & drawer navigation
 */
export const InvoicesPage: React.FC<InvoicesPageProps> = ({ onNavigateScreen }) => {
  return (
    <div className="w-full h-full min-h-screen bg-[#0d1117] flex items-center justify-center sm:py-3 overflow-hidden select-none">
      {/* Mobile Device Shell Container */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[880px] sm:max-h-[96vh] sm:rounded-[38px] bg-white flex flex-col overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] sm:border-[8px] sm:border-[#1e232d] relative">
        <AndroidFrame theme="light" time="10:50">
          <MobileInvoicesScreen onNavigateScreen={onNavigateScreen} />
        </AndroidFrame>
      </div>
    </div>
  );
};

export default InvoicesPage;
