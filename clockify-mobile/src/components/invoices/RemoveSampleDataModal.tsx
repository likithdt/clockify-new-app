import { useInvoiceStore } from "@/stores/useInvoiceStore";
import { X } from "lucide-react";

export function RemoveSampleDataModal() {
    const { isRemoveSampleModalOpen, closeRemoveSampleModal, removeSampleData } =
        useInvoiceStore();

    if (!isRemoveSampleModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
                    <h2 className="text-lg font-normal text-[#1E293B]">
                        Remove sample data
                    </h2>
                    <button
                        type="button"
                        onClick={closeRemoveSampleModal}
                        className="text-[#94A3B8] hover:text-[#1E293B] p-1 rounded transition cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Content matching Removal of Sample Data.png */}
                <div className="p-6 space-y-4 text-xs text-[#334155] leading-relaxed">
                    <ul className="space-y-2 list-disc list-inside">
                        <li>
                            All automatically added sample data and entries will be removed
                            from the workspace.
                        </li>
                        <li>
                            All data manually added by you or your users will not be removed.
                        </li>
                    </ul>

                    <p className="pt-2 text-[#64748B]">
                        You can always add sample data by clicking Manage in the blue trial banner
                        at the top and selecting Add sample data.
                    </p>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#E2E8F0] mt-6">
                        <button
                            type="button"
                            onClick={closeRemoveSampleModal}
                            className="text-xs font-semibold text-[#03A9F4] hover:text-[#0288D1] hover:underline cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={removeSampleData}
                            className="px-5 py-2 bg-[#03A9F4] hover:bg-[#0288D1] text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-xs transition cursor-pointer"
                        >
                            REMOVE SAMPLE DATA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
