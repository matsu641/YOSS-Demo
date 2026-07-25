import type {
  InternalFlag,
  MeetingRecord,
  RegionalResource,
  ScreeningItemDefinition,
  ScreeningResponse,
  ScreeningSession,
  Staff,
  Student,
  SupportAction,
  SupportDirection,
  SupportRecord,
} from "@/types";
import { screeningCategories } from "@/config";
const sur = [
    "青空",
    "朝比奈",
    "石森",
    "海野",
    "大庭",
    "風間",
    "北原",
    "久遠",
    "小森",
    "桜庭",
    "白波",
    "瀬戸",
    "高峰",
    "月島",
    "時任",
    "夏目",
    "西園",
    "野原",
    "葉山",
    "星川",
    "水城",
    "森下",
    "八雲",
    "雪村",
    "若葉",
    "橘",
    "藤代",
    "七瀬",
    "真白",
    "一ノ瀬",
    "深山",
    "小鳥遊",
    "天城",
    "瑞樹",
    "柊",
    "綾瀬",
  ],
  given = [
    "あおい",
    "伊織",
    "かなで",
    "樹",
    "光",
    "澪",
    "凪",
    "結",
    "蓮",
    "紬",
    "碧",
    "湊",
    "楓",
    "陽",
    "翼",
    "鈴",
    "悠",
    "泉",
    "旭",
    "空",
    "奏",
    "渚",
    "葵",
    "律",
    "望",
    "歩",
    "遥",
    "響",
    "薫",
    "新",
    "忍",
    "環",
    "直",
    "晴",
    "希",
    "晶",
  ];
const dirs: SupportDirection[][] = [
  [],
  ["A"],
  ["B"],
  ["C"],
  ["A", "B"],
  ["A", "B", "C"],
];
export const mockStudents: Student[] = sur.map((n, i) => ({
  id: `student-${i + 1}`,
  studentCode: `D-${String(i + 1).padStart(3, "0")}`,
  name: `${n} ${given[i]}`,
  nameKana: `デモセイト ${i + 1}`,
  grade: Math.floor(i / 6) + 1,
  className: String((i % 3) + 1),
  attendanceNumber: (i % 6) + 1,
  supportDirections: dirs[i % 6] ?? [],
  internalFlagIds:
    i % 5 === 0 ? ["flag-1", "flag-3"] : i % 3 === 0 ? ["flag-2"] : [],
  latestScreeningScore: i % 11 === 0 ? null : 8 + ((i * 3) % 28),
  previousScreeningScore: i % 11 === 0 ? null : 10 + ((i * 2) % 25),
  nextReviewDate:
    i % 4 === 0
      ? "2026-07-10"
      : `2026-08-${String((i % 20) + 1).padStart(2, "0")}`,
  teamMeetingRequired: i % 4 === 0 || i % 7 === 0,
  assignedTeacherId: `staff-${(i % 6) + 1}`,
  lastUpdatedAt: `2026-07-${String(22 - (i % 18)).padStart(2, "0")}T09:00:00+09:00`,
}));
const staffRows = [
  ["山田 管理職", "manager"],
  ["春野 担任", "homeroom-teacher"],
  ["夏川 養護", "school-nurse"],
  ["秋月 支援", "special-support"],
  ["冬木 指導", "student-guidance"],
  ["空井 担任", "homeroom-teacher"],
  ["森野 事務", "office"],
  ["川瀬 SSW", "social-worker"],
  ["星野 SC", "counselor"],
  ["海堂 担任", "homeroom-teacher"],
] as const;
export const mockStaff: Staff[] = staffRows.map((x, i) => ({
  id: `staff-${i + 1}`,
  name: x[0],
  role: x[1],
  avatarInitials: x[0].slice(0, 2),
}));
const recTypes = [
  "observation",
  "interview",
  "parent-contact",
  "external-contact",
  "other",
] as const;
export const mockRecords: SupportRecord[] = Array.from(
  { length: 72 },
  (_, i) => ({
    id: `record-${i + 1}`,
    studentId: `student-${(i % 36) + 1}`,
    type: recTypes[i % 5]!,
    title: [
      "日常の様子を確認",
      "本人との面談",
      "保護者へ連絡",
      "関係者と情報共有",
    ][i % 4]!,
    content:
      i % 9 === 0
        ? "休み時間と授業中の様子を継続して確認した。観察した事実と未確認の推測を分け、次回の確認事項を整理した。"
        : "本人の様子を確認し、次回確認する内容を整理しました。",
    occurredAt: `2026-07-${String(22 - (i % 20)).padStart(2, "0")}T10:00:00+09:00`,
    createdBy: `staff-${(i % 10) + 1}`,
    updatedAt: `2026-07-${String(22 - (i % 20)).padStart(2, "0")}T11:00:00+09:00`,
    tags: i % 2 === 0 ? ["定期確認"] : ["情報共有"],
  }),
);
const sts = [
  "not-started",
  "in-progress",
  "completed",
  "on-hold",
  "needs-review",
] as const;
export const mockActions: SupportAction[] = Array.from(
  { length: 42 },
  (_, i) => ({
    id: `action-${i + 1}`,
    studentId: `student-${(i % 34) + 1}`,
    title: [
      "週1回の面談を行う",
      "学習状況を確認する",
      "保護者と情報を共有する",
      "養護教諭が定期確認する",
      "地域の居場所を案内する",
    ][i % 5]!,
    description: "会議で決定した支援を実施し、経過を記録します。",
    direction: (["A", "B", "C"] as const)[i % 3]!,
    assigneeId: i % 8 === 0 ? null : `staff-${(i % 10) + 1}`,
    priority: (["high", "medium", "low"] as const)[i % 3]!,
    status: sts[i % 5]!,
    startDate: "2026-07-01",
    dueDate:
      i % 4 === 0
        ? "2026-07-15"
        : `2026-08-${String((i % 20) + 1).padStart(2, "0")}`,
    nextReviewDate: "2026-08-20",
    completedAt: i % 5 === 2 ? "2026-07-18" : null,
    resultNote: i % 10 === 2 ? "" : "実施状況を確認しました。",
    sourceMeetingId: i % 2 === 0 ? `meeting-${(i % 20) + 1}` : null,
    createdAt: "2026-07-01T09:00:00+09:00",
    updatedAt: "2026-07-20T09:00:00+09:00",
  }),
);
export const mockFlags: InternalFlag[] = [
  ["継続観察", "観", "日常の様子を継続確認", "blue"],
  ["保護者連携", "保", "保護者との連携が必要", "green"],
  ["欠席傾向", "欠", "欠席状況の確認が必要", "amber"],
  ["学習支援", "学", "学習面の支援を検討", "purple"],
  ["健康確認", "健", "健康面の確認が必要", "rose"],
  ["情報共有", "共", "関係教職員間で共有", "slate"],
].map((x, i) => ({
  id: `flag-${i + 1}`,
  name: x[0]!,
  shortLabel: x[1]!,
  description: x[2]!,
  colorToken: x[3]!,
  isVisible: true,
}));
export const screeningDefinitions: ScreeningItemDefinition[] =
  screeningCategories.flatMap((category) =>
    category.items.map((label, index) => ({
      id: `${category.id}-${index + 1}`,
      category: category.id,
      label,
      description: `${category.label}「${label}」について、観察した事実に基づいて確認してください`,
      maxScore: 2,
    })),
  );
