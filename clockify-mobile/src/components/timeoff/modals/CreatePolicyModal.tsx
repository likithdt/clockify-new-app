import React, { useState } from 'react';
import { useTimeOffStore } from '@/stores/useTimeOffStore';
import { X, Palmtree } from 'lucide-react';
import type { PolicyUnit, AccrualType } from '@/types/timeoff';

export const CreatePolicyModal: React.FC = () => {
  const {
    isCreatePolicyModalOpen,
    setIsCreatePolicyModalOpen,
    members,
    createPolicy,
  } = useTimeOffStore();

  const [name, setName] = useState('');
  const [unit, setUnit] = useState<PolicyUnit>('days');
  const [accrualType, setAccrualType] = useState<AccrualType>('fixed_per_year');
  const [accrualPerYear, setAccrualPerYear] = useState<number>(20);
  const [allowCarryover, setAllowCarryover] = useState(true);
  const [maxBalance, setMaxBalance] = useState<number | ''>(30);
  const [assigneeMode, setAssigneeMode] = useState<'everyone' | 'specific'>('everyone');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [allowNegativeBalance, setAllowNegativeBalance] = useState(false);
  const [allowHalfDay, setAllowHalfDay] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isCreatePolicyModalOpen) return null;

  const reset = () => {
    setName('');
    setUnit('days');
    setAccrualType('fixed_per_year');
    setAccrualPerYear(20);
    setAllowCarryover(true);
    setMaxBalance(30);
    setAssigneeMode('everyone');
    setSelectedMembers([]);
    setRequiresApproval(true);
    setAllowNegativeBalance(false);
    setAllowHalfDay(true);
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Policy name is required';
    if (accrualType === 'fixed_per_year' && (accrualPerYear <= 0 || isNaN(accrualPerYear))) {
      errs.accrual = 'Please enter a valid accrual amount';
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      await createPolicy({
        name: name.trim(),
        unit,
        accrual_type: accrualType,
        accrual_per_year: accrualType === 'fixed_per_year' ? Number(accrualPerYear) : null,
        allow_carryover: allowCarryover,
        max_balance: maxBalance === '' ? null : Number(maxBalance),
        assignee_ids: assigneeMode === 'everyone' ? members.map((m) => m.id) : selectedMembers,
        requires_approval: requiresApproval,
        allow_negative_balance: allowNegativeBalance,
        allow_half_day: allowHalfDay,
      });
      setIsCreatePolicyModalOpen(false);
      reset();
    } catch {
      // Handled by store toast
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Palmtree className="w-4 h-4 text-[#03a9f4]" />
            Create Leave Policy
          </h2>
          <button
            type="button"
            onClick={() => {
              setIsCreatePolicyModalOpen(false);
              reset();
            }}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
          {/* Policy Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Policy name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Paid Time Off (PTO)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full bg-slate-50 border rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#03a9f4] ${
                errors.name ? 'border-rose-400' : 'border-slate-300'
              }`}
            />
            {errors.name && <p className="text-rose-500 mt-0.5">{errors.name}</p>}
          </div>

          {/* Time Unit */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Time unit</label>
            <div className="flex gap-2">
              {(['days', 'hours'] as PolicyUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`flex-1 py-2 px-3 rounded border text-xs font-medium transition-colors cursor-pointer capitalize ${
                    unit === u
                      ? 'border-[#03a9f4] bg-sky-50 text-[#03a9f4]'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Accrual Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Accrual method</label>
              <select
                value={accrualType}
                onChange={(e) => setAccrualType(e.target.value as AccrualType)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#03a9f4] cursor-pointer"
              >
                <option value="fixed_per_year">Fixed amount per year</option>
                <option value="monthly_accrual">Monthly accrual</option>
                <option value="manual">Manual allocation</option>
              </select>
            </div>

            {accrualType === 'fixed_per_year' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Accrual ({unit}/year)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={accrualPerYear}
                  onChange={(e) => setAccrualPerYear(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#03a9f4]"
                />
              </div>
            )}
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
              <div className="border border-slate-200 rounded max-h-32 overflow-y-auto divide-y divide-slate-100">
                {members.map((m) => (
                  <label
                    key={m.id}
                    className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(m.id)}
                      onChange={() => toggleMember(m.id)}
                      className="accent-[#03a9f4]"
                    />
                    <span className="text-slate-700">
                      {m.name.replace(/^\[SAMPLE\]\s*/, '')}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Rules & Permissions */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <span className="block font-semibold text-slate-700">Policy Rules</span>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                className="accent-[#03a9f4] rounded"
              />
              <span className="text-slate-700">Requires manager approval</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allowCarryover}
                onChange={(e) => setAllowCarryover(e.target.checked)}
                className="accent-[#03a9f4] rounded"
              />
              <span className="text-slate-700">Allow unused balance to carry over</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allowNegativeBalance}
                onChange={(e) => setAllowNegativeBalance(e.target.checked)}
                className="accent-[#03a9f4] rounded"
              />
              <span className="text-slate-700">Allow negative balance (overdraft)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allowHalfDay}
                onChange={(e) => setAllowHalfDay(e.target.checked)}
                className="accent-[#03a9f4] rounded"
              />
              <span className="text-slate-700">Allow half-day requests</span>
            </label>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsCreatePolicyModalOpen(false);
                reset();
              }}
              className="px-4 py-2 border border-slate-300 rounded text-slate-600 font-medium hover:bg-slate-50 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Creating...' : 'Create Policy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
