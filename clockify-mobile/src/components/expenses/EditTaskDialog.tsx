import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { TaskItem } from "@/stores/useProjectStore";

interface EditTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskItem | null;
  onSave: (newName: string) => void;
}

export const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
  isOpen,
  onClose,
  task,
  onSave,
}) => {
  const [taskName, setTaskName] = useState("");

  useEffect(() => {
    if (task) {
      setTaskName(task.name);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;
    onSave(taskName.trim());
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 select-none animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[0.5px]"
        onClick={onClose}
      />

      {/* Dialog Card - matching Screenshot 3 (11.47.28 AM (2).jpeg) */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[325px] bg-white rounded-[28px] shadow-2xl p-6 z-10 animate-scaleUp"
      >
        {/* Title */}
        <h2 className="text-[22px] font-bold text-[#111827] mb-6">
          Edit task
        </h2>

        {/* Floating Outline Input */}
        <div className="relative border-2 border-[#00aaff] rounded-2xl px-4 py-3 bg-white">
          <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-xs font-semibold text-[#00aaff]">
            Task name
          </label>
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full text-[15px] font-medium text-[#111827] outline-none bg-transparent"
              autoFocus
            />
            {taskName && (
              <button
                type="button"
                onClick={() => setTaskName("")}
                className="p-0.5 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center">
                  <X className="w-3 h-3 text-gray-500 stroke-[2.5]" />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-6 mt-8 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="text-[14px] font-semibold text-[#00aaff] hover:text-[#0288d1] px-2 py-1 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-[14px] font-semibold text-[#00aaff] hover:text-[#0288d1] px-2 py-1 rounded transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