export const mockScreenings: ScreeningSession[] = mockStudents.map((s, i) => {
  const responses: ScreeningResponse[] = screeningDefinitions.map((d, k) => ({
    itemId: d.id,
    score: (i + k) % 3,
    observedFact: k % 3 === 0 ? "授業中の様子を教職員が直接確認した。" : "",
    informationSource: "direct-observation",
    verificationStatus: "verified",
    note: "",
  }));
  return {
    id: `screen-${i + 1}`,
    studentId: s.id,
    academicYear: 2026,
    term: "1学期",
    meetingType: "screening",
    responses,
    sharedConcernNote:
      i % 5 === 0 ? "観察事実と未確認情報を分けて共有する。" : "",
    totalScore: responses.reduce(
      (total, response) => total + (response.score ?? 0),
      0,
    ),
    completedAt: i % 3 ? "2026-07-01" : null,
    updatedAt: s.lastUpdatedAt,
  };
});
export const mockMeetings: MeetingRecord[] = Array.from(
  { length: 24 },
  (_, i) => ({
    id: `meeting-${i + 1}`,
    studentId: `student-${(i % 18) + 1}`,
    type: i % 2 ? "school-team" : "screening",
    heldAt: `2026-07-${String((i % 20) + 1).padStart(2, "0")}`,
    privateMemo: "個人メモ（デモ）",
    sharedMemo: "観察事実を共有し次回の確認事項を決定しました。",
    teamMeetingDecision:
      i % 3 === 0 ? "refer" : i % 3 === 1 ? "do-not-refer" : "pending",
    selectedDirections: [(["A", "B", "C"] as const)[i % 3]!],
    selectedSupportOptions: ["定期確認"],
    createdActionIds: i < 20 ? [`action-${i + 1}`] : [],
    updatedAt: "2026-07-20",
  }),
);
const cats = [
  "学習支援",
  "子ども食堂",
  "居場所",
  "福祉相談",
  "医療",
  "行政",
  "その他",
];
export const mockResources: RegionalResource[] = Array.from(
  { length: 12 },
  (_, i) => ({
    id: `resource-${i + 1}`,
    name: `デモ地域支援センター ${i + 1}`,
    category: cats[i % 7]!,
    address: `デモ県みらい市架空町 ${i + 1}-${i + 2}`,
    phone: `000-0000-${1000 + i}`,
    openingHours: "平日 9:00〜17:00",
    description: "児童生徒と家庭を対象とした架空の地域資源です。",
    distanceFromSchoolKm: 0.4 + i * 0.3,
    supportedDirections: i % 2 ? ["B", "C"] : ["B"],
    mapPosition: { x: 12 + ((i * 17) % 76), y: 18 + ((i * 23) % 68) },
  }),
);
