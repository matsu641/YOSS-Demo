import {
  mockActions,
  mockFlags,
  mockMeetings,
  mockRecords,
  mockResources,
  mockScreenings,
  mockStaff,
  mockStudents,
  screeningDefinitions,
} from "@/data/mock";
import type { ActionFilters, StudentFilters, SupportAction } from "@/types";
import { today } from "@/lib/utils";
export const isOverdue = (a: SupportAction) =>
  !!a.dueDate && a.dueDate < today && a.status !== "completed";
export const repositories = {
  students: {
    async getAll(f: StudentFilters = {}) {
      return mockStudents.filter(
        (s) =>
          (!f.grade || s.grade === f.grade) &&
          (!f.className || s.className === f.className) &&
          (!f.direction || s.supportDirections.includes(f.direction)) &&
          (!f.name || s.name.includes(f.name)) &&
          (!f.preset || f.preset !== "team" || s.teamMeetingRequired) &&
          (!f.actionStatus ||
            mockActions.some((a) => a.studentId === s.id && isOverdue(a))),
      );
    },
    async getById(id: string) {
      return mockStudents.find((s) => s.id === id) ?? null;
    },
  },
  actions: {
    async getAll(f: ActionFilters = {}) {
      return mockActions.filter(
        (a) =>
          (!f.status ||
            (f.status === "overdue" ? isOverdue(a) : a.status === f.status)) &&
          (!f.priority || a.priority === f.priority) &&
          (!f.direction || a.direction === f.direction),
      );
    },
  },
  records: {
    async getAll(id?: string) {
      return id ? mockRecords.filter((r) => r.studentId === id) : mockRecords;
    },
  },
  reference: {
    async getStaff() {
      return mockStaff;
    },
    async getFlags() {
      return mockFlags;
    },
    async getResources() {
      return mockResources;
    },
    async getMeetings(id?: string) {
      return id ? mockMeetings.filter((m) => m.studentId === id) : mockMeetings;
    },
    async getScreenings(id?: string) {
      return id
        ? mockScreenings.filter((s) => s.studentId === id)
        : mockScreenings;
    },
    async getScreeningDefinitions() {
      return screeningDefinitions;
    },
  },
};
