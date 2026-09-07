import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Settings,
  Users,
  Check,
} from 'lucide-react';
import { useCalendarStore } from '@/stores/useCalendarStore';

export const CalendarHeader: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    selectedDate,
    selectedMemberId,
    setSelectedMemberId,
    goToToday,
    nextPeriod,
    prevPeriod,
    openSettingsModal,
    members,
  } = useCalendarStore();

  const [isTeammateDropdownOpen, setIsTeammateDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTeammateDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format date range or single date
  const formatHeaderDate = () => {
    const d = new Date(selectedDate);
    if (viewMode === 'day') {
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }

    // Week view: compute start (Monday) and end (Sunday)
    const dayOfWeek = d.getDay(); // 0 is Sunday
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(d);
    monday.setDate(d.getDate() + distanceToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const monMonth = monday.toLocaleDateString('en-US', { month: 'short' });
    const sunMonth = sunday.toLocaleDateString('en-US', { month: 'short' });
    const monDay = monday.getDate();
    const sunDay = sunday.getDate();
    const year = sunday.getFullYear();

    if (monMonth === sunMonth) {
      return `${monMonth} ${monDay} - ${sunDay}, ${year}`;
    }
    return `${monMonth} ${monDay} - ${sunMonth} ${sunDay}, ${year}`;
  };

  const currentMember = members.find((m) => m.id === selectedMemberId);

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 select-none shadow-2xs">
      {/* Left side: CALENDAR button & Week/Day segmented toggle */}
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <span className="px-3 py-1.5 text-xs font-bold text-slate-500 tracking-wider uppercase border border-slate-200 rounded-l bg-slate-50">
            CALENDAR
          </span>

          {/* Segmented toggle for Week | Day */}
          <div className="flex items-center border border-l-0 border-slate-200 rounded-r bg-slate-100 p-0.5 text-xs">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 font-medium rounded-xs transition-all ${
                viewMode === 'week'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 font-medium rounded-xs transition-all ${
                viewMode === 'day'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Day
            </button>
          </div>
        </div>
      </div>

      {/* Right side: Settings, Teammates, Date picker */}
      <div className="flex items-center gap-3">
        {/* Settings gear icon */}
        <button
          onClick={openSettingsModal}
          title="Calendar Settings"
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Teammates dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsTeammateDropdownOpen(!isTeammateDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span className="max-w-[140px] truncate">
              {currentMember ? currentMember.name : 'Teammates'}
            </span>
            <span className="text-[10px] text-slate-400">▼</span>
          </button>

          {isTeammateDropdownOpen && (
            <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded shadow-lg py-1 z-50 text-xs">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Filter by Teammate
              </div>
              <button
                onClick={() => {
                  setSelectedMemberId(null);
                  setIsTeammateDropdownOpen(false);
                }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 ${
                  selectedMemberId === null ? 'bg-sky-50 text-[#03a9f4] font-medium' : 'text-slate-700'
                }`}
              >
                <span>All Teammates</span>
                {selectedMemberId === null && <Check className="w-3.5 h-3.5" />}
              </button>

              <div className="border-t border-slate-100 my-1" />

              <div className="max-h-52 overflow-y-auto">
                {members.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => {
                      setSelectedMemberId(member.id);
                      setIsTeammateDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 ${
                      selectedMemberId === member.id
                        ? 'bg-sky-50 text-[#03a9f4] font-medium'
                        : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <span className="truncate">{member.name}</span>
                    </div>
                    {selectedMemberId === member.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Date Navigator Group */}
        <div className="flex items-center border border-slate-200 rounded shadow-2xs bg-white">
          <button
            onClick={goToToday}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors border-r border-slate-200"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Today</span>
          </button>

          <button
            onClick={prevPeriod}
            title="Previous"
            className="p-1.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors border-r border-slate-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 text-xs font-semibold text-slate-800 min-w-[140px] text-center">
            {formatHeaderDate()}
          </span>

          <button
            onClick={nextPeriod}
            title="Next"
            className="p-1.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
