import React, { useState } from "react";
import {
  Menu,
  Settings as SettingsIcon,
  AlertTriangle,
  Plus,
  Trash2,
  Paperclip,
  CircleDollarSign,
} from "lucide-react";
import { useExpenseStore, Expense } from "@/stores/useExpenseStore";

interface ExpensesMainViewProps {
  onOpenDrawer: () => void;
  onOpenSettings: () => void;
  onOpenAddExpense: () => void;
  onSelectExpense?: (expense: Expense) => void;
}

export const ExpensesMainView: React.FC<ExpensesMainViewProps> = ({
  onOpenDrawer,
  onOpenSettings,
  onOpenAddExpense,
  onSelectExpense,
}) => {
  const { expenses, deleteExpense } = useExpenseStore();
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-[#f9fafb] overflow-hidden relative select-none animate-fadeIn">
      {/* Top App Bar matching Screenshot 2 */}
      <header className="h-14 px-4 bg-white flex items-center justify-between shrink-0 border-b border-[#f3f4f6] z-20">
        {/* Hamburger with orange notification dot + Title */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="relative p-1 -ml-1 text-[#111827] hover:text-[#4b5563] active:scale-95 transition-transform"
            title="Open navigation menu"
          >
            <Menu className="w-6 h-6 text-[#111827]" />
            {/* Orange notification dot matching Screenshot 2 */}
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#ff5722] ring-2 ring-white" />
          </button>

          <h1 className="text-[20px] font-semibold text-[#111827] tracking-tight">
            Expenses
          </h1>
        </div>

        {/* Settings gear icon on the right */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 text-[#4b5563] hover:text-[#111827] active:scale-95 transition-transform"
          title="Expense Settings"
        >
          <SettingsIcon className="w-6 h-6 text-[#4b5563]" />
        </button>
      </header>

      {/* Dismissible Warning Banner matching Screenshot 2 */}
      {!isBannerDismissed && (
        <div className="bg-white border-b border-[#e5e7eb] px-4 py-3.5 flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-3 flex-1">
            <AlertTriangle className="w-5 h-5 text-[#4b5563] shrink-0 mt-0.5 stroke-[1.8]" />
            <p className="text-[13px] text-[#374151] leading-snug">
              Timesheets and expenses got separated.
              <br />
              Make sure to submit them both.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsBannerDismissed(true)}
            className="text-[14px] font-semibold text-[#00aaff] hover:text-[#0288d1] px-1 py-0.5 transition-colors shrink-0"
          >
            Close
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {expenses.length === 0 ? (
          /* Empty State matching Screenshot 2 */
          <div className="h-full flex flex-col items-center justify-center px-6 -mt-10">
            {/* Grey Folded Document / Receipt Icon matching Screenshot 2 */}
            <div className="w-20 h-20 mb-6 flex items-center justify-center text-[#9ca3af]">
              <svg
                viewBox="0 0 64 64"
                className="w-16 h-16 fill-none stroke-current"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Paper sheet with folded bottom right corner */}
                <path
                  d="M16 12 C16 10 18 8 20 8 L44 8 C46 8 48 10 48 12 L48 40 L38 52 L20 52 C18 52 16 50 16 48 Z"
                  fill="#9ca3af"
                  stroke="none"
                />
                <path
                  d="M38 40 L48 40 L38 52 Z"
                  fill="#6b7280"
                  stroke="none"
                />
                {/* Horizontal lines */}
                <line x1="24" y1="20" x2="40" y2="20" stroke="white" strokeWidth="3" />
                <line x1="24" y1="28" x2="40" y2="28" stroke="white" strokeWidth="3" />
                <line x1="24" y1="36" x2="34" y2="36" stroke="white" strokeWidth="3" />
              </svg>
            </div>

            <h2 className="text-[20px] font-bold text-[#111827] mb-2 tracking-tight">
              No expenses yet
            </h2>
            <p className="text-[14px] text-[#6b7280] text-center">
              All your expenses will show up here.
            </p>
          </div>
        ) : (
          /* Active Expenses List */
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
                {expenses.length} {expenses.length === 1 ? "Expense" : "Expenses"}
              </span>
              <span className="text-xs font-bold text-gray-700">
                Total: $
                {expenses
                  .reduce((acc, curr) => acc + (curr.amount || 0), 0)
                  .toFixed(2)}{" "}
                USD
              </span>
            </div>

            {expenses.map((expense) => (
              <div
                key={expense.id}
                onClick={() => onSelectExpense?.(expense)}
                className="bg-white rounded-2xl p-4 border border-[#e5e7eb] shadow-xs hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[15px] font-bold text-[#111827]">
                      {expense.category}
                    </span>
                    {expense.billable && (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <CircleDollarSign className="w-2.5 h-2.5" />
                        Billable
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#4b5563]">
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: expense.projectColor || "#03a9f4" }}
                      />
                      <span className="truncate font-medium">
                        {expense.projectName || "General"}
                      </span>
                    </div>
                    <span>•</span>
                    <span>{expense.date}</span>
                  </div>

                  {expense.note && (
                    <p className="text-xs text-gray-500 mt-1.5 truncate italic">
                      "{expense.note}"
                    </p>
                  )}

                  {expense.receiptName && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-[#0288d1] font-medium">
                      <Paperclip className="w-3 h-3" />
                      <span className="truncate">{expense.receiptName}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end shrink-0 gap-2">
                  <span className="text-[16px] font-bold text-[#111827]">
                    ${Number(expense.amount).toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Delete this expense?")) {
                        deleteExpense(expense.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button (+) matching Screenshot 2 */}
      <div className="absolute right-5 bottom-6 z-30">
        <button
          type="button"
          onClick={onOpenAddExpense}
          className="w-14 h-14 rounded-full bg-[#00aaff] hover:bg-[#0288d1] active:scale-95 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,170,255,0.4)] transition-all"
          title="Add Expense"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
