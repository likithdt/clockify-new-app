/**
 * Clockify Invoicing - Domain Entities and DTO Types
 */

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Void';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface InvoiceDTO {
  id: string;
  invoice_number: string;
  client: string;
  client_id?: string;
  issue_date: string; // DD/MM/YYYY or YYYY-MM-DD
  due_on: string; // DD/MM/YYYY or YYYY-MM-DD
  due_subtitle?: string; // e.g. "4 days ago"
  amount: number;
  balance: number;
  currency: string;
  status: InvoiceStatus;
  items?: InvoiceLineItem[];
  notes?: string;
  is_sample: boolean;
  created_at: string;
  updated_at?: string;
}

export interface InvoiceClient {
  id: string;
  name: string;
  email?: string;
  address?: string;
  currency?: string;
}

export interface InvoiceSettings {
  company_name: string;
  company_address: string;
  default_currency: string;
  default_due_days: number;
  next_invoice_number: number;
  tax_rate_percent: number;
}

export interface InvoiceFilter {
  client?: string;
  status?: InvoiceStatus | 'All';
  search_query?: string;
  start_date?: string;
  end_date?: string;
}

export interface CreateInvoicePayload {
  invoice_number: string;
  client: string;
  client_id?: string;
  issue_date: string;
  due_date: string;
  amount?: number;
  balance?: number;
  currency?: string;
  items?: InvoiceLineItem[];
  notes?: string;
  status?: InvoiceStatus;
  is_sample?: boolean;
}

export interface UpdateInvoicePayload {
  invoice_number?: string;
  client?: string;
  client_id?: string;
  issue_date?: string;
  due_date?: string;
  due_subtitle?: string;
  amount?: number;
  balance?: number;
  currency?: string;
  status?: InvoiceStatus;
  items?: InvoiceLineItem[];
  notes?: string;
}

export interface InvoiceSummaryDTO {
  total_amount: number;
  total_balance: number;
  total_paid: number;
  total_overdue: number;
  currency: string;
  count: number;
  draft_count: number;
  sent_count: number;
  paid_count: number;
  overdue_count: number;
}
