import React, { useState } from "react";
import {
  FileText,
  Building2,
  Calendar,
  Clock,
  MoreVertical,
  CheckCircle2,
  Send,
  Copy,
  Download,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useInvoiceStore, type Invoice } from "@/stores/useInvoiceStore";

interface MobileInvoiceCardProps {
  invoice: Invoice;
}

export const MobileInvoiceCard: React.FC<MobileInvoiceCardProps> = ({ invoice }) => {
  const { markInvoiceStatus, duplicateInvoice, deleteInvoice, setToastMessage } = useInvoiceStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isOverdue = invoice.status === "Overdue";
  const isPaid = invoice.status === "Paid";
  const isSent = invoice.status === "Sent";

  const formatAmount = (val: number, curr: string) => {
    return `${val.toFixed(2).replace(".", ",")} ${curr || "USD"}`;
  };

  const handleDownloadPDF = () => {
    setIsMenuOpen(false);
    setToastMessage(`Downloading PDF for ${invoice.invoiceNumber}...`);
    setTimeout(() => {
      setToastMessage(`Invoice ${invoice.invoiceNumber} PDF downloaded`);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-xs hover:border-[#cbd5e1] transition-all relative">
      {/* Top Header: ID, Status, Actions Menu */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[15px] text-[#0f172a] truncate">
              {invoice.invoiceNumber}
            </span>
            {invoice.isSample && (
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0">
                SAMPLE
              </span>
            )}
          </div>

          {/* Client */}
          <div className="flex items-center gap-1.5 mt-1 text-xs text-[#64748b]">
            <Building2 className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
            <span className="truncate font-medium text-[#334155]">{invoice.client}</span>
          </div>
        </div>

        {/* Status Badge & More Menu */}
        <div className="flex items-center gap-1 shrink-0">
          {isOverdue && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
              <AlertTriangle className="w-3 h-3" />
              Overdue
            </span>
          )}
          {isPaid && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              Paid
            </span>
          )}
          {isSent && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
              <Send className="w-3 h-3" />
              Sent
            </span>
          )}
          {invoice.status === "Draft" && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              <FileText className="w-3 h-3" />
              Draft
            </span>
          )}

          {/* More actions dropdown */}
          <div className="relative ml-0.5">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-lg text-[#94a3b8] hover:text-[#0f172a] hover:bg-slate-100 transition cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#e2e8f0] rounded-xl shadow-xl z-30 py-1 text-xs animate-fadeIn divide-y divide-slate-100">
                <div className="py-1">
                  {!isPaid && (
                    <button
                      type="button"
                      onClick={() => {
                        markInvoiceStatus(invoice.id, "Paid");
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-emerald-600 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark as Paid
                    </button>
                  )}
                  {invoice.status === "Draft" && (
                    <button
                      type="button"
                      onClick={() => {
                        markInvoiceStatus(invoice.id, "Sent");
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-blue-600 font-medium"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Mark as Sent
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-[#334155]"
                  >
                    <Download className="w-3.5 h-3.5 text-[#64748b]" />
                    Download PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      duplicateInvoice(invoice.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-[#334155]"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#64748b]" />
                    Duplicate
                  </button>
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      deleteInvoice(invoice.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dates Section */}
      <div className="mt-3.5 pt-3 border-t border-[#f1f5f9] grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-[11px] text-[#94a3b8] font-medium flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#94a3b8]" /> Issue Date
          </span>
          <p className="mt-0.5 text-[#334155] font-semibold">{invoice.issueDate}</p>
        </div>

        <div>
          <span className="text-[11px] text-[#94a3b8] font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#94a3b8]" /> Due On
          </span>
          <p className="mt-0.5 text-[#334155] font-semibold">{invoice.dueOn}</p>
          {invoice.dueSubtitle && (
            <span className="text-[10px] font-bold text-rose-600 block mt-0.5">
              {invoice.dueSubtitle}
            </span>
          )}
        </div>
      </div>

      {/* Amount and Balance Row */}
      <div className="mt-3 pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider">Amount</span>
          <p className="text-sm font-bold text-[#0f172a]">
            {formatAmount(invoice.amount, invoice.currency)}
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider">Balance</span>
          <p
            className={`text-sm font-bold ${
              isOverdue
                ? "text-rose-600 font-extrabold"
                : invoice.balance > 0
                ? "text-[#d97706]"
                : "text-emerald-600"
            }`}
          >
            {formatAmount(invoice.balance, invoice.currency)}
          </p>
        </div>
      </div>

      {/* Quick Action Button for unpaid invoices */}
      {!isPaid && (
        <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] flex items-center justify-end">
          <button
            type="button"
            onClick={() => markInvoiceStatus(invoice.id, "Paid")}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#e0f2fe] text-[#0288d1] hover:bg-[#bae6fd] active:scale-95 transition cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark as Paid</span>
          </button>
        </div>
      )}
    </div>
  );
};
