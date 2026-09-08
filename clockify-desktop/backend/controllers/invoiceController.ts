import { invoiceService } from '../services/invoiceService';
import type {
  InvoiceFilter,
  CreateInvoicePayload,
  UpdateInvoicePayload,
  InvoiceStatus,
  InvoiceSettings,
} from '../models/invoiceTypes';

export class InvoiceController {
  static listInvoices(filter?: InvoiceFilter) {
    try {
      const data = invoiceService.listInvoices(filter);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static getInvoice(id: string) {
    try {
      const invoice = invoiceService.getInvoice(id);
      if (!invoice) {
        return { success: false, error: `Invoice '${id}' not found` };
      }
      return { success: true, data: invoice };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static createInvoice(payload: CreateInvoicePayload) {
    try {
      const data = invoiceService.createInvoice(payload);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static updateInvoice(id: string, payload: UpdateInvoicePayload) {
    try {
      const data = invoiceService.updateInvoice(id, payload);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static deleteInvoice(id: string) {
    try {
      invoiceService.deleteInvoice(id);
      return { success: true, message: `Invoice '${id}' deleted successfully` };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static markInvoiceStatus(id: string, status: InvoiceStatus) {
    try {
      const data = invoiceService.markInvoiceStatus(id, status);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static recordPayment(id: string, amountPaid: number) {
    try {
      const data = invoiceService.recordPayment(id, amountPaid);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static removeSampleData() {
    try {
      invoiceService.removeSampleData();
      return { success: true, message: 'Sample invoices removed successfully' };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static restoreSampleData() {
    try {
      invoiceService.restoreSampleData();
      return { success: true, message: 'Sample invoices restored successfully' };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static getInvoiceSummary(filter?: InvoiceFilter) {
    try {
      const data = invoiceService.getInvoiceSummary(filter);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static listClients() {
    try {
      const data = invoiceService.listClients();
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static createClient(name: string, email?: string, currency?: string, address?: string) {
    try {
      const data = invoiceService.createClient(name, email, currency, address);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static deleteClient(id: string) {
    try {
      invoiceService.deleteClient(id);
      return { success: true, message: `Client '${id}' deleted successfully` };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static getSettings() {
    try {
      const data = invoiceService.getSettings();
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static updateSettings(settings: Partial<InvoiceSettings>) {
    try {
      const data = invoiceService.updateSettings(settings);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }
}
