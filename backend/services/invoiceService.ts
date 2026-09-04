import seedData from '../data/seedData.json';
import type {
  InvoiceDTO,
  InvoiceClient,
  InvoiceSettings,
  InvoiceFilter,
  CreateInvoicePayload,
  UpdateInvoicePayload,
  InvoiceStatus,
  InvoiceSummaryDTO,
} from '../models/invoiceTypes';

class InvoiceService {
  private invoices: InvoiceDTO[] = [];
  private clients: InvoiceClient[] = [];
  private settings!: InvoiceSettings;

  constructor() {
    this.loadSeedData();
  }

  private loadSeedData() {
    const raw = seedData as any;
    this.invoices = JSON.parse(JSON.stringify(raw.invoices || []));
    this.clients = JSON.parse(JSON.stringify(raw.invoice_clients || []));
    this.settings = JSON.parse(
      JSON.stringify(
        raw.invoice_settings || {
          company_name: 'Gopalan College of Engineering and Management',
          company_address: 'Hoodi, Whitefield, Bengaluru, Karnataka 560048',
          default_currency: 'INR',
          default_due_days: 10,
          next_invoice_number: 3,
          tax_rate_percent: 18.0,
        }
      )
    );
  }

  // ─── Invoice CRUD ─────────────────────────────────────────────────────────

  public listInvoices(filter?: InvoiceFilter): InvoiceDTO[] {
    return this.invoices.filter((inv) => {
      if (filter?.client && filter.client !== 'All') {
        if (inv.client.toLowerCase() !== filter.client.toLowerCase()) return false;
      }
      if (filter?.status && filter.status !== 'All') {
        if (inv.status !== filter.status) return false;
      }
      if (filter?.search_query && filter.search_query.trim()) {
        const q = filter.search_query.toLowerCase();
        const matchNum = inv.invoice_number.toLowerCase().includes(q);
        const matchClient = inv.client.toLowerCase().includes(q);
        if (!matchNum && !matchClient) return false;
      }
      if (filter?.start_date && inv.issue_date < filter.start_date) return false;
      if (filter?.end_date && inv.issue_date > filter.end_date) return false;
      return true;
    });
  }

  public getInvoice(id: string): InvoiceDTO | null {
    const found = this.invoices.find((i) => i.id === id);
    return found ? { ...found } : null;
  }

