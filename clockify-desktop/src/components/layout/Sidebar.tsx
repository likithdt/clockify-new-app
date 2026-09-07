import React from 'react';
import {
  Clock,
  Calendar,
  CalendarDays,
  Receipt,
  Palmtree,
  LayoutGrid,
  BarChart3,
  Smartphone,
  CheckSquare,
  FolderKanban,
  Users,
  Building2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface SidebarProps {
  currentView: 'tracker' | 'timeoff' | 'calendar';
  onSelectView: (view: 'tracker' | 'timeoff' | 'calendar') => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  collapsed = false,
  onToggleCollapse,
}) => {
  return (
    <aside
      className={`${
        collapsed ? 'w-14' : 'w-52'
      } bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 transition-all duration-200 select-none text-[13px]`}
    >
      <div className="py-2 overflow-y-auto">
        {/* Main tracking tools */}
        <div className="space-y-0.5">
          <button
            onClick={() => onSelectView('tracker')}
            className={`w-full flex items-center justify-between px-3 py-2 transition-colors ${
              currentView === 'tracker'
                ? 'bg-sky-50 text-[#03a9f4] font-semibold border-l-4 border-[#03a9f4]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 shrink-0" />
              {!collapsed && <span>TIME TRACKER</span>}
            </div>
          </button>

          <button
            onClick={() => onSelectView('calendar')}
            className={`w-full flex items-center justify-between px-3 py-2 transition-colors ${
              currentView === 'calendar'
                ? 'bg-sky-50 text-[#03a9f4] font-semibold border-l-4 border-[#03a9f4]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 shrink-0" />
              {!collapsed && <span>CALENDAR</span>}
            </div>
          </button>

          <button
            className="w-full flex items-center justify-between px-3 py-2 text-slate-600 hover:bg-slate-50 border-l-4 border-transparent transition-colors"
          >
            <div className="flex items-center gap-3">
              <CalendarDays className="w-4 h-4 shrink-0" />
              {!collapsed && <span>SCHEDULE</span>}
            </div>
            {!collapsed && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          <button
            className="w-full flex items-center justify-between px-3 py-2 text-slate-600 hover:bg-slate-50 border-l-4 border-transparent transition-colors"
          >
            <div className="flex items-center gap-3">
              <Receipt className="w-4 h-4 shrink-0" />
              {!collapsed && <span>EXPENSES</span>}
            </div>
          </button>

          {/* TIME OFF - Main active feature */}
          <button
            onClick={() => onSelectView('timeoff')}
            className={`w-full flex items-center justify-between px-3 py-2 transition-colors ${
              currentView === 'timeoff'
                ? 'bg-sky-50 text-[#03a9f4] font-semibold border-l-4 border-[#03a9f4]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Palmtree className="w-4 h-4 shrink-0" />
              {!collapsed && <span>TIME OFF</span>}
            </div>
            {!collapsed && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            )}
          </button>
        </div>

        {/* ANALYZE Section */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          {!collapsed && (
            <div className="px-3 pb-1 text-[11px] font-bold text-slate-400 tracking-wider">
              ANALYZE
            </div>
          )}
          <div className="space-y-0.5">
            <button className="w-full flex items-center px-3 py-2 text-slate-600 hover:bg-slate-50 border-l-4 border-transparent transition-colors">
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4 shrink-0" />
                {!collapsed && <span>DASHBOARD</span>}
              </div>
            </button>

            <button className="w-full flex items-center justify-between px-3 py-2 text-slate-600 hover:bg-slate-50 border-l-4 border-transparent transition-colors">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 shrink-0" />
                {!collapsed && <span>REPORTS</span>}
              </div>
              {!collapsed && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* MANAGE Section */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          {!collapsed && (
            <div className="px-3 pb-1 text-[11px] font-bold text-slate-400 tracking-wider">
              MANAGE
            </div>
          )}
          <div className="space-y-0.5">
            <button className="w-full flex items-center px-3 py-2 text-slate-600 hover:bg-slate-50 border-l-4 border-transparent transition-colors">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 shrink-0" />
                {!collapsed && <span>KIOSKS</span>}
              </div>
            </button>

            <button className="w-full flex items-center justify-between px-3 py-2 text-slate-600 hover:bg-slate-50 border-l-4 border-transparent transition-colors">
              <div className="flex items-center gap-3">
                <CheckSquare className="w-4 h-4 shrink-0" />
                {!collapsed && <span>APPROVALS</span>}
              </div>
              {!collapsed && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
            </button>

            <button className="w-full flex items-center px-3 py-2 text-slate-600 hover:bg-slate-50 border-l-4 border-transparent transition-colors">
              <div className="flex items-center gap-3">
                <FolderKanban className="w-4 h-4 shrink-0" />
                {!collapsed && <span>PROJECTS</span>}
              </div>
            </button>

            <button className="w-full flex items-center px-3 py-2 text-slate-600 hover:bg-slate-50 border-l-4 border-transparent transition-colors">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 shrink-0" />
                {!collapsed && <span>TEAM</span>}
              </div>
            </button>

            <button className="w-full flex items-center px-3 py-2 text-slate-600 hover:bg-slate-50 border-l-4 border-transparent transition-colors">
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 shrink-0" />
                {!collapsed && <span>CLIENTS</span>}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Collapse button */}
      {onToggleCollapse && (
        <div className="p-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onToggleCollapse}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded text-xs flex items-center gap-1"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      )}
    </aside>
  );
};
