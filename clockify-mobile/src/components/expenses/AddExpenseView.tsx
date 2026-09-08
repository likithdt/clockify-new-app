import React, { useState } from "react";
import {
  ArrowLeft,
  Folder,
  CircleDollarSign,
  Paperclip,
  FileText,
  Check,
  X,
} from "lucide-react";

interface AddExpenseViewProps {
  onBack: () => void;
  date: string;
  onOpenDatePicker: () => void;
  project: { id: string; name: string; color: string } | null;
  onOpenProjectSelect: () => void;
  category: string | null;
  onOpenCategorySelect: () => void;
  amount: string;
  onAmountChange: (val: string) => void;
  billable: boolean;
  onToggleBillable: () => void;
  attachedReceipt: string | null;
  onOpenReceiptSheet: () => void;
  onRemoveReceipt: () => void;
  notes: string;
  onNotesChange: (val: string) => void;
  onSaveExpense: () => void;
}

export const AddExpenseView: React.FC<AddExpenseViewProps> = ({
  onBack,
  date,
  onOpenDatePicker,
  project,
  onOpenProjectSelect,
  category,
  onOpenCategorySelect,
  amount,
  onAmountChange,
  billable,
  onToggleBillable,
  attachedReceipt,
  onOpenReceiptSheet,
  onRemoveReceipt,
  notes,
  onNotesChange,
  onSaveExpense,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddClick = () => {
    setValidationError(null);
    if (!project) {
      setValidationError("Please select a project.");
      return;
    }
    if (!category) {
      setValidationError("Please select a category.");
      return;
    }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setValidationError("Please enter a valid amount greater than 0.");
      return;
    }

    onSaveExpense();
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative select-none animate-fadeIn">
      {/* Top App Bar matching Screenshot 3 */}
      <header className="h-14 px-4 bg-white flex items-center shrink-0 border-b border-[#f3f4f6] z-20">
        <button
          type="button"
          onClick={onBack}
          className="p-1 -ml-1 text-[#111827] hover:text-[#4b5563] active:scale-95 transition-transform"
          title="Back to Expenses"
        >
          <ArrowLeft className="w-6 h-6 text-[#111827]" />
        </button>
        <h1 className="text-[20px] font-semibold text-[#111827] ml-4 tracking-tight">
          Add expense
        </h1>
      </header>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#f3f4f6]">
        {/* Error notification banner if validation fails */}
        {validationError && (
          <div className="bg-red-50 px-5 py-2.5 flex items-center justify-between text-xs text-red-600 font-medium">
            <span>{validationError}</span>
            <button
              type="button"
              onClick={() => setValidationError(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 1. Date Row */}
        <div
          onClick={onOpenDatePicker}
          className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 flex items-center justify-center text-[#4b5563]">
              {/* Calendar grid SVG matching real Clockify app */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#4b5563]" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <circle cx="8" cy="13" r="0.8" fill="currentColor" stroke="none" />
                <circle cx="12" cy="13" r="0.8" fill="currentColor" stroke="none" />
                <circle cx="16" cy="13" r="0.8" fill="currentColor" stroke="none" />
                <circle cx="8" cy="17" r="0.8" fill="currentColor" stroke="none" />
                <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
                <circle cx="16" cy="17" r="0.8" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <div>
              <div className="text-[14px] font-medium text-[#111827]">Date</div>
              <div className="text-[13px] text-[#4b5563] mt-0.5">{date}</div>
            </div>
          </div>
          <span className="text-[#9ca3af] text-lg leading-none">›</span>
        </div>

        {/* 2. Project Row */}
        <div
          onClick={onOpenProjectSelect}
          className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 relative flex items-center justify-center text-[#4b5563]">
              <span className="absolute -top-1.5 -left-1 text-[13px] font-bold text-[#111827]">
                *
              </span>
              <Folder className="w-5 h-5 text-[#4b5563]" />
            </div>
            <div>
              <div className="text-[14px] font-medium text-[#111827]">Project</div>
              <div className="text-[13px] text-[#4b5563] mt-0.5 flex items-center gap-1.5">
                {project ? (
                  <>
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-[#111827] font-medium">{project.name}</span>
                  </>
                ) : (
                  "None"
                )}
              </div>
            </div>
          </div>
          <span className="text-[#9ca3af] text-lg leading-none">›</span>
        </div>

        {/* 3. Category Row */}
        <div
          onClick={onOpenCategorySelect}
          className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 relative flex items-center justify-center text-[#4b5563]">
              <span className="absolute -top-1.5 -left-1 text-[13px] font-bold text-[#111827]">
                *
              </span>
              {/* Category Geometric Shapes SVG Icon (Triangle, Square, Circle) */}
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-[#4b5563]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="12 2 17 11 7 11" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <circle cx="18" cy="17.5" r="3.5" />
              </svg>
            </div>
            <div>
              <div className="text-[14px] font-medium text-[#111827]">Category</div>
              <div className="text-[13px] text-[#4b5563] mt-0.5">
                {category || "None"}
              </div>
            </div>
          </div>
          <span className="text-[#9ca3af] text-lg leading-none">›</span>
        </div>

        {/* 4. Amount Row */}
        <div className="px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-6 h-6 relative flex items-center justify-center text-[#4b5563]">
              <span className="absolute -top-1.5 -left-1 text-[13px] font-bold text-[#111827]">
                *
              </span>
              {/* Banknote 100 SVG Icon */}
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-[#4b5563]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <text
                  x="12"
                  y="15"
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight="bold"
                  fill="currentColor"
                  stroke="none"
                >
                  100
                </text>
              </svg>
            </div>
            <div className="flex-1">
              <input
                type="number"
                step="any"
                min="0"
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                placeholder="Amount"
                className="w-full text-[15px] text-[#111827] placeholder-[#4b5563] outline-none bg-transparent"
              />
            </div>
          </div>
          <span className="text-[14px] font-medium text-[#4b5563] ml-2">USD</span>
        </div>

        {/* 5. Billable Row */}
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 flex items-center justify-center text-[#4b5563]">
              <CircleDollarSign className="w-5 h-5 text-[#4b5563]" />
            </div>
            <span className="text-[14px] font-medium text-[#111827]">Billable</span>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={onToggleBillable}
            className={`w-12 h-7 rounded-full transition-colors relative p-0.5 focus:outline-none ${
              billable ? "bg-[#00aaff]" : "bg-[#9ca3af]"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                billable ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* 6. Attach a receipt Row */}
        <div
          onClick={onOpenReceiptSheet}
          className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-6 h-6 flex items-center justify-center text-[#4b5563]">
              <Paperclip className="w-5 h-5 text-[#4b5563]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-medium text-[#111827]">
                Attach a receipt
              </div>
              {attachedReceipt && (
                <div className="text-xs text-[#0288d1] flex items-center gap-1.5 mt-0.5 font-medium truncate">
                  <span>Attached: {attachedReceipt}</span>
                </div>
              )}
            </div>
          </div>

          {attachedReceipt && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveReceipt();
              }}
              className="p-1 text-gray-400 hover:text-red-500 rounded-full"
              title="Remove receipt"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 7. Notes Row - Editable input matching Screenshot 7 */}
        <div className="px-5 py-3.5 flex items-start gap-4">
          <div className="w-6 h-6 flex items-center justify-center text-[#4b5563] mt-1">
            <FileText className="w-5 h-5 text-[#4b5563]" />
          </div>
          <div className="flex-1">
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Notes"
              className="w-full text-[14px] text-[#111827] placeholder-[#4b5563] outline-none bg-transparent resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Floating Action Button (✓ Add) matching Screenshot 3 & 7 */}
      <div className="absolute right-5 bottom-6 z-30">
        <button
          type="button"
          onClick={handleAddClick}
          className="h-12 px-6 rounded-2xl bg-[#50c3f8] hover:bg-[#03a9f4] active:scale-95 text-white font-semibold text-[15px] flex items-center gap-2 shadow-[0_4px_16px_rgba(3,169,244,0.4)] transition-all"
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};
