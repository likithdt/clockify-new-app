import { useState } from 'react';
import { TopHeader } from '@/components/layout/TopHeader';
import { Sidebar } from '@/components/layout/Sidebar';
import { TimeOffPage } from '@/components/timeoff/TimeOffPage';
import { CalendarPage } from '@/components/calendar/CalendarPage';
import { TrackerBar } from '@/components/tracker/TrackerBar';
import { useTimerStore, TimeEntry } from '@/stores/useTimerStore';

export default function App() {
  const [currentView, setCurrentView] = useState<'tracker' | 'timeoff' | 'calendar'>('calendar');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { entries } = useTimerStore();

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const formatDuration = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${s}s`;
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#f5f7f9] overflow-hidden select-none font-sans">
      {/* Top trial & workspace header */}
      <TopHeader />

      {/* Main container with Sidebar & Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          
        />

        {/* View switching */}
        {currentView === 'calendar' ? (
          <CalendarPage />
        ) : currentView === 'timeoff' ? (
          <TimeOffPage />
        ) : (
          <main className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
            {/* Top Sticky Tracker Bar Container */}
            <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md p-6 pb-4 border-b border-slate-200 shadow-xs">
              <TrackerBar />
            </header>

            {/* Time Entries Feed */}
            <section className="flex-1 p-6 pt-4 space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                <span>Today</span>
                <span>
                  Total: {formatDuration(entries.reduce((acc: number, curr: TimeEntry) => acc + curr.durationSeconds, 0))}
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded shadow-sm divide-y divide-slate-100">
                {entries.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-400">
                    No time tracked yet today. Type a task and hit{' '}
                    <span className="font-semibold text-blue-600">START</span>!
                  </div>
                ) : (
                  entries.map((entry: TimeEntry) => (
                    <div
                      key={entry.id}
                      className="p-3.5 flex items-center justify-between text-sm hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="font-medium text-slate-800 truncate">
                          {entry.description}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.projectColor }}
                          />
                          {entry.projectName}
                        </span>
                      </div>

                      <div className="flex items-center gap-6 text-slate-500 text-xs">
                        <span>
                          {formatTime(entry.startTime)} -{' '}
                          {entry.endTime ? formatTime(entry.endTime) : 'now'}
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
        )}
      </div>
    </div>
  );
}