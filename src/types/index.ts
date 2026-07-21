export type SupportDirection = "A" | "B" | "C";
export type ActionStatus =
  "not-started" | "in-progress" | "completed" | "on-hold" | "needs-review";
export type ActionPriority = "high" | "medium" | "low";
export interface Student {
  id: string;
  studentCode: string;
  name: string;
  nameKana: string;
  grade: number;
  className: string;
  attendanceNumber: number;
  supportDirections: SupportDirection[];
  internalFlagIds: string[];
  latestScreeningScore: number | null;
  previousScreeningScore: number | null;
  nextReviewDate: string | null;
  teamMeetingRequired: boolean;
  assignedTeacherId: string;
  lastUpdatedAt: string;
}
export interface Staff {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
}
export interface SupportRecord {
  id: string;
  studentId: string;
  type:
    | "observation"
    | "interview"
    | "parent-contact"
    | "external-contact"
    | "other";
  title: string;
  content: string;
  occurredAt: string;
  createdBy: string;
  updatedAt: string;
  tags: string[];
}
export interface SupportAction {
  id: string;
  studentId: string;
  title: string;
  description: string;
  direction: SupportDirection;
  assigneeId: string | null;
  priority: ActionPriority;
  status: ActionStatus;
  startDate: string | null;
  dueDate: string | null;
  nextReviewDate: string | null;
  completedAt: string | null;
  resultNote: string;
  sourceMeetingId: string | null;
  createdAt: string;
  updatedAt: string;
}
export type ScreeningCategory =
  | "school-adaptation"
  | "learning"
  | "family"
  | "development"
  | "health"
  | "economy"
  | "welfare"
  | "community";
export type InformationSource =
  | "direct-observation"
  | "student"
  | "guardian"
  | "other-student"
  | "external-organization"
  | "unconfirmed";
export type VerificationStatus =
  "verified" | "partially-verified" | "unverified";
export interface ScreeningItemDefinition {
  id: string;
  category: ScreeningCategory;
  label: string;
  description: string;
  maxScore: number;
}
export interface ScreeningResponse {
  itemId: string;
  score: number | null;
  observedFact: string;
  informationSource: InformationSource | null;
  verificationStatus: VerificationStatus | null;
  note: string;
}
export interface ScreeningSession {
  id: string;
  studentId: string;
  academicYear: number;
  term: string;
  meetingType: string;
  responses: ScreeningResponse[];
  sharedConcernNote: string;
  totalScore: number;
  completedAt: string | null;
  updatedAt: string;
}
export interface MeetingRecord {
  id: string;
  studentId: string;
  type: "screening" | "school-team";
  heldAt: string;
  privateMemo: string;
  sharedMemo: string;
  teamMeetingDecision: "refer" | "do-not-refer" | "pending" | null;
  selectedDirections: SupportDirection[];
  selectedSupportOptions: string[];
  createdActionIds: string[];
  updatedAt: string;
}
export interface InternalFlag {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  colorToken: string;
  isVisible: boolean;
}
export interface RegionalResource {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  openingHours: string;
  description: string;
  distanceFromSchoolKm: number;
  supportedDirections: SupportDirection[];
  mapPosition: { x: number; y: number };
}
export interface StudentFilters {
  grade?: number;
  className?: string;
  direction?: SupportDirection;
  actionStatus?: string;
  name?: string;
  preset?: string;
}
export interface ActionFilters {
  status?: ActionStatus | "overdue";
  priority?: ActionPriority;
  assignee?: string;
  grade?: number;
  direction?: SupportDirection;
  studentName?: string;
}
