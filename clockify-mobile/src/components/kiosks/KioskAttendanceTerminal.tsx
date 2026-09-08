import React from "react";
import { useKioskStore } from "@/stores/useKioskStore";
import { Monitor, ArrowLeft, CheckCircle2, Coffee, LogIn, LogOut, Delete } from "lucide-react";

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
    <div className="flex-1 flex flex-col h-full bg-[#F5F6F8] overflow-y-auto select-none font-sans relative">
      {/* Top Station Header */}
      <header className="h-14 bg-white border-b border-[#E2E8F0] px-4 flex items-center justify-between sticky top-0 z-20 shrink-0 shadow-2xs">
        <button
          type="button"
          onClick={closeTerminal}
          className="h-8 px-2.5 bg-white border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit</span>
        </button>

        <div className="flex items-center gap-1.5 min-w-0 px-2">
          <Monitor className="w-4 h-4 text-[#03A9F4] shrink-0" />
          <span className="text-xs font-bold text-[#1E293B] truncate max-w-[130px]">
            {currentKiosk?.name || "Kiosk Station"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-[#10B981] font-bold bg-[#ECFDF5] px-2 py-1 rounded-full border border-[#A7F3D0] shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span>ONLINE</span>
        </div>
      </header>

      {/* Main Terminal Body */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white border border-[#E2E8F0] rounded-2xl shadow-lg p-6 text-center animate-fadeIn">
          {/* Top Terminal Icon */}
          <div className="w-12 h-12 bg-[#E1F5FE] text-[#03A9F4] rounded-full mx-auto flex items-center justify-center mb-3 shadow-xs">
            <Monitor className="w-6 h-6" />
          </div>

          <h2 className="text-base font-bold text-[#1E293B] truncate">
            {currentKiosk?.name || "Reception Kiosk Station"}
          </h2>

          {terminalStatus === "SUCCESS" ? (
            /* Success State */
            <div className="py-6 space-y-3 animate-fadeIn">
              <CheckCircle2 className="w-14 h-14 text-[#10B981] mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-[#1E293B]">
                {successMessage}
              </h3>
              <p className="text-xs text-[#64748B]">
                Attendance logged. Returning to PIN screen...
              </p>
            </div>
          ) : terminalStatus === "AUTHENTICATED" ? (
            /* Member Authenticated - Choose Clock In / Out */
            <div className="py-4 space-y-4 animate-fadeIn">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#03A9F4] bg-sky-50 px-2.5 py-0.5 rounded-full">
                  Authenticated
                </span>
                <h3 className="text-lg font-bold text-[#1E293B] mt-1.5">
                  Welcome, {terminalUser}!
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Select your action:
                </p>
              </div>

              <div className="space-y-2 text-xs font-bold w-full">
                <button
                  type="button"
                  onClick={() => recordAttendance("CLOCK_IN")}
                  className="w-full py-3 bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] text-[#047857] rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs active:scale-95"
                >
                  <LogIn className="w-4 h-4" />
                  <span>CLOCK IN</span>
                </button>

                <button
                  type="button"
                  onClick={() => recordAttendance("START_BREAK")}
                  className="w-full py-3 bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs active:scale-95"
                >
                  <Coffee className="w-4 h-4" />
                  <span>START BREAK</span>
                </button>

                <button
                  type="button"
                  onClick={() => recordAttendance("CLOCK_OUT")}
                  className="w-full py-3 bg-[#E1F5FE] hover:bg-[#BAE6FD] border border-[#B3E5FC] text-[#0288D1] rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  <span>CLOCK OUT</span>
                </button>
              </div>

              <button
                type="button"
                onClick={clearTerminalPin}
                className="text-xs text-[#94A3B8] hover:text-[#1E293B] underline cursor-pointer pt-1"
              >
                Not you? Switch member
              </button>
            </div>
          ) : (
            /* PIN Entry Mode */
            <>
              <p className="text-xs text-[#64748B] mt-1">
                Enter your 4-digit personal PIN to sign in
              </p>

              {/* 4 PIN Dots */}
              <div className="my-5">
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((index) => {
                    const isFilled = terminalPin.length > index;
                    return (
                      <span
                        key={index}
                        className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
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
              <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto mb-4">
                {keypadNumbers.map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => enterTerminalDigit(num)}
                    className="h-11 bg-[#F8FAFC] hover:bg-[#E1F5FE] border border-[#E2E8F0] rounded-xl font-bold text-base text-[#1E293B] active:scale-90 transition cursor-pointer shadow-2xs"
                  >
                    {num}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={clearTerminalPin}
                  className="h-11 bg-white hover:bg-[#FEE2E2] border border-[#CBD5E1] rounded-xl font-bold text-xs text-[#EF4444] active:scale-90 transition cursor-pointer shadow-2xs"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={() => enterTerminalDigit("0")}
                  className="h-11 bg-[#F8FAFC] hover:bg-[#E1F5FE] border border-[#E2E8F0] rounded-xl font-bold text-base text-[#1E293B] active:scale-90 transition cursor-pointer shadow-2xs"
                >
                  0
                </button>

                <button
                  type="button"
                  onClick={submitTerminalPin}
                  className="h-11 bg-[#03A9F4] hover:bg-[#0288D1] text-white rounded-xl font-bold text-xs active:scale-90 transition cursor-pointer shadow-2xs"
                >
                  Enter
                </button>
              </div>

              <p className="text-[10px] text-[#94A3B8]">
                Tip: Enter any 4 digits (e.g. 1234) to sign in.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
