import { Grid, HelpCircle, Bell, Puzzle, ChevronDown, MoreHorizontal, Info } from "lucide-react";

interface TopNavbarProps {
    workspaceName?: string;
    userInitials?: string;
}

export function TopNavbar({
    workspaceName = "GOPALAN COLLEGE OF ENGINEERING...",
    userInitials = "LD",
}: TopNavbarProps) {
    return (
        <header className="flex flex-col flex-shrink-0 z-30 select-none">
            {/* Blue Pro Trial Banner (#1A73E8) matching reference screenshot */}
            <div className="bg-[#1a73e8] text-white px-4 py-1.5 flex items-center justify-center text-xs font-medium relative shadow-sm">
                <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-white flex-shrink-0" />
                    <span>
                        <strong className="font-semibold">7 days left in trial</strong> - You are currently using sample data to help you explore.
                    </span>
                    <button className="inline-flex items-center gap-0.5 text-white underline hover:text-blue-100 transition-colors ml-1">
                        Manage <ChevronDown className="w-3.5 h-3.5 inline" />
                    </button>
                </div>
            </div>

            {/* Main Clockify Top Bar */}
            <div className="h-[52px] bg-white border-b border-[#e2e8f0] px-4 flex items-center justify-between">
                {/* Left Section: 9-dot launcher, Clockify Logo, Workspace selector, Upgrade button */}
                <div className="flex items-center gap-3">
                    {/* 9 Dots launcher icon */}
                    <button className="p-1.5 text-[#64748b] hover:text-[#1e293b] hover:bg-[#f1f5f9] rounded transition" title="Apps">
                        <Grid className="w-5 h-5" />
                    </button>

                    {/* Clockify Brand Logo */}
                    <div className="flex items-center gap-2 cursor-pointer">
                        <div className="w-7 h-7 rounded-lg bg-[#03a9f4] flex items-center justify-center text-white shadow-sm">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <span className="font-bold text-[#1e293b] text-lg tracking-tight lowercase">
                            clockify
                        </span>
                    </div>

                    <div className="h-5 w-px bg-[#e2e8f0] mx-1" />

                    {/* Workspace Selector */}
                    <button className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-[#1e293b] hover:bg-[#f8fafc] rounded transition max-w-[280px] truncate">
                        <span className="truncate">{workspaceName}</span>
                    </button>

                    {/* More dots button */}
                    <button className="p-1 text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#f1f5f9] rounded transition" title="Workspace options">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* UPGRADE Button */}
                    <button className="px-3 py-1 bg-[#03a9f4] hover:bg-[#0288d1] text-white text-xs font-bold uppercase rounded tracking-wider shadow-sm transition-colors">
                        UPGRADE
                    </button>
                </div>

                {/* Right Section: Add-ons, Notifications, Help, User Avatar */}
                <div className="flex items-center gap-3">
                    {/* Puzzle / Add-ons icon */}
                    <button className="p-1.5 text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#f1f5f9] rounded transition" title="Integrations & Add-ons">
                        <Puzzle className="w-5 h-5" />
                    </button>

                    {/* Notifications bell with badge 2 */}
                    <button className="relative p-1.5 text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#f1f5f9] rounded transition" title="Notifications">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-0.5 right-0.5 min-w-[15px] h-[15px] px-1 bg-[#f97316] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                            2
                        </span>
                    </button>

                    {/* Help icon */}
                    <button className="p-1.5 text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#f1f5f9] rounded transition" title="Help & Support">
                        <HelpCircle className="w-5 h-5" />
                    </button>

                    {/* User Profile circle avatar (Bindhu Shree - BS) */}
                    <button className="w-8 h-8 rounded-full bg-[#00897b] text-white font-bold text-xs flex items-center justify-center ring-2 ring-white shadow-sm hover:opacity-90 transition">
                        {userInitials}
                    </button>
                </div>
            </div>
        </header>
    );
}
