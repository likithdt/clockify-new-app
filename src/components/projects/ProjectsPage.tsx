import { useProjectStore } from "@/stores/useProjectStore";
import { ProjectsFilterBar } from "./ProjectsFilterBar";
import { ProjectsTable } from "./ProjectsTable";
import { CreateProjectModal } from "./CreateProjectModal";

export function ProjectsPage() {
    const { openCreateModal } = useProjectStore();

    return (
        <div className="flex-1 flex flex-col overflow-y-auto min-h-0 bg-[#f5f6f8] select-none">
            <div className="p-8 max-w-[1400px] w-full mx-auto space-y-6">
                {/* Page Title & Create Project Button */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-normal text-[#1e293b]">Projects</h1>
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="px-4 py-2.5 bg-[#03a9f4] hover:bg-[#0288d1] text-white text-xs font-semibold uppercase tracking-wider rounded-sm shadow-sm transition flex items-center gap-2 cursor-pointer"
                    >
                        <span>CREATE NEW PROJECT</span>
                    </button>
                </div>

                {/* Filter and Search Bar */}
                <ProjectsFilterBar />

                {/* Projects Table */}
                <ProjectsTable />
            </div>

            {/* Create Project Modal Dialog */}
            <CreateProjectModal />
        </div>
    );
}
