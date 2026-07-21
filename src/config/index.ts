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
  "school-adaptation": "学校適応",
  learning: "学習",
  family: "家庭状況",
  development: "発達",
  health: "健康",
  economy: "経済",
  welfare: "福祉",
  community: "地域情報",
};
export const screeningCategories = [
  {
    id: "school-adaptation",
    label: "学校適応",
    items: [
      "転入",
      "不登校",
      "7日+",
      "遅刻",
      "服装",
      "言葉",
      "友人",
      "ケガ",
      "コロナ",
    ],
  },
  { id: "learning", label: "学習", items: ["学力", "授業", "宿題", "その他"] },
  {
    id: "family",
    label: "家庭状況",
    items: ["持ち物", "家庭", "連絡", "その他"],
  },
  { id: "development", label: "発達", items: ["支援学級", "来室", "その他"] },
  {
    id: "health",
    label: "健康",
    items: ["成長", "健康", "保健室", "発達診断", "その他"],
  },
  { id: "economy", label: "経済", items: ["要保護", "諸費", "その他"] },
  {
    id: "welfare",
    label: "福祉",
    items: ["SC/SSW", "要対協", "生指", "その他"],
  },
  {
    id: "community",
    label: "地域情報",
    items: [
      "学童",
      "食堂",
      "放課後",
      "家庭教育",
      "地域",
      "その他",
      "いじめ",
      "生活",
      "その他",
    ],
  },
] as const satisfies readonly {
  id: ScreeningCategory;
  label: string;
  items: readonly string[];
}[];
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
