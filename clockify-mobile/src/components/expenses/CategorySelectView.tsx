import React, { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useExpenseStore } from "@/stores/useExpenseStore";

interface CategorySelectViewProps {
  onBack: () => void;
  selectedCategory?: string;
  onSelectCategory: (category: string, rateText?: string) => void;
}

export const CategorySelectView: React.FC<CategorySelectViewProps> = ({
  onBack,
  selectedCategory,
  onSelectCategory,
}) => {
  const { categories, categoryRates, addCategory } = useExpenseStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryRate, setNewCategoryRate] = useState("");

  // Default fallback categories matching Screenshot 6 exactly
  const defaultCategories = [
    "Day rate",
    "Entertainment",
    "Lodging",
    "Meals",
    "Mileage",
    "Other",
    "Transportation",
  ];

  const categoryList = categories.length > 0 ? categories : defaultCategories;

  const rates: Record<string, string> = {
    "Day rate": "100.00 USD per day",
    "Mileage": "0.57 USD per mile",
    ...(categoryRates || {}),
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    addCategory(newCategoryName.trim(), newCategoryRate.trim() || undefined);
    onSelectCategory(newCategoryName.trim(), newCategoryRate.trim() || undefined);
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative select-none animate-fadeIn">
      {/* Top App Bar matching Screenshot 6 */}
      <header className="h-14 px-4 bg-white flex items-center justify-between shrink-0 border-b border-[#f3f4f6] z-20">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="p-1 -ml-1 text-[#111827] hover:text-[#4b5563] active:scale-95 transition-transform"
            title="Back to Add expense"
          >
            <ArrowLeft className="w-6 h-6 text-[#111827]" />
          </button>
          <h1 className="text-[20px] font-semibold text-[#111827] tracking-tight">
            Select category
          </h1>
        </div>
      </header>

      {/* Category List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {categoryList.map((category) => {
          const isSelected = selectedCategory === category;
          const rateText = rates[category];

          return (
            <div
              key={category}
              onClick={() => onSelectCategory(category, rateText)}
              className="flex items-center justify-between py-4 px-2 rounded-xl cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              {/* Radio + Category Name */}
              <div className="flex items-center gap-4">
                {/* Radio Button matching Screenshot 6 */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? "border-[#00aaff] bg-white"
                      : "border-[#4b5563] bg-transparent"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00aaff]" />
                  )}
                </div>

                <span className="text-[15px] font-medium text-[#111827]">
                  {category}
                </span>
              </div>

              {/* Rate Text on Right (e.g. 100.00 USD per day) */}
              {rateText && (
                <span className="text-[13px] font-medium text-[#374151]">
                  {rateText}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Action Button (+ New) matching Screenshot 6 */}
      <div className="absolute right-5 bottom-6 z-30">
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="h-12 px-6 rounded-2xl bg-[#00aaff] hover:bg-[#0288d1] active:scale-95 text-white font-semibold text-[15px] flex items-center gap-2 shadow-[0_4px_16px_rgba(0,170,255,0.4)] transition-all"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>New</span>
        </button>
      </div>

      {/* Quick Add Category Modal */}
      {isAddModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 select-none">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[0.5px]"
            onClick={() => setIsAddModalOpen(false)}
          />
          <form
            onSubmit={handleAddCategory}
            className="relative w-full max-w-[320px] bg-white rounded-3xl p-6 shadow-2xl z-10 space-y-4"
          >
            <h3 className="text-lg font-bold text-[#111827]">New Category</h3>
            <div>
              <label className="text-xs text-gray-500 font-medium">Category Name *</label>
              <input
                type="text"
                required
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Parking"
                className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#00aaff]"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Unit Rate (Optional)</label>
              <input
                type="text"
                value={newCategoryRate}
                onChange={(e) => setNewCategoryRate(e.target.value)}
                placeholder="e.g. 50.00 USD per hour"
                className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#00aaff]"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold text-white bg-[#00aaff] rounded-xl hover:bg-[#0288d1]"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
