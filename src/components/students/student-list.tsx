"use client";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Search, X } from "lucide-react";
import {
  Button,
  DirectionBadge,
  EmptyState,
  Select,
  StatusBadge,
} from "@/components/ui";
import { formatDate, today } from "@/lib/utils";
import { useActionStore, useUiStore } from "@/stores";
import type { Staff, Student, SupportDirection } from "@/types";
export function StudentList({
  students,
  staff,
}: {
  students: Student[];
  staff: Staff[];
}) {
  const router = useRouter(),
    params = useSearchParams(),
    actions = useActionStore((s) => s.actions),
    toast = useUiStore((s) => s.toast);
  const year = params.get("year") ?? "2026",
    term = params.get("term") ?? "1",
    grade = params.get("grade") ?? "",
    className = params.get("class") ?? "",
    name = params.get("name") ?? "",
    assigneeCategory = params.get("assigneeCategory") ?? "",
    direction = params.get("direction") ?? "",
    actionStatus = params.get("actionStatus") ?? "";
  const update = (key: string, value: string) => {
    const p = new URLSearchParams(params);
    if (value) p.set(key, value);
    else p.delete(key);
    router.push(`/students?${p}`);
  };
  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          (!grade || s.grade === Number(grade)) &&
          (!className || s.className === className) &&
          (!direction ||
            s.supportDirections.includes(direction as SupportDirection)) &&
          (!name || s.id === name) &&
          (!assigneeCategory ||
            staff.some(
              (member) =>
                member.id === s.assignedTeacherId &&
                (assigneeCategory === "class"
                  ? member.role === "homeroom-teacher"
                  : assigneeCategory === "special-support"
                    ? member.role === "special-support"
                    : assigneeCategory === "health"
                      ? member.role === "school-nurse"
                      : assigneeCategory === "office"
                        ? member.role === "office"
                        : assigneeCategory === "management"
                          ? ["manager", "student-guidance"].includes(
                              member.role,
                            )
                          : ["social-worker", "counselor"].includes(
                              member.role,
                            )),
            )) &&
          (!actionStatus ||
            actions.some(
              (a) =>
                a.studentId === s.id &&
                a.dueDate &&
                a.dueDate < today &&
                a.status !== "completed",
            )),
      ),
    [
      students,
      staff,
      grade,
      className,
      direction,
      name,
      assigneeCategory,
      actionStatus,
      actions,
    ],
  );
  const activeConditions: { key: string; label: string }[] = [];
  if (year !== "2026")
    activeConditions.push({ key: "year", label: `${year}年度` });
  if (term !== "1")
    activeConditions.push({ key: "term", label: `${term}学期` });
  if (grade) activeConditions.push({ key: "grade", label: `${grade}年生` });
  if (className)
    activeConditions.push({ key: "class", label: `${className}組` });
  if (name)
    activeConditions.push({
      key: "name",
      label:
        students.find((student) => student.id === name)?.name ?? "選択生徒",
    });
  if (assigneeCategory) {
    const assigneeLabels: Record<string, string> = {
      class: "学級",
      "special-support": "特別支援",
      health: "養護",
      office: "事務",
      management: "管理職・生徒指導",
      community: "地域・調査",
    };
    activeConditions.push({
      key: "assigneeCategory",
      label: assigneeLabels[assigneeCategory] ?? assigneeCategory,
    });
  }
  if (direction) {
    const directionLabels: Record<string, string> = {
      A: "A 教職員関与",
      B: "B 地域資源の活用",
      C: "C 専門機関の活用",
    };
    activeConditions.push({
      key: "direction",
      label: directionLabels[direction] ?? direction,
    });
  }
  if (actionStatus)
    activeConditions.push({ key: "actionStatus", label: "期限超過" });
  return (
    <>
      <div className="card student-search-panel">
        <div className="student-search-title">
          <Search aria-hidden="true" />
          <h2>検索条件を選択してください</h2>
        </div>
        <div className="student-search-grid">
          <Select
            label="年度"
            value={year}
            onChange={(e) => update("year", e.target.value)}
          >
            <option value="2024">2024年度</option>
            <option value="2025">2025年度</option>
            <option value="2026">2026年度</option>
          </Select>
          <Select
            label="学期"
            value={term}
            onChange={(e) => update("term", e.target.value)}
          >
            <option value="1">1学期</option>
            <option value="2">2学期</option>
            <option value="3">3学期</option>
          </Select>
          <Select
            label="学年"
            value={grade}
            onChange={(e) => update("grade", e.target.value)}
          >
            <option value="">すべて</option>
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <option key={g} value={g}>
                {g}年
              </option>
            ))}
          </Select>
          <Select
            label="クラス"
            value={className}
            onChange={(e) => update("class", e.target.value)}
          >
            <option value="">全クラス</option>
            {Array.from({ length: 10 }, (_, index) => index + 1).map(
              (classNumber) => (
                <option key={classNumber} value={classNumber}>
                  {classNumber}組
                </option>
              ),
            )}
          </Select>
          <Select
            label="生徒名"
            value={name}
            onChange={(e) => update("name", e.target.value)}
          >
            <option value="">全生徒</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </Select>
          <Select
            label="担当検索"
            value={assigneeCategory}
            onChange={(e) => update("assigneeCategory", e.target.value)}
          >
            <option value="">全担当</option>
            <option value="class">学級</option>
            <option value="special-support">特別支援</option>
            <option value="health">養護</option>
            <option value="office">事務</option>
            <option value="management">管理職・生徒指導</option>
            <option value="community">地域・調査</option>
          </Select>
        </div>
        {activeConditions.length > 0 && (
          <div className="student-search-active-row">
            <span className="student-search-active-label">絞り込み条件：</span>
            <div className="active-chips">
              {activeConditions.map((condition) => (
                <button
                  type="button"
                  className="active-chip"
                  key={condition.key}
                  onClick={() => update(condition.key, "")}
                  aria-label={`${condition.label}を解除`}
                >
                  {condition.label}
                  <X size={15} />
                </button>
              ))}
            </div>
            <Button
              className="student-search-clear"
              variant="ghost"
              onClick={() => router.push("/students")}
            >
              すべてクリア
            </Button>
          </div>
        )}
      </div>
      <p className="muted section">{filtered.length}名を表示</p>
      {filtered.length === 0 ? (
        <EmptyState
          action={
            <Button onClick={() => router.push("/students")}>
              条件をクリア
            </Button>
          }
        />
      ) : (
        <div className="table-wrap">
          <table className="desktop-table">
            <thead>
              <tr>
                <th>生徒</th>
                <th>学年・クラス</th>
                <th>支援方向</th>
                <th>最新スコア</th>
                <th>前回比</th>
                <th>進行中アクション</th>
                <th>次回確認日</th>
                <th>最終更新</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const sa = actions.filter((a) => a.studentId === s.id),
                  over = sa.filter(
                    (a) =>
                      a.dueDate &&
                      a.dueDate < today &&
                      a.status !== "completed",
                  );
                const diff =
                  s.latestScreeningScore !== null &&
                  s.previousScreeningScore !== null
                    ? s.latestScreeningScore - s.previousScreeningScore
                    : null;
                return (
                  <tr
                    className="clickable"
                    key={s.id}
                    onClick={() => router.push(`/students/${s.id}`)}
                  >
                    <td>
                      <b>{s.name}</b>
                      <small className="muted">
                        　出席番号 {s.attendanceNumber}
                      </small>
                    </td>
                    <td>
                      {s.grade}年{s.className}組
                    </td>
                    <td>
                      {s.supportDirections.length
                        ? s.supportDirections.map((d) => (
                            <DirectionBadge key={d} direction={d} />
                          ))
                        : "未設定"}
                    </td>
                    <td>{s.latestScreeningScore ?? "—"}点</td>
                    <td className={diff && diff > 0 ? "field-error" : ""}>
                      {diff === null ? "—" : diff > 0 ? `+${diff}` : diff}
                    </td>
                    <td>
                      {sa.filter((a) => a.status === "in-progress").length}件{" "}
                      {over.length > 0 && (
                        <StatusBadge status="in-progress" overdue />
                      )}
                    </td>
                    <td>{formatDate(s.nextReviewDate)}</td>
                    <td>{formatDate(s.lastUpdatedAt)}</td>
                    <td>
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast("対応記録の追加は生徒個表から操作できます");
                        }}
                      >
                        詳細 <ChevronRight size={16} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
