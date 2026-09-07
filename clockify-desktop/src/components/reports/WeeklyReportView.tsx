interface WeeklyMemberRow {
    id: string;
    name: string;
    avatarBg: string;
    days: { [key: string]: string };
    weekTotal: string;
}

const WEEKLY_DATA: WeeklyMemberRow[] = [
    {
        id: "m-1",
        name: "Bindhu Shree",
        avatarBg: "#00897b",
        days: {
            Mon: "08:00",
            Tue: "07:30",
            Wed: "08:15",
            Thu: "08:00",
            Fri: "07:45",
            Sat: "00:00",
            Sun: "00:00",
        },
        weekTotal: "39:30 h",
    },
    {
        id: "m-2",
        name: "Likith D T",
        avatarBg: "#0288d1",
        days: {
            Mon: "08:30",
            Tue: "08:00",
            Wed: "08:00",
            Thu: "08:00",
            Fri: "08:00",
            Sat: "00:00",
            Sun: "00:00",
        },
        weekTotal: "40:30 h",
    },
    {
        id: "m-3",
        name: "Amy Smith",
        avatarBg: "#F59E0B",
        days: {
            Mon: "07:45",
            Tue: "08:00",
            Wed: "07:30",
            Thu: "08:00",
            Fri: "07:15",
            Sat: "00:00",
            Sun: "00:00",
        },
        weekTotal: "38:30 h",
    },
    {
        id: "m-4",
        name: "James Anderson",
        avatarBg: "#64748B",
        days: {
            Mon: "08:00",
            Tue: "08:00",
            Wed: "08:00",
            Thu: "08:00",
            Fri: "08:00",
            Sat: "00:00",
            Sun: "00:00",
        },
        weekTotal: "40:00 h",
    },
];

export function WeeklyReportView() {
    return (
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs overflow-hidden select-none">
            {/* Header */}
            <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                    Team Weekly Hours (Aug 31 – Sep 06)
                </h3>
                <span className="text-xs font-mono font-bold text-[#03A9F4]">
                    Workspace Total: 158:30 h
                </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                            <th className="py-3 px-4">Member</th>
                            <th className="py-3 px-3 text-center">Mon</th>
                            <th className="py-3 px-3 text-center">Tue</th>
                            <th className="py-3 px-3 text-center">Wed</th>
                            <th className="py-3 px-3 text-center">Thu</th>
                            <th className="py-3 px-3 text-center">Fri</th>
                            <th className="py-3 px-3 text-center text-[#94A3B8]">Sat</th>
                            <th className="py-3 px-3 text-center text-[#94A3B8]">Sun</th>
                            <th className="py-3 px-4 text-right">Week Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9] text-[#334155]">
                        {WEEKLY_DATA.map((row) => (
                            <tr key={row.id} className="hover:bg-[#F8FAFC] transition">
                                <td className="py-3.5 px-4 font-semibold text-[#1E293B]">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: row.avatarBg }}
                                        >
                                            {row.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span>{row.name}</span>
                                    </div>
                                </td>
                                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                    <td
                                        key={day}
                                        className={`py-3.5 px-3 text-center font-mono ${
                                            row.days[day] === "00:00"
                                                ? "text-[#CBD5E1]"
                                                : "text-[#1E293B]"
                                        }`}
                                    >
                                        {row.days[day]}
                                    </td>
                                ))}
                                <td className="py-3.5 px-4 font-mono font-bold text-right text-[#03A9F4]">
                                    {row.weekTotal}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
