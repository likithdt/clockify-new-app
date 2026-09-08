import React, { useState, useRef } from "react";
import { QrCode, Tablet, Clock, Check, ChevronRight } from "lucide-react";

export function KiosksWelcomeCards() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const index = Math.round(scrollLeft / (clientWidth * 0.75));
    setActiveCardIndex(Math.min(2, Math.max(0, index)));
  };

  const scrollToCard = (index: number) => {
    if (!scrollRef.current) return;
    const cardWidth = 290;
    scrollRef.current.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
    setActiveCardIndex(index);
  };

  return (
    <div className="space-y-2 select-none">
      {/* Horizontal Swipe Deck */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto pb-2 pt-1 px-0.5 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Card 1: 1. Set up Kiosk */}
        <div className="w-[280px] min-w-[280px] shrink-0 snap-start bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#03A9F4] uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded-full">
                Step 1
              </span>
              <span className="text-[10px] text-[#94A3B8] font-medium">1 of 3</span>
            </div>
            <h3 className="text-sm font-bold text-[#1E293B]">
              1. Set up Kiosk
            </h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Assign members and choose an authentication method.
            </p>
          </div>

          {/* Card 1 Visual Mockup matching Kiosks.png */}
          <div className="mt-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 relative overflow-hidden min-h-[130px] flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="h-3.5 bg-[#E1F5FE] rounded w-3/4" />
              <div className="h-2.5 bg-slate-200 rounded w-1/2" />
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-[#1E293B] font-semibold">
              <span className="w-4 h-4 rounded bg-[#03A9F4] text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span>Requires PIN</span>
            </div>

            {/* Floating badge pill */}
            <div className="mt-2 bg-white border border-[#E2E8F0] rounded-lg shadow-2xs px-2 py-1 flex items-center gap-1.5 text-xs text-[#1E293B] font-semibold w-fit">
              <QrCode className="w-3.5 h-3.5 text-[#03A9F4]" />
              <span className="text-[10px]">Verify users with QR Code</span>
            </div>
          </div>
        </div>

        {/* Card 2: 2. Clock In and Out */}
        <div className="w-[280px] min-w-[280px] shrink-0 snap-start bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full">
                Step 2
              </span>
              <span className="text-[10px] text-[#94A3B8] font-medium">2 of 3</span>
            </div>
            <h3 className="text-sm font-bold text-[#1E293B]">
              2. Clock In and Out
            </h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Members can clock in and out and log daily breaks.
            </p>
          </div>

          {/* Card 2 Visual Mockup matching Kiosks.png */}
          <div className="mt-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 relative overflow-hidden min-h-[130px] flex items-center gap-2.5">
            {/* Left: User mini badge */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-xs font-bold text-[#D97706]">
                👤
              </div>
              <span className="text-[9px] text-[#64748B] font-mono font-bold">
                Day: 5:00
              </span>
            </div>

            {/* Right: Clock in / break buttons mockup */}
            <div className="flex-1 space-y-1 text-[9px] font-bold">
              <div className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] px-2 py-0.5 rounded text-center">
                CLOCK IN
              </div>
              <div className="bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] px-2 py-0.5 rounded text-center">
                START BREAK
              </div>
              <div className="bg-[#E1F5FE] border border-[#B3E5FC] text-[#0288D1] px-2 py-0.5 rounded text-center">
                CLOCK OUT
              </div>
            </div>

            {/* Floating badge pill */}
            <div className="absolute bottom-2 left-2 bg-white border border-[#E2E8F0] rounded-lg shadow-2xs px-2 py-1 flex items-center gap-1.5 text-[10px] text-[#1E293B] font-semibold">
              <Tablet className="w-3 h-3 text-[#03A9F4]" />
              <span>Use Kiosk on tablet</span>
            </div>
          </div>
        </div>

        {/* Card 3: 3. Track attendance */}
        <div className="w-[280px] min-w-[280px] shrink-0 snap-start bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded-full">
                Step 3
              </span>
              <span className="text-[10px] text-[#94A3B8] font-medium">3 of 3</span>
            </div>
            <h3 className="text-sm font-bold text-[#1E293B]">
              3. Track attendance
            </h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Use reports for monitoring team attendance and breaks.
            </p>
          </div>

          {/* Card 3 Visual Mockup matching Kiosks.png */}
          <div className="mt-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 relative overflow-hidden min-h-[130px] flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="h-2 bg-slate-200 rounded w-14" />
                </div>
                <span className="font-mono text-[9px] text-[#64748B] font-bold">8:00h</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  <span className="h-2 bg-slate-200 rounded w-18" />
                </div>
                <span className="font-mono text-[9px] text-[#64748B] font-bold">7:38h</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="h-2 bg-slate-200 rounded w-12" />
                </div>
                <span className="font-mono text-[9px] text-[#64748B] font-bold">8:00h</span>
              </div>
            </div>

            {/* Floating badge pill */}
            <div className="mt-2 bg-white border border-[#E2E8F0] rounded-lg shadow-2xs px-2 py-1 flex items-center gap-1.5 text-[10px] text-[#1E293B] font-semibold w-fit">
              <Clock className="w-3 h-3 text-[#03A9F4]" />
              <span>Realtime data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dot Indicators & Hint */}
      <div className="flex items-center justify-between px-1 text-[10px] text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToCard(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeCardIndex === idx
                  ? "w-5 bg-[#03A9F4]"
                  : "w-1.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
        <span className="flex items-center gap-0.5">
          <span>Swipe for more</span>
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}
