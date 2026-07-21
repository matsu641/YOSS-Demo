"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
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
import {
  useActionStore,
  useMeetingStore,
  useRecordStore,
  useScreeningStore,
  useUiStore,
} from "@/stores";
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
      "担任による面談",
      "養護教諭による定期確認",
      "生徒指導担当による対応",
      "特別支援担当との連携",
      "SSWとの校内連携",
      "SCとの校内連携",
    ],
  },
  {
    direction: "B",
    label: "地域資源の活用",
    options: [
      "学習支援",
      "地域の居場所",
      "子ども食堂",
      "家庭教育支援",
      "地域福祉サービス",
    ],
  },
  {
    direction: "C",
    label: "専門機関の活用",
    options: [
      "児童相談所",
      "家庭児童相談室",
      "教育センター",
      "少年サポートセンター",
      "医療・福祉相談機関",
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
    index = students.findIndex((s) => s.id === student?.id),
    session = sessions.find((s) => s.studentId === student?.id);
  if (!student) return null;
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
  const move = (n: number) => {
    const next = students[index + n];
    if (next) setId(next.id);
  };
  return (
    <>
      <Card>
        <div className="student-nav">
          <Button
            variant="outline"
            disabled={index === 0}
            onClick={() => move(-1)}
          >
            <ArrowLeft />
            前へ
          </Button>
          <Select
            label="対象生徒"
            value={id}
            onChange={(e) => setId(e.target.value)}
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.grade}年{s.className}組 {s.name}
              </option>
            ))}
          </Select>
          <Button
            variant="outline"
            disabled={index === students.length - 1}
            onClick={() => move(1)}
          >
            次へ
            <ArrowRight />
          </Button>
          <b>
            {index + 1} / {students.length}人
          </b>
        </div>
      </Card>
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
                    <h1>{student.latestScreeningScore ?? "—"}</h1>
                  </div>
                  <div>
                    <small>前回比</small>
                    <h1>
                      {student.latestScreeningScore !== null &&
                      student.previousScreeningScore !== null
                        ? student.latestScreeningScore -
                          student.previousScreeningScore
                        : "—"}
                    </h1>
                  </div>
                  <div>
                    <small>自由記述</small>
                    <p>{session?.sharedConcernNote || "登録なし"}</p>
                  </div>
                </div>
              </Card>
              <Card className="section ai-demo">
                <h3>AI参考判定・デモ</h3>
                <p>
                  <b>校内チーム会議への付議：</b> 付議を推奨
                </p>
                <p>
                  <b>参考支援方向：</b> A 教職員関与
                </p>
                <small>
                  この表示は静的ダミーデータであり、実際のAI処理は行っていません。
                </small>
              </Card>
            </>
          )}
          {tab === "screening" && (
            <Card>
              {session?.responses.map((r) => (
                <div className="list-row" key={r.itemId}>
                  <b>{r.itemId}</b>
                  <span>スコア {r.score}</span>
                  <small>{r.observedFact}</small>
                </div>
              ))}
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
                <h2>支援方向と支援候補</h2>
                <p className="muted">会議で決定する内容です。</p>
              </>
            )}
            {supports.map((s) => (
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
                {mode === "team" &&
                  s.options.map((o) => (
                    <label key={o}>
                      <input
                        type="checkbox"
                        checked={options.includes(o)}
                        onChange={() => {
                          setOptions((v) =>
                            v.includes(o)
                              ? v.filter((x) => x !== o)
                              : [...v, o],
                          );
                          setActionTitle(o);
                        }}
                      />
                      {o}
                    </label>
                  ))}
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
