import React from 'react';
import { useTimeOffStore } from '@/stores/useTimeOffStore';
import {
  Grid,
  ChevronDown,
  Puzzle,
  Bell,
  HelpCircle,
  Clock,
  Info,
} from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { sampleDataActive, removeSampleData } = useTimeOffStore();

  return (
    <header className="flex flex-col w-full shrink-0 border-b border-slate-200 z-30">
      {/* Blue Trial & Sample Data Banner */}
      {sampleDataActive && (
        <div className="bg-[#0288d1] text-white text-xs px-4 py-2 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-4 h-4 rounded-full border border-white/60 flex items-center justify-center text-[10px]">
              <Info className="w-3 h-3" />
            </span>
            <span>
              <strong>7 days left in trial</strong> — You are currently using sample data to help you explore.{' '}
              <button type="button" className="underline font-semibold hover:text-cyan-200 inline-flex items-center gap-0.5 cursor-pointer">
                Manage <ChevronDown className="w-3 h-3" />
              </button>
            </span>
          </div>
          <button
            type="button"
            onClick={removeSampleData}
            className="border border-white/80 hover:bg-white hover:text-[#0288d1] transition-all px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase cursor-pointer"
          >
            Remove Sample Data
          </button>
        </div>
      )}

      {/* Main Top App Bar */}
      <div className="h-12 bg-white px-4 flex items-center justify-between border-b border-slate-200 text-slate-700">
        <div className="flex items-center gap-4">
          {/* 9 dots grid menu */}
          <button type="button" className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer">
            <Grid className="w-4 h-4" />
          </button>

          {/* Clockify Logo */}
          <div className="flex items-center gap-1.5 cursor-pointer select-none">
            <div className="w-6 h-6 rounded-full bg-[#03a9f4] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight text-base">clockify</span>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Workspace Switcher */}
          <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded transition-colors text-xs font-medium text-slate-700">
            <span className="max-w-[240px] truncate uppercase font-semibold text-slate-600">
              GOPALAN COLLEGE OF ENGINEERING...
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Upgrade Button */}
          <button type="button" className="bg-[#03a9f4] hover:bg-[#0288d1] text-white text-[11px] font-semibold px-2.5 py-1 rounded tracking-wide uppercase transition-colors cursor-pointer">
            Upgrade
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer" title="Add-ons">
            <Puzzle className="w-4 h-4" />
          </button>

          <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full relative transition-colors cursor-pointer" title="Notifications">
            <Bell className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 bg-amber-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center pointer-events-none">
              2
            </span>
          </button>

          <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer" title="Help">
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Avatar Circle */}
          <div className="w-7 h-7 rounded-full bg-teal-600 text-white font-semibold text-xs flex items-center justify-center cursor-pointer shadow-sm ml-1 hover:ring-2 hover:ring-teal-400">
            BS
          </div>
        </div>
      </div>
    </header>
  );
};

