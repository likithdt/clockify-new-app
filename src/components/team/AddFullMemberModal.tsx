import { useState } from "react";
import { X } from "lucide-react";
import { useTeamStore } from "@/stores/useTeamStore";

export function AddFullMemberModal() {
    const { isAddMemberOpen, setAddMemberOpen, addMembers } = useTeamStore();
    const [emailsInput, setEmailsInput] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    if (!isAddMemberOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        const rawEmails = emailsInput
            .split(/[,;\s]+/)
            .map((e) => e.trim())
            .filter(Boolean);

        if (rawEmails.length === 0) {
            setErrorMsg("Please enter at least one email address.");
            return;
        }

        // Basic email validation
        const invalid = rawEmails.find((email) => !email.includes("@"));
        if (invalid) {
            setErrorMsg(`Invalid email format: "${invalid}"`);
            return;
        }

        addMembers(rawEmails);
        setEmailsInput("");
        setAddMemberOpen(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
            <div className="bg-white rounded-md shadow-2xl w-full max-w-[580px] overflow-hidden flex flex-col border border-[#d1d5db] animate-in fade-in zoom-in-95 duration-150">
                {/* Header matching Team(Add full members).png */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
                    <h2 className="text-[17px] font-normal text-[#1f2937]">Add full members</h2>
                    <button
                        onClick={() => setAddMemberOpen(false)}
                        className="text-[#9ca3af] hover:text-[#4b5563] p-1 rounded transition cursor-pointer"
                        title="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errorMsg && (
                        <div className="p-2.5 bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] rounded text-xs">
                            {errorMsg}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-[#374151] mb-1">
                            Invite by email
                        </label>
                        <p className="text-[11px] text-[#6b7280] mb-2">
                            Separate multiple emails with commas, spaces, or semicolons.
                        </p>
                        <input
                            type="text"
                            placeholder="Enter one or more email addresses"
                            value={emailsInput}
                            onChange={(e) => setEmailsInput(e.target.value)}
                            autoFocus
                            className="w-full h-10 px-3 bg-white border border-[#d1d5db] rounded text-xs text-[#1f2937] focus:outline-none focus:border-[#03a9f4]"
                        />
                    </div>

                    {/* Footer */}
                    <div className="pt-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setAddMemberOpen(false)}
                            className="px-4 py-2 text-xs font-medium text-[#03a9f4] hover:text-[#0288d1] cursor-pointer transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-[#03a9f4] hover:bg-[#0288d1] text-white text-xs font-semibold rounded uppercase tracking-wider transition cursor-pointer shadow-sm"
                        >
                            SEND INVITE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
