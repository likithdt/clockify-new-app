import React, { useEffect } from 'react';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { CalendarHeader } from './CalendarHeader';
import { CalendarWeekView } from './CalendarWeekView';
import { CalendarDayView } from './CalendarDayView';
import { CreateTaskModal } from './CreateTaskModal';
import { CalendarSettingsModal } from './CalendarSettingsModal';

export const CalendarPage: React.FC = () => {
  const { viewMode, fetchData, isLoading } = useCalendarStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Calendar Top Subheader Bar */}
      <CalendarHeader />

      {/* Main Calendar View Area */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {viewMode === 'week' ? <CalendarWeekView /> : <CalendarDayView />}

        {/* Subtle loading spinner overlay on initial fetch */}
        {isLoading && (
          <div className="absolute top-2 right-4 bg-white/90 border border-slate-200 px-3 py-1 rounded-full shadow-xs text-xs text-slate-500 flex items-center gap-2 z-40">
            <span className="w-2.5 h-2.5 border-2 border-[#03a9f4] border-t-transparent rounded-full animate-spin" />
            <span>Syncing calendar...</span>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateTaskModal />
      <CalendarSettingsModal />
    </div>
  );
};
