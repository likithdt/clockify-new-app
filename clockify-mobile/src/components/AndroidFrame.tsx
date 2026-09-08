import React from "react";
import { Wifi, Signal, Battery, MessageSquare, Sparkles, Mail } from "lucide-react";

interface AndroidFrameProps {
  children: React.ReactNode;
  onBackPress?: () => void;
  onHomePress?: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  onBackPress,
  onHomePress,
}) => {
  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center sm:py-4">
      {/* Mobile Device Container */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[880px] sm:max-h-[92vh] sm:rounded-[36px] bg-[#0f1216] text-white flex flex-col overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] sm:border-[5px] sm:border-[#222831] relative select-none">
        
        {/* Android Status Bar (matching reference screenshots) */}
        <div className="h-7 px-4 bg-[#0f1216] shrink-0 flex items-center justify-between text-xs text-white z-50 select-none">
          {/* Left: Time & notification icons */}
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-tight text-[13px]">12:32</span>
            <div className="flex items-center gap-1.5 opacity-80 scale-90">
              <MessageSquare className="w-3 h-3 text-white" />
              <Sparkles className="w-3 h-3 text-white" />
              <Mail className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Right: Phone, Wifi, Cellular, Battery */}
          <div className="flex items-center gap-1.5 opacity-90">
            <span className="text-[10px] scale-90 font-mono">VoLTE</span>
            <Wifi className="w-3.5 h-3.5" />
            <Signal className="w-3.5 h-3.5" />
            <div className="flex items-center">
              <Battery className="w-4 h-4 fill-white rotate-90" />
            </div>
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Android Navigation Bar (matching reference screenshots) */}
        <div className="h-10 bg-[#0f1216] shrink-0 border-t border-[#181c22] flex items-center justify-around px-8 z-40 select-none">
          {/* Recents button (three vertical bars) */}
          <button
            type="button"
            className="w-12 h-8 flex items-center justify-center opacity-60 hover:opacity-100 active:opacity-100 transition-opacity"
            title="Recents"
          >
            <div className="flex items-center gap-1">
              <span className="w-0.5 h-3.5 bg-white/70 rounded-full"></span>
              <span className="w-0.5 h-3.5 bg-white/70 rounded-full"></span>
              <span className="w-0.5 h-3.5 bg-white/70 rounded-full"></span>
            </div>
          </button>

          {/* Home button (circle) */}
          <button
            type="button"
            onClick={onHomePress}
            className="w-12 h-8 flex items-center justify-center opacity-60 hover:opacity-100 active:opacity-100 transition-opacity"
            title="Home"
          >
            <div className="w-3.5 h-3.5 rounded-full border-[1.8px] border-white/70"></div>
          </button>

          {/* Back button (chevron left) */}
          <button
            type="button"
            onClick={onBackPress}
            className="w-12 h-8 flex items-center justify-center opacity-60 hover:opacity-100 active:opacity-100 transition-opacity"
            title="Back"
          >
            <div className="w-2.5 h-2.5 border-l-2 border-b-2 border-white/70 -rotate-45 translate-x-0.5"></div>
          </button>
        </div>

      </div>
    </div>
  );
};
