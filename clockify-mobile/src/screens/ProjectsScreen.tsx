import React, { useState } from "react";
import { Plus, Folder, ChevronDown, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import type { Project, TaskItem } from "../backend/types";

export interface ProjectsScreenProps {
  projects: Project[];
  searchQuery: string;
  onOpenProjectModal: () => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onUpdateTask: (projectId: string, taskId: string, updates: Partial<TaskItem>) => void;
  onCreateTask: (projectId: string, name: string) => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
  projects,
  searchQuery,
  onOpenProjectModal,
  onUpdateTask,
  onCreateTask,
}) => {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [addingTaskForId, setAddingTaskForId] = useState<string | null>(null);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  const handleAddTask = (projectId: string) => {
    if (!newTaskName.trim()) return;
    onCreateTask(projectId, newTaskName.trim());
    setNewTaskName("");
    setAddingTaskForId(null);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#0f1216] text-white p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Projects</h2>
        <button
          type="button"
          onClick={onOpenProjectModal}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#00b0ff] text-white text-xs font-semibold hover:bg-[#009ee6]"
        >
          <Plus className="w-4 h-4" /> Create Project
        </button>
      </div>

      <div className="space-y-3">
        {filteredProjects.map((p) => {
          const isExpanded = expandedProjectId === p.id;
          return (
            <div
              key={p.id}
              className="bg-[#1a1f26] border border-[#27303c] rounded-2xl overflow-hidden"
            >
              <div
                onClick={() => setExpandedProjectId(isExpanded ? null : p.id)}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#202731] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  <div>
                    <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                    {p.clientName && <p className="text-xs text-[#8c9ba5]">{p.clientName}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8c9ba5]">{p.tasks?.length || 0} tasks</span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-[#8c9ba5]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#8c9ba5]" />
                  )}
                </div>
              </div>

              {/* Tasks Expansion */}
              {isExpanded && (
                <div className="border-t border-[#27303c] bg-[#14181e] p-3 space-y-2">
                  <div className="space-y-1">
                    {p.tasks?.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-[#1c222b]"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateTask(p.id, task.id, { isDone: !task.isDone })
                          }
                          className="flex items-center gap-2 text-left text-xs"
                        >
                          {task.isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#8c9ba5]" />
                          )}
                          <span
                            className={task.isDone ? "line-through text-[#8c9ba5]" : "text-white"}
                          >
                            {task.name}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {addingTaskForId === p.id ? (
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        placeholder="Task name..."
                        className="flex-1 bg-[#1a1f26] border border-[#27303c] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00b0ff]"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTask(p.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#00b0ff] text-white text-xs font-semibold"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAddingTaskForId(p.id)}
                      className="text-xs text-[#00b0ff] hover:underline flex items-center gap-1 pt-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Task
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
