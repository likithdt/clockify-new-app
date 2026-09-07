import { useState } from "react";
import { X, Plus, Trash2, Settings, IndianRupee } from "lucide-react";
import { useExpenseStore } from "@/stores/useExpenseStore";

interface ExpenseSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ExpenseSettingsModal({ isOpen, onClose }: ExpenseSettingsModalProps) {
    const { categories } = useExpenseStore();
    const [categoryList, setCategoryList] = useState<string[]>(categories);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [defaultCurrency, setDefaultCurrency] = useState("INR");
    const [defaultBillable, setDefaultBillable] = useState(true);

    if (!isOpen) return null;

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;
        if (!categoryList.includes(newCategoryName.trim())) {
            setCategoryList([...categoryList, newCategoryName.trim()]);
        }
        setNewCategoryName("");
    };

    const handleDeleteCategory = (cat: string) => {
        setCategoryList(categoryList.filter((c) => c !== cat));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
            <div className="bg-white rounded-md shadow-2xl w-full max-w-[520px] overflow-hidden flex flex-col border border-[#d1d5db] animate-in fade-in zoom-in-95 duration-150">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-[#03a9f4]" />
                        <h2 className="text-[17px] font-normal text-[#1f2937]">Expense Settings</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#9ca3af] hover:text-[#4b5563] p-1 rounded transition cursor-pointer"
                        title="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6 text-sm text-[#374151] max-h-[80vh] overflow-y-auto">
                    {/* General Currency */}
                    <div>
                        <label className="text-xs font-semibold text-[#4b5563] uppercase tracking-wider block mb-2">
                            Default Currency
                        </label>
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <IndianRupee className="w-4 h-4 text-[#9ca3af] absolute left-3 top-2.5" />
                                <input
                                    type="text"
                                    value={defaultCurrency}
                                    onChange={(e) => setDefaultCurrency(e.target.value)}
                                    className="w-full h-9 pl-9 pr-3 bg-white border border-[#d1d5db] rounded text-xs text-[#1f2937] focus:outline-none focus:border-[#03a9f4]"
                                />
                            </div>
                            <span className="text-xs text-[#6b7280]">Applied to all new expenses</span>
                        </div>
                    </div>

                    {/* Default Billable */}
                    <div className="flex items-center justify-between border-t border-b border-[#f3f4f6] py-3">
                        <div>
                            <div className="text-xs font-semibold text-[#1f2937]">New expenses are billable by default</div>
                            <div className="text-[11px] text-[#6b7280]">Can still be toggled per expense record</div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setDefaultBillable(!defaultBillable)}
                            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                                defaultBillable ? "bg-[#374151]" : "bg-[#d1d5db]"
                            }`}
                        >
                            <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                    defaultBillable ? "translate-x-5" : "translate-x-0"
                                }`}
                            />
                        </button>
                    </div>

                    {/* Categories Management */}
                    <div>
                        <label className="text-xs font-semibold text-[#4b5563] uppercase tracking-wider block mb-2">
                            Expense Categories ({categoryList.length})
                        </label>

                        <div className="flex items-center gap-2 mb-3">
                            <input
                                type="text"
                                placeholder="New category name..."
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddCategory();
                                    }
                                }}
                                className="flex-1 h-9 px-3 bg-white border border-[#d1d5db] rounded text-xs text-[#1f2937] focus:outline-none focus:border-[#03a9f4]"
                            />
                            <button
                                type="button"
                                onClick={handleAddCategory}
                                className="h-9 px-3.5 bg-[#03a9f4] hover:bg-[#0288d1] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add
                            </button>
                        </div>

                        <div className="border border-[#e5e7eb] rounded divide-y divide-[#f3f4f6] max-h-48 overflow-y-auto">
                            {categoryList.map((cat) => (
                                <div key={cat} className="flex items-center justify-between px-3 py-2 text-xs">
                                    <span className="text-[#374151] font-medium">{cat}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteCategory(cat)}
                                        className="text-[#9ca3af] hover:text-[#ef4444] p-1 transition"
                                        title="Remove category"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-[#f9fafb] border-t border-[#e5e7eb] flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-[#03a9f4] hover:bg-[#0288d1] text-white text-xs font-semibold rounded uppercase tracking-wider transition cursor-pointer"
                    >
                        DONE
                    </button>
                </div>
            </div>
        </div>
    );
}
