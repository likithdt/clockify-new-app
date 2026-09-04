import React, { useState } from 'react';
import { useTimeOffStore } from '@/stores/useTimeOffStore';
import {
  ChevronDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  FileText,
  Palmtree,
  Check,
  X,
  Trash2,
  Download,
} from 'lucide-react';
import type { RequestStatus } from '@/types/timeoff';

export const RequestsTab: React.FC = () => {
  const {
    requests,
    members,
    policies,
    reviewRequest,
    deleteRequest,
    showConfirm,
    addToast,
  } = useTimeOffStore();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [memberFilter, setMemberFilter] = useState<string>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const getMember = (memberId: string) =>
    members.find((m) => m.id === memberId) || { name: 'Unknown User', email: '' };

  const getPolicy = (policyId: string) =>
    policies.find((p) => p.id === policyId) || { name: 'Leave Policy' };

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    if (statusFilter !== 'all' && req.status !== statusFilter) return false;
    if (memberFilter !== 'all' && req.member_id !== memberFilter) return false;
    return true;
  });

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Rejected
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Pending <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          </span>
        );
      case 'withdrawn':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Withdrawn
          </span>
        );
    }
  };

  const getMemberAvatar = (name: string) => {
    const clean = name.replace(/^\[SAMPLE\]\s*/, '');
    const initials = clean.slice(0, 2).toUpperCase();
    if (clean.includes('Lara')) {
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-400 to-rose-300 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-xs">
          {initials}
        </div>
      );
    }
    if (clean.includes('Amy')) {
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-xs">
          {initials}
        </div>
      );
    }
    if (clean.includes('Mike')) {
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-xs">
          {initials}
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-xs">
        {initials}
      </div>
    );
  };

  const handleDelete = (reqId: string, memberName: string) => {
    setActiveMenuId(null);
    showConfirm(
      'Delete time off request?',
      `Are you sure you want to delete this request for ${memberName}? This will adjust any associated leave balances.`,
      () => deleteRequest(reqId)
    );
  };

  const handleExport = () => {
    const rows = [
      ['Team Member', 'Period Start', 'Period End', 'Duration (days)', 'Policy', 'Status'],
      ...filteredRequests.map((r) => [
        getMember(r.member_id).name.replace(/^\[SAMPLE\]\s*/, ''),
        r.start_date,
        r.end_date,
        r.duration.toString(),
        getPolicy(r.policy_id).name,
        r.status,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'clockify_timeoff_requests.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Requests exported to CSV');
  };

  return (
    <div className="space-y-4">
      {/* Filters bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-300 hover:border-slate-400 rounded px-3 py-1.5 pr-7 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-xs"
            >
              <option value="all">Show all time off</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Team Dropdown */}
          <div className="relative">
            <select
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
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

          {/* Date Range Selector */}
          <div className="flex items-center bg-white border border-slate-300 rounded shadow-xs select-none">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>All time</span>
            </button>
            <div className="flex items-center border-l border-slate-200">
              <button
                type="button"
                className="p-1.5 hover:bg-slate-50 text-slate-500 cursor-pointer"
                title="Previous period"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="p-1.5 hover:bg-slate-50 text-slate-500 border-l border-slate-200 cursor-pointer"
                title="Next period"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Export Button */}
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

      {/* Requests Table */}
      <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Requests ({filteredRequests.length})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#f0f3f6] text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-semibold select-none">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Team Member</th>
                <th className="py-2.5 px-4 font-semibold">Period</th>
                <th className="py-2.5 px-4 font-semibold">Requested</th>
                <th className="py-2.5 px-4 font-semibold">Policy</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 text-right pr-6 font-semibold w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No time off requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const member = getMember(req.member_id);
                  const policy = getPolicy(req.policy_id);
                  const isMenuOpen = activeMenuId === req.id;
                  const cleanName = member.name.replace(/^\[SAMPLE\]\s*/, '');

                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/80 transition-colors group relative"
                    >
                      {/* Team Member */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {getMemberAvatar(member.name)}
                          <div>
                            <div className="font-medium text-slate-800">{cleanName}</div>
                            <div className="text-[10px] text-slate-400">{member.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Period */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">
                          {req.start_date === req.end_date
                            ? req.start_date
                            : `${req.start_date} — ${req.end_date}`}
                        </div>
                      </td>

                      {/* Requested duration */}
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {req.duration.toFixed(1)}d
                      </td>

                      {/* Policy */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Palmtree className="w-3.5 h-3.5 text-rose-500" />
                          <span>{policy.name}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">{getStatusBadge(req.status)}</td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right pr-4">
                        <div className="flex items-center justify-end gap-2">
                          {req.note && (
                            <button
                              type="button"
                              onClick={() => setSelectedNote(req.note || '')}
                              className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 cursor-pointer"
                              title="View Note"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}

                          {req.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() =>
                                reviewRequest(req.id, { status: 'approved' })
                              }
                              className="text-[#03a9f4] hover:text-[#0288d1] font-semibold text-xs px-2 py-1 rounded hover:bg-sky-50 transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                          )}

                          {/* Menu dropdown button */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveMenuId(isMenuOpen ? null : req.id)
                              }
                              className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                              <div
                                className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-md shadow-lg z-30 py-1 text-left select-none animate-in fade-in-50 zoom-in-95 duration-100"
                                onMouseLeave={() => setActiveMenuId(null)}
                              >
                                {req.status !== 'approved' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      reviewRequest(req.id, { status: 'approved' });
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" /> Approve
                                  </button>
                                )}
                                {req.status !== 'rejected' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      reviewRequest(req.id, { status: 'rejected' });
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" /> Reject
                                  </button>
                                )}
                                <div className="h-px bg-slate-100 my-1" />
                                <button
                                  type="button"
                                  onClick={() => handleDelete(req.id, cleanName)}
                                  className="w-full px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-slate-400" /> Delete
                                </button>
                              </div>
                            )}
                          </div>
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

      {/* Note modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full shadow-xl space-y-3 border border-slate-200">
            <h3 className="font-semibold text-slate-800 text-sm">Request Note</h3>
            <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
              {selectedNote}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNote(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
