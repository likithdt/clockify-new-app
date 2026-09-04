import React, { useRef, useEffect, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { CalendarTaskCard } from './CalendarTaskCard';

export const CalendarDayView: React.FC = () => {
  const {
    selectedDate,
    selectedMemberId,
    tasks,
    zoomLevel,
    zoomIn,
    zoomOut,
    openCreateModal,
  } = useCalendarStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const hourHeights = [44, 60, 80, 100];
  const hourHeight = hourHeights[zoomLevel - 1] || 60;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const d = new Date(selectedDate);
  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
  const monthName = d.toLocaleDateString('en-US', { month: 'short' });
  const dayNum = d.getDate();
  const fullDayHeader = `${dayName}, ${monthName} ${dayNum}`;
  const isToday = selectedDate === '2026-08-31';

  // Initial scroll to 08:00
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 8 * hourHeight;
    }
  }, [hourHeight]);

  const visibleTasks = tasks.filter((t) => {
    if (t.date !== selectedDate) return false;
    if (selectedMemberId && t.member_id !== selectedMemberId) return false;
    return true;
  });

  const dayTotalMins = visibleTasks
    .filter((t) => t.entry_type === 'entry')
    .reduce((acc, curr) => acc + curr.duration_minutes, 0);

  const formatDayTotal = (mins: number) => {
    const totalSecs = mins * 60;
    const h = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
    const s = String(totalSecs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTimeTop = (currentHours * 60 + currentMinutes) * (hourHeight / 60);

  const plannedTasks = visibleTasks.filter((t) => t.entry_type === 'planned');
  const dayEntries = visibleTasks.filter((t) => t.entry_type === 'entry');

  const handleSlotClick = (hour: number) => {
    const startStr = `${String(hour).padStart(2, '0')}:00`;
    const endStr = `${String(hour + 1).padStart(2, '0')}:00`;
    openCreateModal({
      date: selectedDate,
      startTime: startStr,
      endTime: endStr,
      entryType: 'entry',
    });
  };

  const handleAddPlannedClick = () => {
    openCreateModal({
      date: selectedDate,
      startTime: '09:00',
      endTime: '10:00',
      entryType: 'planned',
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white overflow-hidden select-none">
      {/* ── Top Header Row with Zoom Controls & Single Day Header ── */}
      <div className="flex border-b border-slate-200 bg-white shrink-0 z-20 shadow-2xs">
        {/* Zoom Controls [- | +] */}
        <div className="w-16 sm:w-20 p-2 border-r border-slate-200 flex items-center justify-center">
          <div className="flex items-center border border-slate-200 rounded bg-slate-50 shadow-2xs overflow-hidden">
            <button
              onClick={zoomOut}
              disabled={zoomLevel <= 1}
              title="Zoom out"
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 disabled:opacity-30 disabled:hover:bg-transparent transition-colors border-r border-slate-200"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={zoomIn}
              disabled={zoomLevel >= 4}
              title="Zoom in"
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Single Day Header */}
        <div className="flex-1 py-2 px-4 text-center flex flex-col items-center justify-center">
          <div
            className={`text-xs font-semibold ${
              isToday ? 'text-[#03a9f4]' : 'text-slate-800'
            }`}
          >
            {fullDayHeader}
          </div>
          <div
            className={`font-mono text-xs font-medium mt-0.5 ${
              isToday ? 'text-[#03a9f4]' : 'text-slate-500'
            }`}
          >
            {formatDayTotal(dayTotalMins)}
          </div>
        </div>
      </div>

      {/* ── Planned Row ── */}
      <div className="flex border-b border-dashed border-slate-300 bg-slate-50/60 shrink-0 min-h-[42px]">
        <div className="w-16 sm:w-20 p-2 text-xs font-medium text-slate-500 flex items-center justify-center border-r border-slate-200 uppercase tracking-wider text-[11px]">
          Planned
        </div>

        <div className="flex-1 p-2 flex flex-wrap items-center gap-2">
          {plannedTasks.map((pt) => (
            <div key={pt.id} className="w-64">
              <CalendarTaskCard task={pt} isPlannedRow={true} />
            </div>
          ))}

          <button
            onClick={handleAddPlannedClick}
            title="Add planned task"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-600 hover:text-[#03a9f4] hover:bg-white rounded border border-dashed border-slate-300 transition-all"
          >
            <Plus className="w-3 h-3" />
            <span>Add Planned Task</span>
          </button>
        </div>
      </div>

      {/* ── 24-Hour Scrollable Day Grid ── */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden relative flex"
      >
        {/* Time Axis Labels */}
        <div className="w-16 sm:w-20 shrink-0 border-r border-slate-200 bg-white select-none">
          {hours.map((hour) => (
            <div
              key={hour}
              style={{ height: `${hourHeight}px` }}
              className="border-b border-dashed border-slate-200 text-right pr-2 text-xs text-slate-400 font-mono flex items-start justify-end pt-1"
            >
              <span>{String(hour).padStart(2, '0')}:00</span>
            </div>
          ))}
        </div>

        {/* Day Column */}
        <div className="flex-1 relative bg-white">
          {/* 24 Hour Slots */}
          {hours.map((hour) => (
            <div
              key={hour}
              onClick={() => handleSlotClick(hour)}
              style={{ height: `${hourHeight}px` }}
              className="border-b border-dashed border-slate-200 hover:bg-sky-50/40 transition-colors cursor-pointer group"
            >
              <div className="opacity-0 group-hover:opacity-60 text-[10px] text-slate-400 p-1 flex items-center gap-0.5">
                <Plus className="w-2.5 h-2.5" />
                <span>{String(hour).padStart(2, '0')}:00</span>
              </div>
            </div>
          ))}

          {/* Current Time Indicator Line */}
          {isToday && (
            <div
              style={{ top: `${currentTimeTop}px` }}
              className="absolute left-0 right-0 flex items-center z-30 pointer-events-none"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#03a9f4] -ml-1 border-2 border-white shadow-xs" />
              <div className="flex-1 border-t-2 border-[#03a9f4]" />
            </div>
          )}

          {/* Tasks */}
          {dayEntries.map((t) => {
            const [startH, startM] = t.start_time.split(':').map(Number);
            const top = (startH * 60 + (startM || 0)) * (hourHeight / 60);
            const height = Math.max(28, t.duration_minutes * (hourHeight / 60));

            return (
              <CalendarTaskCard
                key={t.id}
                task={t}
                top={top}
                height={height}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
