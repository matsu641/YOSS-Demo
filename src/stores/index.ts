"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  mockActions,
  mockFlags,
  mockMeetings,
  mockRecords,
  mockScreenings,
  mockStudents,
} from "@/data/mock";
import type {
  InternalFlag,
  MeetingRecord,
  ScreeningResponse,
  Student,
  SupportAction,
  SupportRecord,
} from "@/types";
import { calculateScreeningTotal } from "@/lib/screening";
export const useStudentStore = create<{
  students: Student[];
  recentIds: string[];
  markRecent: (id: string) => void;
}>()(
  persist(
    (set) => ({
      students: mockStudents,
      recentIds: [],
      markRecent: (id) =>
        set((s) => ({
          recentIds: [id, ...s.recentIds.filter((x) => x !== id)].slice(0, 6),
        })),
    }),
    { name: "yoss-students" },
  ),
);
export const useActionStore = create<{
  actions: SupportAction[];
  addAction: (a: SupportAction) => void;
  updateAction: (id: string, p: Partial<SupportAction>) => void;
}>()(
  persist(
    (set) => ({
      actions: mockActions,
      addAction: (a) => set((s) => ({ actions: [a, ...s.actions] })),
      updateAction: (id, p) =>
        set((s) => ({
          actions: s.actions.map((a) =>
            a.id === id
              ? { ...a, ...p, updatedAt: new Date().toISOString() }
              : a,
          ),
        })),
    }),
    { name: "yoss-actions" },
  ),
);
export const useRecordStore = create<{
  records: SupportRecord[];
  addRecord: (r: SupportRecord) => void;
}>()(
  persist(
    (set) => ({
      records: mockRecords,
      addRecord: (r) => set((s) => ({ records: [r, ...s.records] })),
    }),
    { name: "yoss-records" },
  ),
);
export const useScreeningStore = create<{
  sessions: typeof mockScreenings;
  saveResponse: (id: string, r: ScreeningResponse) => void;
  saveConcern: (id: string, n: string) => void;
}>()(
  persist(
    (set) => ({
      sessions: mockScreenings,
      saveResponse: (id, r) =>
        set((s) => ({
          sessions: s.sessions.map((x) =>
            x.studentId === id &&
            (!x.evaluatorId || x.evaluatorId === "staff-1")
              ? {
                  ...x,
                  responses: [
                    ...x.responses.filter((q) => q.itemId !== r.itemId),
                    r,
                  ],
                  totalScore:
                    calculateScreeningTotal({
                      responses: [
                        ...x.responses.filter((q) => q.itemId !== r.itemId),
                        r,
                      ],
                    }) ?? 0,
                }
              : x,
          ),
        })),
      saveConcern: (id, n) =>
        set((s) => ({
          sessions: s.sessions.map((x) =>
            x.studentId === id &&
            (!x.evaluatorId || x.evaluatorId === "staff-1")
              ? { ...x, sharedConcernNote: n }
              : x,
          ),
        })),
    }),
    { name: "yoss-screenings" },
  ),
);
export const useMeetingStore = create<{
  meetings: MeetingRecord[];
  updateMeeting: (id: string, p: Partial<MeetingRecord>) => void;
}>()(
  persist(
    (set) => ({
      meetings: mockMeetings,
      updateMeeting: (id, p) =>
        set((s) => ({
          meetings: s.meetings.map((m) =>
            m.studentId === id ? { ...m, ...p } : m,
          ),
        })),
    }),
    { name: "yoss-meetings" },
  ),
);
export const useFlagStore = create<{
  flags: InternalFlag[];
  saveFlag: (f: InternalFlag) => void;
  deleteFlag: (id: string) => void;
}>()(
  persist(
    (set) => ({
      flags: mockFlags,
      saveFlag: (f) =>
        set((s) => ({
          flags: s.flags.some((x) => x.id === f.id)
            ? s.flags.map((x) => (x.id === f.id ? f : x))
            : [...s.flags, f],
        })),
      deleteFlag: (id) =>
        set((s) => ({ flags: s.flags.filter((f) => f.id !== id) })),
    }),
    { name: "yoss-flags" },
  ),
);
type Toast = { id: number; message: string };
export const useUiStore = create<{
  sidebarOpen: boolean;
  toasts: Toast[];
  toggleSidebar: () => void;
  toast: (m: string) => void;
  dismiss: (id: number) => void;
  reset: () => void;
}>((set) => ({
  sidebarOpen: false,
  toasts: [],
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toast: (m) =>
    set((s) => ({
      toasts: [...s.toasts, { id: s.toasts.length + 1, message: m }],
    })),
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  reset: () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("yoss-"))
      .forEach((k) => localStorage.removeItem(k));
    location.assign("/dashboard");
  },
}));
