import React, { useState } from 'react';
import { useTimeOffStore } from '@/stores/useTimeOffStore';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Palmtree,
} from 'lucide-react';

export const TimelineTab: React.FC = () => {
  const { requests, members } = useTimeOffStore();
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [startDateOffset, setStartDateOffset] = useState<number>(0); // offset in days

  // Base start date: Sep 03, 2026
  const baseDate = new Date(2026, 8, 3); // Sept 3, 2026
  baseDate.setDate(baseDate.getDate() + startDateOffset);

  // Generate 25 days from baseDate
  const days = Array.from({ length: 25 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const dayNum = d.getDate();
    const formatted = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const dateString = d.toISOString().split('T')[0];
    const isToday = startDateOffset === 0 && i === 0;

    return {
      day: formatted,
      monthName,
      dateString,
      isToday,
      isWeekend,
      showMonth: i === 0 || dayNum === 1 || i % 7 === 0,
    };
  });

  const rangeStartStr = days[0].dateString;
  const rangeEndStr = days[days.length - 1].dateString;

  const formatRangeLabel = () => {
    const start = new Date(days[0].dateString);
    const end = new Date(days[days.length - 1].dateString);
    const sStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const eStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${sStr} – ${eStr}`;
  };

  const getMemberAvatar = (name: string) => {
    const clean = name.replace(/^\[SAMPLE\]\s*/, '');
    const initials = clean.slice(0, 2).toUpperCase();
    if (clean.includes('Amy')) {
      return (
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-xs">
          {initials}
        </div>
      );
    }
    if (clean.includes('Mike')) {
      return (
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-xs">
          {initials}
        </div>
      );
    }
    if (clean.includes('Lara')) {
      return (
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-400 to-rose-300 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-xs">
          {initials}
        </div>
      );
    }
    return (
      <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
        {initials}
      </div>
    );
  };

  const timelineMembers = members.filter((m) => {
    if (teamFilter !== 'all' && m.id !== teamFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          {/* Date range picker with navigation */}
          <div className="flex items-center bg-white border border-slate-300 rounded shadow-xs select-none">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatRangeLabel()}</span>
            </button>
            <div className="flex items-center border-l border-slate-200">
              <button
                type="button"
                onClick={() => setStartDateOffset((prev) => prev - 7)}
                className="p-1.5 hover:bg-slate-50 text-slate-500 cursor-pointer"
                title="Previous 7 days"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setStartDateOffset(0)}
                className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 border-l border-slate-200 cursor-pointer"
                title="Reset to today"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setStartDateOffset((prev) => prev + 7)}
                className="p-1.5 hover:bg-slate-50 text-slate-500 border-l border-slate-200 cursor-pointer"
                title="Next 7 days"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Team filter */}
          <div className="relative">
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-300 hover:border-slate-400 rounded px-3 py-1.5 pr-7 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-xs"
            >
              <option value="all">Team (All)</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name.replace(/^\[SAMPLE\]\s*/, '')}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Gantt Timeline Grid */}
      <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[950px]">
            {/* Header: Months & Days */}
            <div className="flex border-b border-slate-200 bg-[#f0f3f6] text-[11px] font-semibold text-slate-500 select-none">
              <div className="w-56 px-4 py-2.5 shrink-0 uppercase tracking-wider">
                Team member
              </div>
              <div className="flex-1 grid grid-cols-[repeat(25,minmax(0,1fr))] border-l border-slate-200 relative">
                {days.map((d) => (
                  <div
                    key={d.dateString}
                    className={`py-2 text-center border-r border-slate-100 flex flex-col items-center justify-center relative ${
                      d.isToday ? 'text-blue-600 font-bold bg-blue-50/40' : ''
                    } ${d.isWeekend ? 'bg-slate-100/50 text-slate-400' : ''}`}
                  >
                    {d.showMonth && (
                      <span className="text-[9px] text-slate-400 uppercase mb-0.5">
                        {d.monthName}
                      </span>
                    )}
                    <span>{d.day}</span>
                    {d.isToday && (
                      <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Member Rows */}
            <div className="divide-y divide-slate-100 text-xs">
              {timelineMembers.map((member) => {
                const cleanName = member.name.replace(/^\[SAMPLE\]\s*/, '');
                // Requests intersecting visible window
                const memberRequests = requests.filter(
                  (r) =>
                    r.member_id === member.id &&
                    r.status !== 'rejected' &&
                    r.status !== 'withdrawn' &&
                    r.start_date <= rangeEndStr &&
                    r.end_date >= rangeStartStr
                );

                return (
                  <div key={member.id} className="flex hover:bg-slate-50/70 transition-colors h-14 items-center">
                    {/* Member Column */}
                    <div className="w-56 px-4 shrink-0 flex items-center gap-2.5">
                      {getMemberAvatar(member.name)}
                      <span className="font-medium text-slate-800 truncate">{cleanName}</span>
                    </div>

                    {/* Timeline Day Slots */}
                    <div className="flex-1 grid grid-cols-[repeat(25,minmax(0,1fr))] border-l border-slate-200 h-full relative">
                      {days.map((d) => (
                        <div
                          key={d.dateString}
                          className={`border-r border-slate-100 h-full relative ${
                            d.isToday ? 'bg-blue-50/20' : ''
                          } ${d.isWeekend ? 'bg-slate-50/40' : ''}`}
                        >
                          {d.isToday && (
                            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-blue-400 z-10" />
                          )}
                        </div>
                      ))}

                      {/* Render Bars spanning across the grid */}
                      {memberRequests.map((req) => {
                        const startIdx = days.findIndex((d) => d.dateString >= req.start_date);
                        const effectiveStart = startIdx === -1 ? 0 : startIdx;

                        let endIdx = days.findIndex((d) => d.dateString > req.end_date);
                        if (endIdx === -1) endIdx = 25;

                        const span = Math.max(1, endIdx - effectiveStart);

                        return (
                          <div
                            key={req.id}
                            style={{
                              gridColumnStart: effectiveStart + 1,
                              gridColumnEnd: `span ${span}`,
                            }}
                            className={`absolute inset-y-2.5 flex items-center justify-center rounded px-2 text-white text-[11px] font-semibold shadow-xs cursor-pointer transition-transform hover:scale-[1.02] z-20 ${
                              req.status === 'approved'
                                ? 'bg-rose-500 hover:bg-rose-600'
                                : 'bg-amber-500 hover:bg-amber-600'
                            }`}
                            title={`${req.duration}d Time Off (${req.start_date} to ${req.end_date}) - ${req.status}`}
                          >
                            <Palmtree className="w-3.5 h-3.5 shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Date Bottom Indicator */}
        <div className="h-0.5 bg-blue-500 w-1/3 ml-56" />
      </div>
    </div>
  );
};
