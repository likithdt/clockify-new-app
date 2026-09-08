import React from "react";
import { Plus, Trash2, Receipt } from "lucide-react";
import type { Expense } from "../backend/types";

export interface ExpensesScreenProps {
  expenses: Expense[];
  onOpenExpenseModal: () => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpensesScreen: React.FC<ExpensesScreenProps> = ({
  expenses,
  onOpenExpenseModal,
  onDeleteExpense,
}) => {
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#0f1216] text-white p-4 space-y-4">
      {/* Total Card */}
      <div className="bg-[#1a1f26] border border-[#27303c] rounded-2xl p-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-[#8c9ba5] block">Total Recorded</span>
          <span className="text-xl font-bold text-white">${totalAmount.toFixed(2)}</span>
        </div>
        <button
          type="button"
          onClick={onOpenExpenseModal}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#00b0ff] text-white text-xs font-semibold hover:bg-[#009ee6]"
        >
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      {/* Expenses List */}
      <div className="space-y-2">
        {expenses.length === 0 ? (
          <div className="text-center py-12 text-[#8c9ba5] space-y-2">
            <Receipt className="w-10 h-10 mx-auto text-[#4a5568]" />
            <p className="text-sm">No expenses recorded yet</p>
          </div>
        ) : (
          expenses.map((exp) => (
            <div
              key={exp.id}
              className="bg-[#1a1f26] border border-[#27303c] rounded-2xl p-3.5 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    ${exp.amount.toFixed(2)} {exp.currency}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#242b36] text-[#8c9ba5]">
                    {exp.category}
                  </span>
                </div>
                {exp.projectName && (
                  <p className="text-xs text-[#8c9ba5] mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: exp.projectColor || "#00b0ff" }} />
                    {exp.projectName}
                  </p>
                )}
                {exp.notes && <p className="text-xs text-slate-400 mt-0.5">{exp.notes}</p>}
              </div>

              <button
                type="button"
                onClick={() => onDeleteExpense(exp.id)}
                className="p-2 text-[#8c9ba5] hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
