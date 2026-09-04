import { useState } from "react";
import { X, IndianRupee } from "lucide-react";
import { useTeamStore } from "@/stores/useTeamStore";

export function ChangeRateModal() {
    const { editingRate, setEditingRate, updateRate } = useTeamStore();

    const [rateValue, setRateValue] = useState<string>(
        editingRate?.currentRate !== null && editingRate?.currentRate !== undefined
            ? editingRate.currentRate.toString()
            : ""
    );
    const [applyToExisting, setApplyToExisting] = useState(false);

    if (!editingRate) return null;

    const isBillable = editingRate.type === "billable";
    const title = isBillable ? "Change billable rate" : "Change cost rate";

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const parsed = rateValue.trim() === "" ? null : parseFloat(rateValue);
        updateRate(editingRate.memberId, editingRate.type, parsed);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
            <div className="bg-white rounded-md shadow-2xl w-full max-w-[460px] overflow-hidden flex flex-col border border-[#d1d5db] animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
                    <h2 className="text-[17px] font-normal text-[#1f2937]">{title}</h2>
                    <button
                        onClick={() => setEditingRate(null)}
                        className="text-[#9ca3af] hover:text-[#4b5563] p-1 rounded transition cursor-pointer"
                        title="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSave} className="p-6 space-y-4 text-xs text-[#374151]">
                    <div>
                        <div className="text-[#6b7280] mb-1">
                            Team member: <span className="font-semibold text-[#1f2937]">{editingRate.memberName}</span>
                        </div>
                        <label className="block text-xs font-medium text-[#4b5563] mt-3 mb-1.5">
                            New {isBillable ? "billable" : "cost"} rate (INR/h)
                        </label>
                        <div className="relative flex items-center">
                            <IndianRupee className="w-4 h-4 text-[#9ca3af] absolute left-3 pointer-events-none" />
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={rateValue}
                                onChange={(e) => setRateValue(e.target.value)}
                                autoFocus
                                className="w-full h-9 pl-9 pr-14 bg-white border border-[#d1d5db] rounded text-xs text-[#1f2937] focus:outline-none focus:border-[#03a9f4]"
                            />
                            <span className="absolute right-3 text-[11px] font-semibold text-[#9ca3af]">
                                INR / h
                            </span>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-[#f3f4f6] space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={applyToExisting}
                                onChange={(e) => setApplyToExisting(e.target.checked)}
                                className="rounded border-[#cbd5e1] text-[#03a9f4] focus:ring-0"
                            />
                            <span className="text-[#4b5563]">
                                Apply to previous un-invoiced time entries as well
                            </span>
                        </label>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setEditingRate(null)}
                            className="px-4 py-2 text-xs font-medium text-[#03a9f4] hover:text-[#0288d1] cursor-pointer transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-[#03a9f4] hover:bg-[#0288d1] text-white text-xs font-semibold rounded uppercase tracking-wider transition cursor-pointer shadow-sm"
                        >
                            SAVE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
