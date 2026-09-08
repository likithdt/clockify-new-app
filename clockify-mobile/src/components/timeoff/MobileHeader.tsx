import { Bell, ChevronDown, Menu, Search } from 'lucide-react';

interface MobileHeaderProps {
  onMenu: () => void;
}

export function MobileHeader({ onMenu }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:h-16 md:px-6">
      <button type="button" aria-label="Open navigation" onClick={onMenu} className="rounded p-1.5 text-slate-600 shadow-none hover:bg-slate-100 md:hidden">
        <Menu size={22} />
      </button>
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#03a9f4] text-lg font-bold text-white">C</div>
        <span className="text-[21px] font-semibold tracking-tight text-slate-900">clockify</span>
      </div>
      <div className="flex items-center gap-1.5 text-slate-500">
        <button type="button" aria-label="Search" className="rounded p-2 shadow-none hover:bg-slate-100"><Search size={18} /></button>
        <button type="button" aria-label="Notifications" className="relative rounded p-2 shadow-none hover:bg-slate-100"><Bell size={18} /><span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-orange-500" /></button>
        <button type="button" aria-label="Account menu" className="flex items-center gap-1 rounded p-1 shadow-none hover:bg-slate-100"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#009688] text-xs font-semibold text-white">BS</span><ChevronDown size={14} className="hidden md:block" /></button>
      </div>
    </header>
  );
}