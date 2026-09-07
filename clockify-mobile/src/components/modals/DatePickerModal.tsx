import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Pencil, Calendar as CalendarIcon } from "lucide-react";

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  initialDate?: Date;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialDate = new Date(2026, 8, 7), // Sep 7, 2026
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );
  const [viewMode, setViewMode] = useState<"calendar" | "years" | "manual">("calendar");
  const [manualDateText, setManualDateText] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      const d = initialDate || new Date(2026, 8, 7);
      setSelectedDate(d);
      setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
      setViewMode("calendar");
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      setManualDateText(`${dd}/${mm}/${d.getFullYear()}`);
    }
  }, [isOpen, initialDate]);

  if (!isOpen) return null;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const shortMonthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const headerDateStr = `${shortMonthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
  const monthYearStr = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Calendar calculations (Sunday = 0 matching screenshot 6)
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // First day of month (0 is Sun, 1 is Mon...)
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Handle day click
  const handleDayClick = (dayNum: number) => {
    const newDate = new Date(year, month, dayNum, selectedDate.getHours(), selectedDate.getMinutes());
    setSelectedDate(newDate);
    const dd = String(newDate.getDate()).padStart(2, "0");
    const mm = String(newDate.getMonth() + 1).padStart(2, "0");
    setManualDateText(`${dd}/${mm}/${newDate.getFullYear()}`);
  };

  // Select a year from the year grid
  const handleSelectYear = (selectedYear: number) => {
    const newMonth = new Date(selectedYear, currentMonth.getMonth(), 1);
    setCurrentMonth(newMonth);
    const newDate = new Date(selectedYear, selectedDate.getMonth(), Math.min(selectedDate.getDate(), 28), selectedDate.getHours(), selectedDate.getMinutes());
    setSelectedDate(newDate);
    const dd = String(newDate.getDate()).padStart(2, "0");
    const mm = String(newDate.getMonth() + 1).padStart(2, "0");
    setManualDateText(`${dd}/${mm}/${newDate.getFullYear()}`);
    setViewMode("calendar");
  };

  const handleConfirm = () => {
    if (viewMode === "manual") {
      // Parse dd/MM/yyyy or MM/dd/yyyy or yyyy-MM-dd
      const parts = manualDateText.includes("/")
        ? manualDateText.split("/").map(Number)
        : manualDateText.split("-").map(Number);

      if (parts.length === 3) {
        let d = parts[0];
        let m = parts[1] - 1;
        let y = parts[2];
        if (parts[0] > 1000) {
          // YYYY-MM-DD
          y = parts[0];
          m = parts[1] - 1;
          d = parts[2];
        } else if (parts[2] < 1000 && parts[0] <= 12 && parts[1] > 12) {
          // MM/DD/YY fallback
          m = parts[0] - 1;
          d = parts[1];
          y = parts[2] + 2000;
        }
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          const parsed = new Date(y, m, d, selectedDate.getHours(), selectedDate.getMinutes());
          onConfirm(parsed);
          onClose();
          return;
        }
      }
    }
    onConfirm(selectedDate);
    onClose();
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // List of years from 2026 to 2055 matching Screenshot 4
  const yearsList = Array.from({ length: 30 }, (_, i) => 2026 + i);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 select-none animate-fadeIn">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[0.5px]"
        onClick={onClose}
      />

      {/* Modal Dialog Card (Matching Screenshots in Light Theme) */}
      <div className="relative w-full max-w-[330px] bg-white rounded-[28px] p-6 shadow-2xl z-10 animate-scaleIn border border-gray-100 text-gray-900">
        
        {/* Top Header matching Screenshot 4, 5, 6 */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[12px] text-gray-500 font-medium block">
              Select Date
            </span>
            <span className="text-[26px] font-normal text-gray-900 block mt-0.5">
              {viewMode === "years" ? headerDateStr : "Selected date"}
            </span>
          </div>

          {/* Toggle button between Manual Input & Calendar View */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "manual" ? "calendar" : "manual")}
            className="p-1.5 text-gray-700 hover:text-[#0288d1] transition-colors mt-2"
            title={viewMode === "manual" ? "Switch to calendar view" : "Enter date manually"}
          >
            {viewMode === "manual" ? (
              <CalendarIcon className="w-5 h-5 text-gray-800" />
            ) : (
              <Pencil className="w-5 h-5 text-gray-800" />
            )}
          </button>
        </div>

        {/* MODE 1: MANUAL DATE INPUT (Matching Screenshot 5) */}
        {viewMode === "manual" && (
          <div className="py-5">
            {/* Outlined input box with floating label 'Date' */}
            <div className="relative border-2 border-[#0288d1] rounded-xl px-4 pt-3 pb-2.5 bg-white">
              <span className="absolute -top-2.5 left-3 bg-white px-1.5 text-xs text-[#0288d1] font-medium">
                Date
              </span>
              <input
                type="text"
                value={manualDateText}
                onChange={(e) => setManualDateText(e.target.value)}
                placeholder="dd/MM/yyyy"
                autoFocus
                className="w-full bg-transparent text-[16px] text-gray-900 placeholder-gray-400 outline-none"
              />
            </div>
          </div>
        )}

        {/* MODE 2: YEAR PICKER GRID (Matching Screenshot 4) */}
        {viewMode === "years" && (
          <div className="py-2">
            {/* Subheader dropdown indicator */}
            <div
              onClick={() => setViewMode("calendar")}
              className="inline-flex items-center gap-1.5 text-[14px] text-gray-800 font-medium mb-4 cursor-pointer hover:text-[#0288d1]"
            >
              <span>{monthYearStr}</span>
              <span className="text-[10px]">▼</span>
            </div>

            {/* 3-column Grid of Years (2026 to 2055) */}
            <div className="grid grid-cols-3 gap-y-4 gap-x-2 justify-items-center max-h-[300px] overflow-y-auto no-scrollbar py-1">
              {yearsList.map((yr) => {
                const isSelected = yr === year;
                return (
                  <button
                    key={`year-${yr}`}
                    type="button"
                    onClick={() => handleSelectYear(yr)}
                    className={`text-[15px] transition-all ${
                      isSelected
                        ? "bg-[#0288d1] text-white font-semibold px-4 py-1 rounded-full shadow-sm"
                        : "text-gray-700 hover:text-[#0288d1] font-medium py-1"
                    }`}
                  >
                    {yr}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 3: CALENDAR MONTH GRID (Matching Screenshot 6) */}
        {viewMode === "calendar" && (
          <div>
            {/* Month Year Selector row with Dropdown Arrow and Prev/Next */}
            <div className="flex items-center justify-between mb-3 pt-1">
              <button
                type="button"
                onClick={() => setViewMode("years")}
                className="text-[14px] text-gray-800 font-medium flex items-center gap-1.5 hover:text-[#0288d1] transition-colors focus:outline-none"
                title="Click to select year"
              >
                <span>{monthYearStr}</span>
                <span className="text-[10px]">▼</span>
              </button>

              <div className="flex items-center gap-2 text-gray-600">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 hover:text-gray-900 transition-colors"
                  title="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 hover:text-gray-900 transition-colors"
                  title="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Header: S M T W T F S matching Screenshot 6 */}
            <div className="grid grid-cols-7 text-center mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                <div
                  key={`day-header-${idx}`}
                  className="text-[12px] font-medium text-gray-600"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-y-1.5 justify-items-center mb-4">
              {/* Empty leading slots */}
              {Array.from({ length: firstDay }).map((_, idx) => (
                <div key={`empty-${idx}`} className="w-8 h-8" />
              ))}

              {/* Day numbers */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const thisDate = new Date(year, month, dayNum);
                const isSelected = isSameDay(thisDate, selectedDate);

                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    onClick={() => handleDayClick(dayNum)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] transition-all ${
                      isSelected
                        ? "border-2 border-[#0288d1] text-[#0288d1] font-bold"
                        : "text-gray-800 hover:bg-gray-100 font-normal"
                    }`}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons Row matching Screenshots */}
        <div className="flex items-center justify-end gap-6 pt-3">
          {viewMode === "years" ? (
            <>
              <button
                type="button"
                onClick={() => setViewMode("calendar")}
                className="text-[15px] font-medium text-[#0288d1] hover:text-[#0277bd] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setViewMode("calendar")}
                className="text-[15px] font-medium text-[#0288d1] hover:text-[#0277bd] transition-colors"
              >
                OK
              </button>
            </>
          ) : viewMode === "manual" ? (
            <button
              type="button"
              onClick={handleConfirm}
              className="text-[15px] font-medium text-[#0288d1] hover:text-[#0277bd] transition-colors"
            >
              Done
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="text-[15px] font-medium text-gray-500 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="text-[15px] font-medium text-[#0288d1] hover:text-[#0277bd] transition-colors"
              >
                Done
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
