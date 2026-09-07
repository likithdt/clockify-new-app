import React from 'react';
import { Play, Trash2, Edit3, DollarSign, Clock } from 'lucide-react';
import type { CalendarTask } from '@/types/calendar';
import { useTimerStore } from '@/stores/useTimerStore';
import { useCalendarStore } from '@/stores/useCalendarStore';

interface CalendarTaskCardProps {
  task: CalendarTask;
  top?: number;
  height?: number;
  isPlannedRow?: boolean;
}

export const CalendarTaskCard: React.FC<CalendarTaskCardProps> = ({
  task,
  top,
  height,
  isPlannedRow = false,
}) => {
  const { openEditModal, deleteTask } = useCalendarStore();
  const { startTimer, setDescription, setProject } = useTimerStore();

  const handleStartTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDescription(task.title);
    setProject(task.project_name, task.project_color);
    startTimer();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  const formatMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  // Planned row compact pill
  if (isPlannedRow) {
    return (
      <div
        onClick={() => openEditModal(task)}
        className="group relative flex items-center justify-between gap-1.5 px-2 py-1 text-xs rounded border transition-all cursor-pointer shadow-2xs hover:shadow-xs select-none"
        style={{
          borderLeftColor: task.project_color,
          borderLeftWidth: '3px',
          backgroundColor: `${task.project_color}18`,
          borderColor: `${task.project_color}40`,
        }}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: task.project_color }}
          />
          <span className="font-medium text-slate-800 truncate text-[11px]">
            {task.title}
          </span>
          <span className="text-[10px] text-slate-500 truncate hidden sm:inline">
            ({task.project_name})
          </span>
        </div>

        <div className="hidden group-hover:flex items-center gap-1 shrink-0">
          <button
            onClick={handleStartTimer}
            title="Start timer for this task"
            className="p-0.5 rounded text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
          </button>
          <button
            onClick={handleDelete}
            title="Delete task"
            className="p-0.5 rounded text-rose-500 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  // Positioned block on the 24h timeline
  const isCompact = (height || 60) < 45;

  return (
    <div
      onClick={() => openEditModal(task)}
      style={{
        top: `${top}px`,
        height: `${Math.max(26, (height || 50) - 2)}px`,
        borderLeftColor: task.project_color,
        borderLeftWidth: '4px',
        backgroundColor: `${task.project_color}15`,
      }}
      className="absolute left-1 right-1 group rounded-r border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-150 cursor-pointer overflow-hidden p-1.5 flex flex-col justify-between z-10 hover:z-20 hover:border-slate-300"
    >
      {/* Top row: Title + Actions */}
      <div className="flex items-start justify-between gap-1 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-xs text-slate-900 truncate leading-tight flex items-center gap-1">
            <span>{task.title}</span>
            {task.is_billable && (
              <span title="Billable">
                <DollarSign className="w-3 h-3 text-emerald-600 shrink-0 inline stroke-[2.5]" />
              </span>
            )}
          </div>
          {!isCompact && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-0.5 truncate">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: task.project_color }}
              />
              <span className="font-medium truncate">{task.project_name}</span>
              {task.client_name && (
                <span className="text-slate-400 truncate">· {task.client_name}</span>
              )}
            </div>
          )}
        </div>

        {/* Hover action buttons */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 bg-white/90 backdrop-blur-xs rounded px-1 py-0.5 shadow-2xs">
          <button
            onClick={handleStartTimer}
            title="Start tracking time"
            className="p-1 rounded text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(task);
            }}
            title="Edit task"
            className="p-1 rounded text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            title="Delete task"
            className="p-1 rounded text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Bottom row: Time interval & duration & tags */}
      {!isCompact && (
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-auto pt-1">
          <div className="flex items-center gap-1 truncate">
            <Clock className="w-2.5 h-2.5 text-slate-400" />
            <span>
              {task.start_time} - {task.end_time}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {task.tags && task.tags.length > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-white/80 border border-slate-200 text-[10px] text-slate-600 font-sans truncate max-w-[70px]">
                {task.tags[0]}
                {task.tags.length > 1 ? ` +${task.tags.length - 1}` : ''}
              </span>
            )}
            <span className="font-semibold text-slate-700 bg-white/70 px-1.5 py-0.2 rounded border border-slate-200/60">
              {formatMinutes(task.duration_minutes)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
