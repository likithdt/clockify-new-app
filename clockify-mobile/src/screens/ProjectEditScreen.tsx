import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Check,
  Star,
  Edit2,
  MoreVertical,
  Plus,
  FileText,
  User,
  DollarSign,
  Globe,
  Palette,
  X,
} from "lucide-react";
import type { Project, TaskItem } from "../backend/types";

interface ProjectEditScreenProps {
  isOpen: boolean;
  project: Project;
  onClose: () => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onUpdateTask: (projectId: string, taskId: string, updates: Partial<TaskItem>) => void;
  onCreateTask: (projectId: string, name: string) => void;
}

const PROJECT_COLORS = [
  "#e91e63", // Pink
  "#ab47bc", // Purple
  "#7986cb", // Slate blue
  "#2196f3", // Blue
  "#00bcd4", // Cyan
  "#009688", // Teal
  "#8bc34a", // Green
  "#ff7043", // Orange
  "#a1887f", // Light brown
  "#78909c", // Gray
];

export const ProjectEditScreen: React.FC<ProjectEditScreenProps> = ({
  isOpen,
  project,
  onClose,
  onUpdateProject,
  onUpdateTask,
  onCreateTask,
}) => {
  const [activeTab, setActiveTab] = useState<"tasks" | "settings">("tasks");
  const [taskFilter, setTaskFilter] = useState<"active" | "done" | "all">("active");
  const [taskSearch, setTaskSearch] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Task Options Bottom Sheet (Requirement 9)
  const [selectedTaskForMenu, setSelectedTaskForMenu] = useState<TaskItem | null>(null);

  // Edit Task Popup (Requirement 10)
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [editTaskBillable, setEditTaskBillable] = useState(true);
  const [editTaskDone, setEditTaskDone] = useState(false);
  const [editTaskFavorite, setEditTaskFavorite] = useState(false);

  // New Task Modal
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  // Settings Tab State (matching Image 7)
  const [editProjectName, setEditProjectName] = useState(project.name);
  const [editProjectClient, setEditProjectClient] = useState(project.clientName || "");
  const [editProjectBillable, setEditProjectBillable] = useState(project.isBillable ?? false);
  const [editProjectPublic, setEditProjectPublic] = useState(project.isPublic ?? true);
  const [editProjectColor, setEditProjectColor] = useState(project.color || "#03a9f4");
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  if (!isOpen) return null;

  // Filter tasks based on selected segment and search
  const filteredTasks = project.tasks.filter((task) => {
    if (taskFilter === "active" && task.isDone) return false;
    if (taskFilter === "done" && !task.isDone) return false;
    if (taskSearch.trim()) {
      return task.name.toLowerCase().includes(taskSearch.toLowerCase());
    }
    return true;
  });

  // Open Edit Task modal
  const handleOpenEditTask = (task: TaskItem) => {
    setSelectedTaskForMenu(null);
    setEditingTask(task);
    setEditTaskName(task.name);
    setEditTaskBillable(task.isBillable ?? true);
    setEditTaskDone(task.isDone ?? false);
    setEditTaskFavorite(task.isFavorite ?? false);
  };

  // Save Edit Task
  const handleSaveEditTask = () => {
    if (!editingTask || !editTaskName.trim()) return;
    onUpdateTask(project.id, editingTask.id, {
      name: editTaskName.trim(),
      isBillable: editTaskBillable,
      isDone: editTaskDone,
      isFavorite: editTaskFavorite,
    });
    setEditingTask(null);
  };

  // Toggle Task Done
  const handleToggleTaskDone = (task: TaskItem) => {
    onUpdateTask(project.id, task.id, { isDone: !task.isDone });
    setSelectedTaskForMenu(null);
  };

  // Toggle Task Favorite
  const handleToggleTaskFavorite = (task: TaskItem) => {
    onUpdateTask(project.id, task.id, { isFavorite: !task.isFavorite });
    setSelectedTaskForMenu(null);
  };

  // Create Task
  const handleCreateNewTask = () => {
    if (!newTaskName.trim()) return;
    onCreateTask(project.id, newTaskName.trim());
    setNewTaskName("");
    setShowNewTaskModal(false);
  };

  // Save Settings
  const handleSaveSettings = () => {
    onUpdateProject(project.id, {
      name: editProjectName.trim() || project.name,
      clientName: editProjectClient.trim() || undefined,
      isBillable: editProjectBillable,
      isPublic: editProjectPublic,
      color: editProjectColor,
    });
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 2000);
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#121518] flex flex-col select-none overflow-hidden animate-fadeIn">
      {/* Top Header matching Images 6 & 7 */}
      <div className="h-14 px-4 flex items-center justify-between shrink-0 border-b border-[#1b2026]">
        {showSearchInput ? (
          <div className="flex-1 flex items-center gap-2 bg-[#1b2027] rounded-xl px-3 py-1.5 animate-fadeIn">
            <Search className="w-4 h-4 text-[#8c9ba5]" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent text-sm text-white placeholder-[#8c9ba5] outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setShowSearchInput(false);
                setTaskSearch("");
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
                {project.name}
              </h1>
            </div>

            {activeTab === "tasks" && (
              <button
                type="button"
                onClick={() => setShowSearchInput(true)}
                className="p-2 text-white/90 hover:text-white shrink-0 transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Tabs Header: Tasks | Settings matching Images 6 & 7 */}
      <div className="flex border-b border-[#1c2128] bg-[#121518] shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("tasks")}
          className={`flex-1 py-3 text-[15px] font-medium text-center transition-all relative ${
            activeTab === "tasks" ? "text-white" : "text-[#78909c] hover:text-white"
          }`}
        >
          Tasks
          {activeTab === "tasks" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#4fc3f7]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`flex-1 py-3 text-[15px] font-medium text-center transition-all relative ${
            activeTab === "settings" ? "text-white" : "text-[#78909c] hover:text-white"
          }`}
        >
          Settings
          {activeTab === "settings" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#4fc3f7]" />
          )}
        </button>
      </div>

      {/* ===================== TASKS TAB (Image 6) ===================== */}
      {activeTab === "tasks" && (
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Segmented Filter Control matching Image 6 */}
          <div className="p-4 shrink-0">
            <div className="flex bg-[#1d2228] p-1 rounded-full border border-[#262c34]">
              {/* Active */}
              <button
                type="button"
                onClick={() => setTaskFilter("active")}
                className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-all ${
                  taskFilter === "active"
                    ? "bg-[#1e4a68] text-white shadow-sm"
                    : "text-[#8c9ba5] hover:text-white"
                }`}
              >
                {taskFilter === "active" && <Check className="w-4 h-4 stroke-[2.5]" />}
                <span>Active</span>
              </button>

              {/* Done */}
              <button
                type="button"
                onClick={() => setTaskFilter("done")}
                className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-all ${
                  taskFilter === "done"
                    ? "bg-[#1e4a68] text-white shadow-sm"
                    : "text-[#8c9ba5] hover:text-white"
                }`}
              >
                {taskFilter === "done" && <Check className="w-4 h-4 stroke-[2.5]" />}
                <span>Done</span>
              </button>

              {/* All */}
              <button
                type="button"
                onClick={() => setTaskFilter("all")}
                className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-all ${
                  taskFilter === "all"
                    ? "bg-[#1e4a68] text-white shadow-sm"
                    : "text-[#8c9ba5] hover:text-white"
                }`}
              >
                {taskFilter === "all" && <Check className="w-4 h-4 stroke-[2.5]" />}
                <span>All</span>
              </button>
            </div>
          </div>

          {/* Tasks List matching Image 6 */}
          <div className="flex-1 overflow-y-auto pb-24 divide-y divide-[#1c2128]">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {task.isFavorite && (
                    <Star className="w-3.5 h-3.5 fill-[#ffb300] text-[#ffb300] shrink-0" />
                  )}
                  <span
                    className={`text-[16px] text-white font-normal truncate ${
                      task.isDone ? "line-through opacity-60" : ""
                    }`}
                  >
                    {task.name}
                  </span>
                </div>

                {/* Three-dot menu button */}
                <button
                  type="button"
                  onClick={() => setSelectedTaskForMenu(task)}
                  className="p-1.5 text-[#8c9ba5] hover:text-white transition-colors"
                  title="Task options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="py-16 text-center text-[#78909c] text-sm">
                No tasks found.
              </div>
            )}
          </div>

          {/* Extended FAB '+ New task' matching Image 6 */}
          <div className="absolute bottom-6 right-5 z-20">
            <button
              type="button"
              onClick={() => setShowNewTaskModal(true)}
              className="flex items-center gap-2 bg-[#4fc3f7] hover:bg-[#38bdf8] active:scale-95 text-[#0c2336] px-5 py-3.5 rounded-2xl font-semibold shadow-xl transition-all"
            >
              <Plus className="w-5 h-5 stroke-[2.8]" />
              <span className="text-[15px]">New task</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================== SETTINGS TAB (Image 7) ===================== */}
      {activeTab === "settings" && (
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 overflow-y-auto pb-24">
            {/* Row 1: Project Name with edit icon */}
            <div className="px-5 py-4 flex items-center gap-4 border-b border-[#1c2128]">
              <Edit2 className="w-5 h-5 text-[#78909c] shrink-0" />
              <input
                type="text"
                value={editProjectName}
                onChange={(e) => setEditProjectName(e.target.value)}
                placeholder="Project name"
                className="flex-1 bg-transparent text-[16px] text-white placeholder-[#78909c] outline-none"
              />
            </div>

            {/* Row 2: Client */}
            <div className="px-5 py-3.5 flex items-center justify-between border-b border-[#1c2128]">
              <div className="flex items-center gap-4 min-w-0">
                <User className="w-5 h-5 text-[#78909c] shrink-0" />
                <div>
                  <div className="text-[15px] text-white font-normal">Client</div>
                  <div className="text-[13px] text-[#78909c]">
                    {editProjectClient || "None"}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Billable */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-[#1c2128]">
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 rounded-full border border-[#78909c] flex items-center justify-center text-[12px] font-medium text-[#78909c]">
                  $
                </div>
                <span className="text-[16px] text-white font-normal">Billable</span>
              </div>

              <button
                type="button"
                onClick={() => setEditProjectBillable(!editProjectBillable)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  editProjectBillable ? "bg-[#4fc3f7]" : "bg-[#333a42]"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full transition-transform ${
                    editProjectBillable
                      ? "translate-x-6 bg-white shadow-md"
                      : "translate-x-0 bg-[#8c9ba5]"
                  }`}
                />
              </button>
            </div>

            {/* Row 4: Public */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-[#1c2128]">
              <div className="flex items-center gap-4">
                <Globe className="w-5 h-5 text-[#78909c] shrink-0" />
                <span className="text-[16px] text-white font-normal">Public</span>
              </div>

              <button
                type="button"
                onClick={() => setEditProjectPublic(!editProjectPublic)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  editProjectPublic ? "bg-[#4fc3f7]" : "bg-[#333a42]"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full transition-transform ${
                    editProjectPublic
                      ? "translate-x-6 bg-white shadow-md"
                      : "translate-x-0 bg-[#8c9ba5]"
                  }`}
                />
              </button>
            </div>

            {/* Row 5: Project color */}
            <div className="px-5 pt-4 pb-6">
              <div className="flex items-center gap-4 mb-4">
                <Palette className="w-5 h-5 text-[#78909c] shrink-0" />
                <span className="text-[16px] text-white font-normal">Project color</span>
              </div>

              {/* 10 Color circles matching Image 7 */}
              <div className="grid grid-cols-5 gap-y-4 justify-items-center max-w-[280px] mx-auto mt-2">
                {PROJECT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setEditProjectColor(c)}
                    className="w-8 h-8 rounded-full transition-transform hover:scale-110 active:scale-95 relative flex items-center justify-center"
                    style={{ backgroundColor: c }}
                  >
                    {editProjectColor.toLowerCase() === c.toLowerCase() && (
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Toast feedback */}
          {settingsSavedToast && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#00b0ff] text-[#0c2336] px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg animate-fadeIn z-30">
              Settings saved!
            </div>
          )}

          {/* Save Button matching Image 7 */}
          <div className="absolute bottom-6 right-5 z-20">
            <button
              type="button"
              onClick={handleSaveSettings}
              className="flex items-center gap-2 bg-[#4fc3f7] hover:bg-[#38bdf8] active:scale-95 text-[#0c2336] px-6 py-3.5 rounded-2xl font-semibold shadow-xl transition-all"
            >
              <Check className="w-5 h-5 stroke-[2.8]" />
              <span className="text-[15px]">Save</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TASK THREE-DOT MENU BOTTOM SHEET (Requirement 9) */}
      {/* Show exactly: Mark as done, Add to favorites, Edit */}
      {/* ============================================================ */}
      {selectedTaskForMenu && (
        <div className="absolute inset-0 z-50 flex items-end justify-center select-none">
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-[0.5px] animate-fadeIn"
            onClick={() => setSelectedTaskForMenu(null)}
          />
          <div className="relative w-full bg-[#262a2e] rounded-t-[28px] pt-3 pb-6 px-4 shadow-2xl z-10 animate-slideInUp">
            <div className="w-9 h-1 bg-[#505a64] rounded-full mx-auto mb-4" />

            <div className="space-y-0.5">
              {/* Option 1: Mark as done */}
              <button
                type="button"
                onClick={() => handleToggleTaskDone(selectedTaskForMenu)}
                className="w-full flex items-center gap-5 px-4 py-3.5 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
              >
                <Check className="w-5 h-5 text-white stroke-[2]" />
                <span className="text-[16px] font-normal text-white">
                  {selectedTaskForMenu.isDone ? "Mark as active" : "Mark as done"}
                </span>
              </button>

              {/* Option 2: Add to favorites */}
              <button
                type="button"
                onClick={() => handleToggleTaskFavorite(selectedTaskForMenu)}
                className="w-full flex items-center gap-5 px-4 py-3.5 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
              >
                <Star
                  className={`w-5 h-5 stroke-[2] ${
                    selectedTaskForMenu.isFavorite
                      ? "fill-[#ffb300] text-[#ffb300]"
                      : "text-white"
                  }`}
                />
                <span className="text-[16px] font-normal text-white">
                  {selectedTaskForMenu.isFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"}
                </span>
              </button>

              {/* Option 3: Edit */}
              <button
                type="button"
                onClick={() => handleOpenEditTask(selectedTaskForMenu)}
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
      {/* EDIT TASK POPUP (Requirement 10) */}
      {/* Allows editing task name, available task settings, Save & Cancel */}
      {/* ============================================================ */}
      {editingTask && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 select-none">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-[0.5px] animate-fadeIn"
            onClick={() => setEditingTask(null)}
          />
          <div className="relative w-full max-w-[340px] bg-[#212529] rounded-3xl p-6 shadow-2xl z-10 animate-scaleIn">
            <h3 className="text-[17px] font-semibold text-white mb-5">Edit task</h3>

            {/* Task Name Input */}
            <div className="mb-5">
              <label className="text-xs text-[#90a4ae] block mb-1.5 font-medium">
                Task Name
              </label>
              <input
                type="text"
                value={editTaskName}
                onChange={(e) => setEditTaskName(e.target.value)}
                placeholder="Task name"
                autoFocus
                className="w-full bg-[#16191d] border border-[#333a42] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#78909c] outline-none focus:border-[#4fc3f7]"
              />
            </div>

            {/* Available Task Settings */}
            <div className="space-y-3.5 mb-6 pt-2 border-t border-[#2b3036]">
              {/* Billable */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <DollarSign className="w-4 h-4 text-[#90a4ae]" />
                  <span className="text-sm text-white font-normal">Billable</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditTaskBillable(!editTaskBillable)}
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                    editTaskBillable ? "bg-[#4fc3f7]" : "bg-[#333a42]"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-transform ${
                      editTaskBillable
                        ? "translate-x-5 bg-white"
                        : "translate-x-0 bg-[#8c9ba5]"
                    }`}
                  />
                </button>
              </div>

              {/* Status (Done) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#90a4ae]" />
                  <span className="text-sm text-white font-normal">Done</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditTaskDone(!editTaskDone)}
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                    editTaskDone ? "bg-[#4fc3f7]" : "bg-[#333a42]"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-transform ${
                      editTaskDone
                        ? "translate-x-5 bg-white"
                        : "translate-x-0 bg-[#8c9ba5]"
                    }`}
                  />
                </button>
              </div>

              {/* Favorite */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-[#90a4ae]" />
                  <span className="text-sm text-white font-normal">Favorite</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditTaskFavorite(!editTaskFavorite)}
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                    editTaskFavorite ? "bg-[#4fc3f7]" : "bg-[#333a42]"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-transform ${
                      editTaskFavorite
                        ? "translate-x-5 bg-white"
                        : "translate-x-0 bg-[#8c9ba5]"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Actions: Cancel & Save */}
            <div className="flex items-center justify-end gap-5">
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="text-[15px] font-medium text-[#78909c] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditTask}
                className="text-[15px] font-medium text-[#4fc3f7] hover:text-[#38bdf8] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CREATE NEW TASK MODAL */}
      {/* ============================================================ */}
      {showNewTaskModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 select-none">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-[0.5px] animate-fadeIn"
            onClick={() => setShowNewTaskModal(false)}
          />
          <div className="relative w-full max-w-[320px] bg-[#212529] rounded-3xl p-5 shadow-2xl z-10 animate-scaleIn">
            <h3 className="text-[16px] font-semibold text-white mb-3">New Task</h3>
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Task name"
              autoFocus
              className="w-full bg-[#16191d] border border-[#333a42] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#78909c] outline-none focus:border-[#4fc3f7] mb-5"
            />
            <div className="flex items-center justify-end gap-5">
              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                className="text-[14px] font-medium text-[#78909c]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateNewTask}
                className="text-[14px] font-medium text-[#4fc3f7]"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
