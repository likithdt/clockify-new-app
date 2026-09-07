import React from "react";
import { Plus, Keyboard, Play } from "lucide-react";

interface SpeedDialMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelectBreak: () => void;
  onSelectManual: () => void;
  onSelectTimer: () => void;
}

export const SpeedDialMenu: React.FC<SpeedDialMenuProps> = ({
  isOpen,
  onToggle,
  onClose,
  onSelectBreak,
  onSelectManual,
  onSelectTimer,
}) => {
  return (
    <>
      {/* Dimmed backdrop when speed dial is open */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-black/75 backdrop-blur-[0.5px] z-40 animate-fadeIn"
          onClick={onClose}
        />
      )}

      {/* Floating Action Container */}
      <div className="absolute bottom-6 right-5 z-40 flex flex-col items-end select-none">
        {/* Speed Dial Options matching WhatsApp Image 2026-09-06 at 9.57.48 AM.jpeg */}
        {isOpen ? (
          <div className="flex flex-col items-end space-y-4 animate-slideInUp">
            {/* Option 1: Break */}
            <div
              onClick={() => {
                onSelectBreak();
                onClose();
              }}
              className="flex items-center gap-3.5 cursor-pointer group active:scale-95 transition-transform"
            >
              <span className="text-[15px] font-semibold text-white tracking-wide">
                Break
              </span>
              <div className="w-12 h-12 bg-[#00b0ff] hover:bg-[#009be0] text-white flex items-center justify-center rounded-[16px] shadow-lg transition-transform">
                {/* Coffee cup matching screenshot */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 stroke-white fill-none stroke-[2.2] stroke-linecap-round stroke-linejoin-round"
                >
                  <path d="M17 8h1a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1" />
                  <path d="M5 8h12v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8z" />
                  <line x1="3" y1="20" x2="19" y2="20" />
                </svg>
              </div>
            </div>

            {/* Option 2: Manual */}
            <div
              onClick={() => {
                onSelectManual();
                onClose();
              }}
              className="flex items-center gap-3.5 cursor-pointer group active:scale-95 transition-transform"
            >
              <span className="text-[15px] font-semibold text-white tracking-wide">
                Manual
              </span>
              <div className="w-12 h-12 bg-[#00b0ff] hover:bg-[#009be0] text-white flex items-center justify-center rounded-[16px] shadow-lg transition-transform">
                <Keyboard className="w-6 h-6 text-white stroke-[2.2]" />
              </div>
            </div>

            {/* Option 3: Timer */}
            <div
              onClick={() => {
                onSelectTimer();
                onClose();
              }}
              className="flex items-center gap-3.5 cursor-pointer group active:scale-95 transition-transform"
            >
              <span className="text-[15px] font-semibold text-white tracking-wide">
                Timer
              </span>
              <div className="relative w-16 h-16">
                {/* Offset dark teal back plate matching screenshot */}
                <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#15465e] rounded-[20px]" />
                {/* Main cyan button */}
                <div className="relative w-full h-full bg-[#4fc3f7] rounded-[20px] flex items-center justify-center shadow-md">
                  <Play className="w-6 h-6 fill-[#0c2336] text-[#0c2336] ml-1" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Default '+' button when speed dial is closed */
          <div
            onClick={onToggle}
            className="relative w-16 h-16 cursor-pointer active:scale-95 transition-transform"
          >
            {/* Offset dark teal back plate matching screenshot */}
            <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#15465e] rounded-[20px]" />
            {/* Main cyan button with Plus icon */}
            <button
              type="button"
              className="relative w-full h-full bg-[#4fc3f7] hover:bg-[#38bdf8] rounded-[20px] flex items-center justify-center shadow-md text-[#0c2336] transition-colors"
              title="Add time entry"
            >
              <Plus className="w-7 h-7 stroke-[2.8]" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
