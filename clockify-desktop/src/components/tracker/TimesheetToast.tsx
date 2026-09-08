import { useState } from "react";
import { CalendarClock, X } from "lucide-react";

interface Props {
    onEnableTimesheet?: () => void;
}

export function TimesheetToast({ onEnableTimesheet }: Props) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 bg-white border border-[#E2E8F0] rounded-lg shadow-lg p-3.5 flex items-center gap-3.5 z-40 max-w-sm animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] flex-shrink-0">
                <CalendarClock className="w-5 h-5 text-[#64748B]" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1E293B]">
                    Prefer to enter hours in Timesheet?
                </p>
                <button
                    type="button"
                    onClick={onEnableTimesheet}
                    className="text-xs font-semibold text-[#03A9F4] hover:text-[#0288D1] hover:underline cursor-pointer block mt-0.5"
                >
                    Enable Timesheet
                </button>
            </div>

            <button
                type="button"
                onClick={() => setIsVisible(false)}
                className="text-[#94A3B8] hover:text-[#1E293B] p-1 rounded transition cursor-pointer"
                title="Dismiss"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