  public createInvoice(payload: CreateInvoicePayload): InvoiceDTO {
    const amount = payload.amount !== undefined ? payload.amount : 750.0;
    const balance = payload.balance !== undefined ? payload.balance : amount;

    const newInvoice: InvoiceDTO = {
      id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      invoice_number: payload.invoice_number.trim(),
      client: payload.client.trim(),
      client_id: payload.client_id,
      issue_date: payload.issue_date,
      due_on: payload.due_date,
      amount,
      balance,
      currency: payload.currency || this.settings.default_currency || 'INR',
      status: payload.status || 'Draft',
      items: payload.items || [],
      notes: payload.notes,
      is_sample: payload.is_sample ?? false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.invoices.unshift(newInvoice);
    this.settings.next_invoice_number += 1;
    return { ...newInvoice };
  }

  public updateInvoice(id: string, payload: UpdateInvoicePayload): InvoiceDTO {
    const idx = this.invoices.findIndex((i) => i.id === id);
    if (idx === -1) {
      throw new Error(`Invoice with ID '${id}' not found`);
    }

    const current = this.invoices[idx];
    const updated: InvoiceDTO = {
      ...current,
      invoice_number: payload.invoice_number !== undefined ? payload.invoice_number.trim() : current.invoice_number,
      client: payload.client !== undefined ? payload.client.trim() : current.client,
      client_id: payload.client_id !== undefined ? payload.client_id : current.client_id,
      issue_date: payload.issue_date !== undefined ? payload.issue_date : current.issue_date,
      due_on: payload.due_date !== undefined ? payload.due_date : current.due_on,
      due_subtitle: payload.due_subtitle !== undefined ? payload.due_subtitle : current.due_subtitle,
      amount: payload.amount !== undefined ? payload.amount : current.amount,
      balance: payload.balance !== undefined ? payload.balance : current.balance,
      currency: payload.currency !== undefined ? payload.currency : current.currency,
      status: payload.status !== undefined ? payload.status : current.status,
      items: payload.items !== undefined ? payload.items : current.items,
      notes: payload.notes !== undefined ? payload.notes : current.notes,
      updated_at: new Date().toISOString(),
    };

    this.invoices[idx] = updated;
    return { ...updated };
  }

  public deleteInvoice(id: string): void {
    const idx = this.invoices.findIndex((i) => i.id === id);
    if (idx === -1) {
      throw new Error(`Invoice with ID '${id}' not found`);
    }
    this.invoices.splice(idx, 1);
  }

  public markInvoiceStatus(id: string, status: InvoiceStatus): InvoiceDTO {
    return this.updateInvoice(id, { status });
  }

  public recordPayment(id: string, amountPaid: number): InvoiceDTO {
    const inv = this.getInvoice(id);
    if (!inv) throw new Error(`Invoice with ID '${id}' not found`);

    const newBalance = Math.max(0, inv.balance - amountPaid);
    const newStatus: InvoiceStatus = newBalance === 0 ? 'Paid' : inv.status;
    return this.updateInvoice(id, { balance: newBalance, status: newStatus });
  }

  public removeSampleData(): void {
    this.invoices = this.invoices.filter((i) => !i.is_sample);
  }

  public restoreSampleData(): void {
    const raw = seedData as any;
    const sampleInvoices: InvoiceDTO[] = JSON.parse(JSON.stringify(raw.invoices || []));
    const nonSample = this.invoices.filter((i) => !i.is_sample);
    this.invoices = [...sampleInvoices, ...nonSample];
  }

  // ─── Analytics & Summary ──────────────────────────────────────────────────

  public getInvoiceSummary(filter?: InvoiceFilter): InvoiceSummaryDTO {
    const filtered = this.listInvoices(filter);
    const totalAmount = filtered.reduce((acc, curr) => acc + curr.amount, 0);
    const totalBalance = filtered.reduce((acc, curr) => acc + curr.balance, 0);
    const totalPaid = totalAmount - totalBalance;
    const totalOverdue = filtered
      .filter((i) => i.status === 'Overdue')
      .reduce((acc, curr) => acc + curr.balance, 0);

    const draft = filtered.filter((i) => i.status === 'Draft').length;
    const sent = filtered.filter((i) => i.status === 'Sent').length;
    const paid = filtered.filter((i) => i.status === 'Paid').length;
    const overdue = filtered.filter((i) => i.status === 'Overdue').length;

    return {
      total_amount: Math.round(totalAmount * 100) / 100,
      total_balance: Math.round(totalBalance * 100) / 100,
      total_paid: Math.round(totalPaid * 100) / 100,
      total_overdue: Math.round(totalOverdue * 100) / 100,
      currency: this.settings.default_currency || 'INR',
      count: filtered.length,
      draft_count: draft,
      sent_count: sent,
      paid_count: paid,
      overdue_count: overdue,
    };
  }

  // ─── Clients Management ───────────────────────────────────────────────────

  public listClients(): InvoiceClient[] {
    return [...this.clients];
  }

  public createClient(name: string, email?: string, currency?: string, address?: string): InvoiceClient {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Client name cannot be empty');

    const existing = this.clients.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) return { ...existing };

    const newClient: InvoiceClient = {
      id: `client-${Date.now()}`,
      name: trimmed,
      email,
      currency: currency || this.settings.default_currency,
      address,
    };

    this.clients.push(newClient);
    return { ...newClient };
  }

  public deleteClient(id: string): void {
    const idx = this.clients.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error(`Client with ID '${id}' not found`);
    this.clients.splice(idx, 1);
  }

  // ─── Settings ─────────────────────────────────────────────────────────────

  public getSettings(): InvoiceSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<InvoiceSettings>): InvoiceSettings {
    this.settings = { ...this.settings, ...partial };
    return { ...this.settings };
  }

  public resetSampleData(): void {
    this.loadSeedData();
  }
}

export const invoiceService = new InvoiceService();
