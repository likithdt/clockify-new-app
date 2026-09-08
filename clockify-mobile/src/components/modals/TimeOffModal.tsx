import React, { useState } from "react";
import { X } from "lucide-react";

interface TimeOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestTimeOff: (data: {
    policyName: string;
    startDate: string;
    endDate: string;
    dateRangeLabel: string;
    durationDays: number;
    note?: string;
  }) => void;
}

export const TimeOffModal: React.FC<TimeOffModalProps> = ({
  isOpen,
  onClose,
  onRequestTimeOff,
}) => {
  const [policyName, setPolicyName] = useState("Vacation");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const durationDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    onRequestTimeOff({
      policyName: `[SAMPLE] ${policyName}`,
      startDate,
      endDate,
      dateRangeLabel: `${startDate} - ${endDate}`,
      durationDays,
      note: note.trim() || undefined,
    });

    setNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[#1a1f26] border border-[#27303c] rounded-2xl w-full max-w-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Request Time Off</h2>
          <button type="button" onClick={onClose} className="text-[#8c9ba5] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#8c9ba5] block mb-1">Time Off Policy</label>
            <select
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              className="w-full bg-[#12161c] border border-[#27303c] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00b0ff]"
            >
              <option value="Vacation">Vacation</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Personal Leave">Personal Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-[#8c9ba5] block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#12161c] border border-[#27303c] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00b0ff]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#8c9ba5] block mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#12161c] border border-[#27303c] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00b0ff]"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#8c9ba5] block mb-1">Note (Optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Reason for request..."
              rows={2}
              className="w-full bg-[#12161c] border border-[#27303c] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00b0ff] resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl bg-[#242b35] text-[#8c9ba5] text-xs font-semibold hover:bg-[#2b3340]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-[#00b0ff] text-white text-xs font-semibold hover:bg-[#009ee6]"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
