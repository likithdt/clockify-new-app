import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // DD/MM/YYYY
  onSelectDate: (date: string) => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
}) => {
  // Parse initial DD/MM/YYYY or fallback to 07/09/2026
  const parseDate = (dStr: string) => {
    const parts = dStr.split("/");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return { day, month, year };
      }
    }
    return { day: 7, month: 8, year: 2026 }; // Sep 7, 2026
  };

  const initial = parseDate(selectedDate);
  const [currentYear, setCurrentYear] = useState(initial.year);
  const [currentMonth, setCurrentMonth] = useState(initial.month);
  const [pickedDay, setPickedDay] = useState(initial.day);
  const [isManualInput, setIsManualInput] = useState(false);
  const [manualInputVal, setManualInputVal] = useState(selectedDate);

  if (!isOpen) return null;

  // Days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Day of week of 1st day (0=Sunday, 1=Monday... we want Monday=0)
  const getFirstDayOfWeek = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    // In JavaScript 0 is Sunday. For Monday start: (day + 6) % 7
    return (firstDay + 6) % 7;
  };

  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfWeek(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleConfirm = () => {
    if (isManualInput) {
      onSelectDate(manualInputVal);
    } else {
      const dd = String(pickedDay).padStart(2, "0");
      const mm = String(currentMonth + 1).padStart(2, "0");
      const yyyy = String(currentYear);
      onSelectDate(`${dd}/${mm}/${yyyy}`);
    }
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 select-none animate-fadeIn">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Dialog Card - matching Screenshot 4 */}
      <div className="relative w-full max-w-[325px] bg-white rounded-[28px] shadow-2xl p-6 z-10 animate-scaleUp">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[12px] font-medium text-[#4b5563] tracking-wide">
              Select Date
            </span>
            <h2 className="text-[28px] font-bold text-[#111827] mt-1 tracking-tight">
              {MONTH_SHORT[currentMonth]} {pickedDay}, {currentYear}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsManualInput(!isManualInput)}
            className="p-1.5 text-[#374151] hover:bg-gray-100 rounded-full transition-colors mt-2"
            title="Edit date manually"
          >
            <Pencil className="w-5 h-5 text-[#374151]" />
          </button>
        </div>

        {isManualInput ? (
          <div className="my-6">
            <label className="text-xs text-gray-500 font-medium">Enter Date (DD/MM/YYYY)</label>
            <input
              type="text"
              value={manualInputVal}
              onChange={(e) => setManualInputVal(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#03a9f4]"
              placeholder="07/09/2026"
            />
          </div>
        ) : (
          <>
            {/* Month / Year header + Navigation */}
            <div className="flex items-center justify-between mt-6 mb-4">
              <div className="flex items-center gap-1 cursor-pointer group">
                <span className="text-[14px] font-medium text-[#1f2937]">
                  {MONTHS[currentMonth]} {currentYear}
                </span>
                <span className="text-[11px] text-[#4b5563] ml-0.5">▼</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 rounded-full text-[#4b5563] hover:bg-gray-100 hover:text-black transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 rounded-full text-[#4b5563] hover:bg-gray-100 hover:text-black transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Weekdays Header: M T W T F S S */}
            <div className="grid grid-cols-7 text-center text-[12px] font-semibold text-[#4b5563] mb-2">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-y-1 text-center text-[13px]">
              {/* Empty leading cells */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-9 w-9" />
              ))}

              {/* Days in Month */}
              {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isSelected = dayNum === pickedDay;
                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    onClick={() => setPickedDay(dayNum)}
                    className={`h-9 w-9 mx-auto rounded-full flex items-center justify-center font-medium transition-colors ${
                      isSelected
                        ? "bg-[#03a9f4] text-white font-bold shadow-sm"
                        : "text-[#111827] hover:bg-gray-100"
                    }`}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Footer Buttons: Cancel and OK */}
        <div className="flex items-center justify-end gap-5 mt-6 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-[14px] font-semibold text-[#03a9f4] hover:text-[#0288d1] px-2 py-1 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="text-[14px] font-semibold text-[#03a9f4] hover:text-[#0288d1] px-2 py-1 rounded transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
