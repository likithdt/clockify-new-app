import { create } from 'zustand';
import { timeoffApi } from '@/lib/timeoffApi';
import { timeOffService } from '@backend/services/timeOffService';
import type {
  TimeOffRequest,
  LeavePolicy,
  LeaveBalance,
  Holiday,
  TeamMember,
  Toast,
  CreateRequestPayload,
  ReviewRequestPayload,
  CreatePolicyPayload,
  UpdatePolicyPayload,
  CreateHolidayPayload,
  UpdateHolidayPayload,
} from '@/types/timeoff';

type TabKey = 'requests' | 'timeline' | 'balance' | 'policies' | 'holidays';

interface ConfirmState {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

interface TimeOffState {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;

  requests: TimeOffRequest[];
  policies: LeavePolicy[];
  balances: LeaveBalance[];
  holidays: Holiday[];
  members: TeamMember[];

  isLoading: boolean;
  error: string | null;
  sampleDataActive: boolean;

  // Toast system
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;

  // Confirm dialog
  confirm: ConfirmState;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirm: () => void;

  // Dialog states
  isRequestModalOpen: boolean;
  setIsRequestModalOpen: (open: boolean) => void;
  isCreatePolicyModalOpen: boolean;
  setIsCreatePolicyModalOpen: (open: boolean) => void;
  isCreateHolidayModalOpen: boolean;
  setIsCreateHolidayModalOpen: (open: boolean) => void;
  isImportHolidaysModalOpen: boolean;
  setIsImportHolidaysModalOpen: (open: boolean) => void;

  // Edit states
  editingHolidayId: string | null;
  setEditingHolidayId: (id: string | null) => void;
  editingPolicyId: string | null;
  setEditingPolicyId: (id: string | null) => void;

  fetchData: () => Promise<void>;
  createRequest: (payload: CreateRequestPayload) => Promise<void>;
  reviewRequest: (id: string, payload: ReviewRequestPayload) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  createPolicy: (payload: CreatePolicyPayload) => Promise<void>;
  updatePolicy: (id: string, payload: UpdatePolicyPayload) => Promise<void>;
  deletePolicy: (id: string) => Promise<void>;
  createHoliday: (payload: CreateHolidayPayload) => Promise<void>;
  updateHoliday: (id: string, payload: UpdateHolidayPayload) => Promise<void>;
  importHolidays: (countryCode: string, year: number) => Promise<void>;
  importSelectedHolidays: (countryCode: string, selections: { name: string; date: string }[]) => Promise<Holiday[]>;
  deleteHoliday: (id: string) => Promise<void>;
  removeSampleData: () => void;
}

function getInitialTab(): TabKey {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '') as TabKey;
    const valid: TabKey[] = ['requests', 'timeline', 'balance', 'policies', 'holidays'];
    if (valid.includes(hash)) return hash;
  }
  return 'holidays';
}

