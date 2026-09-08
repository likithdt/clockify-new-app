import React, { useState, useMemo } from 'react';
import { useTimeOffStore } from '@/stores/useTimeOffStore';
import { timeOffService } from '@backend/services/timeOffService';
import { X, Download, Globe, CheckSquare, Square, Calendar } from 'lucide-react';

const COUNTRIES = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'SG', name: 'Singapore' },
];

export const ImportHolidaysModal: React.FC = () => {
  const {
    isImportHolidaysModalOpen,
    setIsImportHolidaysModalOpen,
    importSelectedHolidays,
  } = useTimeOffStore();

  const [countryCode, setCountryCode] = useState('IN');
  const [year, setYear] = useState(2026);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [autoImportEveryYear, setAutoImportEveryYear] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available holidays for the selected country and year
  const availableHolidays = useMemo(() => {
    return timeOffService.getPublicHolidaysPreview(countryCode, year);
  }, [countryCode, year]);

  // Sync initial selection when availableHolidays changes
  React.useEffect(() => {
    // Select all un-imported ones by default
    const unimported = availableHolidays.filter((h) => !h.exists).map((h) => h.date);
    setSelectedDates(unimported);
  }, [availableHolidays]);

  if (!isImportHolidaysModalOpen) return null;

  const handleToggle = (date: string) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const handleSelectAll = () => {
    setSelectedDates(availableHolidays.map((h) => h.date));
  };

  const handleDeselectAll = () => {
    setSelectedDates([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDates.length === 0) return;

    setIsSubmitting(true);
    try {
      const selections = availableHolidays
        .filter((h) => selectedDates.includes(h.date))
        .map((h) => ({ name: h.name, date: h.date }));

      await importSelectedHolidays(countryCode, selections);
      setIsImportHolidaysModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const unimportedCount = availableHolidays.filter((h) => !h.exists).length;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <Download className="w-4 h-4 text-[#03a9f4]" />
            Import Public Holidays
          </h2>
          <button
            type="button"
            onClick={() => setIsImportHolidaysModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden text-xs">
          {/* Controls bar */}
          <div className="p-5 border-b border-slate-100 grid grid-cols-2 gap-3 bg-slate-50/70 shrink-0">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Country
              </label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#03a9f4] cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Year
              </label>
              <input
                type="number"
                min="2020"
                max="2035"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10) || 2026)}
                className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#03a9f4]"
              />
            </div>
          </div>

          {/* List selection controls */}
          <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-600 shrink-0">
            <span className="font-semibold text-slate-700">
              Found {availableHolidays.length} holidays ({unimportedCount} new)
            </span>
            <div className="flex items-center gap-3 font-medium">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[#03a9f4] hover:underline cursor-pointer"
              >
                Select all
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={handleDeselectAll}
                className="text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Unselect all
              </button>
            </div>
          </div>

          {/* Holidays Preview Checklist */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {availableHolidays.map((item) => {
              const isSelected = selectedDates.includes(item.date);
              return (
                <div
                  key={item.date + item.name}
                  onClick={() => handleToggle(item.date)}
                  className={`flex items-center justify-between p-2.5 rounded transition-colors cursor-pointer select-none ${
                    item.exists
                      ? 'bg-slate-50/50 opacity-60'
                      : isSelected
                      ? 'bg-sky-50/50'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-[#03a9f4] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <div>
                      <div className="font-medium text-slate-800 flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {item.exists && (
                          <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-normal">
                            Already added
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Auto import checkbox */}
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/40 shrink-0 flex items-center gap-2">
            <input
              type="checkbox"
              id="auto-import"
              checked={autoImportEveryYear}
              onChange={(e) => setAutoImportEveryYear(e.target.checked)}
              className="accent-[#03a9f4] rounded"
            />
            <label htmlFor="auto-import" className="text-[11px] text-slate-600 cursor-pointer">
              Auto-import every year on recurrence
            </label>
          </div>

          {/* Footer actions */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0 bg-white">
            <button
              type="button"
              onClick={() => setIsImportHolidaysModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded text-slate-600 font-medium hover:bg-slate-50 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedDates.length === 0}
              className="px-5 py-2 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {isSubmitting
                  ? 'Importing...'
                  : `Import ${selectedDates.length} Holiday${selectedDates.length !== 1 ? 's' : ''}`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
