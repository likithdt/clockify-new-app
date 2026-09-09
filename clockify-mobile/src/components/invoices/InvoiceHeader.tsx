import React, { useState } from "react";
import { Menu, Search, Plus, X, Settings } from "lucide-react";
import { useInvoiceStore } from "@/stores/useInvoiceStore";

interface InvoiceHeaderProps {
  onOpenDrawer?: () => void;
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ onOpenDrawer }) => {
  const { invoices, searchQuery, setSearchQuery, openCreateModal, openRemoveSampleModal, hasSampleData } = useInvoiceStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="bg-[#1b2026] text-white border-b border-[#262e37] sticky top-0 z-30 select-none shadow-sm">
      {/* Top Main Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Drawer Hamburger & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="p-1.5 -ml-1.5 rounded-lg text-[#8c9ba5] hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-white">Invoices</h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#262e37] text-[#00b0ff]">
              {invoices.length}
            </span>
          </div>
        </div>

        {/* Right Actions: Search toggle, Settings/Sample, Create Invoice */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (isSearchOpen) setSearchQuery("");
            }}
            className={`p-2 rounded-lg text-xs transition-all cursor-pointer ${
              isSearchOpen || searchQuery
                ? "bg-[#00b0ff]/20 text-[#00b0ff]"
                : "text-[#8c9ba5] hover:text-white hover:bg-white/10"
            }`}
            aria-label="Search invoices"
          >
            <Search className="w-4 h-4" />
          </button>

          {hasSampleData && (
            <button
              type="button"
              onClick={openRemoveSampleModal}
              className="p-2 rounded-lg text-[#8c9ba5] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Sample Data Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-1 bg-[#00b0ff] hover:bg-[#009ee6] active:scale-95 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md shadow-[#00b0ff]/20 transition-all cursor-pointer ml-1"
          >
            <Plus className="w-4 h-4" />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      {isSearchOpen && (
        <div className="px-4 pb-3 pt-1 animate-fadeIn">
          <div className="flex items-center gap-2 bg-[#262e37] rounded-lg px-3 py-2 border border-[#30363d] focus-within:border-[#00b0ff]">
            <Search className="w-4 h-4 text-[#8c9ba5] shrink-0" />
            <input
              type="text"
              placeholder="Search by Invoice ID or Client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="bg-transparent text-xs text-white placeholder:text-[#6e7681] outline-none w-full"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[#8c9ba5] hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
