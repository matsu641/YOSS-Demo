"use client";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Search, X } from "lucide-react";
import {
  Button,
  DirectionBadge,
  EmptyState,
  Input,
  Select,
  StatusBadge,
} from "@/components/ui";
import { formatDate, today } from "@/lib/utils";
import { useActionStore, useUiStore } from "@/stores";
import type { Student, SupportDirection } from "@/types";
export function StudentList({ students }: { students: Student[] }) {
  const router = useRouter(),
    params = useSearchParams(),
    actions = useActionStore((s) => s.actions),
    toast = useUiStore((s) => s.toast);
  const [name, setName] = useState(params.get("name") ?? "");
  const grade = params.get("grade") ?? "",
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
          (!direction ||
            s.supportDirections.includes(direction as SupportDirection)) &&
          (!name || s.name.includes(name)) &&
          (!actionStatus ||
            actions.some(
              (a) =>
                a.studentId === s.id &&
                a.dueDate &&
                a.dueDate < today &&
                a.status !== "completed",
            )),
      ),
    [students, grade, direction, name, actionStatus, actions],
  );
  const preset = (id: string) => {
    const p = new URLSearchParams();
    if (id === "overdue") p.set("actionStatus", "overdue");
    if (id === "team") p.set("preset", "team");
    if (id === "review") p.set("review", "overdue");
    router.push(`/students?${p}`);
  };
  return (
    <>
      <div className="active-chips">
        {[
          ["自分の担当生徒", "mine"],
          ["期限超過あり", "overdue"],
          ["前回から悪化", "worse"],
          ["アクション未登録", "none"],
          ["校内チーム会議対象", "team"],
          ["次回確認日超過", "review"],
          ["最近更新された生徒", "recent"],
        ].map(([l, id]) => (
          <button className="active-chip" key={id} onClick={() => preset(id ?? "")}>
            {l}
          </button>
        ))}
      </div>
      <div className="card toolbar">
        <Input
          label="生徒名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && update("name", name)}
          placeholder="氏名で検索"
        />
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
        <Select label="クラス">
          <option>すべて</option>
          <option>1組</option>
          <option>2組</option>
          <option>3組</option>
        </Select>
        <Select
          label="支援方向"
          value={direction}
          onChange={(e) => update("direction", e.target.value)}
        >
          <option value="">すべて</option>
          <option value="A">A 教職員関与</option>
          <option value="B">B 地域資源</option>
          <option value="C">C 専門機関</option>
        </Select>
        <Select
          label="アクション状態"
          value={actionStatus}
          onChange={(e) => update("actionStatus", e.target.value)}
        >
          <option value="">すべて</option>
          <option value="overdue">期限超過</option>
        </Select>
        <Button onClick={() => update("name", name)}>
          <Search size={17} />
          検索
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setName("");
            router.push("/students");
          }}
        >
          <X size={17} />
          クリア
        </Button>
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
