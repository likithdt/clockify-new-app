import { useState } from "react";
import { X, Calendar as CalendarIcon, ChevronDown, Check, Paperclip } from "lucide-react";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { useProjectStore } from "@/stores/useProjectStore";

interface CreateExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateExpenseModal({ isOpen, onClose }: CreateExpenseModalProps) {
    const { addExpense, categories, teammates } = useExpenseStore();
    const { projects } = useProjectStore();

    const [teamMember, setTeamMember] = useState(teammates[0] || "Bindhu shree");
    const [date, setDate] = useState("Today");
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [billable, setBillable] = useState(true);
    const [attachedFile, setAttachedFile] = useState<string | null>(null);

    // Dropdown state toggles
    const [isProjectOpen, setIsProjectOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isMemberOpen, setIsMemberOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    if (!isOpen) return null;

    // Available projects fallback if store is empty
    const availableProjects = projects.length > 0 ? projects : [
        { id: "proj-1", name: "Clockify Mobile App", color: "#03A9F4" },
        { id: "proj-2", name: "Internal Infrastructure", color: "#4CAF50" },
        { id: "proj-3", name: "Website Redesign", color: "#FF9800" },
    ];

    const selectedProject = availableProjects.find((p) => p.id === selectedProjectId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!selectedProjectId) {
            setErrorMsg("Please select a project.");
            return;
        }
        if (!category) {
            setErrorMsg("Please select a category.");
            return;
        }
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setErrorMsg("Please enter a valid amount greater than 0.");
            return;
        }

        const project = availableProjects.find((p) => p.id === selectedProjectId);

        addExpense({
            teamMember,
            date,
            projectId: selectedProjectId,
            projectName: project?.name || "General Project",
            projectColor: project?.color || "#03A9F4",
            category,
            amount: parsedAmount,
            currency: "USD",
            note: note.trim(),
            billable,
            receiptName: attachedFile || undefined,
        });

