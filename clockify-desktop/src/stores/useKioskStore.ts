import { create } from "zustand";
import { kioskApi } from "@/lib/kioskApi";

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
    isLoading: boolean;

    // Actions
    loadFromBackend: () => Promise<void>;
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
    isLoading: false,

    loadFromBackend: async () => {
        set({ isLoading: true });
        try {
            const list = await kioskApi.listKiosks();
            if (list && list.length > 0) {
                const mapped: KioskDevice[] = list.map((k) => ({
                    id: k.id,
                    name: k.name,
                    assignees: k.assignees,
                    defaultProject: k.default_project,
                    defaultBreakProject: k.default_break_project,
                    logoutAfterHours: k.logout_after_hours,
                    authRequired: k.auth_required,
                    location: k.location,
                    deviceIp: k.device_ip,
                    todayCheckIns: k.today_check_ins,
                    status: k.status,
                    createdAt: new Date(k.created_at),
                }));
                set({ kiosks: mapped });
            }

            const recs = await kioskApi.listAttendanceRecords();
            if (recs && recs.length > 0) {
                const mappedRecs: AttendanceRecord[] = recs.map((r) => ({
                    id: r.id,
                    kioskId: r.kiosk_id,
                    kioskName: r.kiosk_name,
                    userName: r.user_name,
                    action: r.action,
                    timestamp: new Date(r.timestamp),
                }));
                set({ records: mappedRecs });
            }
            set({ isLoading: false });
        } catch (e) {
            console.warn("Could not load kiosks from backend:", e);
            set({ isLoading: false });
        }
    },

    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),

    createKiosk: (params) => {
        const id = `kiosk-${Date.now()}`;
        const newKiosk: KioskDevice = {
            id,
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

        kioskApi.createKiosk({
            name: params.name,
            assignees: params.assignees,
            default_project: params.defaultProject,
            default_break_project: params.defaultBreakProject,
            logout_after_hours: params.logoutAfterHours,
            auth_required: params.authRequired,
        }).catch(console.error);
    },

    deleteKiosk: (id) => {
        set((state) => ({
            kiosks: state.kiosks.filter((k) => k.id !== id),
            activeTerminalKioskId:
                state.activeTerminalKioskId === id ? null : state.activeTerminalKioskId,
        }));
        kioskApi.deleteKiosk(id).catch(console.error);
    },

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

            if (nextPin.length === 4) {
                setTimeout(() => {
                    get().submitTerminalPin();
                }, 200);
            }
        }
    },

    clearTerminalPin: () => set({ terminalPin: "", terminalStatus: "IDLE" }),

    submitTerminalPin: async () => {
        const { terminalPin, activeTerminalKioskId } = get();
        if (terminalPin.length !== 4) return;

        try {
            if (activeTerminalKioskId) {
                const res = await kioskApi.verifyPin(activeTerminalKioskId, terminalPin);
                if (res.valid && res.userName) {
                    set({
                        terminalStatus: "AUTHENTICATED",
                        terminalUser: res.userName,
                    });
                    return;
                }
            }
        } catch (e) {
            console.warn("Backend pin verification fallback:", e);
        }

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
        const { activeTerminalKioskId, kiosks, terminalUser, terminalPin } = get();
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

        if (activeTerminalKioskId) {
            kioskApi.recordAttendance({
                kiosk_id: activeTerminalKioskId,
                user_name: userName,
                action,
                pin_code: terminalPin,
            }).catch(console.error);
        }

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
