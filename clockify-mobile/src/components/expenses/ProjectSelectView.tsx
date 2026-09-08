import React, { useState } from "react";
import { ArrowLeft, Search, Plus, MoreVertical, X } from "lucide-react";
import { useProjectStore, Project } from "@/stores/useProjectStore";
import { ProjectOptionsBottomSheet } from "./ProjectOptionsBottomSheet";

interface ProjectSelectViewProps {
  onBack: () => void;
  selectedProjectId?: string;
  onSelectProject: (project: { id: string; name: string; color: string }) => void;
  onOpenProjectEdit?: (project: Project) => void;
  onCreateNew: () => void;
}

export const ProjectSelectView: React.FC<ProjectSelectViewProps> = ({
  onBack,
  selectedProjectId,
  onSelectProject,
  onOpenProjectEdit,
  onCreateNew,
}) => {
  const { projects, toggleFavorite } = useProjectStore();
  const [selectedProjectForMenu, setSelectedProjectForMenu] = useState<Project | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fallback / default projects matching Screenshot 5 exactly if store is empty
  const defaultList: Project[] = projects.length > 0 ? projects : [
    {
      id: "proj-internal",
      name: "[SAMPLE] Internal Project",
      color: "#03a9f4",
      client: null,
      trackedHours: 0,
      amount: 0,
      currency: "USD",
      access: "Public",
      isFavorite: false,
      isArchived: false,
      isBillable: false,
      createdAt: new Date(),
    },
    {
      id: "proj-alpha",
      name: "[SAMPLE] Project Alpha",
      color: "#8d6e63",
      client: "[SAMPLE] Client A",
      trackedHours: 0,
      amount: 0,
      currency: "USD",
      access: "Public",
      isFavorite: false,
      isArchived: false,
      isBillable: true,
      createdAt: new Date(),
    },
    {
      id: "proj-beta",
      name: "[SAMPLE] Project Beta",
      color: "#f44336",
      client: "[SAMPLE] Client B",
      trackedHours: 0,
      amount: 0,
      currency: "USD",
      access: "Public",
      isFavorite: false,
      isArchived: false,
      isBillable: true,
      createdAt: new Date(),
    },
    {
      id: "proj-gamma",
      name: "[SAMPLE] Project Gamma",
      color: "#ff9800",
      client: "[SAMPLE] Client B",
      trackedHours: 0,
      amount: 0,
      currency: "USD",
      access: "Public",
      isFavorite: false,
      isArchived: false,
      isBillable: true,
      createdAt: new Date(),
    },
  ];

  // Filter projects by query
  const filteredProjects = defaultList.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.client && p.client.toLowerCase().includes(q))
    );
  });

  // Group by client
  const withoutClient = filteredProjects.filter((p) => !p.client);
  const groupedByClient: Record<string, Project[]> = {};

  filteredProjects.forEach((p) => {
    if (p.client) {
      if (!groupedByClient[p.client]) {
        groupedByClient[p.client] = [];
      }
      groupedByClient[p.client].push(p);
    }
  });



  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative select-none animate-fadeIn">
      {/* Top App Bar matching Screenshot 5 */}
      <header className="h-14 px-4 bg-white flex items-center justify-between shrink-0 border-b border-[#f3f4f6] z-20">
        {isSearchOpen ? (
          <div className="flex-1 flex items-center gap-2 bg-[#f3f4f6] rounded-xl px-3 py-1.5">
            <Search className="w-4 h-4 text-[#6b7280]" />
            <input
              type="text"
              placeholder="Search projects or clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent text-sm text-[#111827] placeholder-[#9ca3af] outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="p-1 text-[#6b7280] hover:text-[#111827]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onBack}
                className="p-1 -ml-1 text-[#111827] hover:text-[#4b5563] active:scale-95 transition-transform"
                title="Back to Add expense"
              >
                <ArrowLeft className="w-6 h-6 text-[#111827]" />
              </button>
              <h1 className="text-[20px] font-semibold text-[#111827] tracking-tight">
                Projects
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#374151] hover:text-[#111827] active:scale-95 transition-transform"
              title="Search Projects"
            >
              <Search className="w-5 h-5 text-[#374151]" />
            </button>
          </>
        )}
      </header>

      {/* Project List View */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Without client Group */}
        {withoutClient.length > 0 && (
          <div>
            <h3 className="text-[13px] font-medium text-[#4b5563] mb-3 px-1">
              Without client
            </h3>
                      <div className="divide-y divide-[#f3f4f6]">
              {withoutClient.map((project) => (
                <div
                  key={project.id}
                  onClick={() =>
                    onSelectProject({
                      id: project.id,
                      name: project.name,
                      color: project.color,
                    })
                  }
                  className={`flex items-center justify-between py-3.5 px-2 cursor-pointer transition-colors ${
                    selectedProjectId === project.id
                      ? "bg-sky-50"
                      : "hover:bg-gray-50 active:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-[15px] font-medium text-[#111827] truncate">
                      {project.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProjectForMenu(project);
                    }}
                    className="p-1.5 text-[#9ca3af] hover:text-[#4b5563] rounded-full"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grouped by Clients */}
        {Object.entries(groupedByClient).map(([clientName, clientProjects]) => (
          <div key={clientName}>
            <h3 className="text-[13px] font-medium text-[#4b5563] mb-3 px-1">
              {clientName}
            </h3>
            <div className="divide-y divide-[#f3f4f6]">
              {clientProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() =>
                    onSelectProject({
                      id: project.id,
                      name: project.name,
                      color: project.color,
                    })
                  }
                  className={`flex items-center justify-between py-3.5 px-2 cursor-pointer transition-colors ${
                    selectedProjectId === project.id
                      ? "bg-sky-50"
                      : "hover:bg-gray-50 active:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-[15px] font-medium text-[#111827] truncate">
                      {project.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProjectForMenu(project);
                    }}
                    className="p-1.5 text-[#9ca3af] hover:text-[#4b5563] rounded-full"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            No projects found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Floating Action Button (+ New) */}
      <div className="absolute right-5 bottom-6 z-30">
        <button
          type="button"
          onClick={onCreateNew}
          className="h-12 px-6 rounded-2xl bg-[#00aaff] hover:bg-[#0288d1] active:scale-95 text-white font-semibold text-[15px] flex items-center gap-2 shadow-[0_4px_16px_rgba(0,170,255,0.4)] transition-all"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>New</span>
        </button>
      </div>

      {/* Project Options Bottom Sheet matching Screenshot 1 (11.47.28 AM.jpeg) */}
      <ProjectOptionsBottomSheet
        isOpen={!!selectedProjectForMenu}
        onClose={() => setSelectedProjectForMenu(null)}
        project={selectedProjectForMenu}
        onToggleFavorite={(p) => toggleFavorite(p.id)}
        onEditProject={(p) => onOpenProjectEdit?.(p)}
      />
    </div>
  );
};
