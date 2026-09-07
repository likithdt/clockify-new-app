import React, { useState } from 'react';
import { useTimeOffStore } from '@/stores/useTimeOffStore';
import { X, Calendar } from 'lucide-react';
import type { HolidayRecurrence } from '@/types/timeoff';

const COLORS = [
  '#03a9f4', '#e91e63', '#4caf50', '#ff9800', '#9c27b0',
  '#00bcd4', '#f44336', '#3f51b5', '#8bc34a', '#ff5722',
];

export const CreateHolidayModal: React.FC = () => {
  const { isCreateHolidayModalOpen, setIsCreateHolidayModalOpen, members, createHoliday } = useTimeOffStore();

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-01-01');
  const [recurrence, setRecurrence] = useState<HolidayRecurrence>('every_year');
  const [assigneeMode, setAssigneeMode] = useState<'everyone' | 'specific'>('everyone');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [color, setColor] = useState(COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isCreateHolidayModalOpen) return null;

  const reset = () => {
    setName('');
    setStartDate('2026-01-01');
    setEndDate('2026-01-01');
    setRecurrence('every_year');
    setAssigneeMode('everyone');
    setSelectedMembers([]);
    setColor(COLORS[0]);
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Holiday name is required';
    if (!startDate) errs.startDate = 'Start date is required';
    if (!endDate) errs.endDate = 'End date is required';
    if (endDate < startDate) errs.endDate = 'End date cannot be before start date';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsSubmitting(true);
    try {
      await createHoliday({
        name: name.trim(),
        date: startDate,
        end_date: endDate !== startDate ? endDate : null,
        country_code: null,
        member_ids: assigneeMode === 'everyone' ? [] : selectedMembers,
        recurrence,
        color,
      });
      setIsCreateHolidayModalOpen(false);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#03a9f4]" />
            Create holiday
          </h2>
          <button type="button" onClick={() => { setIsCreateHolidayModalOpen(false); reset(); }}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          {/* Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Holiday name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Company Foundation Day"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full bg-slate-50 border rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#03a9f4] ${errors.name ? 'border-rose-400' : 'border-slate-300'}`}
            />
            {errors.name && <p className="text-rose-500 mt-0.5">{errors.name}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Start date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); if (endDate < e.target.value) setEndDate(e.target.value); }}
                className={`w-full bg-slate-50 border rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#03a9f4] ${errors.startDate ? 'border-rose-400' : 'border-slate-300'}`}
              />
              {errors.startDate && <p className="text-rose-500 mt-0.5">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                End date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-full bg-slate-50 border rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#03a9f4] ${errors.endDate ? 'border-rose-400' : 'border-slate-300'}`}
              />
              {errors.endDate && <p className="text-rose-500 mt-0.5">{errors.endDate}</p>}
            </div>
          </div>

          {/* Recurrence */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Recurrence</label>
            <div className="flex gap-2">
              {(['every_year', 'once'] as HolidayRecurrence[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRecurrence(r)}
                  className={`flex-1 py-2 px-3 rounded border text-xs font-medium transition-colors cursor-pointer ${
                    recurrence === r
                      ? 'border-[#03a9f4] bg-sky-50 text-[#03a9f4]'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {r === 'every_year' ? 'Every year' : 'Once'}
                </button>
              ))}
            </div>
          </div>

          {/* Assignees */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assignees</label>
            <div className="flex gap-2 mb-2">
              {(['everyone', 'specific'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAssigneeMode(mode)}
                  className={`flex-1 py-2 px-3 rounded border text-xs font-medium transition-colors cursor-pointer capitalize ${
                    assigneeMode === mode
                      ? 'border-[#03a9f4] bg-sky-50 text-[#03a9f4]'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {mode === 'everyone' ? 'Everyone' : 'Specific members'}
                </button>
              ))}
            </div>
            {assigneeMode === 'specific' && (
              <div className="border border-slate-200 rounded max-h-36 overflow-y-auto divide-y divide-slate-100">
                {members.map((m) => (
                  <label key={m.id} className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(m.id)}
                      onChange={() => toggleMember(m.id)}
                      className="accent-[#03a9f4]"
                    />
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {m.name.replace(/^\[SAMPLE\]\s*/, '').slice(0, 2).toUpperCase()}
                    </span>
                    <span className="text-slate-700">{m.name.replace(/^\[SAMPLE\]\s*/, '')}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Color */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${color === c ? 'border-slate-700 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => { setIsCreateHolidayModalOpen(false); reset(); }}
              className="px-4 py-2 border border-slate-300 rounded text-slate-600 font-medium hover:bg-slate-50 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
