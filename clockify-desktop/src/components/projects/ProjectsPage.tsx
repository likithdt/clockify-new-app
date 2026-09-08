import { useEffect } from "react";
import { useProjectStore } from "@/stores/useProjectStore";
import { ProjectsFilterBar } from "./ProjectsFilterBar";
import { ProjectsTable } from "./ProjectsTable";
import { CreateProjectModal } from "./CreateProjectModal";
import { ProjectRemoveSampleModal } from "./ProjectRemoveSampleModal";

export function ProjectsPage() {
    const { hasSampleData, setRemoveSampleModalOpen, openCreateModal, loadFromBackend } = useProjectStore();

    useEffect(() => {
        loadFromBackend();
    }, [loadFromBackend]);

    return (
        <div className="flex-1 flex flex-col overflow-y-auto min-h-0 bg-[#f5f6f8] select-none p-8">
            <div className="w-full space-y-5">
                {/* Sample Data Banner matching Creation of New Project.png */}
                {hasSampleData && (
                    <div className="bg-[#e8f4fd] border border-[#b8e2fb] text-[#1565c0] px-4 py-2.5 rounded-sm flex items-center justify-between text-xs">
                        <span>You are currently using sample data to help you explore.</span>
                        <button
                            type="button"
                            onClick={() => setRemoveSampleModalOpen(true)}
                            className="px-3 py-1 border border-[#03a9f4] text-[#03a9f4] hover:bg-white rounded text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                        >
                            REMOVE SAMPLE DATA
                        </button>
                    </div>
                )}

                {/* Page Title & Create Project Button matching Projects.png */}
                <div className="flex items-center justify-between">
                    <h1 className="text-[22px] font-normal text-[#333333]">Projects</h1>
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-[#03a9f4] hover:bg-[#0288d1] text-white text-xs font-semibold uppercase tracking-wider rounded-sm shadow-sm transition flex items-center gap-2 cursor-pointer"
                    >
                        <span>CREATE NEW PROJECT</span>
                    </button>
                </div>

                {/* Filter and Search Bar */}
                <ProjectsFilterBar />

                {/* Projects Table */}
                <ProjectsTable />
            </div>

            {/* Modals */}
            <CreateProjectModal />
            <ProjectRemoveSampleModal />
        </div>
    );
}
