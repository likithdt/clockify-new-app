import React, { useState } from "react";
import { X, Plus, Trash2, Settings, DollarSign, RotateCcw } from "lucide-react";
import { useExpenseStore } from "@/stores/useExpenseStore";

interface ExpenseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpenseSettingsModal: React.FC<ExpenseSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    categories,
    addCategory,
    removeCategory,
    loadSampleData,
    clearAllExpenses,
  } = useExpenseStore();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [defaultBillable, setDefaultBillable] = useState(true);

  if (!isOpen) return null;

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName.trim());
    setNewCategoryName("");
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 select-none animate-fadeIn">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Settings Dialog Card */}
      <div className="relative w-full max-w-[340px] bg-white rounded-[28px] shadow-2xl p-6 z-10 max-h-[90vh] flex flex-col animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-[#00aaff]">
              <Settings className="w-4 h-4" />
            </div>
            <h2 className="text-[17px] font-bold text-[#111827]">
              Expense Settings
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 text-sm">
          {/* Default Currency */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">
              Currency
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#00aaff]"
                placeholder="USD"
              />
            </div>
          </div>

          {/* Default Billable */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-600">
              Default as Billable
            </span>
            <button
              type="button"
              onClick={() => setDefaultBillable(!defaultBillable)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 focus:outline-none ${
                defaultBillable ? "bg-[#00aaff]" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  defaultBillable ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Manage Categories */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-2">
              Expense Categories ({categories.length})
            </label>

            <form onSubmit={handleAddCategory} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Add new category..."
                className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#00aaff]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#00aaff] hover:bg-[#0288d1] text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </form>

            <div className="max-h-36 overflow-y-auto space-y-1.5 border border-gray-100 rounded-xl p-2 bg-gray-50/50">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className="flex items-center justify-between py-1 px-2 rounded-lg bg-white border border-gray-100 text-xs text-gray-800"
                >
                  <span className="font-medium truncate">{cat}</span>
                  <button
                    type="button"
                    onClick={() => removeCategory(cat)}
                    className="text-gray-400 hover:text-red-500 p-0.5"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Prototype Quick Actions */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
              Prototype Actions
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  loadSampleData();
                  onClose();
                }}
                className="flex-1 py-2 px-3 bg-sky-50 hover:bg-sky-100 text-[#0288d1] rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Load Samples
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllExpenses();
                  onClose();
                }}
                className="flex-1 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-[#00aaff] hover:bg-[#0288d1] text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
