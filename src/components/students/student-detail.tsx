"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronDown, Plus } from "lucide-react";
import {
  Button,
  Card,
  DirectionBadge,
  Input,
  Modal,
  PageHeader,
  StatusBadge,
  Tabs,
  Textarea,
} from "@/components/ui";
import { formatDate, today } from "@/lib/utils";
import { calculateScreeningTotal } from "@/lib/screening";
import { ScreeningScoreTable } from "@/components/screening/screening-score-table";
import { useActionStore, useRecordStore, useUiStore } from "@/stores";
import type { MeetingRecord, ScreeningSession, Staff, Student } from "@/types";
const tabItems = [
  { id: "overview", label: "概要" },
  { id: "screening", label: "スクリーニング" },
  { id: "records", label: "対応記録" },
  { id: "actions", label: "アクション" },
  { id: "meetings", label: "会議履歴" },
];
export function StudentDetail({
  student,
  index,
  total,
  staff,
  screenings,
  meetings,
}: {
  student: Student;
  index: number;
  total: number;
  staff: Staff[];
  screenings: ScreeningSession[];
  meetings: MeetingRecord[];
}) {
  const router = useRouter(),
    [tab, setTab] = useState("overview"),
    [recordOpen, setRecordOpen] = useState(false),
    [title, setTitle] = useState(""),
    [content, setContent] = useState("");
  const actions = useActionStore((s) => s.actions).filter(
      (a) => a.studentId === student.id,
    ),
    records = useRecordStore((s) => s.records).filter(
      (r) => r.studentId === student.id,
    ),
    addRecord = useRecordStore((s) => s.addRecord),
    toast = useUiStore((s) => s.toast);
  const latest =
    screenings.find((screening) => screening.evaluatorId === "staff-1") ??
    screenings[0];
  const otherEvaluations = screenings.filter(
    (screening) => screening.id !== latest?.id,
  );
  const latestScreeningScore = calculateScreeningTotal(latest);
  const move = (n: number) => {
    const v = index + n;
    if (v >= 0 && v < total) router.push(`/students/student-${v + 1}`);
  };
  const save = () => {
    if (!title || !content) return;
    addRecord({
      id: `record-${Date.now()}`,
      studentId: student.id,
      type: "observation",
      title,
      content,
      occurredAt: new Date().toISOString(),
      createdBy: "staff-1",
      updatedAt: new Date().toISOString(),
      tags: ["追加記録"],
    });
    setRecordOpen(false);
    setTitle("");
    setContent("");
    toast("対応記録を仮保存しました");
  };
  return (
    <>
      <PageHeader
        title={student.name}
        description={`${student.grade}年${student.className}組　出席番号 ${student.attendanceNumber}　最終更新 ${formatDate(student.lastUpdatedAt)}`}
        actions={
          <>
            <Button
              variant="outline"
              disabled={index === 0}
              onClick={() => move(-1)}
            >
              <ArrowLeft />
              前の生徒
            </Button>
            <span>
              {index + 1} / {total}人
            </span>
            <Button
              variant="outline"
              disabled={index === total - 1}
              onClick={() => move(1)}
            >
              次の生徒
              <ArrowRight />
            </Button>
          </>
        }
      />
      <Card>
        <div className="direction-head">
          <div>
            {student.supportDirections.map((d) => (
              <DirectionBadge key={d} direction={d} />
            ))}
          </div>
          <span className="muted">
            担当：{staff.find((s) => s.id === student.assignedTeacherId)?.name}
          </span>
        </div>
      </Card>
      <div className="grid grid-4 section">
        <Card>
          <span className="muted">最新スクリーニング</span>
          <h1>
            {latestScreeningScore ?? "—"}
            <small> 点</small>
          </h1>
        </Card>
        <Card>
          <span className="muted">前回からの変化</span>
          <h1>
            {latestScreeningScore !== null &&
            student.previousScreeningScore !== null
              ? latestScreeningScore - student.previousScreeningScore
              : "—"}
          </h1>
        </Card>
        <Card>
          <span className="muted">未完了アクション</span>
          <h1>
            {actions.filter((a) => a.status !== "completed").length}
            <small> 件</small>
          </h1>
        </Card>
        <Card>
          <span className="muted">次回確認日</span>
          <h2
            className={
              student.nextReviewDate && student.nextReviewDate < today
                ? "field-error"
                : ""
            }
          >
            {formatDate(student.nextReviewDate)}
          </h2>
        </Card>
      </div>
      <div className="section">
        <Tabs items={tabItems} active={tab} onChange={setTab} />
        {tab === "overview" && (
          <div className="grid grid-2">
            <Card>
              <h2>現在の支援状況</h2>
              <p>
                担当教職員が定期的に様子を確認し、観察事実を校内で共有しています。
              </p>
              <h3>要確認事項</h3>
              {actions
                .filter(
                  (a) =>
                    a.dueDate && a.dueDate < today && a.status !== "completed",
                )
                .map((a) => (
                  <div className="list-row" key={a.id}>
                    <StatusBadge status={a.status} overdue />
                    <span>{a.title}</span>
                  </div>
                ))}
            </Card>
            <Card>
              <h2>活動タイムライン</h2>
              {records.slice(0, 5).map((r) => (
                <div className="list-row" key={r.id}>
                  <small>{formatDate(r.occurredAt)}</small>
                  <div>
                    <b>{r.title}</b>
                    <small>{r.content}</small>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}
        {tab === "screening" && (
          <div className="grid">
            <Card>
              <h2>自分のスクリーニング評価</h2>
              <ScreeningScoreTable session={latest} />
            </Card>
            <Card>
              <h2>他の先生の評価</h2>
              <p className="muted">
                必要な記録だけを開いて、評価の違いや共通点を確認できます。
              </p>
              {otherEvaluations.length > 0 ? (
                otherEvaluations.map((evaluation) => (
                  <details className="teacher-evaluation" key={evaluation.id}>
                    <summary>
                      <span>
                        <b>
                          {staff.find(
                            (member) => member.id === evaluation.evaluatorId,
                          )?.name ?? "担当者不明"}
                        </b>
                        <small>
                          {formatDate(
                            evaluation.completedAt ?? evaluation.updatedAt,
                          )}
                        </small>
                      </span>
                      <span className="teacher-evaluation-toggle">
                        <strong>{evaluation.totalScore}点</strong>
                        <ChevronDown aria-hidden="true" />
                      </span>
                    </summary>
                    {evaluation.sharedConcernNote && (
                      <p>{evaluation.sharedConcernNote}</p>
                    )}
                    <ScreeningScoreTable session={evaluation} />
                  </details>
                ))
              ) : (
                <p className="muted">他の先生による評価はまだありません。</p>
              )}
            </Card>
          </div>
        )}
        {tab === "records" && (
          <>
            <div className="section-head">
              <h2>対応記録</h2>
              <Button onClick={() => setRecordOpen(true)}>
                <Plus />
                対応記録を追加
              </Button>
            </div>
            {records.map((r) => (
              <Card className="section" key={r.id}>
                <small>{formatDate(r.occurredAt)}</small>
                <h3>{r.title}</h3>
                <p>{r.content}</p>
              </Card>
            ))}
          </>
        )}
        {tab === "actions" && (
          <Card>
            {actions.map((a) => (
              <div className="list-row" key={a.id}>
                <StatusBadge
                  status={a.status}
                  overdue={
                    !!a.dueDate && a.dueDate < today && a.status !== "completed"
                  }
                />
                <div>
                  <b>{a.title}</b>
                  <small>期限 {formatDate(a.dueDate)}</small>
                </div>
              </div>
            ))}
          </Card>
        )}
        {tab === "meetings" && (
          <Card>
            {meetings.map((m) => (
              <div className="list-row" key={m.id}>
                <b>
                  {m.type === "screening"
                    ? "スクリーニング会議"
                    : "校内チーム会議"}
                </b>
                <div>
                  {formatDate(m.heldAt)}
                  <small>{m.sharedMemo}</small>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
      <Modal
        open={recordOpen}
        onClose={() => setRecordOpen(false)}
        title="対応記録を追加"
      >
        <div className="form-grid">
          <Input
            label="件名"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            className="span-2"
            label="内容"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <Button variant="outline" onClick={() => setRecordOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={save}>仮保存する</Button>
        </div>
      </Modal>
    </>
  );
}
