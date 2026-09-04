import { create } from "zustand";

export interface KioskDevice {
    id: string;
    name: string;
    assignees: string[];
    defaultProject: string;
    defaultBreakProject: string;
    logoutAfterHours: number;
    authRequired: boolean;
    location: string;
    deviceIp: string;
    todayCheckIns: number;
    status: "ONLINE" | "OFFLINE";
    createdAt: Date;
}

export interface AttendanceRecord {
    id: string;
    kioskId: string;
    kioskName: string;
    userName: string;
    action: "CLOCK_IN" | "START_BREAK" | "END_BREAK" | "CLOCK_OUT";
    timestamp: Date;
}

interface KioskState {
    kiosks: KioskDevice[];
    isCreateModalOpen: boolean;
    activeTerminalKioskId: string | null;
    terminalPin: string;
    terminalUser: string | null;
    terminalStatus: "IDLE" | "AUTHENTICATED" | "SUCCESS";
    successMessage: string | null;
    records: AttendanceRecord[];

    // Actions
    openCreateModal: () => void;
    closeCreateModal: () => void;
    createKiosk: (params: {
        name: string;
        assignees: string[];
        defaultProject: string;
        defaultBreakProject: string;
        logoutAfterHours: number;
        authRequired: boolean;
    }) => void;
    deleteKiosk: (id: string) => void;
    launchTerminal: (id: string) => void;
    closeTerminal: () => void;
    enterTerminalDigit: (digit: string) => void;
    clearTerminalPin: () => void;
    submitTerminalPin: () => void;
    recordAttendance: (action: "CLOCK_IN" | "START_BREAK" | "CLOCK_OUT") => void;
    resetTerminal: () => void;
}

export const useKioskStore = create<KioskState>((set, get) => ({
    kiosks: [],
    isCreateModalOpen: false,
    activeTerminalKioskId: null,
    terminalPin: "",
    terminalUser: null,
    terminalStatus: "IDLE",
    successMessage: null,
    records: [],

    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),

    createKiosk: (params) => {
        const newKiosk: KioskDevice = {
            id: `kiosk-${Date.now()}`,
            name: params.name,
            assignees: params.assignees.length > 0 ? params.assignees : ["All Members"],
            defaultProject: params.defaultProject || "Internal Work",
            defaultBreakProject: params.defaultBreakProject || "Break",
            logoutAfterHours: params.logoutAfterHours || 24,
            authRequired: params.authRequired,
            location: "Reception / Office Main Entrance",
            deviceIp: `192.168.1.${Math.floor(Math.random() * 150 + 100)}`,
            todayCheckIns: 0,
            status: "ONLINE",
            createdAt: new Date(),
        };

        set((state) => ({
            kiosks: [newKiosk, ...state.kiosks],
            isCreateModalOpen: false,
        }));
    },

    deleteKiosk: (id) =>
        set((state) => ({
            kiosks: state.kiosks.filter((k) => k.id !== id),
            activeTerminalKioskId:
                state.activeTerminalKioskId === id ? null : state.activeTerminalKioskId,
        })),

    launchTerminal: (id) =>
        set({
            activeTerminalKioskId: id,
            terminalPin: "",
            terminalUser: null,
            terminalStatus: "IDLE",
            successMessage: null,
        }),

    closeTerminal: () =>
        set({
            activeTerminalKioskId: null,
            terminalPin: "",
            terminalUser: null,
            terminalStatus: "IDLE",
            successMessage: null,
        }),

    enterTerminalDigit: (digit) => {
        const { terminalPin, terminalStatus } = get();
        if (terminalStatus === "SUCCESS") return;
        if (terminalPin.length < 4) {
            const nextPin = terminalPin + digit;
            set({ terminalPin: nextPin });

            // Automatically verify when 4 digits reached
            if (nextPin.length === 4) {
                setTimeout(() => {
                    get().submitTerminalPin();
                }, 200);
            }
        }
    },

    clearTerminalPin: () => set({ terminalPin: "", terminalStatus: "IDLE" }),

    submitTerminalPin: () => {
        const { terminalPin } = get();
        if (terminalPin.length !== 4) return;

        // Any 4 digit pin authenticates a member for demonstration
        const sampleMembers = [
            "Bindhu Shree",
            "Likith D T",
            "Amy Smith",
            "James Anderson",
            "Lara Peterson",
        ];
        const randomMember =
            sampleMembers[Math.floor(Math.random() * sampleMembers.length)];

        set({
            terminalStatus: "AUTHENTICATED",
            terminalUser: randomMember,
        });
    },

    recordAttendance: (action) => {
        const { activeTerminalKioskId, kiosks, terminalUser } = get();
        const kiosk = kiosks.find((k) => k.id === activeTerminalKioskId);
        const userName = terminalUser || "Member";

        const newRecord: AttendanceRecord = {
            id: `rec-${Date.now()}`,
            kioskId: activeTerminalKioskId || "kiosk-default",
            kioskName: kiosk?.name || "Kiosk Station",
            userName,
            action,
            timestamp: new Date(),
        };

        const actionText =
            action === "CLOCK_IN"
                ? "Clocked In successfully"
                : action === "START_BREAK"
                ? "Break started"
                : "Clocked Out successfully";

        set((state) => ({
            records: [newRecord, ...state.records],
            terminalStatus: "SUCCESS",
            successMessage: `${userName} - ${actionText}`,
            kiosks: state.kiosks.map((k) =>
                k.id === activeTerminalKioskId
                    ? { ...k, todayCheckIns: k.todayCheckIns + 1 }
                    : k
            ),
        }));

        setTimeout(() => {
            get().resetTerminal();
        }, 2200);
    },

    resetTerminal: () =>
        set({
            terminalPin: "",
            terminalUser: null,
            terminalStatus: "IDLE",
            successMessage: null,
        }),
}));
