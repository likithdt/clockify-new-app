import React, { useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardFilterBar } from "./DashboardFilterBar";
import { DashboardMetricCards } from "./DashboardMetricCards";
import { DashboardBarChart } from "./DashboardBarChart";
import { MostTrackedActivitiesCard } from "./MostTrackedActivitiesCard";
import { ProjectBreakdownCard } from "./ProjectBreakdownCard";
import { TeamStatusCard } from "./TeamStatusCard";
import { QuickTimeEntryModal } from "./QuickTimeEntryModal";
import { MobileDrawer } from "@/components/expenses/MobileDrawer";

interface MobileDashboardScreenProps {
  onOpenDrawer?: () => void;
  onNavigateScreen?: (screen: string) => void;
}

export const MobileDashboardScreen: React.FC<MobileDashboardScreenProps> = ({
  onOpenDrawer,
  onNavigateScreen,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    if (onOpenDrawer) {
      onOpenDrawer();
    } else {
      setIsDrawerOpen(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F5F6F8] text-[#1E293B] overflow-hidden select-none relative font-sans">
      {/* 1. TOP APP BAR */}
      <DashboardHeader onOpenDrawer={handleOpenDrawer} />

      {/* 2. FILTER CONTROLS & DEMO NOTICE BAR */}
      <DashboardFilterBar />

      {/* 3. SCROLLABLE DASHBOARD CONTENT AREA */}
      <div className="flex-1 overflow-y-auto pb-8 overscroll-contain">
        {/* KPI Metric Cards (Total Time, Top Project, Top Client, Billable Value) */}
        <DashboardMetricCards />

        {/* Weekly & Daily Bar Chart with Day Selector & Clockify Empty State */}
        <DashboardBarChart />

        {/* Most Tracked Activities Card with Top 5 / Top 10 Dropdown */}
        <MostTrackedActivitiesCard />

        {/* Project Distribution Breakdown */}
        <ProjectBreakdownCard />

        {/* Team Live Status Workload (Active when "Team" filter is on) */}
        <TeamStatusCard />
      </div>

      {/* 4. QUICK TIME ENTRY MODAL */}
      <QuickTimeEntryModal />

      {/* 5. UNIVERSAL MOBILE DRAWER */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeScreen="dashboard"
        onNavigate={(screen) => {
          onNavigateScreen?.(screen);
          setIsDrawerOpen(false);
        }}
      />
    </div>
  );
};
