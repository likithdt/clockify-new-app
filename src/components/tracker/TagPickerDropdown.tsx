import { useState, useRef, useEffect } from "react";
import { Tag as TagIcon, Check, Plus, Search } from "lucide-react";

interface Props {
    selectedTags: string[];
    onToggleTag: (tag: string) => void;
}

const DEFAULT_TAGS = [
    "Development",
    "Design",
    "Meeting",
    "Bug Fix",
    "Review",
    "Research",
    "Admin",
];

export function TagPickerDropdown({ selectedTags, onToggleTag }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [tags, setTags] = useState(DEFAULT_TAGS);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const filteredTags = tags.filter((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateTag = () => {
        if (!searchQuery.trim()) return;
        if (!tags.includes(searchQuery.trim())) {
            setTags([...tags, searchQuery.trim()]);
            onToggleTag(searchQuery.trim());
        }
        setSearchQuery("");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`p-1.5 rounded transition cursor-pointer flex items-center gap-1 ${
                    selectedTags.length > 0
                        ? "text-[#03A9F4] bg-[#E1F5FE]"
                        : "text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F1F5F9]"
                }`}
                title="Add tags"
            >
                <TagIcon className="w-4 h-4" />
                {selectedTags.length > 0 && (
                    <span className="text-[10px] font-bold">
                        {selectedTags.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-56 bg-white border border-[#E2E8F0] rounded shadow-xl z-50 py-1 text-xs">
                    <div className="p-2 border-b border-[#E2E8F0]">
                        <div className="flex items-center gap-2 px-2 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded focus-within:border-[#03A9F4]">
                            <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
                            <input
                                type="text"
                                placeholder="Find or create tag..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleCreateTag();
                                    }
                                }}
                                className="bg-transparent text-xs text-[#1E293B] placeholder:text-[#94A3B8] outline-none w-full"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="max-h-48 overflow-y-auto py-1">
                        {filteredTags.map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => onToggleTag(tag)}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] flex items-center justify-between transition cursor-pointer"
                                >
                                    <span className="text-[#1E293B] font-medium truncate">
                                        {tag}
                                    </span>
                                    {isSelected && (
                                        <Check className="w-3.5 h-3.5 text-[#03A9F4]" />
                                    )}
                                </button>
                            );
                        })}

                        {searchQuery.trim() &&
                            !tags.some(
                                (t) =>
                                    t.toLowerCase() ===
                                    searchQuery.trim().toLowerCase()
                            ) && (
                                <button
                                    type="button"
                                    onClick={handleCreateTag}
                                    className="w-full text-left px-3 py-1.5 text-[#03A9F4] font-semibold hover:bg-[#E1F5FE] flex items-center gap-1.5 transition cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Create &quot;{searchQuery}&quot;</span>
                                </button>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
}
