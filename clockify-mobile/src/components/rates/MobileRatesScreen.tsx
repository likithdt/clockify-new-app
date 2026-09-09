import React, { useState, useMemo, useEffect } from "react";
import { RatesHeader } from "./RatesHeader";
import { RatesFilterBar } from "./RatesFilterBar";
import { RatesSummaryBar } from "./RatesSummaryBar";
import { MemberRateCard } from "./MemberRateCard";
import { EditRateModal } from "./EditRateModal";
import { MobileDrawer } from "@/components/expenses/MobileDrawer";
import { useRateStore } from "@/stores/useRateStore";
import { Users, CheckCircle2, RotateCcw, Plus } from "lucide-react";

interface MobileRatesScreenProps {
  onOpenDrawer?: () => void;
  onNavigateScreen?: (screen: string) => void;
}

export const MobileRatesScreen: React.FC<MobileRatesScreenProps> = ({
  onOpenDrawer,
  onNavigateScreen,
}) => {
  const {
    members,
    rateType,
    roleFilter,
    searchQuery,
    thresholdFilter,
    toastMessage,
    setToastMessage,
    resetToDefaults,
  } = useRateStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Auto hide toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, setToastMessage]);

  const handleOpenDrawer = () => {
    if (onOpenDrawer) {
      onOpenDrawer();
    } else {
      setIsDrawerOpen(true);
    }
  };

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Role filter
      if (roleFilter !== "All" && member.role !== roleFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = member.name.toLowerCase().includes(q);
        const matchEmail = member.email.toLowerCase().includes(q);
        if (!matchName && !matchEmail) return false;
      }

      // Threshold filter
      if (thresholdFilter.condition !== "all" && thresholdFilter.value !== null) {
        const rate = rateType === "billable" ? member.billableRate : member.costRate;
        if (rate === null) return false;

        if (thresholdFilter.condition === "exact" && rate !== thresholdFilter.value) {
          return false;
        }
        if (thresholdFilter.condition === "smaller" && rate >= thresholdFilter.value) {
          return false;
        }
        if (thresholdFilter.condition === "larger" && rate <= thresholdFilter.value) {
          return false;
        }
      }

      return true;
    });
  }, [members, rateType, roleFilter, searchQuery, thresholdFilter]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden select-none relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-[#1e293b] text-white px-4 py-2 rounded-full text-xs font-medium shadow-xl flex items-center gap-2 animate-slideDown max-w-[90%] text-center">
          <CheckCircle2 className="w-4 h-4 text-[#00b0ff] shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <RatesHeader onOpenDrawer={handleOpenDrawer} />

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Summary Metric Bar */}
        <RatesSummaryBar />

        {/* Rates Filter Bar */}
        <RatesFilterBar />

        {/* Member Rates List Content */}
        <div className="p-4 space-y-3 pb-24">
          <div className="flex items-center justify-between text-xs text-[#64748b] px-0.5">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Showing {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"}
            </span>
            <span className="text-[11px] text-[#0288d1] font-medium">
              Mode: {rateType === "billable" ? "Billable Rates" : "Cost Rates"}
            </span>
          </div>

          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <MemberRateCard key={member.id} member={member} />
            ))
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-[#e2e8f0] text-center flex flex-col items-center justify-center my-6">
              <div className="w-12 h-12 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#94a3b8] mb-3">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[#1e293b]">No team members found</p>
              <p className="text-xs text-[#64748b] mt-1 max-w-[240px]">
                Try adjusting your role or rate threshold filters.
              </p>
              <button
                type="button"
                onClick={resetToDefaults}
                className="mt-4 px-4 py-2 bg-[#00b0ff] hover:bg-[#009ee6] text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Filters & Rates</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rate Editing Modal */}
      <EditRateModal />

      {/* Drawer Overlay */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeScreen="rates"
        onNavigate={(screen) => {
          setIsDrawerOpen(false);
          onNavigateScreen?.(screen);
        }}
      />
    </div>
  );
};

export default MobileRatesScreen;
