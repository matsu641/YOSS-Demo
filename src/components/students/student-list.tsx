"use client";

import { Fragment, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronRight, ChevronUp, Search, X } from "lucide-react";
import {
  Button,
  DirectionBadge,
  EmptyState,
  Input,
  Select,
} from "@/components/ui";
import { screeningCategories } from "@/config";
import { formatDate, today } from "@/lib/utils";
import { useActionStore } from "@/stores";
import type {
  InternalFlag,
  ScreeningSession,
  Staff,
  Student,
  SupportDirection,
  SupportRecord,
} from "@/types";

interface StudentListProps {
  students: Student[];
  staff: Staff[];
  screenings: ScreeningSession[];
  flags: InternalFlag[];
  records: SupportRecord[];
}

export function StudentList({
  students,
  staff,
  screenings,
  flags,
  records,
}: StudentListProps) {
  const router = useRouter();
  const params = useSearchParams();
  const actions = useActionStore((state) => state.actions);
  const [expandedScoreIds, setExpandedScoreIds] = useState<string[]>([]);

  const year = params.get("year") ?? "2026";
  const grade = params.get("grade") ?? "";
  const className = params.get("class") ?? "";
  const name = params.get("name") ?? "";
  const direction = params.get("direction") ?? "";
  const internalFlag = params.get("internalFlag") ?? "";
  const teamMeeting = params.get("teamMeeting") ?? "";
  const youngCarer = params.get("youngCarer") ?? "";
  const actionStatus = params.get("actionStatus") ?? "";

  const update = (key: string, value: string) => {
    const nextParams = new URLSearchParams(params);
    if (value) nextParams.set(key, value);
    else nextParams.delete(key);
    router.push(`/students?${nextParams.toString()}`);
  };

  const filtered = useMemo(
    () =>
      students.filter((student) => {
        const isYoungCarer = student.internalFlagIds.includes("flag-2");
        return (
          (!grade || student.grade === Number(grade)) &&
          (!className || student.className === className) &&
          (!name ||
            student.name
              .toLocaleLowerCase("ja")
              .includes(name.toLocaleLowerCase("ja"))) &&
          (!direction ||
            student.supportDirections.includes(
              direction as SupportDirection,
            )) &&
          (!internalFlag || student.internalFlagIds.includes(internalFlag)) &&
          (!teamMeeting ||
            (teamMeeting === "yes"
              ? student.teamMeetingRequired
              : !student.teamMeetingRequired)) &&
          (!youngCarer ||
            (youngCarer === "yes" ? isYoungCarer : !isYoungCarer)) &&
          (!actionStatus ||
            actions.some(
              (action) =>
                action.studentId === student.id &&
                action.dueDate &&
                action.dueDate < today &&
                action.status !== "completed",
            ))
        );
      }),
    [
      actionStatus,
      actions,
      className,
      direction,
      grade,
      internalFlag,
      name,
      students,
      teamMeeting,
      youngCarer,
    ],
  );

  const activeConditions: { key: string; label: string }[] = [];
  if (year !== "2026")
    activeConditions.push({ key: "year", label: `${year}年度` });
  if (direction) {
    const labels: Record<string, string> = {
      A: "A 教職員関与 対応中",
      B: "B 地域資源の活用 対応中",
      C: "C 専門機関の活用 対応中",
    };
    activeConditions.push({
      key: "direction",
      label: labels[direction] ?? direction,
    });
  }
  if (internalFlag)
    activeConditions.push({
      key: "internalFlag",
      label:
        flags.find((flag) => flag.id === internalFlag)?.name ?? "校内フラグ",
    });
  if (grade) activeConditions.push({ key: "grade", label: `${grade}年生` });
  if (className)
    activeConditions.push({ key: "class", label: `${className}組` });
  if (name)
    activeConditions.push({
      key: "name",
      label: `生徒名：${name}`,
    });
  if (teamMeeting)
    activeConditions.push({
      key: "teamMeeting",
      label: `T会議：${teamMeeting === "yes" ? "対象" : "対象外"}`,
    });
  if (youngCarer)
    activeConditions.push({
      key: "youngCarer",
      label: `ヤングケアラー：${youngCarer === "yes" ? "対象" : "対象外"}`,
    });
  if (actionStatus)
    activeConditions.push({ key: "actionStatus", label: "期限超過" });

  const toggleScores = (studentId: string) => {
    setExpandedScoreIds((current) =>
      current.includes(studentId)
        ? current.filter((id) => id !== studentId)
        : [...current, studentId],
    );
  };

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
            onChange={(event) => update("year", event.target.value)}
          >
            <option value="2024">2024年度</option>
            <option value="2025">2025年度</option>
            <option value="2026">2026年度</option>
          </Select>
          <Select
            label="フラグ検索"
            value={direction}
            onChange={(event) => update("direction", event.target.value)}
          >
            <option value="">すべて</option>
            <option value="A">A 教職員関与 対応中</option>
            <option value="B">B 地域資源の活用 対応中</option>
            <option value="C">C 専門機関の活用 対応中</option>
          </Select>
          <Select
            label="校内フラグ検索"
            value={internalFlag}
            onChange={(event) => update("internalFlag", event.target.value)}
          >
            <option value="">すべて</option>
            {flags.map((flag) => (
              <option key={flag.id} value={flag.id}>
                {flag.name}
              </option>
            ))}
          </Select>
          <Select
            label="学年検索"
            value={grade}
            onChange={(event) => update("grade", event.target.value)}
          >
            <option value="">全学年</option>
            {[1, 2, 3, 4, 5, 6].map((value) => (
              <option key={value} value={value}>
                {value}年生
              </option>
            ))}
          </Select>
          <Select
            label="クラス検索"
            value={className}
            onChange={(event) => update("class", event.target.value)}
          >
            <option value="">全クラス</option>
            {Array.from({ length: 10 }, (_, index) => index + 1).map(
              (value) => (
                <option key={value} value={value}>
                  {value}組
                </option>
              ),
            )}
          </Select>
          <Input
            label="生徒名検索"
            value={name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="生徒名を入力"
            type="search"
          />
          <Select
            label="T会議選択"
            value={teamMeeting}
            onChange={(event) => update("teamMeeting", event.target.value)}
          >
            <option value="">すべて</option>
            <option value="yes">対象</option>
            <option value="no">対象外</option>
          </Select>
          <Select
            label="ヤングケアラー"
            value={youngCarer}
            onChange={(event) => update("youngCarer", event.target.value)}
          >
            <option value="">すべて</option>
            <option value="yes">対象</option>
            <option value="no">対象外</option>
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
        <div className="table-wrap student-list-table-wrap">
          <table className="desktop-table student-list-table">
            <thead>
              <tr>
                <th>クラス</th>
                <th>出席番号</th>
                <th>氏名</th>
                <th>フラグ・校内対応</th>
                <th>スクリーニング点数</th>
                <th>対応記録</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => {
                const session = screenings.find(
                  (item) => item.studentId === student.id,
                );
                const scoreByItem = new Map(
                  session?.responses.map((response) => [
                    response.itemId,
                    response.score ?? 0,
                  ]) ?? [],
                );
                const categoryTotals = screeningCategories.map((category) =>
                  category.items.reduce(
                    (sum, _item, index) =>
                      sum +
                      (scoreByItem.get(`${category.id}-${index + 1}`) ?? 0),
                    0,
                  ),
                );
                const total = categoryTotals.reduce(
                  (sum, value) => sum + value,
                  0,
                );
                const evaluation = Math.min(
                  5,
                  Math.max(1, Math.ceil(total / 14)),
                );
                const highestScore = Math.max(...categoryTotals);
                const highestIndex =
                  highestScore > 0 ? categoryTotals.indexOf(highestScore) : -1;
                const latestRecord = records
                  .filter((record) => record.studentId === student.id)
                  .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))[0];
                const isExpanded = expandedScoreIds.includes(student.id);

                return (
                  <Fragment key={student.id}>
                    <tr
                      className="clickable"
                      onClick={() => router.push(`/students/${student.id}`)}
                    >
                      <td className="student-class-cell">
                        {student.grade}年{student.className}組
                      </td>
                      <td>{student.attendanceNumber}</td>
                      <td className="student-name-cell">
                        <b>{student.name}</b>
                      </td>
                      <td>
                        <div className="student-flag-cell">
                          {student.supportDirections.length
                            ? student.supportDirections.map((value) => (
                                <DirectionBadge key={value} direction={value} />
                              ))
                            : "未設定"}
                          {student.internalFlagIds.map((flagId) => {
                            const flag = flags.find(
                              (item) => item.id === flagId,
                            );
                            return flag ? (
                              <span
                                className="internal-flag-pill"
                                key={flag.id}
                              >
                                {flag.shortLabel}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </td>
                      <td className="student-score-summary-cell">
                        <div className="student-score-summary">
                          <div className="student-score-summary-values">
                            <span>
                              合計 <b>{total}</b>
                            </span>
                            <span>
                              ★評価 <b>{evaluation}</b>
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleScores(student.id);
                            }}
                            aria-expanded={isExpanded}
                            aria-label={`${student.name}の点数詳細を${isExpanded ? "閉じる" : "表示"}`}
                          >
                            {isExpanded ? "閉じる" : "点数を見る"}
                            {isExpanded ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </Button>
                        </div>
                      </td>
                      <td className="student-record-cell">
                        {latestRecord ? (
                          <>
                            <small>{formatDate(latestRecord.occurredAt)}</small>
                            <b>{latestRecord.title}</b>
                            <span>
                              {
                                staff.find(
                                  (member) =>
                                    member.id === latestRecord.createdBy,
                                )?.name
                              }
                            </span>
                          </>
                        ) : (
                          <span>記録なし</span>
                        )}
                        <Button
                          variant="ghost"
                          aria-label={`${student.name}の詳細`}
                          onClick={(event) => {
                            event.stopPropagation();
                            router.push(`/students/${student.id}`);
                          }}
                        >
                          <ChevronRight size={16} />
                        </Button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="student-score-detail-row">
                        <td colSpan={6}>
                          <div className="student-score-detail-grid">
                            {screeningCategories.map((category, index) => (
                              <div
                                className={`student-score-detail-card${index === highestIndex ? " is-highest" : ""}`}
                                key={category.id}
                              >
                                <span>{category.label}</span>
                                <b>{categoryTotals[index]}</b>
                                {index === highestIndex && (
                                  <small>最高点</small>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