export const useTimeOffStore = create<TimeOffState>((set, get) => ({
  activeTab: getInitialTab(),
  setActiveTab: (activeTab) => {
    if (typeof window !== 'undefined') {
      window.location.hash = activeTab;
    }
    set({ activeTab });
  },

  requests: timeOffService.listRequests(),
  policies: timeOffService.listPolicies(),
  balances: timeOffService.listBalances(),
  holidays: timeOffService.listHolidays(),
  members: timeOffService.listMembers(),

  isLoading: false,
  error: null,
  sampleDataActive: true,

  // Toast
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3500);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  // Confirm dialog
  confirm: { open: false, title: '', message: '', onConfirm: () => {} },
  showConfirm: (title, message, onConfirm) =>
    set({ confirm: { open: true, title, message, onConfirm } }),
  closeConfirm: () =>
    set({ confirm: { open: false, title: '', message: '', onConfirm: () => {} } }),

  // Dialog open states
  isRequestModalOpen: false,
  setIsRequestModalOpen: (isRequestModalOpen) => set({ isRequestModalOpen }),
  isCreatePolicyModalOpen: false,
  setIsCreatePolicyModalOpen: (isCreatePolicyModalOpen) => set({ isCreatePolicyModalOpen }),
  isCreateHolidayModalOpen: false,
  setIsCreateHolidayModalOpen: (isCreateHolidayModalOpen) => set({ isCreateHolidayModalOpen }),
  isImportHolidaysModalOpen: false,
  setIsImportHolidaysModalOpen: (isImportHolidaysModalOpen) => set({ isImportHolidaysModalOpen }),

  // Edit IDs
  editingHolidayId: null,
  setEditingHolidayId: (editingHolidayId) => set({ editingHolidayId }),
  editingPolicyId: null,
  setEditingPolicyId: (editingPolicyId) => set({ editingPolicyId }),

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [requests, policies, balances, holidays, members] = await Promise.all([
        timeoffApi.listRequests(),
        timeoffApi.listPolicies(),
        timeoffApi.listBalances(),
        timeoffApi.listHolidays(),
        timeoffApi.listTeamMembers(),
      ]);
      set({
        requests: requests || timeOffService.listRequests(),
        policies: policies || timeOffService.listPolicies(),
        balances: balances || timeOffService.listBalances(),
        holidays: holidays || timeOffService.listHolidays(),
        members: members || timeOffService.listMembers(),
        isLoading: false,
      });
    } catch {
      set({
        requests: timeOffService.listRequests(),
        policies: timeOffService.listPolicies(),
        balances: timeOffService.listBalances(),
        holidays: timeOffService.listHolidays(),
        members: timeOffService.listMembers(),
        isLoading: false,
      });
    }
  },

  createRequest: async (payload) => {
    try {
      try {
        const newReq = await timeoffApi.createRequest(payload);
        set((state) => ({ requests: [newReq, ...state.requests] }));
      } catch {
        timeOffService.createRequest(payload);
        set({ requests: timeOffService.listRequests(), balances: timeOffService.listBalances() });
      }
      get().addToast('Time off request submitted successfully');
    } catch (err) {
      get().addToast(err instanceof Error ? err.message : 'Failed to submit request', 'error');
      throw err;
    }
  },

  reviewRequest: async (id, payload) => {
    try {
      try {
        const updated = await timeoffApi.reviewRequest(id, payload);
        set((state) => ({
          requests: state.requests.map((r) => (r.id === id ? updated : r)),
        }));
      } catch {
        timeOffService.reviewRequest(id, payload);
        set({ requests: timeOffService.listRequests(), balances: timeOffService.listBalances() });
      }
      const label = payload.status === 'approved' ? 'approved' : 'rejected';
      get().addToast(`Request ${label} successfully`);
    } catch (err) {
      get().addToast('Failed to update request', 'error');
    }
  },

  deleteRequest: async (id) => {
    try {
      try {
        await timeoffApi.deleteRequest(id);
      } catch {
        timeOffService.deleteRequest(id);
      }
      set({ requests: timeOffService.listRequests(), balances: timeOffService.listBalances() });
      get().addToast('Request deleted');
    } catch (err) {
      get().addToast('Failed to delete request', 'error');
    }
  },

  createPolicy: async (payload) => {
    try {
      try {
        const newPol = await timeoffApi.createPolicy(payload);
        set((state) => ({ policies: [...state.policies, newPol] }));
      } catch {
        timeOffService.createPolicy(payload);
        set({ policies: timeOffService.listPolicies() });
      }
      get().addToast('Policy created successfully');
    } catch (err) {
      get().addToast(err instanceof Error ? err.message : 'Failed to create policy', 'error');
      throw err;
    }
  },

  updatePolicy: async (id, payload) => {
    try {
      timeOffService.updatePolicy(id, payload);
      set({ policies: timeOffService.listPolicies() });
      get().addToast('Policy updated successfully');
    } catch (err) {
      get().addToast('Failed to update policy', 'error');
      throw err;
    }
  },

  deletePolicy: async (id) => {
    try {
      try {
        await timeoffApi.deletePolicy(id);
      } catch {
        timeOffService.deletePolicy(id);
      }
      set({ policies: timeOffService.listPolicies(), balances: timeOffService.listBalances() });
      get().addToast('Policy deleted');
    } catch (err) {
      get().addToast(err instanceof Error ? err.message : 'Failed to delete policy', 'error');
    }
  },

  createHoliday: async (payload) => {
    try {
      try {
        const newHol = await timeoffApi.createHoliday(payload);
        set((state) => ({ holidays: [...state.holidays, newHol] }));
      } catch {
        timeOffService.createHoliday(payload);
        set({ holidays: timeOffService.listHolidays() });
      }
      get().addToast('Holiday created successfully');
    } catch (err) {
      get().addToast('Failed to create holiday', 'error');
      throw err;
    }
  },

  updateHoliday: async (id, payload) => {
    try {
      timeOffService.updateHoliday(id, payload);
      set({ holidays: timeOffService.listHolidays() });
      get().addToast('Holiday updated successfully');
    } catch (err) {
      get().addToast('Failed to update holiday', 'error');
      throw err;
    }
  },

  importHolidays: async (countryCode, year) => {
    try {
      try {
        const imported = await timeoffApi.importPublicHolidays(countryCode, year);
        set((state) => ({ holidays: [...state.holidays, ...imported] }));
      } catch {
        timeOffService.importPublicHolidays(countryCode, year);
        set({ holidays: timeOffService.listHolidays() });
      }
      get().addToast('Holidays imported successfully');
    } catch (err) {
      get().addToast('Failed to import holidays', 'error');
    }
  },

  importSelectedHolidays: async (countryCode, selections) => {
    const imported = timeOffService.importSelectedHolidays(countryCode, selections);
    set({ holidays: timeOffService.listHolidays() });
    if (imported.length > 0) {
      get().addToast(`${imported.length} holiday${imported.length !== 1 ? 's' : ''} imported successfully`);
    } else {
      get().addToast('No new holidays to import (duplicates skipped)', 'info');
    }
    return imported;
  },

  deleteHoliday: async (id) => {
    try {
      try {
        await timeoffApi.deleteHoliday(id);
      } catch {
        timeOffService.deleteHoliday(id);
      }
      set({ holidays: timeOffService.listHolidays() });
      get().addToast('Holiday deleted');
    } catch (err) {
      get().addToast('Failed to delete holiday', 'error');
    }
  },

  removeSampleData: () => {
    set((state) => ({
      sampleDataActive: false,
      requests: state.requests.filter((r) => !r.id.startsWith('r')),
      policies: state.policies.filter((p) => !p.name.includes('[SAMPLE]')),
      members: state.members.filter((m) => !m.name.includes('[SAMPLE]')),
    }));
  },
}));
