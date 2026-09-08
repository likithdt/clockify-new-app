import { useKioskStore } from "@/stores/useKioskStore";
import { Monitor, ArrowLeft, CheckCircle2, Coffee, LogIn, LogOut } from "lucide-react";

export function KioskAttendanceTerminal() {
    const {
        activeTerminalKioskId,
        kiosks,
        terminalPin,
        terminalUser,
        terminalStatus,
        successMessage,
        closeTerminal,
        enterTerminalDigit,
        clearTerminalPin,
        submitTerminalPin,
        recordAttendance,
    } = useKioskStore();

    const currentKiosk = kiosks.find((k) => k.id === activeTerminalKioskId);

    const keypadNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#F5F6F8] overflow-y-auto select-none">
            {/* Top Navigation Bar */}
            <header className="h-14 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-20 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={closeTerminal}
                        className="px-3 py-1.5 bg-white border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] text-xs font-semibold rounded flex items-center gap-1.5 transition cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Exit Station</span>
                    </button>

                    <div className="h-4 w-px bg-[#E2E8F0]" />

                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1E293B]">
                        <Monitor className="w-4 h-4 text-[#03A9F4]" />
                        <span>{currentKiosk?.name || "Kiosk Station"}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#10B981] font-semibold bg-[#ECFDF5] px-2.5 py-1 rounded-full border border-[#A7F3D0]">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span>Station Online · IP: {currentKiosk?.deviceIp || "192.168.1.140"}</span>
                </div>
            </header>

            {/* Main Terminal Screen */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-8 text-center animate-in fade-in zoom-in-95 duration-200">
                    {/* Top Terminal Icon */}
                    <div className="w-14 h-14 bg-[#E1F5FE] text-[#03A9F4] rounded-full mx-auto flex items-center justify-center mb-4 shadow-xs">
                        <Monitor className="w-7 h-7" />
                    </div>

                    <h2 className="text-xl font-bold text-[#1E293B]">
                        {currentKiosk?.name || "Gopalan Campus Reception Kiosk"}
                    </h2>

                    {terminalStatus === "SUCCESS" ? (
                        <div className="py-8 space-y-3 animate-in fade-in">
                            <CheckCircle2 className="w-16 h-16 text-[#10B981] mx-auto animate-bounce" />
                            <h3 className="text-lg font-bold text-[#1E293B]">
                                {successMessage}
                            </h3>
                            <p className="text-xs text-[#64748B]">
                                Attendance logged. Returning to PIN screen...
                            </p>
                        </div>
                    ) : terminalStatus === "AUTHENTICATED" ? (
                        /* Member Authenticated - Choose Clock In / Out */
                        <div className="py-6 space-y-5 animate-in fade-in">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#03A9F4]">
                                    Authenticated Member
                                </span>
                                <h3 className="text-xl font-bold text-[#1E293B] mt-0.5">
                                    Welcome, {terminalUser}!
                                </h3>
                                <p className="text-xs text-[#64748B] mt-1">
                                    Select your attendance action below:
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 max-w-xs mx-auto text-xs font-bold">
                                <button
                                    type="button"
                                    onClick={() => recordAttendance("CLOCK_IN")}
                                    className="p-3 bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] text-[#047857] rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>CLOCK IN</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => recordAttendance("START_BREAK")}
                                    className="p-3 bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                                >
                                    <Coffee className="w-4 h-4" />
                                    <span>START BREAK</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => recordAttendance("CLOCK_OUT")}
                                    className="p-3 bg-[#E1F5FE] hover:bg-[#BAE6FD] border border-[#B3E5FC] text-[#0288D1] rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>CLOCK OUT</span>
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={clearTerminalPin}
                                className="text-xs text-[#94A3B8] hover:text-[#1E293B] underline cursor-pointer"
                            >
                                Not you? Switch member
                            </button>
                        </div>
                    ) : (
                        /* PIN Entry Mode */
                        <>
                            <p className="text-xs text-[#64748B] mt-1">
                                Enter your 4-digit personal PIN to Clock In / Out
                            </p>

                            {/* 4 PIN Dots */}
                            <div className="my-6">
                                <div className="flex justify-center gap-4">
                                    {[0, 1, 2, 3].map((index) => {
                                        const isFilled = terminalPin.length > index;
                                        return (
                                            <span
                                                key={index}
                                                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                                                    isFilled
                                                        ? "bg-[#03A9F4] scale-110 shadow-xs"
                                                        : "bg-slate-200"
                                                }`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Numeric Keypad */}
                            <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto mb-6">
                                {keypadNumbers.map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => enterTerminalDigit(num)}
                                        className="h-12 bg-[#F8FAFC] hover:bg-[#E1F5FE] border border-[#E2E8F0] rounded-xl font-bold text-base text-[#1E293B] active:scale-95 transition cursor-pointer shadow-xs"
                                    >
                                        {num}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    onClick={clearTerminalPin}
                                    className="h-12 bg-white hover:bg-[#FEE2E2] border border-[#CBD5E1] rounded-xl font-bold text-xs text-[#EF4444] active:scale-95 transition cursor-pointer shadow-xs"
                                >
                                    Clear
                                </button>

                                <button
                                    type="button"
                                    onClick={() => enterTerminalDigit("0")}
                                    className="h-12 bg-[#F8FAFC] hover:bg-[#E1F5FE] border border-[#E2E8F0] rounded-xl font-bold text-base text-[#1E293B] active:scale-95 transition cursor-pointer shadow-xs"
                                >
                                    0
                                </button>

                                <button
                                    type="button"
                                    onClick={submitTerminalPin}
                                    className="h-12 bg-[#03A9F4] hover:bg-[#0288D1] text-white rounded-xl font-bold text-xs active:scale-95 transition cursor-pointer shadow-xs"
                                >
                                    Enter
                                </button>
                            </div>

                            <p className="text-[11px] text-[#94A3B8]">
                                Tip: Enter any 4 numbers (e.g. 1234) to sign in.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
