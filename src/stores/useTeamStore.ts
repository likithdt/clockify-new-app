import { create } from "zustand";

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    billableRate: number | null;
    costRate: number | null;
    currency: string;
    role: "Owner" | "Admin" | "Project manager" | "Team manager" | "Member";
    group: string | null;
    status: "Active" | "Inactive" | "Invited";
    isCurrentUser?: boolean;
}

export type TeamTab = "FULL" | "LIMITED" | "GROUPS" | "REMINDERS";

export interface RateFilter {
    exactly: string;
    smallerThan: string;
    largerThan: string;
}

interface TeamState {
    members: TeamMember[];
    activeTab: TeamTab;
    statusFilter: "All" | "Active" | "Inactive" | "Invited";
    billableRateFilter: RateFilter;
    costRateFilter: RateFilter;
    selectedRoles: string[];
    selectedGroup: string;
    searchQuery: string;
    selectedMemberIds: string[];
    visibleFields: {
        billableRate: boolean;
        costRate: boolean;
        role: boolean;
        group: boolean;
        weekStart: boolean;
        workingDays: boolean;
        dailyWorkCapacity: boolean;
    };

    // Modals
    isAddMemberOpen: boolean;
    editingRate: {
        memberId: string;
        memberName: string;
        type: "billable" | "cost";
        currentRate: number | null;
    } | null;
    toastMessage: string | null;

    // Actions
    setActiveTab: (tab: TeamTab) => void;
    setStatusFilter: (status: "All" | "Active" | "Inactive" | "Invited") => void;
    setBillableRateFilter: (filter: Partial<RateFilter>) => void;
    setCostRateFilter: (filter: Partial<RateFilter>) => void;
    toggleRoleFilter: (role: string) => void;
    selectAllRoles: (roles: string[]) => void;
    clearRoleFilter: () => void;
    setSelectedGroup: (group: string) => void;
    setSearchQuery: (query: string) => void;
    toggleSelectMember: (id: string) => void;
    selectAllMembers: () => void;
    clearMemberSelection: () => void;
    toggleVisibleField: (field: keyof TeamState["visibleFields"]) => void;

    setAddMemberOpen: (open: boolean) => void;
    setEditingRate: (data: TeamState["editingRate"]) => void;
    updateRate: (memberId: string, type: "billable" | "cost", newRate: number | null) => void;
    addMembers: (emails: string[]) => void;
    updateMemberRole: (memberId: string, role: TeamMember["role"]) => void;
    deleteMember: (id: string) => void;
    setToastMessage: (msg: string | null) => void;
    resetSampleTeam: () => void;
}

const initialMembers: TeamMember[] = [
    {
        id: "tm-1",
        name: "[SAMPLE] Amy Smith",
        email: "amy.smith1b1753f297a01cbb@clockify.me",
        billableRate: null,
        costRate: 15,
        currency: "USD",
        role: "Project manager",
        group: null,
        status: "Active",
    },
    {
        id: "tm-2",
        name: "[SAMPLE] James Anderson",
        email: "james.anderson36d56b7f7df036@clockify.me",
        billableRate: null,
        costRate: 5,
        currency: "USD",
        role: "Member",
        group: null,
        status: "Active",
    },
    {
        id: "tm-3",
        name: "[SAMPLE] Lara Peterson",
        email: "lara.peterson03af321182e80532@clockify.me",
        billableRate: null,
        costRate: 10,
        currency: "USD",
        role: "Team manager",
        group: null,
        status: "Active",
    },
    {
        id: "tm-4",
        name: "[SAMPLE] Mike Johnson",
        email: "mike.johnson22b7a3ff4c176cbc@clockify.me",
        billableRate: null,
        costRate: 10,
        currency: "USD",
        role: "Member",
        group: null,
        status: "Active",
    },
    {
        id: "tm-5",
        name: "Bindhu shree (you)",
        email: "sbindhu230@gmail.com",
        billableRate: null,
        costRate: null,
        currency: "USD",
        role: "Owner",
        group: null,
        status: "Active",
        isCurrentUser: true,
    },
];

