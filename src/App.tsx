import { TrackerBar } from "@/components/tracker/TrackerBar";
import { useTimerStore } from "@/stores/useTimerStore";
import { format } from "date-fns";
import { Clock, BarChart3, FolderKanban, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function App() {
  const { entries } = useTimerStore();

    const formatDuration = (totalSecs: number) => {
        const h = Math.floor(totalSecs / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        const s = totalSecs % 60;
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m ${s}s`;
    };

    const getLocationDisplayText = (
        entry: ReturnType<typeof useTimerStore.getState>["entries"][number]
    ) => {
        if (!entry.location) return null;
        if (entry.location.address) {
            return entry.location.address.length > 25
                ? entry.location.address.substring(0, 25) + "…"
                : entry.location.address;
        }
        return `${entry.location.latitude.toFixed(3)}, ${entry.location.longitude.toFixed(3)}`;
    };

  return (
    <div className="flex h-screen w-screen bg-slate-100 overflow-hidden select-none">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
        <div className="h-14 flex items-center px-4 font-bold text-white tracking-wide border-b border-slate-800">
          CLOCKIFY
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3 bg-slate-800 text-white text-xs">
            <Clock className="w-4 h-4 text-blue-400" /> Time Tracker
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-white text-xs">
            <FolderKanban className="w-4 h-4" /> Projects
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-white text-xs">
            <BarChart3 className="w-4 h-4" /> Reports
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-white text-xs">
            <Settings className="w-4 h-4" /> Settings
          </Button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Sticky Tracker Bar Container */}
        <header className="sticky top-0 z-10 bg-slate-100/90 backdrop-blur-md p-6 pb-4 border-b border-slate-200">
          <TrackerBar />
        </header>

        {/* Time Entries Feed */}
        <section className="flex-1 p-6 pt-4 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
            <span>Today</span>
            <span>
              Total: {formatDuration(entries.reduce((acc, curr) => acc + curr.durationSeconds, 0))}
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-md shadow-sm divide-y divide-slate-100">
            {entries.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                No time tracked yet today. Type a task and hit <span className="font-semibold text-blue-600">START</span>!
              </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="p-3.5 flex items-center justify-between text-sm hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="font-medium text-slate-800 truncate">{entry.description}</span>
                    <span className="flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.projectColor }} />
                      {entry.projectName}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-slate-500 text-xs">
                    <span>
                      {format(entry.startTime, "HH:mm")} - {entry.endTime ? format(entry.endTime, "HH:mm") : "now"}
                    </span>
                    <span className="font-mono text-sm font-semibold text-slate-800 min-w-[55px] text-right">
                      {formatDuration(entry.durationSeconds)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}