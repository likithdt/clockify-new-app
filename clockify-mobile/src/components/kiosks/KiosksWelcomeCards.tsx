import { QrCode, Tablet, Clock, Check } from "lucide-react";

export function KiosksWelcomeCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1100px] mx-auto select-none">
            {/* Card 1: 1. Set up Kiosk */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm flex flex-col justify-between overflow-hidden relative group hover:shadow-md transition">
                <div>
                    <h3 className="text-base font-bold text-[#1E293B]">
                        1. Set up Kiosk
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                        Assign members and choose an authentication method.
                    </p>
                </div>

                {/* Card 1 Visual Mockup */}
                <div className="mt-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3.5 relative overflow-hidden min-h-[140px] flex flex-col justify-between">
                    <div className="space-y-2">
                        {/* Mock text inputs */}
                        <div className="h-4 bg-[#E1F5FE] rounded w-3/4" />
                        <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs text-[#1E293B] font-medium">
                        <span className="w-4 h-4 rounded bg-[#03A9F4] text-white flex items-center justify-center text-[10px]">
                            <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                        <span>Requires PIN</span>
                    </div>

                    {/* Floating badge pill */}
                    <div className="absolute bottom-2.5 right-2.5 bg-white border border-[#E2E8F0] rounded-lg shadow-sm px-2.5 py-1.5 flex items-center gap-1.5 text-xs text-[#1E293B] font-semibold">
                        <QrCode className="w-3.5 h-3.5 text-[#03A9F4]" />
                        <span className="text-[11px]">Verify users with QR Code</span>
                    </div>
                </div>
            </div>

            {/* Card 2: 2. Clock In and Out */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm flex flex-col justify-between overflow-hidden relative group hover:shadow-md transition">
                <div>
                    <h3 className="text-base font-bold text-[#1E293B]">
                        2. Clock In and Out
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                        Members can clock in and out and log daily breaks.
                    </p>
                </div>

                {/* Card 2 Visual Mockup */}
                <div className="mt-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3.5 relative overflow-hidden min-h-[140px] flex items-center gap-3">
                    {/* Left: User mini badge */}
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="w-7 h-7 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[11px] font-bold text-[#D97706]">
                            👤
                        </div>
                        <span className="text-[10px] text-[#64748B] font-mono">
                            Day: 5:00
                        </span>
                    </div>

                    {/* Right: Clock in / break buttons mock */}
                    <div className="flex-1 space-y-1.5 text-[10px] font-bold">
                        <div className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] px-2 py-1 rounded text-center">
                            CLOCK IN
                        </div>
                        <div className="bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] px-2 py-1 rounded text-center">
                            START BREAK
                        </div>
                        <div className="bg-[#E1F5FE] border border-[#B3E5FC] text-[#0288D1] px-2 py-1 rounded text-center">
                            CLOCK OUT
                        </div>
                    </div>

                    {/* Floating badge pill */}
                    <div className="absolute bottom-2.5 left-2 bg-white border border-[#E2E8F0] rounded-lg shadow-sm px-2.5 py-1.5 flex items-center gap-1.5 text-xs text-[#1E293B] font-semibold">
                        <Tablet className="w-3.5 h-3.5 text-[#03A9F4]" />
                        <span className="text-[11px]">Use Kiosk on tablet</span>
                    </div>
                </div>
            </div>

            {/* Card 3: 3. Track attendance */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm flex flex-col justify-between overflow-hidden relative group hover:shadow-md transition">
                <div>
                    <h3 className="text-base font-bold text-[#1E293B]">
                        3. Track attendance
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                        Use reports for monitoring team attendance and breaks.
                    </p>
                </div>

                {/* Card 3 Visual Mockup */}
                <div className="mt-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3.5 relative overflow-hidden min-h-[140px] flex flex-col justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                                <span className="h-2.5 bg-slate-200 rounded w-16" />
                            </div>
                            <span className="font-mono text-[10px] text-[#64748B]">8:00h</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                                <span className="h-2.5 bg-slate-200 rounded w-20" />
                            </div>
                            <span className="font-mono text-[10px] text-[#64748B]">7:38h</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                                <span className="h-2.5 bg-slate-200 rounded w-14" />
                            </div>
                            <span className="font-mono text-[10px] text-[#64748B]">8:00h</span>
                        </div>
                    </div>

                    {/* Floating badge pill */}
                    <div className="absolute bottom-2.5 left-2.5 bg-white border border-[#E2E8F0] rounded-lg shadow-sm px-2.5 py-1.5 flex items-center gap-1.5 text-xs text-[#1E293B] font-semibold">
                        <Clock className="w-3.5 h-3.5 text-[#03A9F4]" />
                        <span className="text-[11px]">Realtime data</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
