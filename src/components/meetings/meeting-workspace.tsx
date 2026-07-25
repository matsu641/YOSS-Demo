"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Button,
  Card,
  DirectionBadge,
  Input,
  Select,
  Tabs,
  Textarea,
} from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { ScreeningScoreTable } from "@/components/screening/screening-score-table";
import { MeetingSearchFilters } from "@/components/meetings/meeting-search-filters";
import {
  useActionStore,
  useMeetingStore,
  useRecordStore,
  useScreeningStore,
  useUiStore,
} from "@/stores";
import { screeningCategories } from "@/config";
import type { Staff, Student, SupportDirection } from "@/types";
const supports: {
  direction: SupportDirection;
  label: string;
  options: string[];
}[] = [
  {
    direction: "A",
    label: "教職員関与",
    options: [
      "担任のアプローチ",
      "生徒指導や児童生徒支援のアプローチ",
      "養護教諭のアプローチ",
      "特別支援担当のアプローチ",
      "学年団のアプローチ",
      "SSWを活用したアプローチ",
      "SCを活用したアプローチ",
      "その他",
    ],
  },
  {
    direction: "B",
    label: "地域資源の活用",
    options: [
      "家庭教育支援の活用",
      "学習支援の活用",
      "居場所、こども食堂の活用",
      "単発の事業活用",
      "地域人材の活用",
      "学童保育の活用",
      "地域の福祉サービスの活用（放課後デイ等）",
      "その他",
    ],
  },
  {
    direction: "C",
    label: "専門機関の活用",
    options: [
      "家庭児童相談室・児童相談所の活用",
      "少年サポートセンターの活用",
      "教育センターの活用",
      "福祉制度（生活保護、母子相談等）の活用",
      "その他",
    ],
  },
];
export function MeetingWorkspace({
  students,
  staff,
  mode,
}: {
  students: Student[];
  staff: Staff[];
  mode: "screening" | "team";
}) {
  const [id, setId] = useState(students[0]?.id ?? ""),
    [tab, setTab] = useState("summary"),
    [decision, setDecision] = useState("pending"),
    [directions, setDirections] = useState<SupportDirection[]>([]),
    [options, setOptions] = useState<string[]>([]),
    [supportStates, setSupportStates] = useState<
      Record<string, "new" | "continue" | "reject">
    >({}),
    [privateMemo, setPrivate] = useState(""),
    [sharedMemo, setShared] = useState(""),
    [actionTitle, setActionTitle] = useState(""),
    [assignee, setAssignee] = useState(""),
    [due, setDue] = useState("");
  const actions = useActionStore((s) => s.actions),
    add = useActionStore((s) => s.addAction),
    records = useRecordStore((s) => s.records),
    sessions = useScreeningStore((s) => s.sessions),
    updateMeeting = useMeetingStore((s) => s.updateMeeting),
    toast = useUiStore((s) => s.toast),
    student = students.find((s) => s.id === id) ?? students[0],
    session = sessions.find((s) => s.studentId === student?.id);
  if (!student) return null;
  const studentRecords = records
    .filter((record) => record.studentId === student.id)
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  const scoreByItem = new Map(
    session?.responses.map((response) => [
      response.itemId,
      response.score ?? 0,
    ]) ?? [],
  );
  const categoryScores = screeningCategories.map((category) => ({
    label: category.label,
    score: category.items.reduce(
      (total, _item, index) =>
        total + (scoreByItem.get(`${category.id}-${index + 1}`) ?? 0),
      0,
    ),
    maxScore: category.items.length * 2,
  }));
  const highestCategoryScore = Math.max(
    0,
    ...categoryScores.map(({ score }) => score),
  );
  const calculatedScreeningScore = session
    ? categoryScores.reduce((total, { score }) => total + score, 0)
    : null;
  const notableCategories = categoryScores
    .filter(({ score }) => score > 0 && score === highestCategoryScore)
    .map(({ label, score }) => `${label}（${score}点）`);
  const saveAll = () => {
    updateMeeting(student.id, {
      teamMeetingDecision: decision as "refer" | "do-not-refer" | "pending",
      selectedDirections: directions,
      selectedSupportOptions: options,
      privateMemo,
      sharedMemo,
    });
    toast("会議内容を仮保存しました");
  };
  const createAction = () => {
    if (!actionTitle || !assignee || !due || !directions[0]) {
      toast("アクション内容・担当者・期限・支援方向を入力してください");
      return;
    }
    const now = new Date().toISOString();
    add({
      id: `action-${Date.now()}`,
      studentId: student.id,
      title: actionTitle,
      description: "会議中に作成",
      direction: directions[0],
      assigneeId: assignee,
      priority: "medium",
      status: "not-started",
      startDate: null,
      dueDate: due,
      nextReviewDate: null,
      completedAt: null,
      resultNote: "",
      sourceMeetingId: null,
      createdAt: now,
      updatedAt: now,
    });
    setActionTitle("");
    toast("アクションを作成しました");
  };
  const selectSupportState = (
    direction: SupportDirection,
    option: string,
    state: "new" | "continue" | "reject",
  ) => {
    setSupportStates((current) => ({ ...current, [option]: state }));
    setDirections((current) =>
      current.includes(direction) ? current : [...current, direction],
    );
    setOptions((current) =>
      state === "reject"
        ? current.filter((item) => item !== option)
        : current.includes(option)
          ? current
          : [...current, option],
    );
    if (state !== "reject") setActionTitle(option);
  };
  return (
    <>
      <MeetingSearchFilters
        students={students}
        staff={staff}
        selectedId={id}
        onStudentChange={setId}
      />
      {mode === "team" && (
        <section className="support-direction-section section">
          <div className="support-direction-title">
            <span aria-hidden="true">🙂</span>
            <h2>支援の方向性</h2>
          </div>
          <div className="support-direction-grid">
            {supports.map((support) => (
              <div
                className={`support-direction-panel support-direction-${support.direction.toLowerCase()}`}
                key={support.direction}
              >
                <h3>
                  {support.direction} {support.label}
                </h3>
                <ol>
                  {support.options.map((option) => (
                    <li key={option}>
                      <span>{option}</span>
                      <div className="support-state-buttons">
                        {[
                          ["new", "新"],
                          ["continue", "続"],
                          ["reject", "拒"],
                        ].map(([state, label]) => (
                          <button
                            type="button"
                            key={state}
                            className={
                              supportStates[option] === state ? "selected" : ""
                            }
                            onClick={() =>
                              selectSupportState(
                                support.direction,
                                option,
                                state as "new" | "continue" | "reject",
                              )
                            }
                            aria-label={`${option}を${label}に設定`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="split section">
        <div>
          <Tabs
            items={[
              { id: "summary", label: "サマリー" },
              { id: "screening", label: "スクリーニングデータ" },
              { id: "records", label: "対応記録" },
              { id: "actions", label: "アクション" },
              { id: "history", label: "過去の会議" },
            ]}
            active={tab}
            onChange={setTab}
          />
          {tab === "summary" && (
            <>
              <Card>
                <div className="direction-head">
                  <div>
                    <h2>{student.name}</h2>
                    <p>
                      {student.grade}年{student.className}組
                    </p>
                  </div>
                  <div>
                    {student.supportDirections.map((d) => (
                      <DirectionBadge key={d} direction={d} />
                    ))}
                  </div>
                </div>
                <div className="grid grid-3 section">
                  <div>
                    <small>合計点</small>
                    <h1>{calculatedScreeningScore ?? "—"}</h1>
                  </div>
                  <div>
                    <small>前回比</small>
                    <h1>
                      {calculatedScreeningScore !== null &&
                      student.previousScreeningScore !== null
                        ? calculatedScreeningScore -
                          student.previousScreeningScore
                        : "—"}
                    </h1>
                  </div>
                  <div>
                    <small>自由記述</small>
                    <p>{session?.sharedConcernNote || "登録なし"}</p>
                  </div>
                </div>
                <section
                  className="meeting-score-breakdown"
                  aria-label="スコアサマリー"
                >
                  <h3>スコアサマリー</h3>
                  <div className="meeting-score-breakdown-grid">
                    {categoryScores.map(({ label, score, maxScore }) => (
                      <div key={label}>
                        <span>{label}</span>
                        <p>
                          <b>{score}</b>
                          <small> / {maxScore}</small>
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </Card>
              <Card className="section ai-demo">
                <h3>AIによる生徒理解のための参考情報・デモ</h3>
                <p>
                  <b>点数から見える傾向：</b>{" "}
                  {notableCategories.length > 0
                    ? `${notableCategories.join("、")}が相対的に高く、関連する状況を丁寧に確認する必要があります。`
                    : "現時点では、点数から明確な傾向は確認できません。"}
                </p>
                <p>
                  <b>記録されている事実：</b>{" "}
                  {session?.sharedConcernNote ||
                    studentRecords[0]?.content ||
                    "参照できる具体的な記録はありません。"}
                </p>
                <p>
                  <b>確認したいこと：</b>{" "}
                  点数の背景や最近の変化について、本人の様子、本人・保護者の認識、教職員の観察記録を照合してください。
                </p>
                <small>
                  AIは支援方向を決定しません。教師が点数と事実を確認し、支援の必要性と方向性を判断するための参考情報です。この表示はデモであり、実際のAI処理は行っていません。
                </small>
              </Card>
            </>
          )}
          {tab === "screening" && (
            <Card>
              <h2>スクリーニング点数</h2>
              <ScreeningScoreTable session={session} />
            </Card>
          )}
          {tab === "records" && (
            <Card>
              {records
                .filter((r) => r.studentId === student.id)
                .map((r) => (
                  <div className="list-row" key={r.id}>
                    <small>{formatDate(r.occurredAt)}</small>
                    <div>
                      <b>{r.title}</b>
                      <small>{r.content}</small>
                    </div>
                  </div>
                ))}
            </Card>
          )}
          {tab === "actions" && (
            <Card>
              {actions
                .filter((a) => a.studentId === student.id)
                .map((a) => (
                  <div className="list-row" key={a.id}>
                    <b>{a.title}</b>
                    <small>{formatDate(a.dueDate)}</small>
                  </div>
                ))}
            </Card>
          )}
        </div>
        <aside className="sticky-panel">
          <Card>
            {mode === "screening" ? (
              <>
                <h2>会議での判定</h2>
                <Select
                  label="校内チーム会議への付議"
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                >
                  <option value="refer">上げる</option>
                  <option value="do-not-refer">上げない</option>
                  <option value="pending">保留</option>
                </Select>
              </>
            ) : (
              <>
                <h2>会議メモとアクション</h2>
                <p className="muted">上で選択した支援内容を具体化します。</p>
              </>
            )}
            {mode === "screening" &&
              supports.map((s) => (
                <div className="support-options" key={s.direction}>
                  <label>
                    <input
                      type="checkbox"
                      checked={directions.includes(s.direction)}
                      onChange={() =>
                        setDirections((v) =>
                          v.includes(s.direction)
                            ? v.filter((d) => d !== s.direction)
                            : [...v, s.direction],
                        )
                      }
                    />
                    <DirectionBadge direction={s.direction} />
                  </label>
                </div>
              ))}
            <Textarea
              label="個人メモ（自分のみ・権限制御はデモ）"
              value={privateMemo}
              onChange={(e) => setPrivate(e.target.value)}
            />
            <Textarea
              label="会議メモ（校内共有）"
              value={sharedMemo}
              onChange={(e) => setShared(e.target.value)}
            />
            <hr />
            <h3>
              <Plus size={17} /> クイックアクション作成
            </h3>
            <Input
              label="アクション内容"
              value={actionTitle}
              onChange={(e) => setActionTitle(e.target.value)}
            />
            <Select
              label="担当者"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              <option value="">選択</option>
              {staff.map((s) => (
                <option value={s.id} key={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
            <Input
              label="期限"
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
            />
            <Button onClick={createAction}>アクションを作成</Button>
            <Button className="wide" onClick={saveAll}>
              判定とメモを仮保存
            </Button>
          </Card>
        </aside>
      </div>
    </>
  );
}
