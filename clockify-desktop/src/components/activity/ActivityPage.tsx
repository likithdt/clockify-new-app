import { useActivityStore } from "@/stores/useActivityStore";
import { ActivityMonitoringView } from "./ActivityMonitoringView";
import { ScreenshotsView } from "./ScreenshotsView";
import { LocationsView } from "./LocationsView";

export function ActivityPage() {
    const { activeSubTab } = useActivityStore();

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            {activeSubTab === "activity" && <ActivityMonitoringView />}
            {activeSubTab === "screenshots" && <ScreenshotsView />}
            {activeSubTab === "locations" && <LocationsView />}
        </div>
    );
}
