import React, { useState, useEffect } from 'react';
import {
  X,
  DollarSign,
  Plus,
  Trash2,
  Copy,
  Play,
  Check,
  User,
  Clock,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { useTimerStore } from '@/stores/useTimerStore';
import type { CalendarEntryType } from '@/types/calendar';

const PROJECT_PALETTE = [
  '#03a9f4', // Clockify Cyan/Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Rose/Red
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#64748b', // Slate
];

export const CreateTaskModal: React.FC = () => {
  const {
    isCreateModalOpen,
    editingTask,
    draftSlot,
    closeModal,
    createTask,
    updateTask,
    deleteTask,
    duplicateTask,
    projects,
    createProject,
    tags,
    createTag,
    members,
    selectedDate,
  } = useCalendarStore();

  const { startTimer, setDescription, setProject } = useTimerStore();

  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState<string>('');
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [isBillable, setIsBillable] = useState(true);
  const [entryType, setEntryType] = useState<CalendarEntryType>('entry');
  const [memberId, setMemberId] = useState<string>('m4');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Inline project creation
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectClient, setNewProjectClient] = useState('');
  const [newProjectColor, setNewProjectColor] = useState('#03a9f4');

  // Inline tag creation
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  // Sync state on open or edit
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setProjectId(editingTask.project_id || '');
      setDate(editingTask.date);
      setStartTime(editingTask.start_time);
      setEndTime(editingTask.end_time);
      setIsBillable(editingTask.is_billable);
      setEntryType(editingTask.entry_type);
      setMemberId(editingTask.member_id);
      setSelectedTags(editingTask.tags || []);
    } else if (draftSlot) {
      setTitle('');
      setProjectId(projects[0]?.id || '');
      setDate(draftSlot.date);
      setStartTime(draftSlot.startTime);
      setEndTime(draftSlot.endTime);
      setIsBillable(true);
      setEntryType(draftSlot.entryType || 'entry');
      setMemberId('m4');
      setSelectedTags([]);
    } else {
      setTitle('');
      setProjectId(projects[0]?.id || '');
      setDate(selectedDate);
      setStartTime('09:00');
      setEndTime('10:00');
      setIsBillable(true);
      setEntryType('entry');
      setMemberId('m4');
      setSelectedTags([]);
    }
    setIsCreatingProject(false);
    setIsCreatingTag(false);
  }, [editingTask, draftSlot, isCreateModalOpen, projects, selectedDate]);

  if (!isCreateModalOpen) return null;

  // Calculate duration
  const calcMinutes = (start: string, end: string) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return 0;
    return Math.max(0, eh * 60 + em - (sh * 60 + sm));
  };

  const durationMinutes = calcMinutes(startTime, endTime);

  const formatDurationDisplay = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${String(m).padStart(2, '0')}m`;
  };

  // Add minutes to end time
  const handleAddMinutes = (additionalMins: number) => {
    const [sh, sm] = startTime.split(':').map(Number);
    const currentMins = calcMinutes(startTime, endTime);
    const newTotal = currentMins + additionalMins;
    const endMinutesSinceMidnight = sh * 60 + sm + newTotal;
    const endH = Math.min(23, Math.floor(endMinutesSinceMidnight / 60));
    const endM = endMinutesSinceMidnight % 60;
    setEndTime(`${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`);
  };

  const handleSaveProject = async () => {
    if (!newProjectName.trim()) return;
    const created = await createProject(
      newProjectName.trim(),
      newProjectColor,
      newProjectClient.trim() || undefined
    );
    setProjectId(created.id);
    setIsCreatingProject(false);
    setNewProjectName('');
    setNewProjectClient('');
  };

  const handleSaveTag = async () => {
    if (!newTagName.trim()) return;
    const tag = await createTag(newTagName.trim());
    if (!selectedTags.includes(tag.name)) {
      setSelectedTags([...selectedTags, tag.name]);
    }
    setIsCreatingTag(false);
    setNewTagName('');
  };

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedProj = projects.find((p) => p.id === projectId);

    if (editingTask) {
      await updateTask(editingTask.id, {
        title: title.trim() || '(No details)',
        project_id: projectId || null,
        project_name: selectedProj ? selectedProj.name : 'No Project',
        project_color: selectedProj ? selectedProj.color : '#03a9f4',
        client_name: selectedProj ? selectedProj.client_name : null,
        date,
        start_time: startTime,
        end_time: endTime,
        duration_minutes: durationMinutes,
        is_billable: isBillable,
        entry_type: entryType,
        member_id: memberId,
        tags: selectedTags,
      });
    } else {
      await createTask({
        title: title.trim() || '(No details)',
        project_id: projectId || null,
        project_name: selectedProj ? selectedProj.name : 'No Project',
        project_color: selectedProj ? selectedProj.color : '#03a9f4',
        client_name: selectedProj ? selectedProj.client_name : null,
        date,
        start_time: startTime,
        end_time: endTime,
        duration_minutes: durationMinutes,
        is_billable: isBillable,
        entry_type: entryType,
        member_id: memberId,
        tags: selectedTags,
      });
    }
  };

  const handleDelete = async () => {
    if (editingTask && confirm(`Delete "${editingTask.title}"?`)) {
      await deleteTask(editingTask.id);
    }
  };

  const handleDuplicate = async () => {
    if (editingTask) {
      await duplicateTask(editingTask.id);
      closeModal();
    }
  };

  const handleStartTimerDirectly = () => {
    const selectedProj = projects.find((p) => p.id === projectId);
    setDescription(title.trim() || '(No details)');
    if (selectedProj) {
      setProject(selectedProj.name, selectedProj.color);
    }
    startTimer();
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#03a9f4]" />
            <h3 className="font-semibold text-sm text-slate-800">
              {editingTask ? 'Edit Time Entry / Task' : 'New Time Entry / Task'}
            </h3>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Description Input */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1 uppercase tracking-wider text-[10px]">
              What are you working on?
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add description..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-hidden focus:border-[#03a9f4] focus:ring-1 focus:ring-[#03a9f4]"
            />
          </div>

          {/* Type Toggle: Regular Entry vs Planned Task */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] w-20">
              Type:
            </span>
            <div className="inline-flex border border-slate-200 rounded p-0.5 bg-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setEntryType('entry')}
                className={`px-3 py-1 font-medium rounded-xs transition-all ${
                  entryType === 'entry'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Time Entry (Grid)
              </button>
              <button
                type="button"
                onClick={() => setEntryType('planned')}
                className={`px-3 py-1 font-medium rounded-xs transition-all ${
                  entryType === 'planned'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Planned Task (Row)
              </button>
            </div>
          </div>

          {/* Project Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                Project
              </label>
              <button
                type="button"
                onClick={() => setIsCreatingProject(!isCreatingProject)}
                className="text-[#03a9f4] hover:underline font-medium flex items-center gap-1 text-[11px]"
              >
                <Plus className="w-3 h-3" />
                <span>{isCreatingProject ? 'Select Existing' : 'Create Project'}</span>
              </button>
            </div>

            {isCreatingProject ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                <input
                  type="text"
                  placeholder="Project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-[#03a9f4]"
                />
                <input
                  type="text"
                  placeholder="Client name (optional)"
                  value={newProjectClient}
                  onChange={(e) => setNewProjectClient(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-[#03a9f4]"
                />
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px]">Color:</span>
                  <div className="flex items-center gap-1.5">
                    {PROJECT_PALETTE.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewProjectColor(color)}
                        className={`w-5 h-5 rounded-full transition-transform ${
                          newProjectColor === color
                            ? 'scale-110 ring-2 ring-slate-800 ring-offset-1'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSaveProject}
                  disabled={!newProjectName.trim()}
                  className="w-full mt-2 py-1.5 bg-[#03a9f4] text-white rounded font-medium hover:bg-[#0288d1] disabled:opacity-50 transition-colors"
                >
                  Save Project
                </button>
              </div>
            ) : (
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-hidden focus:border-[#03a9f4] bg-white text-slate-800"
              >
                <option value="">No Project</option>
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name} {proj.client_name ? `(${proj.client_name})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-500 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-hidden focus:border-[#03a9f4]"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-hidden focus:border-[#03a9f4]"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-hidden focus:border-[#03a9f4]"
              />
            </div>
          </div>

          {/* Quick Increment & Duration Bar */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded border border-slate-200">
            <div className="flex items-center gap-1">
              <span className="text-slate-500 text-[11px] mr-1">Add:</span>
              <button
                type="button"
                onClick={() => handleAddMinutes(15)}
                className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                +15m
              </button>
              <button
                type="button"
                onClick={() => handleAddMinutes(30)}
                className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                +30m
              </button>
              <button
                type="button"
                onClick={() => handleAddMinutes(60)}
                className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                +1h
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono font-bold text-slate-800 text-xs">
                {formatDurationDisplay(durationMinutes)}
              </span>
            </div>
          </div>

          {/* Billable & Assignee */}
          <div className="flex items-center justify-between pt-1">
            {/* Billable Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsBillable(!isBillable)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded border transition-colors ${
                  isBillable
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Billable</span>
              </button>
            </div>

            {/* Member Assignee */}
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="px-2 py-1 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-[#03a9f4] bg-white"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                Tags
              </label>
              <button
                type="button"
                onClick={() => setIsCreatingTag(!isCreatingTag)}
                className="text-[#03a9f4] hover:underline font-medium flex items-center gap-1 text-[11px]"
              >
                <Plus className="w-3 h-3" />
                <span>New Tag</span>
              </button>
            </div>

            {isCreatingTag && (
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="New tag name..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="flex-1 px-2.5 py-1 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-[#03a9f4]"
                />
                <button
                  type="button"
                  onClick={handleSaveTag}
                  className="px-3 py-1 bg-[#03a9f4] text-white rounded text-xs font-medium hover:bg-[#0288d1]"
                >
                  Add
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.name);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.name)}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1 ${
                      isSelected
                        ? 'bg-sky-50 text-[#03a9f4] border-[#03a9f4]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{tag.name}</span>
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {/* Left action buttons if editing */}
            <div className="flex items-center gap-2">
              {editingTask ? (
                <>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded border border-rose-200 transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDuplicate}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                    title="Duplicate Entry"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleStartTimerDirectly}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-300 font-medium transition-colors"
                    title="Start Timer with this task"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Timer</span>
                  </button>
                </>
              ) : null}
            </div>

            {/* Right cancel and submit */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded font-semibold shadow-xs transition-colors"
              >
                {editingTask ? 'Save Changes' : 'Add Entry'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
