import React, { useState, useEffect } from 'react';
import { useTimeOffStore } from '@/stores/useTimeOffStore';
import { X, Palmtree } from 'lucide-react';

export const RequestTimeOffModal: React.FC = () => {
  const {
    isRequestModalOpen,
    setIsRequestModalOpen,
    policies,
    members,
    createRequest,
  } = useTimeOffStore();

  const [memberId, setMemberId] = useState(members[0]?.id || 'm4');
  const [policyId, setPolicyId] = useState(policies[0]?.id || 'p1');
  const [startDate, setStartDate] = useState('2026-09-21');
  const [endDate, setEndDate] = useState('2026-09-22');
  const [duration, setDuration] = useState(2);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-calculate duration roughly in business days
  useEffect(() => {
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (e >= s) {
        const diffDays = Math.round((e.getTime() - s.getTime()) / (1000 * 3600 * 24)) + 1;
        setDuration(Math.max(1, diffDays));
      }
    }
  }, [startDate, endDate]);

  if (!isRequestModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (endDate < startDate) {
      setError('End date cannot be before start date');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await createRequest({
        member_id: memberId,
        policy_id: policyId,
        start_date: startDate,
        end_date: endDate,
        duration: Number(duration),
        note: note.trim() || undefined,
      });
      setIsRequestModalOpen(false);
      setNote('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <Palmtree className="w-4 h-4 text-[#03a9f4]" />
            Request Time Off
          </h2>
          <button
            type="button"
            onClick={() => setIsRequestModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Member */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Team Member
            </label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#03a9f4] cursor-pointer"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name.replace(/^\[SAMPLE\]\s*/, '')} ({m.email})
                </option>
              ))}
            </select>
          </div>

          {/* Policy */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Policy
            </label>
            <select
              value={policyId}
              onChange={(e) => setPolicyId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#03a9f4] cursor-pointer"
            >
              {policies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#03a9f4]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#03a9f4]"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Duration (days)
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value) || 1)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#03a9f4]"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Note (Optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add reason or extra details..."
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#03a9f4]"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRequestModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded text-slate-600 font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
