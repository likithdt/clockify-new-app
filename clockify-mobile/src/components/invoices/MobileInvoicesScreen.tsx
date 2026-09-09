import React, { useState, useMemo, useEffect } from "react";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceFilterBar } from "./InvoiceFilterBar";
import { InvoiceSummaryBar } from "./InvoiceSummaryBar";
import { MobileInvoiceCard } from "./MobileInvoiceCard";
import { CreateInvoiceModal } from "./CreateInvoiceModal";
import { RemoveSampleDataModal } from "./RemoveSampleDataModal";
import { MobileDrawer } from "@/components/expenses/MobileDrawer";
import { useInvoiceStore } from "@/stores/useInvoiceStore";
import { FileText, Plus, CheckCircle2, AlertCircle } from "lucide-react";

interface MobileInvoicesScreenProps {
  onOpenDrawer?: () => void;
  onNavigateScreen?: (screen: string) => void;
}

export const MobileInvoicesScreen: React.FC<MobileInvoicesScreenProps> = ({
  onOpenDrawer,
  onNavigateScreen,
}) => {
  const {
    invoices,
    hasSampleData,
    filterClient,
    filterStatus,
    searchQuery,
    toastMessage,
    setToastMessage,
    openCreateModal,
    openRemoveSampleModal,
    restoreSampleData,
    loadFromBackend,
  } = useInvoiceStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    loadFromBackend();
  }, [loadFromBackend]);

  // Toast auto-hide
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

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (filterClient !== "All" && inv.client !== filterClient) return false;
      if (filterStatus !== "All" && inv.status !== filterStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = inv.invoiceNumber.toLowerCase().includes(q);
        const matchClient = inv.client.toLowerCase().includes(q);
        if (!matchId && !matchClient) return false;
      }
      return true;
    });
  }, [invoices, filterClient, filterStatus, searchQuery]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden select-none relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-[#1e293b] text-white px-4 py-2 rounded-full text-xs font-medium shadow-xl flex items-center gap-2 animate-slideDown">
          <CheckCircle2 className="w-4 h-4 text-[#00b0ff] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <InvoiceHeader onOpenDrawer={handleOpenDrawer} />

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Sample Data Banner matching Invoices.png */}
        {hasSampleData ? (
          <div className="bg-[#e0f2fe]/80 border-b border-[#bae6fd] px-4 py-2.5 flex items-center justify-between gap-2">
            <span className="text-[11px] text-[#0288d1] font-medium leading-tight">
              You are currently using sample data to help you explore.
            </span>
            <button
              type="button"
              onClick={openRemoveSampleModal}
              className="px-2.5 py-1 border border-[#0288d1] text-[#0288d1] hover:bg-[#0288d1] hover:text-white rounded text-[10px] font-bold uppercase tracking-wider shrink-0 transition cursor-pointer"
            >
              REMOVE SAMPLE DATA
            </button>
          </div>
        ) : (
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={restoreSampleData}
              className="text-[11px] font-semibold text-[#00b0ff] hover:underline cursor-pointer"
            >
              + Restore Sample Invoices
            </button>
          </div>
        )}

        {/* Financial Summary Metric Bar */}
        <InvoiceSummaryBar />

        {/* Filter Bar */}
        <InvoiceFilterBar />

        {/* Invoices List Content */}
        <div className="p-4 space-y-3 pb-24">
          <div className="flex items-center justify-between text-xs text-[#64748b] px-0.5">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Showing {filteredInvoices.length} {filteredInvoices.length === 1 ? "invoice" : "invoices"}
            </span>
          </div>

          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => (
              <MobileInvoiceCard key={invoice.id} invoice={invoice} />
            ))
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-[#e2e8f0] text-center flex flex-col items-center justify-center my-6">
              <div className="w-12 h-12 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#94a3b8] mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[#1e293b]">No invoices found</p>
              <p className="text-xs text-[#64748b] mt-1 max-w-[240px]">
                Try adjusting your client or status filters, or create a new invoice.
              </p>
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-4 px-4 py-2 bg-[#00b0ff] hover:bg-[#009ee6] text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Invoice</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <div className="absolute bottom-5 right-5 z-20">
        <button
          type="button"
          onClick={openCreateModal}
          className="w-13 h-13 rounded-full bg-[#00b0ff] hover:bg-[#009ee6] active:scale-95 text-white flex items-center justify-center shadow-lg shadow-[#00b0ff]/40 transition-all cursor-pointer"
          aria-label="Create new invoice"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Invoices Modals */}
      <CreateInvoiceModal />
      <RemoveSampleDataModal />

      {/* Drawer Overlay */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeScreen="invoices"
        onNavigate={(screen) => {
          setIsDrawerOpen(false);
          onNavigateScreen?.(screen);
        }}
      />
    </div>
  );
};

export default MobileInvoicesScreen;
