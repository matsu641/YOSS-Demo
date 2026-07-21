import type {
  ActionPriority,
  ActionStatus,
  InformationSource,
  ScreeningCategory,
  SupportDirection,
  VerificationStatus,
} from "@/types";
export const directionConfig: Record<
  SupportDirection,
  { label: string; className: string }
> = {
  A: { label: "A 教職員関与", className: "direction-a" },
  B: { label: "B 地域資源", className: "direction-b" },
  C: { label: "C 専門機関", className: "direction-c" },
};
export const statusConfig: Record<
  ActionStatus,
  { label: string; className: string }
> = {
  "not-started": { label: "未着手", className: "status-neutral" },
  "in-progress": { label: "対応中", className: "status-info" },
  completed: { label: "完了", className: "status-success" },
  "on-hold": { label: "保留", className: "status-neutral" },
  "needs-review": { label: "要再確認", className: "status-review" },
};
export const priorityLabels: Record<ActionPriority, string> = {
  high: "高",
  medium: "中",
  low: "低",
};
export const categoryLabels: Record<ScreeningCategory, string> = {
  "school-life": "支援の現状",
  learning: "学級",
  family: "自由記述",
  "special-support": "特別支援",
  health: "養護",
  office: "事務",
  management: "管理職・生徒指導",
  community: "地域・調査",
  other: "その他・備考",
};
export const sourceLabels: Record<InformationSource, string> = {
  "direct-observation": "教職員が直接確認",
  student: "本人から聞き取り",
  guardian: "保護者から聞き取り",
  "other-student": "他の生徒からの情報",
  "external-organization": "外部機関からの情報",
  unconfirmed: "未確認",
};
export const verificationLabels: Record<VerificationStatus, string> = {
  verified: "確認済み",
  "partially-verified": "一部確認",
  unverified: "未確認",
};
export const SCREENING_SCORE_OPTIONS = [0, 1, 2] as const;
