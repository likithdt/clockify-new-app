import React, { useState, useEffect } from "react";
import { useActivityStore } from "@/stores/useActivityStore";
import { ActivityMonitoringView } from "../components/activity/ActivityMonitoringView";
import { ScreenshotsView } from "../components/activity/ScreenshotsView";
import { LocationsView } from "../components/activity/LocationsView";
import { ExportActivityModal } from "../components/activity/ExportActivityModal";

export const ActivityScreen: React.FC = () => {
  const { activeSubTab, loadFromBackend } = useActivityStore();
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    loadFromBackend();
  }, [loadFromBackend]);

  // Listen for TopAppBar export click
  useEffect(() => {
    const handleOpenExport = () => {
      setIsExportOpen(true);
    };
    window.addEventListener("clockify:open-activity-export", handleOpenExport);
    return () => {
      window.removeEventListener("clockify:open-activity-export", handleOpenExport);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative bg-[#f5f6f8]">
      {activeSubTab === "activity" && <ActivityMonitoringView />}
      {activeSubTab === "screenshots" && <ScreenshotsView />}
      {activeSubTab === "locations" && <LocationsView />}

      <ExportActivityModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        members={[
          {
            id: "likith",
            name: "Likith D T (You)",
            task: "Clockify Desktop Development",
            project: "Project Alpha",
            activityPercent: 98,
            pulseText: "98% active pulse",
            activeWindow: "VS Code Studio / Terminal",
            score: "99% High",
            status: "TRACKING",
          },
          {
            id: "bindhu",
            name: "Bindhu shree",
            task: "UI Design Refactoring",
            project: "Project Alpha",
            activityPercent: 94,
            pulseText: "94% active pulse",
            activeWindow: "Figma / Chrome IDE",
            score: "96% High",
            status: "TRACKING",
          },
        ]}
      />
    </div>
  );
};

export default ActivityScreen;
