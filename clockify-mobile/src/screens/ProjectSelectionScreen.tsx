import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  MoreVertical,
  Star,
  Edit2,
  Plus,
  X,
  Check,
} from "lucide-react";
import type { Project, TaskItem } from "../backend/types";
import { ProjectEditScreen } from "./ProjectEditScreen";

interface ProjectSelectionScreenProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSelectProject?: (project: Project) => void;
  selectedProjectId?: string;
  onOpenProjectModal?: () => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onUpdateTask: (projectId: string, taskId: string, updates: Partial<TaskItem>) => void;
  onCreateTask: (projectId: string, name: string) => void;
  title?: string;
}

export const ProjectSelectionScreen: React.FC<ProjectSelectionScreenProps> = ({
  isOpen,
  onClose,
  projects,
  onSelectProject,
  selectedProjectId,
  onOpenProjectModal,
  onUpdateProject,
  onUpdateTask,
  onCreateTask,
  title = "Projects",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Project three-dot menu bottom sheet (Image 5)
  const [selectedProjectForMenu, setSelectedProjectForMenu] = useState<Project | null>(null);

  // Project Edit Screen (Requirement 8)
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  if (!isOpen) return null;

  // Filter projects by search
  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.clientName && p.clientName.toLowerCase().includes(q))
    );
  });

  // Split into favorites and client groups matching Image 4
  const favoriteProjects = filteredProjects.filter((p) => p.isFavorite);

  // Group by client
  const clientGroups: Record<string, Project[]> = {};
  filteredProjects.forEach((p) => {
    // If it's not a favorite (or in addition, show under client)
    const clientKey = p.clientName || "Without client";
    if (!clientGroups[clientKey]) clientGroups[clientKey] = [];
    clientGroups[clientKey].push(p);
  });

  const clientOrder = Object.keys(clientGroups).sort((a, b) => {
    if (a === "Without client") return -1;
    if (b === "Without client") return 1;
    return a.localeCompare(b);
  });

  // Toggle favorite on project
  const handleToggleFavorite = (project: Project) => {
    onUpdateProject(project.id, { isFavorite: !project.isFavorite });
    setSelectedProjectForMenu(null);
  };

  // Open Edit Project
  const handleOpenEdit = (project: Project) => {
    setSelectedProjectForMenu(null);
    setEditingProject(project);
  };

  // Keep editingProject in sync if projects update
  const currentEditingProject = editingProject
    ? projects.find((p) => p.id === editingProject.id) || editingProject
    : null;

  return (
    <div className="absolute inset-0 z-50 bg-[#121518] flex flex-col select-none overflow-hidden animate-fadeIn">
      {/* Top Bar matching Image 4 */}
      <div className="h-14 px-4 flex items-center justify-between shrink-0 border-b border-[#1b2026]">
        {showSearch ? (
          <div className="flex-1 flex items-center gap-2 bg-[#1b2027] rounded-xl px-3 py-1.5 animate-fadeIn">
            <Search className="w-4 h-4 text-[#8c9ba5]" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent text-sm text-white placeholder-[#8c9ba5] outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setShowSearch(false);
                setSearchQuery("");
              }}
              className="p-1 text-[#8c9ba5] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <button
                type="button"
                onClick={onClose}
                className="p-1 -ml-1 text-white hover:text-[#4fc3f7] transition-colors shrink-0"
                title="Back"
              >
                <ArrowLeft className="w-6 h-6 stroke-[2]" />
              </button>
              <h1 className="text-[19px] font-normal text-white truncate">
                {title}
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setShowSearch(true)}
              className="p-2 text-white/90 hover:text-white shrink-0 transition-colors"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Main Content Area matching Image 4 */}
      <div className="flex-1 overflow-y-auto pb-24 divide-y divide-[#1c2128]">
        {/* Row 1: Last used project matching Image 4 */}
        <div
          onClick={() => {
            if (projects.length > 0 && onSelectProject) {
              onSelectProject(projects[0]);
              onClose();
            }
          }}
          className="px-5 py-3.5 flex items-center gap-4 hover:bg-white/[0.02] cursor-pointer transition-colors"
        >
          <span className="w-3.5 h-3.5 rounded-full bg-[#78909c] shrink-0" />
          <span className="text-[15px] font-normal text-[#cfd8dc]">
            Last used project
          </span>
        </div>

        {/* Favorites Group (matching Image 4) */}
        {favoriteProjects.length > 0 && (
          <div className="pt-3 pb-1">
            <div className="px-5 py-1.5 text-xs font-medium text-[#8c9ba5]">
              Favorites
            </div>

            {favoriteProjects.map((project) => (
              <div
                key={`fav-${project.id}`}
                onClick={() => {
                  if (onSelectProject) {
                    onSelectProject(project);
                    onClose();
                  }
                }}
                className={`px-5 py-3.5 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition-colors group ${
                  selectedProjectId === project.id ? "bg-[#142e3e]/40" : ""
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: project.color || "#03a9f4" }}
                  />
                  <span className="text-[15px] font-normal text-white truncate">
                    {project.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {selectedProjectId === project.id && (
                    <Check className="w-4 h-4 text-[#00b0ff]" />
                  )}
                  {/* Three-dot menu */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProjectForMenu(project);
                    }}
                    className="p-1 text-[#8c9ba5] hover:text-white transition-colors"
                    title="Project options"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Client Groups (matching Image 4) */}
        {clientOrder.map((clientName) => {
          const clientProjects = clientGroups[clientName];
          return (
            <div key={clientName} className="pt-3 pb-1">
              {/* Client section header */}
              <div className="px-5 py-1.5 text-xs font-medium text-[#8c9ba5]">
                {clientName}
              </div>

              {/* Projects in this client */}
              {clientProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => {
                    if (onSelectProject) {
                      onSelectProject(project);
                      onClose();
                    }
                  }}
                  className={`px-5 py-3.5 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition-colors group ${
                    selectedProjectId === project.id ? "bg-[#142e3e]/40" : ""
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: project.color || "#03a9f4" }}
                    />
                    <span className="text-[15px] font-normal text-white truncate">
                      {project.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {selectedProjectId === project.id && (
                      <Check className="w-4 h-4 text-[#00b0ff]" />
                    )}
                    {/* Three-dot menu button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProjectForMenu(project);
                      }}
                      className="p-1 text-[#8c9ba5] hover:text-white transition-colors"
                      title="Project options"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="py-20 text-center text-[#8c9ba5] text-sm">
            No projects found.
          </div>
        )}
      </div>

      {/* Floating Action Button '+ New' matching Image 4 */}
      <div className="absolute bottom-6 right-5 z-20">
        <button
          type="button"
          onClick={onOpenProjectModal}
          className="flex items-center gap-2 bg-[#5cc5f2] hover:bg-[#48bceb] active:scale-95 text-[#0c2336] px-5 py-3.5 rounded-2xl font-semibold shadow-xl transition-all"
        >
          <Plus className="w-5 h-5 stroke-[2.8]" />
          <span className="text-[15px]">New</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* PROJECT OPTIONS BOTTOM SHEET (Matching Image 5) */}
      {/* Shows: Add to favorites, Edit */}
      {/* ============================================================ */}
      {selectedProjectForMenu && (
        <div className="absolute inset-0 z-50 flex items-end justify-center select-none">
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-[0.5px] animate-fadeIn"
            onClick={() => setSelectedProjectForMenu(null)}
          />
          <div className="relative w-full bg-[#262a2e] rounded-t-[28px] pt-3 pb-6 px-4 shadow-2xl z-10 animate-slideInUp">
            <div className="w-9 h-1 bg-[#505a64] rounded-full mx-auto mb-4" />

            <div className="space-y-0.5">
              {/* Option 1: Add to favorites */}
              <button
                type="button"
                onClick={() => handleToggleFavorite(selectedProjectForMenu)}
                className="w-full flex items-center gap-5 px-4 py-3.5 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
              >
                <Star
                  className={`w-5 h-5 stroke-[2] ${
                    selectedProjectForMenu.isFavorite
                      ? "fill-[#ffb300] text-[#ffb300]"
                      : "text-white"
                  }`}
                />
                <span className="text-[16px] font-normal text-white">
                  {selectedProjectForMenu.isFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"}
                </span>
              </button>

              {/* Option 2: Edit */}
              <button
                type="button"
                onClick={() => handleOpenEdit(selectedProjectForMenu)}
                className="w-full flex items-center gap-5 px-4 py-3.5 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
              >
                <Edit2 className="w-5 h-5 text-white stroke-[2]" />
                <span className="text-[16px] font-normal text-white">Edit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DEDICATED PROJECT EDIT SCREEN (Matching Images 6 & 7) */}
      {/* ============================================================ */}
      {currentEditingProject && (
        <ProjectEditScreen
          isOpen={!!currentEditingProject}
          project={currentEditingProject}
          onClose={() => setEditingProject(null)}
          onUpdateProject={onUpdateProject}
          onUpdateTask={onUpdateTask}
          onCreateTask={onCreateTask}
        />
      )}
    </div>
  );
};
