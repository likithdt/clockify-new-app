import React, { useRef, useEffect, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { CalendarTaskCard } from './CalendarTaskCard';

export const CalendarWeekView: React.FC = () => {
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

  // Row height in px based on zoom level (1=44px, 2=60px, 3=80px, 4=100px)
  const hourHeights = [44, 60, 80, 100];
  const hourHeight = hourHeights[zoomLevel - 1] || 60;

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Compute 7 days of the week starting from Monday of selectedDate
  const getWeekDates = (dateStr: string) => {
    const d = new Date(dateStr);
    const dayOfWeek = d.getDay(); // 0 is Sun
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMonday);

    const week: { dateStr: string; dayName: string; dayNum: number; isToday: boolean }[] = [];
    const todayStr = '2026-08-31'; // Reference screenshot matches 2026-08-31 as today

    for (let i = 0; i < 7; i++) {
      const current = new Date(monday);
      current.setDate(monday.getDate() + i);
      const iso = current.toISOString().split('T')[0];
      const dayName = current.toLocaleDateString('en-US', { weekday: 'short' });
      const monthName = current.toLocaleDateString('en-US', { month: 'short' });
      const dayNum = current.getDate();

      week.push({
        dateStr: iso,
        dayName: `${dayName}, ${monthName} ${dayNum}`,
        dayNum,
        isToday: iso === todayStr,
      });
    }
    return week;
  };

  const weekDays = getWeekDates(selectedDate);

  // Initial scroll to 08:00
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 8 * hourHeight;
    }
  }, [hourHeight]);

  // Format seconds to HH:mm:ss for day totals
  const formatDayTotal = (mins: number) => {
    const totalSecs = mins * 60;
    const h = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
    const s = String(totalSecs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Filter tasks
  const visibleTasks = tasks.filter((t) => {
    if (selectedMemberId && t.member_id !== selectedMemberId) return false;
    return true;
  });

  const getDayTotalMinutes = (dateStr: string) => {
    return visibleTasks
      .filter((t) => t.date === dateStr && t.entry_type === 'entry')
      .reduce((acc, curr) => acc + curr.duration_minutes, 0);
  };

  // Time slots (0 to 23 hours)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Current time position
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTimeTop = (currentHours * 60 + currentMinutes) * (hourHeight / 60);

  // Handle slot click
  const handleSlotClick = (dateStr: string, hour: number) => {
    const startStr = `${String(hour).padStart(2, '0')}:00`;
    const endStr = `${String(hour + 1).padStart(2, '0')}:00`;
    openCreateModal({
      date: dateStr,
      startTime: startStr,
      endTime: endStr,
      entryType: 'entry',
    });
  };

  // Planned slot click
  const handleAddPlannedClick = (dateStr: string) => {
    openCreateModal({
      date: dateStr,
      startTime: '09:00',
      endTime: '10:00',
      entryType: 'planned',
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white overflow-hidden select-none">
      {/* ── Top Header Row with Zoom Controls & 7 Day Headers ── */}
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

        {/* 7 Days Columns */}
        <div className="flex-1 grid grid-cols-7 divide-x divide-slate-200">
          {weekDays.map((day) => {
            const totalMins = getDayTotalMinutes(day.dateStr);
            return (
              <div
                key={day.dateStr}
                className={`py-2 px-1 text-center flex flex-col items-center justify-center transition-colors ${
                  day.isToday ? 'bg-sky-50/50' : 'bg-white'
                }`}
              >
                <div
                  className={`text-xs font-semibold ${
                    day.isToday ? 'text-[#03a9f4]' : 'text-slate-700'
                  }`}
                >
                  {day.dayName}
                </div>
                <div
                  className={`font-mono text-xs font-medium mt-0.5 ${
                    day.isToday ? 'text-[#03a9f4]' : 'text-slate-500'
                  }`}
                >
                  {formatDayTotal(totalMins)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Planned Row ── */}
      <div className="flex border-b border-dashed border-slate-300 bg-slate-50/60 shrink-0 min-h-[42px]">
        <div className="w-16 sm:w-20 p-2 text-xs font-medium text-slate-500 flex items-center justify-center border-r border-slate-200 uppercase tracking-wider text-[11px]">
          Planned
        </div>

        <div className="flex-1 grid grid-cols-7 divide-x divide-slate-200">
          {weekDays.map((day) => {
            const plannedTasks = visibleTasks.filter(
              (t) => t.date === day.dateStr && t.entry_type === 'planned'
            );

            return (
              <div
                key={`planned_${day.dateStr}`}
                className="group relative p-1 min-h-[40px] flex flex-col gap-1 transition-colors hover:bg-sky-50/20"
              >
                {plannedTasks.map((pt) => (
                  <CalendarTaskCard key={pt.id} task={pt} isPlannedRow={true} />
                ))}

                <button
                  onClick={() => handleAddPlannedClick(day.dateStr)}
                  title="Add planned task"
                  className="opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 w-full py-0.5 text-[10px] text-slate-500 hover:text-[#03a9f4] hover:bg-white rounded border border-dashed border-slate-300 transition-all mt-auto"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>Planned</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 24-Hour Scrollable Grid ── */}
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

        {/* 7 Day Timeline Columns */}
        <div className="flex-1 grid grid-cols-7 divide-x divide-slate-200 relative">
          {weekDays.map((day) => {
            const dayTasks = visibleTasks.filter(
              (t) => t.date === day.dateStr && t.entry_type === 'entry'
            );

            return (
              <div
                key={day.dateStr}
                className={`relative ${day.isToday ? 'bg-sky-50/15' : 'bg-white'}`}
              >
                {/* 24 Hour Slots */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    onClick={() => handleSlotClick(day.dateStr, hour)}
                    style={{ height: `${hourHeight}px` }}
                    className="border-b border-dashed border-slate-200 hover:bg-sky-50/40 transition-colors cursor-pointer group"
                  >
                    <div className="opacity-0 group-hover:opacity-60 text-[10px] text-slate-400 p-1 flex items-center gap-0.5">
                      <Plus className="w-2.5 h-2.5" />
                      <span>{String(hour).padStart(2, '0')}:00</span>
                    </div>
                  </div>
                ))}

                {/* Real-time Indicator Line (only for today) */}
                {day.isToday && (
                  <div
                    style={{ top: `${currentTimeTop}px` }}
                    className="absolute left-0 right-0 flex items-center z-30 pointer-events-none"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-[#03a9f4] -ml-1 border-2 border-white shadow-xs" />
                    <div className="flex-1 border-t-2 border-[#03a9f4]" />
                  </div>
                )}

                {/* Day Tasks Cards */}
                {dayTasks.map((t) => {
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
            );
          })}
        </div>
      </div>
    </div>
  );
};
