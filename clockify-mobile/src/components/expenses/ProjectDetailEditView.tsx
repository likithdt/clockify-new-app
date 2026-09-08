import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Plus,
  MoreVertical,
  FileEdit,
  User,
  CircleDollarSign,
  Globe,
  Palette,
  Check,
  X,
} from "lucide-react";
import { Project, TaskItem, useProjectStore } from "@/stores/useProjectStore";
import { TaskOptionsBottomSheet } from "./TaskOptionsBottomSheet";
import { EditTaskDialog } from "./EditTaskDialog";

interface ProjectDetailEditViewProps {
  project: Project;
  onBack: () => void;
  onOpenClientSelect: () => void;
}

const COLOR_PALETTE = [
  "#e91e63", // Pink
  "#9c27b0", // Purple
  "#5c6bc0", // Indigo
  "#1e88e5", // Blue
  "#00aaff", // Cyan
  "#00897b", // Teal
  "#689f38", // Green
  "#ff5722", // Deep Orange
  "#795548", // Brown
];

export const ProjectDetailEditView: React.FC<ProjectDetailEditViewProps> = ({
  project,
  onBack,
  onOpenClientSelect,
}) => {
  const { updateProject, addTask, updateTask } = useProjectStore();

  const [activeTab, setActiveTab] = useState<"tasks" | "settings">("tasks");
  const [taskFilter, setTaskFilter] = useState<"active" | "done" | "all">("active");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Settings State matching Screenshot 7
  const [projectName, setProjectName] = useState(project.name);
  const [isBillable, setIsBillable] = useState(project.isBillable);
  const [isPublic, setIsPublic] = useState(project.access === "Public");
  const [selectedColor, setSelectedColor] = useState(project.color);

  // Task Sheet and Edit States
  const [selectedTaskForMenu, setSelectedTaskForMenu] = useState<TaskItem | null>(null);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  const tasks = project.tasks || [];

  // Filter tasks based on active segment and search
  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === "active" && t.isDone) return false;
    if (taskFilter === "done" && !t.isDone) return false;
    if (searchQuery.trim()) {
      return t.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleSaveProjectSettings = () => {
    updateProject(project.id, {
      name: projectName.trim() || project.name,
      isBillable,
      access: isPublic ? "Public" : "Private",
      color: selectedColor,
    });
    onBack();
  };

  const handleCreateNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    addTask(project.id, newTaskName.trim());
    setNewTaskName("");
    setIsNewTaskDialogOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative select-none animate-fadeIn">
      {/* Top App Bar matching Screenshot 2 & 7 */}
      <header className="h-14 px-4 bg-white flex items-center justify-between shrink-0 border-b border-[#f3f4f6] z-20">
        {isSearchOpen ? (
          <div className="flex-1 flex items-center gap-2 bg-[#f3f4f6] rounded-xl px-3 py-1.5">
            <Search className="w-4 h-4 text-[#6b7280]" />
            <input
              type="text"
              placeholder="Search tasks..."
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
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <button
                type="button"
                onClick={onBack}
                className="p-1 -ml-1 text-[#111827] hover:text-[#4b5563] active:scale-95 transition-transform shrink-0"
                title="Back to Projects"
              >
                <ArrowLeft className="w-6 h-6 text-[#111827]" />
              </button>
              <h1 className="text-[19px] font-semibold text-[#111827] tracking-tight truncate">
                {project.name}
              </h1>
            </div>

            {activeTab === "tasks" && (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#374151] hover:text-[#111827] active:scale-95 transition-transform"
                title="Search Tasks"
              >
                <Search className="w-5 h-5 text-[#374151]" />
              </button>
            )}
          </>
        )}
      </header>

      {/* Tabs Header: Tasks | Settings matching Screenshots */}
      <div className="flex border-b border-[#e5e7eb] bg-white shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("tasks")}
          className={`flex-1 py-3 text-[15px] font-medium text-center relative transition-colors ${
            activeTab === "tasks" ? "text-[#111827] font-semibold" : "text-[#4b5563]"
          }`}
        >
          Tasks
          {activeTab === "tasks" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#00aaff]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`flex-1 py-3 text-[15px] font-medium text-center relative transition-colors ${
            activeTab === "settings" ? "text-[#111827] font-semibold" : "text-[#4b5563]"
          }`}
        >
          Settings
          {activeTab === "settings" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#00aaff]" />
          )}
        </button>
      </div>

      {/* Tab 1: Tasks */}
      {activeTab === "tasks" && (
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Segmented Control Filter: Active | Done | All matching Screenshot 2, 5, 6 */}
          <div className="p-4 shrink-0">
            <div className="border border-[#9ca3af] rounded-full flex overflow-hidden text-[14px] font-medium">
              {/* Active */}
              <button
                type="button"
                onClick={() => setTaskFilter("active")}
                className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors border-r border-[#9ca3af] ${
                  taskFilter === "active"
                    ? "bg-[#cceeff] text-[#111827] font-semibold"
                    : "bg-white text-[#4b5563]"
                }`}
              >
                {taskFilter === "active" && <Check className="w-4 h-4 stroke-[2.5]" />}
                <span>Active</span>
              </button>

              {/* Done */}
              <button
                type="button"
                onClick={() => setTaskFilter("done")}
                className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors border-r border-[#9ca3af] ${
                  taskFilter === "done"
                    ? "bg-[#cceeff] text-[#111827] font-semibold"
                    : "bg-white text-[#4b5563]"
                }`}
              >
                {taskFilter === "done" && <Check className="w-4 h-4 stroke-[2.5]" />}
                <span>Done</span>
              </button>

              {/* All */}
              <button
                type="button"
                onClick={() => setTaskFilter("all")}
                className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors ${
                  taskFilter === "all"
                    ? "bg-[#cceeff] text-[#111827] font-semibold"
                    : "bg-white text-[#4b5563]"
                }`}
              >
                {taskFilter === "all" && <Check className="w-4 h-4 stroke-[2.5]" />}
                <span>All</span>
              </button>
            </div>
          </div>

          {/* Tasks List Content */}
          <div className="flex-1 overflow-y-auto px-5 py-2">
            {filteredTasks.length === 0 ? (
              /* Empty State matching Screenshot 5 (No tasks yet) */
              <div className="h-full flex flex-col items-center justify-center -mt-12 text-center">
                <div className="w-20 h-20 mb-5 flex items-center justify-center text-[#9ca3af]">
                  {/* Document with Magnifying Glass SVG Icon matching Screenshot 5 */}
                  <svg viewBox="0 0 48 48" className="w-16 h-16 fill-current">
                    <path d="M12 4a4 4 0 0 0-4 4v32a4 4 0 0 0 4 4h18a2 2 0 0 0 0-4H12V8h16v10a2 2 0 0 0 2 2h10v6a2 2 0 1 0 4 0v-8a4 4 0 0 0-1.17-2.83l-10-10A4 4 0 0 0 30 4H12z" />
                    <circle cx="34" cy="34" r="7" fill="none" stroke="currentColor" strokeWidth="4" />
                    <line x1="39" y1="39" x2="45" y2="45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-[20px] font-bold text-[#111827] mb-1">
                  No tasks yet
                </h3>
                <p className="text-[14px] text-[#6b7280]">
                  All your tasks will show up here.
                </p>
              </div>
            ) : (
              /* List of Tasks matching Screenshot 2 */
              <div className="divide-y divide-[#f3f4f6]">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setEditingTask(task)}
                    className="flex items-center justify-between py-3.5 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <span className="text-[15px] font-medium text-[#111827]">
                      {task.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTaskForMenu(task);
                      }}
                      className="p-1 text-[#6b7280] hover:text-[#111827] rounded-full hover:bg-gray-100"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* + New task FAB matching Screenshot 2 */}
          <div className="absolute right-5 bottom-6 z-30">
            <button
              type="button"
              onClick={() => setIsNewTaskDialogOpen(true)}
              className="h-12 px-6 rounded-2xl bg-[#00aaff] hover:bg-[#0288d1] active:scale-95 text-white font-semibold text-[15px] flex items-center gap-2 shadow-[0_4px_16px_rgba(0,170,255,0.4)] transition-all"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>New task</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Settings matching Screenshot 7 */}
      {activeTab === "settings" && (
        <div className="flex-1 flex flex-col overflow-y-auto divide-y divide-[#f3f4f6] relative select-none">
          {/* 1. Project Name */}
          <div className="px-5 py-4 flex items-center gap-4">
            <div className="w-6 h-6 flex items-center justify-center text-[#4b5563]">
              <FileEdit className="w-5 h-5 text-[#4b5563]" />
            </div>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="flex-1 text-[15px] font-medium text-[#111827] outline-none bg-transparent"
              placeholder="Project Name"
            />
          </div>

          {/* 2. Client Row */}
          <div
            onClick={onOpenClientSelect}
            className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 flex items-center justify-center text-[#4b5563]">
                <User className="w-5 h-5 text-[#4b5563]" />
              </div>
              <div>
                <div className="text-[14px] font-medium text-[#111827]">Client</div>
                <div className="text-[13px] text-[#4b5563] mt-0.5">
                  {project.client || "None"}
                </div>
              </div>
            </div>
            <span className="text-[#9ca3af] text-sm">›</span>
          </div>

          {/* 3. Billable Row */}
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 flex items-center justify-center text-[#4b5563]">
                <CircleDollarSign className="w-5 h-5 text-[#4b5563]" />
              </div>
              <span className="text-[14px] font-medium text-[#111827]">Billable</span>
            </div>

            {/* Toggle */}
            <button
              type="button"
              onClick={() => setIsBillable(!isBillable)}
              className={`w-12 h-7 rounded-full transition-colors relative p-0.5 focus:outline-none ${
                isBillable ? "bg-[#00aaff]" : "bg-[#9ca3af]"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                  isBillable ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* 4. Public Row */}
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 flex items-center justify-center text-[#4b5563]">
                <Globe className="w-5 h-5 text-[#4b5563]" />
              </div>
              <span className="text-[14px] font-medium text-[#111827]">Public</span>
            </div>

            {/* Toggle */}
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`w-12 h-7 rounded-full transition-colors relative p-0.5 focus:outline-none ${
                isPublic ? "bg-[#00aaff]" : "bg-[#9ca3af]"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                  isPublic ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* 5. Project Color Palette Row matching Screenshot 7 */}
          <div className="px-5 py-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 flex items-center justify-center text-[#4b5563]">
                <Palette className="w-5 h-5 text-[#4b5563]" />
              </div>
              <span className="text-[14px] font-medium text-[#111827]">
                Project color
              </span>
            </div>

            {/* 9 Colors in 2 Rows matching Screenshot 7 */}
            <div className="pl-10 space-y-3.5">
              {/* Row 1: Pink, Purple, Indigo, Blue, Cyan */}
              <div className="flex items-center gap-4">
                {COLOR_PALETTE.slice(0, 5).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      selectedColor.toLowerCase() === color.toLowerCase()
                        ? "scale-115 ring-2 ring-offset-2 ring-gray-400"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Row 2: Teal, Green, Deep Orange, Brown */}
              <div className="flex items-center gap-4 pl-4">
                {COLOR_PALETTE.slice(5).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      selectedColor.toLowerCase() === color.toLowerCase()
                        ? "scale-115 ring-2 ring-offset-2 ring-gray-400"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Floating Action Button (✓ Save) matching Screenshot 7 */}
          <div className="absolute right-5 bottom-6 z-30">
            <button
              type="button"
              onClick={handleSaveProjectSettings}
              className="h-12 px-6 rounded-2xl bg-[#50c3f8] hover:bg-[#03a9f4] active:scale-95 text-white font-semibold text-[15px] flex items-center gap-2 shadow-[0_4px_16px_rgba(3,169,244,0.4)] transition-all"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Save</span>
            </button>
          </div>
        </div>
      )}

      {/* Task Options Bottom Sheet matching Screenshot 4 */}
      <TaskOptionsBottomSheet
        isOpen={!!selectedTaskForMenu}
        onClose={() => setSelectedTaskForMenu(null)}
        task={selectedTaskForMenu}
        onToggleDone={(task) => {
          updateTask(project.id, task.id, { isDone: !task.isDone });
        }}
        onToggleFavorite={(task) => {
          updateTask(project.id, task.id, { isFavorite: !task.isFavorite });
        }}
        onEditTask={(task) => {
          setEditingTask(task);
        }}
      />

      {/* Edit Task Dialog matching Screenshot 3 */}
      <EditTaskDialog
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onSave={(newName) => {
          if (editingTask) {
            updateTask(project.id, editingTask.id, { name: newName });
          }
        }}
      />

      {/* New Task Dialog */}
      {isNewTaskDialogOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 select-none animate-fadeIn">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[0.5px]"
            onClick={() => setIsNewTaskDialogOpen(false)}
          />
          <form
            onSubmit={handleCreateNewTask}
            className="relative w-full max-w-[325px] bg-white rounded-[28px] shadow-2xl p-6 z-10 animate-scaleUp"
          >
            <h2 className="text-[22px] font-bold text-[#111827] mb-6">New task</h2>
            <div className="relative border-2 border-[#00aaff] rounded-2xl px-4 py-3 bg-white">
              <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-xs font-semibold text-[#00aaff]">
                Task name
              </label>
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Enter task name"
                className="w-full text-[15px] font-medium text-[#111827] outline-none bg-transparent"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-end gap-6 mt-8 pt-1">
              <button
                type="button"
                onClick={() => setIsNewTaskDialogOpen(false)}
                className="text-[14px] font-semibold text-[#00aaff] hover:text-[#0288d1] px-2 py-1 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-[14px] font-semibold text-[#00aaff] hover:text-[#0288d1] px-2 py-1 rounded"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
