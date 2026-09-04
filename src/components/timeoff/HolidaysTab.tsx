import React, { useState } from 'react';
import { useTimeOffStore } from '@/stores/useTimeOffStore';
import {
  PartyPopper,
  Calendar,
  Download,
  MoreVertical,
  Edit2,
  Trash2,
  Plus,
} from 'lucide-react';
import type { Holiday } from '@/types/timeoff';

export const HolidaysTab: React.FC = () => {
  const {
    holidays,
    members,
    setIsCreateHolidayModalOpen,
    setIsImportHolidaysModalOpen,
    setEditingHolidayId,
    deleteHoliday,
    showConfirm,
  } = useTimeOffStore();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const formatPeriod = (startDate: string, endDate?: string | null) => {
    try {
      const start = new Date(startDate + 'T00:00:00');
      const startFormatted = start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      if (endDate && endDate !== startDate) {
        const end = new Date(endDate + 'T00:00:00');
        const endFormatted = end.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        return `${startFormatted} - ${endFormatted}`;
      }
      return startFormatted;
    } catch {
      return startDate;
    }
  };

  const getAssigneeLabel = (holiday: Holiday) => {
    if (!holiday.member_ids || holiday.member_ids.length === 0 || holiday.member_ids.length === members.length) {
      return 'Everyone';
    }
    if (holiday.member_ids.length === 1) {
      const member = members.find((m) => m.id === holiday.member_ids[0]);
      return member ? member.name.replace(/^\[SAMPLE\]\s*/, '') : '1 member';
    }
    return `${holiday.member_ids.length} members`;
  };

  const handleDelete = (holiday: Holiday) => {
    setActiveMenuId(null);
    showConfirm(
      'Delete holiday?',
      `Are you sure you want to delete "${holiday.name}"? This action cannot be undone.`,
      () => deleteHoliday(holiday.id)
    );
  };

  const handleEdit = (holidayId: string) => {
    setActiveMenuId(null);
    setEditingHolidayId(holidayId);
  };

  return (
    <div className="space-y-4">
      {/* Top action header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-700">Holidays</h2>
          <p className="text-xs text-slate-500">Manage paid public and company-wide holidays</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsImportHolidaysModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Import public holidays</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCreateHolidayModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#03a9f4] hover:bg-[#0288d1] text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create holiday</span>
          </button>
        </div>
      </div>

      {holidays.length === 0 ? (
        /* Empty State matching Clockify screenshot */
        <div className="bg-white border border-slate-200 rounded shadow-xs py-20 px-4 flex flex-col items-center justify-center text-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <PartyPopper className="w-8 h-8 stroke-[1.5]" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 bg-slate-300 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              0
            </span>
          </div>

          <h3 className="text-base font-semibold text-slate-800 mb-1">
            No holidays yet
          </h3>
          <p className="text-xs text-slate-500 mb-6 max-w-sm">
            Create your first holiday and assign it to members or your entire workspace.
          </p>

          <button
            type="button"
            onClick={() => setIsCreateHolidayModalOpen(true)}
            className="bg-[#03a9f4] hover:bg-[#0288d1] text-white font-semibold text-xs px-5 py-2.5 rounded tracking-wide uppercase transition-colors shadow-xs mb-3 cursor-pointer"
          >
            Create New Holiday
          </button>

          <button
            type="button"
            onClick={() => setIsImportHolidaysModalOpen(true)}
            className="text-[#03a9f4] hover:text-[#0288d1] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Import public holidays</span>
          </button>
        </div>
      ) : (
        /* Clockify Holiday Table */
        <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#f0f3f6] text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-semibold select-none">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Holiday</th>
                  <th className="py-2.5 px-4 font-semibold">Assignees</th>
                  <th className="py-2.5 px-4 font-semibold">Period</th>
                  <th className="py-2.5 px-4 font-semibold">Recurrence</th>
                  <th className="py-2.5 px-4 text-right pr-6 font-semibold w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {holidays.map((h) => {
                  const isMenuOpen = activeMenuId === h.id;
                  return (
                    <tr
                      key={h.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Holiday Name */}
                      <td className="py-3 px-4 font-medium text-slate-800">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: h.color || '#03a9f4' }}
                          />
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-xs">{h.name}</span>
                          {h.country_code && (
                            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              {h.country_code}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Assignees */}
                      <td className="py-3 px-4 text-slate-600">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {getAssigneeLabel(h)}
                        </span>
                      </td>

                      {/* Period */}
                      <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">
                        {formatPeriod(h.date, h.end_date)}
                      </td>

                      {/* Recurrence */}
                      <td className="py-3 px-4 text-slate-600">
                        {h.recurrence === 'every_year' ? (
                          <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                            Every year
                          </span>
                        ) : (
                          <span className="text-slate-500">Once</span>
                        )}
                      </td>

                      {/* Row Actions Menu */}
                      <td className="py-3 px-4 text-right pr-4 relative">
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={() => setActiveMenuId(isMenuOpen ? null : h.id)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors cursor-pointer"
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
                                onClick={() => handleEdit(h.id)}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#03a9f4] flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(h)}
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
