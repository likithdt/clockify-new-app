import { invoke } from '@tauri-apps/api/core';
import { invoiceService } from '@backend/services/invoiceService';
import type {
  InvoiceDTO,
  InvoiceFilter,
  CreateInvoicePayload,
  UpdateInvoicePayload,
  InvoiceStatus,
  InvoiceSummaryDTO,
  InvoiceClient,
  InvoiceSettings,
} from '@backend/models/invoiceTypes';

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export const invoiceApi = {
  listInvoices: async (filter?: InvoiceFilter): Promise<InvoiceDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<InvoiceDTO[]>('list_invoices', { filter });
      } catch (e) {
        console.warn('Tauri invoke list_invoices failed, using fallback:', e);
      }
    }
    return invoiceService.listInvoices(filter);
  },

  getInvoice: async (id: string): Promise<InvoiceDTO> => {
    if (isTauri) {
      try {
        return await invoke<InvoiceDTO>('get_invoice', { id });
      } catch (e) {
        console.warn('Tauri invoke get_invoice failed, using fallback:', e);
      }
    }
    const inv = invoiceService.getInvoice(id);
    if (!inv) throw new Error(`Invoice '${id}' not found`);
    return inv;
  },

  createInvoice: async (payload: CreateInvoicePayload): Promise<InvoiceDTO> => {
    if (isTauri) {
      try {
        return await invoke<InvoiceDTO>('create_invoice', { payload });
      } catch (e) {
        console.warn('Tauri invoke create_invoice failed, using fallback:', e);
      }
    }
    return invoiceService.createInvoice(payload);
  },

  updateInvoice: async (id: string, payload: UpdateInvoicePayload): Promise<InvoiceDTO> => {
    if (isTauri) {
      try {
        return await invoke<InvoiceDTO>('update_invoice', { id, payload });
      } catch (e) {
        console.warn('Tauri invoke update_invoice failed, using fallback:', e);
      }
    }
    return invoiceService.updateInvoice(id, payload);
  },

  deleteInvoice: async (id: string): Promise<void> => {
    if (isTauri) {
      try {
        await invoke('delete_invoice', { id });
        return;
      } catch (e) {
        console.warn('Tauri invoke delete_invoice failed, using fallback:', e);
      }
    }
    invoiceService.deleteInvoice(id);
  },

  markInvoiceStatus: async (id: string, status: InvoiceStatus): Promise<InvoiceDTO> => {
    if (isTauri) {
      try {
        return await invoke<InvoiceDTO>('mark_invoice_status', { id, status });
      } catch (e) {
        console.warn('Tauri invoke mark_invoice_status failed, using fallback:', e);
      }
    }
    return invoiceService.markInvoiceStatus(id, status);
  },

  recordPayment: async (id: string, amountPaid: number): Promise<InvoiceDTO> => {
    if (isTauri) {
      try {
        return await invoke<InvoiceDTO>('record_invoice_payment', { id, amountPaid });
      } catch (e) {
        console.warn('Tauri invoke record_invoice_payment failed, using fallback:', e);
      }
    }
    return invoiceService.recordPayment(id, amountPaid);
  },

  removeSampleInvoices: async (): Promise<void> => {
    if (isTauri) {
      try {
        await invoke('remove_sample_invoices');
        return;
      } catch (e) {
        console.warn('Tauri invoke remove_sample_invoices failed, using fallback:', e);
      }
    }
    invoiceService.removeSampleData();
  },

  restoreSampleInvoices: async (): Promise<InvoiceDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<InvoiceDTO[]>('restore_sample_invoices');
      } catch (e) {
        console.warn('Tauri invoke restore_sample_invoices failed, using fallback:', e);
      }
    }
    invoiceService.restoreSampleData();
    return invoiceService.listInvoices();
  },

  getInvoiceSummary: async (filter?: InvoiceFilter): Promise<InvoiceSummaryDTO> => {
    if (isTauri) {
      try {
        return await invoke<InvoiceSummaryDTO>('get_invoice_summary', { filter });
      } catch (e) {
        console.warn('Tauri invoke get_invoice_summary failed, using fallback:', e);
      }
    }
    return invoiceService.getInvoiceSummary(filter);
  },

  listClients: async (): Promise<InvoiceClient[]> => {
    if (isTauri) {
      try {
        return await invoke<InvoiceClient[]>('list_invoice_clients');
      } catch (e) {
        console.warn('Tauri invoke list_invoice_clients failed, using fallback:', e);
      }
    }
    return invoiceService.listClients();
  },

  createClient: async (
    name: string,
    email?: string,
    address?: string,
    currency?: string
  ): Promise<InvoiceClient> => {
    if (isTauri) {
      try {
        return await invoke<InvoiceClient>('create_invoice_client', {
          name,
          email: email || null,
          address: address || null,
          currency: currency || null,
        });
      } catch (e) {
        console.warn('Tauri invoke create_invoice_client failed, using fallback:', e);
      }
    }
    return invoiceService.createClient(name, email, currency, address);
  },

  deleteClient: async (id: string): Promise<void> => {
    if (isTauri) {
      try {
        await invoke('delete_invoice_client', { id });
        return;
      } catch (e) {
        console.warn('Tauri invoke delete_invoice_client failed, using fallback:', e);
      }
    }
    invoiceService.deleteClient(id);
  },

  getSettings: async (): Promise<InvoiceSettings> => {
    if (isTauri) {
      try {
        return await invoke<InvoiceSettings>('get_invoice_settings');
      } catch (e) {
        console.warn('Tauri invoke get_invoice_settings failed, using fallback:', e);
      }
    }
    return invoiceService.getSettings();
  },

  updateSettings: async (settings: InvoiceSettings): Promise<InvoiceSettings> => {
    if (isTauri) {
      try {
        return await invoke<InvoiceSettings>('update_invoice_settings', { settings });
      } catch (e) {
        console.warn('Tauri invoke update_invoice_settings failed, using fallback:', e);
      }
    }
    return invoiceService.updateSettings(settings);
  },
};