export const useTeamStore = create<TeamState>((set, get) => ({
    members: initialMembers,
    activeTab: "FULL",
    statusFilter: "All",
    billableRateFilter: { exactly: "", smallerThan: "", largerThan: "" },
    costRateFilter: { exactly: "", smallerThan: "", largerThan: "" },
    selectedRoles: [],
    selectedGroup: "all",
    searchQuery: "",
    selectedMemberIds: [],
    visibleFields: {
        billableRate: true,
        costRate: true,
        role: true,
        group: true,
        weekStart: false,
        workingDays: false,
        dailyWorkCapacity: false,
    },

    isAddMemberOpen: false,
    editingRate: null,
    toastMessage: null,

    setActiveTab: (tab) => set({ activeTab: tab }),
    setStatusFilter: (status) => set({ statusFilter: status }),

    setBillableRateFilter: (filter) =>
        set((state) => ({
            billableRateFilter: { ...state.billableRateFilter, ...filter },
        })),

    setCostRateFilter: (filter) =>
        set((state) => ({
            costRateFilter: { ...state.costRateFilter, ...filter },
        })),

    toggleRoleFilter: (role) =>
        set((state) => {
            if (state.selectedRoles.includes(role)) {
                return { selectedRoles: state.selectedRoles.filter((r) => r !== role) };
            } else {
                return { selectedRoles: [...state.selectedRoles, role] };
            }
        }),

    selectAllRoles: (roles) => set({ selectedRoles: roles }),
    clearRoleFilter: () => set({ selectedRoles: [] }),

    setSelectedGroup: (group) => set({ selectedGroup: group }),
    setSearchQuery: (query) => set({ searchQuery: query }),

    toggleSelectMember: (id) =>
        set((state) => {
            if (state.selectedMemberIds.includes(id)) {
                return { selectedMemberIds: state.selectedMemberIds.filter((m) => m !== id) };
            } else {
                return { selectedMemberIds: [...state.selectedMemberIds, id] };
            }
        }),

    selectAllMembers: () => {
        const { members, selectedMemberIds } = get();
        if (selectedMemberIds.length === members.length) {
            set({ selectedMemberIds: [] });
        } else {
            set({ selectedMemberIds: members.map((m) => m.id) });
        }
    },

    clearMemberSelection: () => set({ selectedMemberIds: [] }),

    toggleVisibleField: (field) =>
        set((state) => ({
            visibleFields: {
                ...state.visibleFields,
                [field]: !state.visibleFields[field],
            },
        })),

    setAddMemberOpen: (open) => set({ isAddMemberOpen: open }),
    setEditingRate: (data) => set({ editingRate: data }),

    updateRate: (memberId, type, newRate) => {
        set((state) => ({
            members: state.members.map((m) => {
                if (m.id === memberId) {
                    return type === "billable"
                        ? { ...m, billableRate: newRate }
                        : { ...m, costRate: newRate };
                }
                return m;
            }),
            editingRate: null,
            toastMessage: `${type === "billable" ? "Billable" : "Cost"} rate updated successfully.`,
        }));
    },

    addMembers: (emails) => {
        const newMembers: TeamMember[] = emails.map((email, idx) => ({
            id: `tm-${Date.now()}-${idx}`,
            name: email.split("@")[0],
            email,
            billableRate: null,
            costRate: null,
            currency: "USD",
            role: "Member",
            group: null,
            status: "Invited",
        }));

        set((state) => ({
            members: [...state.members, ...newMembers],
            isAddMemberOpen: false,
            toastMessage: `${emails.length} invitation(s) sent successfully.`,
        }));
    },

    updateMemberRole: (memberId, role) => {
        set((state) => ({
            members: state.members.map((m) =>
                m.id === memberId ? { ...m, role } : m
            ),
            toastMessage: `Role updated to ${role}.`,
        }));
    },

    deleteMember: (id) => {
        set((state) => ({
            members: state.members.filter((m) => m.id !== id),
            toastMessage: `Team member removed.`,
        }));
    },

    setToastMessage: (msg) => set({ toastMessage: msg }),

    resetSampleTeam: () => {
        set({
            members: initialMembers,
            selectedMemberIds: [],
            toastMessage: `Sample team members reset.`,
        });
    },
}));
