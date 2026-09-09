import { create } from "zustand";
import { rateApi } from "@/lib/rateApi";

export interface RateMember {
  id: string;
  name: string;
  email: string;
  role: "Project manager" | "Team manager" | "Member" | "Admin" | "Owner";
  billableRate: number | null;
  costRate: number | null;
  currency: string;
  avatarColor: string;
  status: "Active" | "Inactive";
}

export type RateType = "billable" | "cost";

export interface ThresholdFilter {
  condition: "all" | "exact" | "smaller" | "larger";
  value: number | null;
}

interface RateState {
  rateType: RateType;
  members: RateMember[];
  roleFilter: string;
  searchQuery: string;
  thresholdFilter: ThresholdFilter;
  editingTarget: {
    memberId: string;
    memberName: string;
    type: RateType;
    currentRate: number | null;
  } | null;
  toastMessage: string | null;
  isLoading: boolean;

  // Actions
  setRateType: (type: RateType) => void;
  setRoleFilter: (role: string) => void;
  setSearchQuery: (query: string) => void;
  setThresholdFilter: (filter: ThresholdFilter) => void;
  openEditRateModal: (memberId: string, type?: RateType) => void;
  closeEditRateModal: () => void;
  updateRate: (memberId: string, type: RateType, newRate: number | null, applyToExisting?: boolean) => Promise<void>;
  setToastMessage: (msg: string | null) => void;
  resetToDefaults: () => void;
}

const INITIAL_MEMBERS: RateMember[] = [
  {
    id: "rate-tm-1",
    name: "[SAMPLE] Amy Smith",
    email: "amy.smith1b1753f297a01cbb@clockify.me",
    role: "Project manager",
    billableRate: null,
    costRate: 15.0,
    currency: "USD",
    avatarColor: "bg-[#0288d1]",
    status: "Active",
  },
  {
    id: "rate-tm-2",
    name: "[SAMPLE] James Anderson",
    email: "james.anderson36d56b7f7df036@clockify.me",
    role: "Member",
    billableRate: null,
    costRate: 5.0,
    currency: "USD",
    avatarColor: "bg-[#7b1fa2]",
    status: "Active",
  },
  {
    id: "rate-tm-3",
    name: "[SAMPLE] Lara Peterson",
    email: "lara.peterson03af321182e80532@clockify.me",
    role: "Team manager",
    billableRate: null,
    costRate: 10.0,
    currency: "USD",
    avatarColor: "bg-[#e65100]",
    status: "Active",
  },
  {
    id: "rate-tm-4",
    name: "[SAMPLE] Mike Johnson",
    email: "mike.johnson22b7a3ff4c176cbc@clockify.me",
    role: "Member",
    billableRate: null,
    costRate: 10.0,
    currency: "USD",
    avatarColor: "bg-[#2e7d32]",
    status: "Active",
  },
  {
    id: "rate-tm-5",
    name: "[SAMPLE] Sarah Connor",
    email: "sarah.connor44a199@clockify.me",
    role: "Admin",
    billableRate: 45.0,
    costRate: 20.0,
    currency: "USD",
    avatarColor: "bg-[#c2185b]",
    status: "Active",
  },
  {
    id: "rate-tm-6",
    name: "[SAMPLE] Alex Morgan",
    email: "alex.morgan99b321@clockify.me",
    role: "Member",
    billableRate: 30.0,
    costRate: 12.0,
    currency: "USD",
    avatarColor: "bg-[#0097a7]",
    status: "Active",
  },
];

export const useRateStore = create<RateState>((set, get) => ({
  rateType: "billable",
  members: INITIAL_MEMBERS,
  roleFilter: "All",
  searchQuery: "",
  thresholdFilter: {
    condition: "all",
    value: null,
  },
  editingTarget: null,
  toastMessage: null,
  isLoading: false,

  setRateType: (rateType) => set({ rateType }),
  setRoleFilter: (roleFilter) => set({ roleFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setThresholdFilter: (thresholdFilter) => set({ thresholdFilter }),

  openEditRateModal: (memberId, explicitType) => {
    const member = get().members.find((m) => m.id === memberId);
    if (!member) return;
    const type = explicitType || get().rateType;
    set({
      editingTarget: {
        memberId,
        memberName: member.name,
        type,
        currentRate: type === "billable" ? member.billableRate : member.costRate,
      },
    });
  },

  closeEditRateModal: () => set({ editingTarget: null }),

  updateRate: async (memberId, type, newRate, applyToExisting = false) => {
    const member = get().members.find((m) => m.id === memberId);
    const memberName = member ? member.name : "Member";

    set((state) => ({
      members: state.members.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            [type === "billable" ? "billableRate" : "costRate"]: newRate,
          };
        }
        return m;
      }),
      editingTarget: null,
      toastMessage: `Updated ${type} rate for ${memberName} to ${
        newRate !== null ? `$${newRate.toFixed(2)}/h` : "default"
      }${applyToExisting ? " (applied to existing entries)" : ""}`,
    }));

    try {
      if (newRate !== null) {
        await rateApi.setRate({
          member_id: memberId,
          rate_type: type,
          rate_value: newRate,
          currency: "USD",
          apply_to_existing: applyToExisting,
        });
      }
    } catch (e) {
      console.warn("Backend sync note for rate update:", e);
    }
  },

  setToastMessage: (toastMessage) => set({ toastMessage }),

  resetToDefaults: () => {
    set({
      members: INITIAL_MEMBERS,
      toastMessage: "Reset rates to default sample rates",
    });
  },
}));
