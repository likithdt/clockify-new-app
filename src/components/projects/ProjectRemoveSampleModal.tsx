import { X, AlertTriangle } from "lucide-react";
import { useProjectStore } from "@/stores/useProjectStore";

export function ProjectRemoveSampleModal() {
    const { isRemoveSampleModalOpen, setRemoveSampleModalOpen, removeSampleData } = useProjectStore();

    if (!isRemoveSampleModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 select-none">
            <div className="bg-white rounded shadow-2xl border border-[#cbd5e1] w-full max-w-[480px] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
                    <div className="flex items-center gap-2 text-[#b91c1c]">
                        <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
                        <h2 className="text-[17px] font-normal text-[#1e293b]">Remove sample data</h2>
                    </div>
                    <button
                        onClick={() => setRemoveSampleModalOpen(false)}
                        className="text-[#94a3b8] hover:text-[#1e293b] p-1 transition cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-3 text-xs text-[#475569]">
                    <p className="leading-relaxed">
                        Are you sure you want to remove all sample data?
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-[#64748b] pl-1">
                        <li>All sample projects will be permanently deleted.</li>
                        <li>Any custom projects you created will remain untouched.</li>
                    </ul>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => setRemoveSampleModalOpen(false)}
                        className="px-4 py-2 text-xs font-medium text-[#64748b] hover:text-[#1e293b] cursor-pointer transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={removeSampleData}
                        className="px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-semibold rounded uppercase tracking-wider transition cursor-pointer shadow-sm"
                    >
                        REMOVE SAMPLE DATA
                    </button>
                </div>
            </div>
        </div>
    );
}