        // Reset
        setSelectedProjectId("");
        setCategory("");
        setAmount("");
        setNote("");
        setAttachedFile(null);
        setErrorMsg("");
        onClose();
    };

    const handleFileAttach = () => {
        // Trigger simulated receipt attachment or file picker
        const simulatedReceipts = [
            "receipt_august_2026.pdf",
            "hotel_invoice.png",
            "flight_ticket.pdf",
            "taxi_fare.jpg",
        ];
        const randomReceipt = simulatedReceipts[Math.floor(Math.random() * simulatedReceipts.length)];
        setAttachedFile(randomReceipt);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
            <div className="bg-white rounded-md shadow-2xl w-full max-w-[560px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 border border-[#d1d5db]">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
                    <h2 className="text-[17px] font-normal text-[#1f2937]">Create expense</h2>
                    <button
                        onClick={onClose}
                        className="text-[#9ca3af] hover:text-[#4b5563] p-1 rounded transition cursor-pointer"
                        title="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm text-[#374151]">
                    {errorMsg && (
                        <div className="p-2.5 bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] rounded text-xs font-medium">
                            {errorMsg}
                        </div>
                    )}

                    {/* Team member */}
                    <div className="flex items-center">
                        <label className="w-32 text-xs font-medium text-[#4b5563] flex-shrink-0">
                            Team member
                        </label>
                        <div className="flex-1 relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsMemberOpen(!isMemberOpen);
                                    setIsProjectOpen(false);
                                    setIsCategoryOpen(false);
                                }}
                                className="w-full h-9 px-3 bg-white border border-[#d1d5db] rounded text-xs text-[#1f2937] flex items-center justify-between hover:border-[#9ca3af] focus:outline-none focus:border-[#03a9f4]"
                            >
                                <span>{teamMember}</span>
                                <ChevronDown className="w-4 h-4 text-[#9ca3af]" />
                            </button>

                            {isMemberOpen && (
                                <div className="absolute left-0 right-0 top-10 mt-1 bg-white border border-[#d1d5db] rounded shadow-lg z-30 py-1 max-h-48 overflow-y-auto">
                                    {teammates.map((member) => (
                                        <button
                                            key={member}
                                            type="button"
                                            onClick={() => {
                                                setTeamMember(member);
                                                setIsMemberOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 text-xs text-[#374151] hover:bg-[#f3f4f6] flex items-center justify-between"
                                        >
                                            <span>{member}</span>
                                            {teamMember === member && <Check className="w-3.5 h-3.5 text-[#03a9f4]" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center">
                        <label className="w-32 text-xs font-medium text-[#4b5563] flex-shrink-0">
                            Date
                        </label>
                        <div className="flex-1 relative flex items-center">
                            <div className="absolute left-3 text-[#9ca3af] pointer-events-none">
                                <CalendarIcon className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                placeholder="Today"
                                className="w-full h-9 pl-9 pr-3 bg-white border border-[#d1d5db] rounded text-xs text-[#1f2937] focus:outline-none focus:border-[#03a9f4]"
                            />
                        </div>
                    </div>

                    {/* Project * */}
                    <div className="flex items-center">
                        <label className="w-32 text-xs font-medium text-[#4b5563] flex-shrink-0">
                            Project <span className="text-[#ef4444]">*</span>
                        </label>
                        <div className="flex-1 relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsProjectOpen(!isProjectOpen);
                                    setIsCategoryOpen(false);
                                    setIsMemberOpen(false);
                                }}
                                className="w-full h-9 px-3 bg-white border border-[#d1d5db] rounded text-xs flex items-center justify-between hover:border-[#9ca3af] focus:outline-none focus:border-[#03a9f4]"
                            >
                                {selectedProject ? (
                                    <div className="flex items-center gap-2 truncate">
                                        <span
                                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: selectedProject.color }}
                                        />
                                        <span className="text-[#1f2937] font-medium truncate">{selectedProject.name}</span>
                                    </div>
                                ) : (
                                    <span className="text-[#9ca3af]">Select Project</span>
                                )}
                                <ChevronDown className="w-4 h-4 text-[#9ca3af]" />
                            </button>

                            {isProjectOpen && (
                                <div className="absolute left-0 right-0 top-10 mt-1 bg-white border border-[#d1d5db] rounded shadow-lg z-30 py-1 max-h-48 overflow-y-auto">
                                    {availableProjects.map((p) => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedProjectId(p.id);
                                                setIsProjectOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 text-xs text-[#374151] hover:bg-[#f3f4f6] flex items-center gap-2"
                                        >
                                            <span
                                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: p.color }}
                                            />
                                            <span className="truncate">{p.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Category * */}
                    <div className="flex items-center">
                        <label className="w-32 text-xs font-medium text-[#4b5563] flex-shrink-0">
                            Category <span className="text-[#ef4444]">*</span>
                        </label>
                        <div className="flex-1 relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCategoryOpen(!isCategoryOpen);
                                    setIsProjectOpen(false);
                                    setIsMemberOpen(false);
                                }}
                                className="w-full h-9 px-3 bg-white border border-[#d1d5db] rounded text-xs flex items-center justify-between hover:border-[#9ca3af] focus:outline-none focus:border-[#03a9f4]"
                            >
                                <span className={category ? "text-[#1f2937] font-medium" : "text-[#9ca3af]"}>
                                    {category || "Select category"}
                                </span>
                                <ChevronDown className="w-4 h-4 text-[#9ca3af]" />
                            </button>

                            {isCategoryOpen && (
                                <div className="absolute left-0 right-0 top-10 mt-1 bg-white border border-[#d1d5db] rounded shadow-lg z-30 py-1 max-h-48 overflow-y-auto">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => {
                                                setCategory(cat);
                                                setIsCategoryOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 text-xs text-[#374151] hover:bg-[#f3f4f6] flex items-center justify-between"
                                        >
                                            <span>{cat}</span>
                                            {category === cat && <Check className="w-3.5 h-3.5 text-[#03a9f4]" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Amount * */}
                    <div className="flex items-center">
                        <label className="w-32 text-xs font-medium text-[#4b5563] flex-shrink-0">
                            Amount <span className="text-[#ef4444]">*</span>
                        </label>
                        <div className="flex-1 relative flex items-center">
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount"
                                className="w-full h-9 pl-3 pr-14 bg-white border border-[#d1d5db] rounded text-xs text-[#1f2937] focus:outline-none focus:border-[#03a9f4]"
                            />
                            <span className="absolute right-3 text-xs font-semibold text-[#9ca3af] pointer-events-none">
                                USD
                            </span>
                        </div>
                    </div>

                    {/* Note */}
                    <div className="flex items-start">
                        <label className="w-32 text-xs font-medium text-[#4b5563] flex-shrink-0 pt-2">
                            Note
                        </label>
                        <div className="flex-1">
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Add note"
                                rows={3}
                                className="w-full p-2.5 bg-white border border-[#d1d5db] rounded text-xs text-[#1f2937] focus:outline-none focus:border-[#03a9f4] resize-y"
                            />
                        </div>
                    </div>

                    {/* Billable */}
                    <div className="flex items-center">
                        <label className="w-32 text-xs font-medium text-[#4b5563] flex-shrink-0">
                            Billable
                        </label>
                        <div className="flex-1 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setBillable(!billable)}
                                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                                    billable ? "bg-[#374151]" : "bg-[#d1d5db]"
                                }`}
                            >
                                <div
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                        billable ? "translate-x-5" : "translate-x-0"
                                    }`}
                                />
                            </button>
                            <span className="text-xs text-[#374151] font-normal">
                                {billable ? "Yes" : "No"}
                            </span>
                        </div>
                    </div>

                    {/* File attachment */}
                    <div className="flex items-center">
                        <label className="w-32 text-xs font-medium text-[#4b5563] flex-shrink-0">
                            File attachment
                        </label>
                        <div className="flex-1 flex items-center gap-3">
                            {attachedFile ? (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded text-xs text-[#166534]">
                                    <Paperclip className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-[200px]">{attachedFile}</span>
                                    <button
                                        type="button"
                                        onClick={() => setAttachedFile(null)}
                                        className="text-[#166534] hover:text-[#dc2626] ml-1 cursor-pointer"
                                        title="Remove receipt"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleFileAttach}
                                    className="px-4 py-1.5 border border-[#03a9f4] text-[#03a9f4] hover:bg-[#e1f5fe] rounded text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                                >
                                    ATTACH RECEIPT
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-medium text-[#03a9f4] hover:text-[#0288d1] cursor-pointer transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-[#03a9f4] hover:bg-[#0288d1] text-white text-xs font-semibold rounded uppercase tracking-wider transition cursor-pointer shadow-sm"
                        >
                            CREATE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
