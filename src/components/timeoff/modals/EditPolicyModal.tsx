
import React, { useState, useEffect } from 'react';
import { useTimeOffStore } from '@/stores/useTimeOffStore';
import { X, Edit2 } from 'lucide-react';
import type { PolicyUnit, AccrualType } from '@/types/timeoff';

export const EditPolicyModal: React.FC = () => {
  const {
    editingPolicyId,
    setEditingPolicyId,
    policies,
    members,
    updatePolicy,
  } = useTimeOffStore();

  const policy = policies.find((p) => p.id === editingPolicyId);

  const [name, setName] = useState('');
  const [unit, setUnit] = useState<PolicyUnit>('days');
  const [accrualType, setAccrualType] = useState<AccrualType>('fixed_per_year');
  const [accrualPerYear, setAccrualPerYear] = useState<number>(20);
  const [allowCarryover, setAllowCarryover] = useState(true);
  const [maxBalance, setMaxBalance] = useState<number | ''>(30);
  const [assigneeMode, setAssigneeMode] = useState<'everyone' | 'specific'>('everyone');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [allowNegativeBalance, setAllowNegativeBalance] = useState(false);
  const [allowHalfDay, setAllowHalfDay] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (policy) {
      setName(policy.name);
      setUnit(policy.unit);
      setAccrualType(policy.accrual_type);
      setAccrualPerYear(policy.accrual_per_year || 20);
      setAllowCarryover(policy.allow_carryover);
      setMaxBalance(policy.max_balance ?? '');
      setIsActive(policy.is_active);
      setRequiresApproval(policy.requires_approval ?? true);
      setAllowNegativeBalance(policy.allow_negative_balance ?? false);
      setAllowHalfDay(policy.allow_half_day ?? true);

      if (!policy.assignee_ids || policy.assignee_ids.length === 0 || policy.assignee_ids.length === members.length) {
        setAssigneeMode('everyone');
        setSelectedMembers([]);
      } else {
        setAssigneeMode('specific');
        setSelectedMembers(policy.assignee_ids);
      }
    }
  }, [policy, members]);

  if (!editingPolicyId || !policy) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Policy name is required';
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
      await updatePolicy(policy.id, {
        name: name.trim(),
        unit,
        accrual_type: accrualType,
        accrual_per_year: accrualType === 'fixed_per_year' ? Number(accrualPerYear) : null,
        allow_carryover: allowCarryover,
        max_balance: maxBalance === '' ? null : Number(maxBalance),
        assignee_ids: assigneeMode === 'everyone' ? members.map((m) => m.id) : selectedMembers,
        is_active: isActive,
        requires_approval: requiresApproval,
        allow_negative_balance: allowNegativeBalance,
        allow_half_day: allowHalfDay,
      });
      setEditingPolicyId(null);
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
            <Edit2 className="w-4 h-4 text-[#03a9f4]" />
            Edit Leave Policy
          </h2>
          <button
            type="button"
            onClick={() => setEditingPolicyId(null)}
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

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded">
            <div>
              <span className="font-semibold text-slate-700 block">Policy Status</span>
              <span className="text-[11px] text-slate-500">
                Inactive policies cannot be requested by team members
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#03a9f4]"></div>
            </label>
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

          {/* Rules */}
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
              onClick={() => setEditingPolicyId(null)}
              className="px-4 py-2 border border-slate-300 rounded text-slate-600 font-medium hover:bg-slate-50 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
