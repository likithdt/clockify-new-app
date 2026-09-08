import React from "react";
import { CheckCheck, Star, Pencil } from "lucide-react";
import { TaskItem } from "@/stores/useProjectStore";

interface TaskOptionsBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskItem | null;
  onToggleDone: (task: TaskItem) => void;
  onToggleFavorite: (task: TaskItem) => void;
  onEditTask: (task: TaskItem) => void;
}

export const TaskOptionsBottomSheet: React.FC<TaskOptionsBottomSheetProps> = ({
  isOpen,
  onClose,
  task,
  onToggleDone,
  onToggleFavorite,
  onEditTask,
}) => {
  if (!isOpen || !task) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end select-none animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[0.5px] transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet - matching Screenshot 4 (11.47.28 AM (3).jpeg) */}
      <div className="relative w-full bg-white rounded-t-[32px] shadow-2xl pb-8 pt-3 px-6 z-10 animate-slideUp">
        {/* Handle Bar */}
        <div className="w-12 h-1 bg-[#cfd8dc] rounded-full mx-auto mb-6" />

        {/* Menu Items */}
        <div className="space-y-1">
          {/* Mark as done / Mark as active */}
          <button
            type="button"
            onClick={() => {
              onToggleDone(task);
              onClose();
            }}
            className="w-full flex items-center gap-5 py-3.5 px-2 rounded-xl text-[#1f2937] hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center text-[#212121]">
              <CheckCheck className="w-5 h-5 text-[#212121]" />
            </div>
            <span className="text-[15px] font-medium text-[#111827]">
              {task.isDone ? "Mark as active" : "Mark as done"}
            </span>
          </button>

          {/* Add to favorites */}
          <button
            type="button"
            onClick={() => {
              onToggleFavorite(task);
              onClose();
            }}
            className="w-full flex items-center gap-5 py-3.5 px-2 rounded-xl text-[#1f2937] hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center text-[#212121]">
              <Star
                className={`w-5 h-5 ${
                  task.isFavorite
                    ? "fill-[#f59e0b] text-[#f59e0b]"
                    : "text-[#212121]"
                }`}
              />
            </div>
            <span className="text-[15px] font-medium text-[#111827]">
              {task.isFavorite ? "Remove from favorites" : "Add to favorites"}
            </span>
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={() => {
              onEditTask(task);
              onClose();
            }}
            className="w-full flex items-center gap-5 py-3.5 px-2 rounded-xl text-[#1f2937] hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center text-[#212121]">
              <Pencil className="w-5 h-5 text-[#212121]" />
            </div>
            <span className="text-[15px] font-medium text-[#111827]">Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
