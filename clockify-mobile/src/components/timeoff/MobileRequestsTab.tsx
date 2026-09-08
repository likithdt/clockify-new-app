import { CalendarDays, Check, ChevronDown, Download, FileText, MoreVertical, X } from 'lucide-react';
import { useTimeOffStore } from '@/stores/useTimeOffStore';
import type { RequestStatus } from '@/types/timeoff';

const cleanName = (name: string) => name.replace(/^\[SAMPLE\]\s*/, '');

export function MobileRequestsTab() {
  const { requests, members, policies, reviewRequest, addToast } = useTimeOffStore();
  const member = (id: string) => members.find((item) => item.id === id);
  const policy = (id: string) => policies.find((item) => item.id === id);

  const exportRequests = () => {
    const rows = [['Team Member', 'Period', 'Requested', 'Policy', 'Status'], ...requests.map((request) => [cleanName(member(request.member_id)?.name || 'Unknown'), `${request.start_date} - ${request.end_date}`, request.duration.toString(), policy(request.policy_id)?.name || 'Leave', request.status])];
    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(rows.map((row) => row.join(',')).join('\n'))}`;
    link.download = 'clockify_timeoff_requests.csv';
    link.click();
    addToast('Requests exported to CSV');
  };

  const statusStyle: Record<RequestStatus, string> = {
    pending: 'bg-[#fff0d7] text-[#a26100]',
    approved: 'bg-[#e4f4e7] text-[#318043]',
    rejected: 'bg-[#ffe4e2] text-[#c33a31]',
    withdrawn: 'bg-slate-100 text-slate-600',
  };

  return (
    <section>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <button type="button" className="flex items-center justify-between rounded border border-slate-300 bg-white px-3 py-2 text-left text-xs text-slate-600 shadow-none"><span>Show all time off</span><ChevronDown size={14} /></button>
        <button type="button" className="flex items-center justify-between rounded border border-slate-300 bg-white px-3 py-2 text-left text-xs text-slate-600 shadow-none"><span>Team (All)</span><ChevronDown size={14} /></button>
        <button type="button" className="col-span-2 flex items-center gap-2 rounded border border-slate-300 bg-white px-3 py-2 text-left text-xs text-slate-600 shadow-none sm:col-span-1"><CalendarDays size={15} className="text-slate-400" /> All time</button>
        <button type="button" onClick={exportRequests} className="col-span-2 flex items-center justify-center gap-2 rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-600 shadow-none sm:ml-auto sm:col-span-1"><Download size={14} /> Export</button>
      </div>
      <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2"><h2 className="text-sm font-medium text-slate-500">Requests <span className="text-slate-400">({requests.length})</span></h2></div>
      <div className="space-y-3">
        {requests.map((request) => {
          const person = member(request.member_id);
          return <article key={request.id} className="rounded border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0b566] text-xs font-semibold text-white">{cleanName(person?.name || 'U').slice(0, 2).toUpperCase()}</div><div className="min-w-0"><p className="truncate text-sm font-medium text-slate-700">{cleanName(person?.name || 'Unknown User')}</p><p className="mt-0.5 text-xs text-slate-400">{policy(request.policy_id)?.name || 'Leave policy'}</p></div></div>
              <span className={`shrink-0 rounded px-2 py-1 text-[11px] font-medium ${statusStyle[request.status]}`}>{request.status[0].toUpperCase() + request.status.slice(1)}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs"><div><span className="block uppercase tracking-wide text-slate-400">Period</span><span className="mt-1 block font-medium text-slate-700">{request.start_date} - {request.end_date}</span></div><div><span className="block uppercase tracking-wide text-slate-400">Requested</span><span className="mt-1 block font-medium text-slate-700">{request.duration},00d</span></div></div>
            <div className="mt-3 flex justify-end gap-1">{request.status === 'pending' && <><button type="button" title="Approve" onClick={() => reviewRequest(request.id, { status: 'approved' })} className="rounded p-2 text-[#03a9f4] shadow-none hover:bg-sky-50"><Check size={17} /></button><button type="button" title="Reject" onClick={() => reviewRequest(request.id, { status: 'rejected' })} className="rounded p-2 text-rose-500 shadow-none hover:bg-rose-50"><X size={17} /></button></>}<button type="button" title="View note" onClick={() => request.note && addToast(request.note, 'info')} className="rounded p-2 text-slate-400 shadow-none hover:bg-slate-100"><FileText size={17} /></button><button type="button" title="More actions" className="rounded p-2 text-slate-400 shadow-none hover:bg-slate-100"><MoreVertical size={17} /></button></div>
          </article>;
        })}
      </div>
    </section>
  );
}