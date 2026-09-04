import React, { useState } from 'react';
import { useTimeOffStore } from '@/stores/useTimeOffStore';
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  MoreVertical,
  PlusCircle,
  Palmtree,
  Trash2,
  Edit2,
  Plus,
} from 'lucide-react';
import type { LeavePolicy } from '@/types/timeoff';

export const PoliciesTab: React.FC = () => {
  const {
    policies,
    members,
    setIsCreatePolicyModalOpen,
    setEditingPolicyId,
    deletePolicy,
    showConfirm,
  } = useTimeOffStore();

  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredPolicies = policies.filter((p) => {
    if (statusFilter === 'active' && !p.is_active) return false;
    if (statusFilter === 'inactive' && p.is_active) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getPolicyIcon = (name: string) => {
    if (name.toLowerCase().includes('sick')) {
      return (
        <div className="w-5 h-5 rounded flex items-center justify-center text-[#03a9f4]">
          <PlusCircle className="w-4 h-4 stroke-[2.2]" />
        </div>
      );
    }
    if (name.includes('[SAMPLE]')) {
      return (
        <div className="w-5 h-5 rounded flex items-center justify-center text-rose-500">
          <Palmtree className="w-4 h-4 stroke-[2.2]" />
        </div>
      );
    }
    return (
      <div className="w-5 h-5 rounded flex items-center justify-center text-emerald-600">
        <Palmtree className="w-4 h-4 stroke-[2.2]" />
      </div>
    );
  };

  const getAssigneesText = (policy: LeavePolicy) => {
    if (!policy.assignee_ids || policy.assignee_ids.length === 0 || policy.assignee_ids.length === members.length) {
      return 'Everyone';
    }
    return `${policy.assignee_ids.length} members`;
  };

  const handleDelete = (policy: LeavePolicy) => {
    setActiveMenuId(null);
    showConfirm(
      'Delete policy?',
      `Are you sure you want to delete "${policy.name}"? If there are any historical records, consider deactivating it instead.`,
      () => deletePolicy(policy.id)
    );
  };

  const handleEdit = (id: string) => {
    setActiveMenuId(null);
    setEditingPolicyId(id);
  };

  return (
    <div className="space-y-4">
      {/* Top action & filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          {/* Active filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="appearance-none bg-white border border-slate-300 hover:border-slate-400 rounded px-3 py-1.5 pr-7 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-xs"
            >
              <option value="active">Show active</option>
              <option value="inactive">Show inactive</option>
              <option value="all">Show all</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search policies"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 w-56 shadow-xs"
            />
          </div>
        </div>

        {/* Create new policy button */}
        <button
          type="button"
          onClick={() => setIsCreatePolicyModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#03a9f4] hover:bg-[#0288d1] text-white font-semibold px-3.5 py-1.5 rounded uppercase tracking-wider text-[11px] transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Create New Policy</span>
        </button>
      </div>

      {/* Policies Table */}
      <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Policies ({filteredPolicies.length})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#f0f3f6] text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-semibold select-none">
              <tr>
                <th className="py-2.5 px-4 font-semibold">
                  <div className="flex items-center gap-1">
                    <span>Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-4 font-semibold">
                  <div className="flex items-center gap-1">
                    <span>Unit</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-4 font-semibold">
                  <div className="flex items-center gap-1">
                    <span>Accrual</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-4 font-semibold">Assignees</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 text-right pr-6 font-semibold w-16">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPolicies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No policies found.
                  </td>
                </tr>
              ) : (
                filteredPolicies.map((policy) => {
                  const isMenuOpen = activeMenuId === policy.id;
                  return (
                    <tr key={policy.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5 font-medium text-slate-800">
                          {getPolicyIcon(policy.name)}
                          <span>{policy.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 capitalize">
                        {policy.unit}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {policy.accrual_per_year !== null && policy.accrual_per_year !== undefined
                          ? `${policy.accrual_per_year.toFixed(2)}${policy.unit === 'days' ? 'd' : 'h'}/year`
                          : 'Manual'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded text-[11px] border border-slate-200">
                          {getAssigneesText(policy)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                            policy.is_active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {policy.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right pr-4 relative">
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={() => setActiveMenuId(isMenuOpen ? null : policy.id)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 cursor-pointer"
                            title="More options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <div
                              className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-md shadow-lg z-30 py-1 text-left select-none animate-in fade-in-50 zoom-in-95 duration-100"
                              onMouseLeave={() => setActiveMenuId(null)}
                            >
                              <button
                                type="button"
                                onClick={() => handleEdit(policy.id)}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#03a9f4] flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(policy)}
                                className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
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
