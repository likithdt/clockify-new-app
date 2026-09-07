import { useKioskStore, type KioskDevice } from "@/stores/useKioskStore";
import { Monitor, Trash2, ArrowRight } from "lucide-react";

interface Props {
    kiosks: KioskDevice[];
}

export function KioskDevicesTable({ kiosks }: Props) {
    const { launchTerminal, deleteKiosk } = useKioskStore();

    return (
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden select-none">
            <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-[#03A9F4]" />
                    <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                        Active Kiosk Stations ({kiosks.length})
                    </h3>
                </div>
                <span className="text-xs text-[#64748B]">
                    Shared devices configured for attendance logging
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                            <th className="py-3 px-4">Station Name</th>
                            <th className="py-3 px-4">Assignees</th>
                            <th className="py-3 px-4">Device IP</th>
                            <th className="py-3 px-4 text-center">Today Check-ins</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9] text-xs text-[#334155]">
                        {kiosks.map((kiosk) => (
                            <tr
                                key={kiosk.id}
                                className="hover:bg-[#F8FAFC] transition group"
                            >
                                <td className="py-3.5 px-4 font-semibold text-[#1E293B]">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-[#E1F5FE] text-[#03A9F4] flex items-center justify-center font-bold text-xs flex-shrink-0">
                                            <Monitor className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-xs text-[#1E293B]">
                                                {kiosk.name}
                                            </div>
                                            <div className="text-[10px] text-[#64748B]">
                                                Default: {kiosk.defaultProject}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="py-3.5 px-4 text-[#64748B]">
                                    <span className="truncate max-w-[180px] block">
                                        {kiosk.assignees.join(", ")}
                                    </span>
                                </td>

                                <td className="py-3.5 px-4 font-mono text-[11px] text-[#64748B]">
                                    {kiosk.deviceIp}
                                </td>

                                <td className="py-3.5 px-4 font-bold text-center text-[#1E293B]">
                                    <span className="px-2 py-0.5 bg-[#F1F5F9] rounded font-mono">
                                        {kiosk.todayCheckIns}
                                    </span>
                                </td>

                                <td className="py-3.5 px-4">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#ECFDF5] text-[#047857] text-[10px] font-bold rounded border border-[#A7F3D0]">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                                        ONLINE
                                    </span>
                                </td>

                                <td className="py-3.5 px-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => launchTerminal(kiosk.id)}
                                            className="px-3 py-1 bg-[#03A9F4] hover:bg-[#0288D1] text-white font-semibold text-xs rounded shadow-xs flex items-center gap-1 transition cursor-pointer"
                                        >
                                            <span>Launch Station</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteKiosk(kiosk.id)}
                                            className="p-1.5 text-[#CBD5E1] hover:text-[#EF4444] rounded hover:bg-[#FEE2E2] transition cursor-pointer"
                                            title="Delete Kiosk"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
