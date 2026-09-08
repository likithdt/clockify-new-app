import React from "react";
import { Plus, Tag as TagIcon, Trash2 } from "lucide-react";
import type { Tag } from "../backend/types";

export interface TagsScreenProps {
  tags: Tag[];
  searchQuery: string;
  onOpenTagModal: () => void;
  onDeleteTag: (id: string) => void;
}

export const TagsScreen: React.FC<TagsScreenProps> = ({
  tags,
  searchQuery,
  onOpenTagModal,
  onDeleteTag,
}) => {
  const filtered = tags.filter((t) =>
    t.name.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#0f1216] text-white p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Tags</h2>
        <button
          type="button"
          onClick={onOpenTagModal}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#00b0ff] text-white text-xs font-semibold hover:bg-[#009ee6]"
        >
          <Plus className="w-4 h-4" /> Create Tag
        </button>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[#8c9ba5] space-y-2">
            <TagIcon className="w-10 h-10 mx-auto text-[#4a5568]" />
            <p className="text-sm">No tags created yet</p>
          </div>
        ) : (
          filtered.map((t) => (
            <div
              key={t.id}
              className="bg-[#1a1f26] border border-[#27303c] rounded-2xl p-3.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-[#00b0ff]" />
                <span className="text-sm font-semibold text-white">{t.name}</span>
              </div>

              <button
                type="button"
                onClick={() => onDeleteTag(t.id)}
                className="p-2 text-[#8c9ba5] hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
