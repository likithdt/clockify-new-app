import React, { useState } from 'react';
import { useTimeOffStore } from '@/stores/useTimeOffStore';
import { ChevronDown, Palmtree, Download } from 'lucide-react';

export const BalanceTab: React.FC = () => {
  const { balances, policies, members, addToast } = useTimeOffStore();
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('all');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('all');

  const getMember = (id: string) =>
    members.find((m) => m.id === id) || { name: 'Unknown User', email: '' };

  const getPolicy = (id: string) =>
    policies.find((p) => p.id === id) || { name: 'Unknown Policy', unit: 'days' };

  const filteredBalances = balances.filter((b) => {
    if (selectedPolicyId !== 'all' && b.policy_id !== selectedPolicyId) return false;
    if (selectedMemberId !== 'all' && b.member_id !== selectedMemberId) return false;
    return true;
  });

  const handleExport = () => {
    const rows = [
      ['Team Member', 'Policy', 'Accrued', 'Used', 'Remaining'],
      ...filteredBalances.map((b) => [
        getMember(b.member_id).name.replace(/^\[SAMPLE\]\s*/, ''),
        getPolicy(b.policy_id).name,
        b.accrued.toString(),
        b.used.toString(),
        b.remaining.toString(),
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'clockify_timeoff_balances.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Balances exported to CSV');
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          {/* Policy filter */}
          <div className="relative">
            <select
              value={selectedPolicyId}
              onChange={(e) => setSelectedPolicyId(e.target.value)}
              className="appearance-none bg-white border border-slate-300 hover:border-slate-400 rounded px-3 py-1.5 pr-7 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-xs"
            >
              <option value="all">Policy (All)</option>
              {policies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Member filter */}
          <div className="relative">
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="appearance-none bg-white border border-slate-300 hover:border-slate-400 rounded px-3 py-1.5 pr-7 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-xs"
            >
              <option value="all">Team (All)</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name.replace(/^\[SAMPLE\]\s*/, '')}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Export */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded px-3 py-1.5 text-slate-700 font-medium shadow-xs cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Balance Table */}
      <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Balances ({filteredBalances.length})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#f0f3f6] text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-semibold select-none">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Team Member</th>
                <th className="py-2.5 px-4 font-semibold">Policy</th>
                <th className="py-2.5 px-4 font-semibold">Accrued</th>
                <th className="py-2.5 px-4 font-semibold">Used</th>
                <th className="py-2.5 px-4 font-semibold">Available Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBalances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    No balance entries found for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredBalances.map((b, idx) => {
                  const member = getMember(b.member_id);
                  const policy = getPolicy(b.policy_id);
                  const cleanName = member.name.replace(/^\[SAMPLE\]\s*/, '');

                  return (
                    <tr key={`${b.member_id}-${b.policy_id}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {cleanName}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Palmtree className="w-3.5 h-3.5 text-rose-500" />
                          <span>{policy.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono">
                        {b.accrued.toFixed(1)} {policy.unit}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono">
                        {b.used.toFixed(1)} {policy.unit}
                      </td>
                      <td className="py-3 px-4 font-semibold font-mono">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] ${
                            b.remaining < 0
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {b.remaining.toFixed(1)} {policy.unit}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
