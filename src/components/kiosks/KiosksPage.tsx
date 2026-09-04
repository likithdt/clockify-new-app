import { useKioskStore } from "@/stores/useKioskStore";
import { KiosksWelcomeCards } from "./KiosksWelcomeCards";
import { CreateKioskModal } from "./CreateKioskModal";
import { KioskDevicesTable } from "./KioskDevicesTable";
import { KioskAttendanceTerminal } from "./KioskAttendanceTerminal";
import { Plus } from "lucide-react";

export function KiosksPage() {
    const { kiosks, isCreateModalOpen, activeTerminalKioskId, openCreateModal } =
        useKioskStore();

    // If viewing the full terminal attendance screen
    if (activeTerminalKioskId) {
        return <KioskAttendanceTerminal />;
    }

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[#F5F6F8] min-h-0 overflow-y-auto select-none">
            {/* Page Header */}
            <div className="p-8 pb-4 max-w-[1280px] w-full mx-auto flex items-center justify-between">
                <h1 className="text-2xl font-normal text-[#1E293B]">Kiosks</h1>

                {kiosks.length > 0 && (
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-[#03A9F4] hover:bg-[#0288D1] text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>CREATE KIOSK</span>
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="px-8 pb-12 max-w-[1280px] w-full mx-auto space-y-8 flex-1 flex flex-col justify-start">
                {kiosks.length === 0 ? (
                    /* Exact empty/intro state matching Kiosks.png */
                    <div className="space-y-10 my-auto py-4">
                        {/* Center Hero */}
                        <div className="text-center max-w-xl mx-auto space-y-3">
                            <h2 className="text-2xl font-bold text-[#1E293B]">
                                Simplify time tracking with kiosk
                            </h2>
                            <p className="text-sm text-[#64748B]">
                                Set up a kiosk to enable clock in and clock out using a shared device.
                            </p>
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={openCreateModal}
                                    className="px-6 py-2.5 bg-[#03A9F4] hover:bg-[#0288D1] text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-xs transition cursor-pointer"
                                >
                                    CREATE KIOSK
                                </button>
                            </div>
                        </div>

                        {/* 3 Step Visual Cards */}
                        <KiosksWelcomeCards />
                    </div>
                ) : (
                    /* Configured Kiosks View */
                    <div className="space-y-8">
                        <KioskDevicesTable kiosks={kiosks} />

                        {/* Guide reference section */}
                        <div className="pt-4 border-t border-[#E2E8F0]">
                            <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-4">
                                How Kiosk Terminals Work
                            </h4>
                            <KiosksWelcomeCards />
                        </div>
                    </div>
                )}
            </div>

            {/* Create Kiosk Modal Dialog */}
            {isCreateModalOpen && <CreateKioskModal />}
        </div>
    );
}
