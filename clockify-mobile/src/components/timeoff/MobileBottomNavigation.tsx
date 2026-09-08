import { CalendarDays, Clock3, MoreHorizontal, Palmtree } from 'lucide-react';

interface MobileBottomNavigationProps {
  active: string;
  onChange: (value: string) => void;
}

export function MobileBottomNavigation({ active, onChange }: MobileBottomNavigationProps) {
  const items = [
    { id: 'tracker', label: 'Tracker', icon: Clock3 },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'timeoff', label: 'Time off', icon: Palmtree },
    { id: 'more', label: 'More', icon: MoreHorizontal },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid h-[66px] grid-cols-4 border-t border-slate-200 bg-white pb-1 md:hidden">
      {items.map(({ id, label, icon: Icon }) => (
        <button key={id} type="button" onClick={() => onChange(id)} className={`flex flex-col items-center justify-center gap-1 text-[10px] shadow-none ${active === id ? 'text-[#03a9f4]' : 'text-slate-500'}`}>
          <Icon size={20} strokeWidth={active === id ? 2.4 : 1.8} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}