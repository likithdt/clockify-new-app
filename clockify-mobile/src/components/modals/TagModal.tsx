import React, { useState } from "react";
import { X } from "lucide-react";

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTag: (name: string) => void;
}

export const TagModal: React.FC<TagModalProps> = ({
  isOpen,
  onClose,
  onCreateTag,
}) => {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateTag(name.trim());
    setName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[#1a1f26] border border-[#27303c] rounded-2xl w-full max-w-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Create Tag</h2>
          <button type="button" onClick={onClose} className="text-[#8c9ba5] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#8c9ba5] block mb-1">Tag Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Design, Meeting"
              className="w-full bg-[#12161c] border border-[#27303c] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00b0ff]"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl bg-[#242b35] text-[#8c9ba5] text-xs font-semibold hover:bg-[#2b3340]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-[#00b0ff] text-white text-xs font-semibold hover:bg-[#009ee6]"
            >
              Create Tag
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
