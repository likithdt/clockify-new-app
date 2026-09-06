import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import type { Project, TaskItem } from "../backend/types";
import { ProjectSelectionScreen } from "./ProjectSelectionScreen";

export interface PomodoroSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  automaticBreak: boolean;
  defaultBreakProject: boolean;
  defaultBreakProjectId?: string;
  defaultBreakProjectName?: string;
}

interface PomodoroSettingsScreenProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PomodoroSettings;
  onSaveSettings: (settings: PomodoroSettings) => void;
  projects?: Project[];
  onOpenProjectModal?: () => void;
  onUpdateProject?: (id: string, updates: Partial<Project>) => void;
  onUpdateTask?: (projectId: string, taskId: string, updates: Partial<TaskItem>) => void;
  onCreateTask?: (projectId: string, name: string) => void;
}

export const PomodoroSettingsScreen: React.FC<PomodoroSettingsScreenProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  projects = [],
  onOpenProjectModal,
  onUpdateProject = () => {},
  onUpdateTask = () => {},
  onCreateTask = () => {},
}) => {
  const [focusMinutes, setFocusMinutes] = useState(settings.focusMinutes || 25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(
    settings.shortBreakMinutes || 5
  );
  const [automaticBreak, setAutomaticBreak] = useState(
    settings.automaticBreak ?? true
  );
  const [defaultBreakProject, setDefaultBreakProject] = useState(
    settings.defaultBreakProject ?? false
  );
  const [defaultBreakProjectId, setDefaultBreakProjectId] = useState(
    settings.defaultBreakProjectId || ""
  );
  const [defaultBreakProjectName, setDefaultBreakProjectName] = useState(
    settings.defaultBreakProjectName || ""
  );

  // Dedicated Project Selection Screen (Image 4)
  const [showProjectSelection, setShowProjectSelection] = useState(false);

  // Dialogs for picking intervals
  const [showFocusPicker, setShowFocusPicker] = useState(false);
  const [showBreakPicker, setShowBreakPicker] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFocusMinutes(settings.focusMinutes || 25);
      setShortBreakMinutes(settings.shortBreakMinutes || 5);
      setAutomaticBreak(settings.automaticBreak ?? true);
      setDefaultBreakProject(settings.defaultBreakProject ?? false);
      setDefaultBreakProjectId(settings.defaultBreakProjectId || "");
      setDefaultBreakProjectName(settings.defaultBreakProjectName || "");
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleDone = () => {
    onSaveSettings({
      focusMinutes,
      shortBreakMinutes,
      automaticBreak,
      defaultBreakProject,
      defaultBreakProjectId: defaultBreakProject ? defaultBreakProjectId : undefined,
      defaultBreakProjectName: defaultBreakProject ? defaultBreakProjectName : undefined,
    });
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#121518] flex flex-col select-none overflow-hidden animate-fadeIn">
      {/* Top Bar matching Image 3 */}
      <div className="h-14 px-4 flex items-center shrink-0 border-b border-[#1b2026]">
        <button
          type="button"
          onClick={handleDone}
          className="p-1 -ml-1 text-white hover:text-[#4fc3f7] transition-colors"
          title="Back"
        >
          <X className="w-6 h-6 stroke-[2.2]" />
        </button>
        <h1 className="text-[19px] font-normal text-white ml-5">
          Pomodoro settings
        </h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Section Header: TIME INTERVALS matching Image 3 */}
        <div className="px-5 pt-6 pb-2 text-[13px] font-medium tracking-wider text-[#78909c] uppercase">
          TIME INTERVALS
        </div>

        {/* Row 1: Focus */}
        <div
          onClick={() => setShowFocusPicker(true)}
          className="px-5 py-4 flex items-center justify-between border-b border-[#1c2128] cursor-pointer hover:bg-white/[0.02] transition-colors"
        >
          <span className="text-[16px] text-white font-normal">Focus</span>
          <span className="text-[15px] text-[#90a4ae] font-normal">
            {focusMinutes} minutes
          </span>
        </div>

        {/* Row 2: Short break */}
        <div
          onClick={() => setShowBreakPicker(true)}
          className="px-5 py-4 flex items-center justify-between border-b border-[#1c2128] cursor-pointer hover:bg-white/[0.02] transition-colors"
        >
          <span className="text-[16px] text-white font-normal">Short break</span>
          <span className="text-[15px] text-[#90a4ae] font-normal">
            {shortBreakMinutes} minutes
          </span>
        </div>

        {/* Row 3: Automatic break */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#1c2128]">
          <span className="text-[16px] text-white font-normal">
            Automatic break
          </span>

          {/* Toggle Switch matching Image 3 (cyan track, white thumb) */}
          <button
            type="button"
            onClick={() => setAutomaticBreak(!automaticBreak)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              automaticBreak ? "bg-[#4fc3f7]" : "bg-[#333a42]"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full transition-transform ${
                automaticBreak
                  ? "translate-x-6 bg-white shadow-md"
                  : "translate-x-0 bg-[#8c9ba5]"
              }`}
            />
          </button>
        </div>

        {/* Row 4: Default break project */}
        <div className="px-5 py-3.5 flex items-start justify-between border-b border-[#1c2128]">
          <div className="max-w-[270px]">
            <div className="text-[16px] text-white font-normal">
              Default break project
            </div>
            <div className="text-[13px] text-[#78909c] leading-snug mt-1">
              When off, break project uses focus interval project.
            </div>
          </div>

          {/* Toggle Switch matching Image 3 */}
          <button
            type="button"
            onClick={() => setDefaultBreakProject(!defaultBreakProject)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 mt-0.5 ${
              defaultBreakProject ? "bg-[#4fc3f7]" : "bg-[#333a42]"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full transition-transform ${
                defaultBreakProject
                  ? "translate-x-6 bg-white shadow-md"
                  : "translate-x-0 bg-[#8c9ba5]"
              }`}
            />
          </button>
        </div>

        {/* Row 5: Select project (Requirement 6: ONLY shown when Default break project is ON!) */}
        {defaultBreakProject && (
          <div
            onClick={() => setShowProjectSelection(true)}
            className="px-5 py-4 flex items-center justify-between border-b border-[#1c2128] cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-[16px] text-white font-normal">
              {defaultBreakProjectName || "Select project"}
            </span>
          </div>
        )}
      </div>

      {/* Done button matching Image 3 */}
      <div className="absolute bottom-6 right-5 z-20">
        <button
          type="button"
          onClick={handleDone}
          className="flex items-center gap-2 bg-[#5cc5f2] hover:bg-[#48bceb] active:scale-95 text-[#0c2336] px-6 py-3.5 rounded-2xl font-semibold shadow-xl transition-all"
        >
          <Check className="w-5 h-5 stroke-[2.8]" />
          <span className="text-[15px]">Done</span>
        </button>
      </div>

      {/* Focus Duration Picker Modal */}
      {showFocusPicker && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={() => setShowFocusPicker(false)}
          />
          <div className="relative w-full max-w-[320px] bg-[#212529] rounded-3xl p-6 shadow-2xl z-10 animate-scaleIn">
            <h3 className="text-base font-semibold text-white mb-4">
              Focus Duration
            </h3>
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {[15, 20, 25, 30, 45, 50].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    setFocusMinutes(mins);
                    setShowFocusPicker(false);
                  }}
                  className={`py-2.5 rounded-xl font-medium text-sm transition-all ${
                    focusMinutes === mins
                      ? "bg-[#00b0ff] text-white font-bold"
                      : "bg-[#16191d] text-[#cfd8dc] hover:bg-[#282d34]"
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowFocusPicker(false)}
                className="text-sm font-medium text-[#78909c]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Short Break Duration Picker Modal */}
      {showBreakPicker && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={() => setShowBreakPicker(false)}
          />
          <div className="relative w-full max-w-[320px] bg-[#212529] rounded-3xl p-6 shadow-2xl z-10 animate-scaleIn">
            <h3 className="text-base font-semibold text-white mb-4">
              Short Break Duration
            </h3>
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {[3, 5, 10, 15, 20].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    setShortBreakMinutes(mins);
                    setShowBreakPicker(false);
                  }}
                  className={`py-2.5 rounded-xl font-medium text-sm transition-all ${
                    shortBreakMinutes === mins
                      ? "bg-[#00b0ff] text-white font-bold"
                      : "bg-[#16191d] text-[#cfd8dc] hover:bg-[#282d34]"
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowBreakPicker(false)}
                className="text-sm font-medium text-[#78909c]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Project Selection Screen matching Image 4 */}
      <ProjectSelectionScreen
        isOpen={showProjectSelection}
        onClose={() => setShowProjectSelection(false)}
        projects={projects}
        selectedProjectId={defaultBreakProjectId}
        onSelectProject={(selected) => {
          setDefaultBreakProjectId(selected.id);
          setDefaultBreakProjectName(selected.name);
          setShowProjectSelection(false);
        }}
        onOpenProjectModal={onOpenProjectModal}
        onUpdateProject={onUpdateProject}
        onUpdateTask={onUpdateTask}
        onCreateTask={onCreateTask}
      />
    </div>
  );
};
