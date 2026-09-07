import { Calendar, User, Clock, IndianRupee } from "lucide-react";

interface DetailedEntry {
    id: string;
    date: string;
    member: string;
    avatarBg: string;
    description: string;
    project: string;
    projectColor: string;
    client?: string;
    timeSpan: string;
    duration: string;
    amount: string;
    isBillable: boolean;
}

const DETAILED_RECORDS: DetailedEntry[] = [
    {
        id: "d-1",
        date: "Aug 31, 2026",
        member: "Bindhu Shree",
        avatarBg: "#00897b",
        description: "UI/UX Architecture Sprint & Reference Screen Alignments",
        project: "Project Alpha",
        projectColor: "#03A9F4",
        client: "[SAMPLE] Client B",
        timeSpan: "08:00 - 11:30",
        duration: "03:30:00",
        amount: "₹315.00",
        isBillable: true,
    },
    {
        id: "d-2",
        date: "Aug 31, 2026",
        member: "Likith D T",
        avatarBg: "#0288d1",
        description: "Tauri Rust Native Backend Integration & Permissions Setup",
        project: "Project Beta",
        projectColor: "#EF4444",
        client: "[SAMPLE] Client A",
        timeSpan: "12:30 - 16:15",
        duration: "03:45:00",
        amount: "₹337.50",
        isBillable: true,
    },
    {
        id: "d-3",
        date: "Aug 31, 2026",
        member: "Amy Smith",
        avatarBg: "#F59E0B",
        description: "Corporate Audit & Time Off Requests Assessment",
        project: "[SAMPLE] Internal Project",
        projectColor: "#03A9F4",
        timeSpan: "09:00 - 13:00",
        duration: "04:00:00",
        amount: "₹0.00",
        isBillable: false,
    },
    {
        id: "d-4",
        date: "Aug 31, 2026",
        member: "James Anderson",
        avatarBg: "#64748B",
        description: "PostgreSQL Database Clustering & Docker Setup",
        project: "Project Gamma",
        projectColor: "#6D4C41",
        client: "[SAMPLE] Client A",
        timeSpan: "14:00 - 18:00",
        duration: "04:00:00",
        amount: "₹360.00",
        isBillable: true,
    },
];

export function DetailedReportView() {
    return (
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs overflow-hidden select-none">
            {/* Header */}
            <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#03A9F4]" />
                    <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                        Itemized Time Log Records
                    </h3>
                </div>
                <span className="text-xs font-mono font-bold text-[#1E293B]">
                    Showing {DETAILED_RECORDS.length} Entries
                </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                            <th className="py-3 px-4">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                                    Date
                                </span>
                            </th>
                            <th className="py-3 px-4">
                                <span className="flex items-center gap-1">
                                    <User className="w-3.5 h-3.5 text-[#94A3B8]" />
                                    Member
                                </span>
                            </th>
                            <th className="py-3 px-4">Description</th>
                            <th className="py-3 px-4">Project</th>
                            <th className="py-3 px-4">Time Span</th>
                            <th className="py-3 px-4 text-right">Duration</th>
                            <th className="py-3 px-4 text-right">
                                <span className="inline-flex items-center gap-1 justify-end">
                                    <IndianRupee className="w-3.5 h-3.5 text-[#94A3B8]" />
                                    Amount
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9] text-[#334155]">
                        {DETAILED_RECORDS.map((rec) => (
                            <tr key={rec.id} className="hover:bg-[#F8FAFC] transition">
                                <td className="py-3.5 px-4 font-mono text-[11px] text-[#64748B]">
                                    {rec.date}
                                </td>
                                <td className="py-3.5 px-4 font-semibold text-[#1E293B]">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: rec.avatarBg }}
                                        >
                                            {rec.member.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span>{rec.member}</span>
                                    </div>
                                </td>
                                <td className="py-3.5 px-4 font-medium text-[#1E293B]">
                                    {rec.description}
                                </td>
                                <td className="py-3.5 px-4">
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#E1F5FE] text-[#0288D1] border border-[#B3E5FC]">
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: rec.projectColor }}
                                        />
                                        <span>{rec.project}</span>
                                    </span>
                                </td>
                                <td className="py-3.5 px-4 font-mono text-[11px] text-[#64748B]">
                                    {rec.timeSpan}
                                </td>
                                <td className="py-3.5 px-4 font-mono font-bold text-right text-[#1E293B]">
                                    {rec.duration}
                                </td>
                                <td className="py-3.5 px-4 font-mono font-bold text-right text-[#10B981]">
                                    {rec.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
