"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
  UserRound,
  X,
} from "lucide-react";
import { Button, DirectionBadge, Input, Select } from "@/components/ui";
import type { Staff, Student, SupportDirection } from "@/types";

interface MeetingSearchFiltersProps {
  students: Student[];
  staff: Staff[];
  selectedId: string;
  onStudentChange: (id: string) => void;
}

export function MeetingSearchFilters({
  students,
  staff,
  selectedId,
  onStudentChange,
}: MeetingSearchFiltersProps) {
  const [year, setYear] = useState("2026");
  const [term, setTerm] = useState("1");
  const [grade, setGrade] = useState("");
  const [className, setClassName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [assignee, setAssignee] = useState("");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [direction, setDirection] = useState<SupportDirection | "">("");
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const selectedStudent =
    students.find((student) => student.id === selectedId) ?? students[0];
  const assignedStaff = staff.find(
    (member) => member.id === selectedStudent?.assignedTeacherId,
  );

  const candidates = useMemo(
    () =>
      students.filter(
        (student) =>
          (!grade || student.grade === Number(grade)) &&
          (!className || student.className === className) &&
          (!studentName ||
            student.name
              .toLocaleLowerCase("ja")
              .includes(studentName.toLocaleLowerCase("ja"))) &&
          (!assignee || student.assignedTeacherId === assignee) &&
          (!minScore ||
            (student.latestScreeningScore ?? -1) >= Number(minScore)) &&
          (!maxScore ||
            (student.latestScreeningScore ?? Infinity) <= Number(maxScore)) &&
          (!direction || student.supportDirections.includes(direction)),
      ),
    [
      assignee,
      className,
      direction,
      grade,
      maxScore,
      minScore,
      studentName,
      students,
    ],
  );

  const applyCandidates = (next: Student[]) => {
    if (next[0] && !next.some((student) => student.id === selectedId)) {
      onStudentChange(next[0].id);
    }
  };

  const filterStudents = ({
    nextGrade = grade,
    nextClassName = className,
    nextStudentName = studentName,
    nextAssignee = assignee,
    nextMinScore = minScore,
    nextMaxScore = maxScore,
    nextDirection = direction,
  }: {
    nextGrade?: string;
    nextClassName?: string;
    nextStudentName?: string;
    nextAssignee?: string;
    nextMinScore?: string;
    nextMaxScore?: string;
    nextDirection?: SupportDirection | "";
  }) =>
    students.filter(
      (student) =>
        (!nextGrade || student.grade === Number(nextGrade)) &&
        (!nextClassName || student.className === nextClassName) &&
        (!nextStudentName ||
          student.name
            .toLocaleLowerCase("ja")
            .includes(nextStudentName.toLocaleLowerCase("ja"))) &&
        (!nextAssignee || student.assignedTeacherId === nextAssignee) &&
        (!nextMinScore ||
          (student.latestScreeningScore ?? -1) >= Number(nextMinScore)) &&
        (!nextMaxScore ||
          (student.latestScreeningScore ?? Infinity) <= Number(nextMaxScore)) &&
        (!nextDirection || student.supportDirections.includes(nextDirection)),
    );

  const clearAll = () => {
    setYear("2026");
    setTerm("1");
    setGrade("");
    setClassName("");
    setStudentName("");
    setAssignee("");
    setMinScore("");
    setMaxScore("");
    setDirection("");
  };

  const activeConditions = [
    ...(year !== "2026"
      ? [{ key: "year", label: `${year}年度`, clear: () => setYear("2026") }]
      : []),
    ...(term !== "1"
      ? [{ key: "term", label: `${term}学期`, clear: () => setTerm("1") }]
      : []),
    ...(grade
      ? [
          {
            key: "grade",
            label: `${grade}年生`,
            clear: () => {
              setGrade("");
              applyCandidates(filterStudents({ nextGrade: "" }));
            },
          },
        ]
      : []),
    ...(className
      ? [
          {
            key: "class",
            label: `${className}組`,
            clear: () => {
              setClassName("");
              applyCandidates(filterStudents({ nextClassName: "" }));
            },
          },
        ]
      : []),
    ...(studentName
      ? [
          {
            key: "studentName",
            label: `生徒名：${studentName}`,
            clear: () => {
              setStudentName("");
              applyCandidates(filterStudents({ nextStudentName: "" }));
            },
          },
        ]
      : []),
    ...(assignee
      ? [
          {
            key: "assignee",
            label: `担当：${staff.find((member) => member.id === assignee)?.name ?? "選択中"}`,
            clear: () => {
              setAssignee("");
              applyCandidates(filterStudents({ nextAssignee: "" }));
            },
          },
        ]
      : []),
    ...(minScore
      ? [
          {
            key: "minScore",
            label: `${minScore}点以上`,
            clear: () => {
              setMinScore("");
              applyCandidates(filterStudents({ nextMinScore: "" }));
            },
          },
        ]
      : []),
    ...(maxScore
      ? [
          {
            key: "maxScore",
            label: `${maxScore}点以下`,
            clear: () => {
              setMaxScore("");
              applyCandidates(filterStudents({ nextMaxScore: "" }));
            },
          },
        ]
      : []),
    ...(direction
      ? [
          {
            key: "direction",
            label: `判定：${direction}`,
            clear: () => {
              setDirection("");
              applyCandidates(filterStudents({ nextDirection: "" }));
            },
          },
        ]
      : []),
  ];

  return (
    <div className="meeting-student-context">
      {selectedStudent && (
        <section className="card meeting-selected-student">
          <div className="meeting-selected-student-main">
            <span className="meeting-selected-student-icon" aria-hidden="true">
              <UserRound size={24} />
            </span>
            <div>
              <span className="meeting-selected-student-label">
                現在の対象生徒
              </span>
              <h2>{selectedStudent.name}</h2>
            </div>
          </div>
          <dl className="meeting-selected-student-details">
            <div>
              <dt>学年・クラス</dt>
              <dd>
                {selectedStudent.grade}年{selectedStudent.className}組
              </dd>
            </div>
            <div>
              <dt>出席番号</dt>
              <dd>{selectedStudent.attendanceNumber}番</dd>
            </div>
            <div>
              <dt>担当</dt>
              <dd>{assignedStaff?.name ?? "未設定"}</dd>
            </div>
            <div>
              <dt>T会議</dt>
              <dd>{selectedStudent.teamMeetingRequired ? "対象" : "対象外"}</dd>
            </div>
          </dl>
          <div className="meeting-selected-student-directions">
            {selectedStudent.supportDirections.length > 0 ? (
              selectedStudent.supportDirections.map((direction) => (
                <DirectionBadge direction={direction} key={direction} />
              ))
            ) : (
              <span className="muted">支援方向は未設定</span>
            )}
          </div>
          <Button
            variant="outline"
            className="meeting-search-toggle"
            onClick={() => setIsSearchOpen((current) => !current)}
            aria-expanded={isSearchOpen}
          >
            <SlidersHorizontal size={17} />
            {isSearchOpen ? "検索条件を閉じる" : "検索条件を変更"}
            {isSearchOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
          </Button>
        </section>
      )}

      {isSearchOpen && (
        <div className="card meeting-search-panel">
          <div className="meeting-search-title">
            <Search aria-hidden="true" />
            <h2>検索条件を選択してください</h2>
          </div>
          <div className="meeting-search-grid">
            <Select
              label="年度"
              value={year}
              onChange={(event) => setYear(event.target.value)}
            >
              <option value="2024">2024年度</option>
              <option value="2025">2025年度</option>
              <option value="2026">2026年度</option>
            </Select>
            <Select
              label="学期"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
            >
              <option value="1">1学期</option>
              <option value="2">2学期</option>
              <option value="3">3学期</option>
            </Select>
            <Select
              label="学年"
              value={grade}
              onChange={(event) => {
                const value = event.target.value;
                setGrade(value);
                applyCandidates(filterStudents({ nextGrade: value }));
              }}
            >
              <option value="">すべて</option>
              {[1, 2, 3, 4, 5, 6].map((value) => (
                <option value={value} key={value}>
                  {value}年生
                </option>
              ))}
            </Select>
            <Select
              label="クラス"
              value={className}
              onChange={(event) => {
                const value = event.target.value;
                setClassName(value);
                applyCandidates(filterStudents({ nextClassName: value }));
              }}
            >
              <option value="">全クラス</option>
              {Array.from({ length: 10 }, (_, index) => index + 1).map(
                (value) => (
                  <option value={value} key={value}>
                    {value}組
                  </option>
                ),
              )}
            </Select>
            <Input
              label="生徒名"
              value={studentName}
              placeholder="生徒名を入力"
              type="search"
              onChange={(event) => {
                const value = event.target.value;
                setStudentName(value);
                applyCandidates(filterStudents({ nextStudentName: value }));
              }}
            />
            <Select
              label="担当検索"
              value={assignee}
              onChange={(event) => {
                const value = event.target.value;
                setAssignee(value);
                applyCandidates(filterStudents({ nextAssignee: value }));
              }}
            >
              <option value="">全担当</option>
              {staff.map((member) => (
                <option value={member.id} key={member.id}>
                  {member.name}
                </option>
              ))}
            </Select>
            <Input
              label="スコア（下限）"
              type="number"
              min="0"
              value={minScore}
              placeholder="0"
              onChange={(event) => {
                const value = event.target.value;
                setMinScore(value);
                applyCandidates(filterStudents({ nextMinScore: value }));
              }}
            />
            <Input
              label="スコア（上限）"
              type="number"
              min="0"
              value={maxScore}
              placeholder="上限なし"
              onChange={(event) => {
                const value = event.target.value;
                setMaxScore(value);
                applyCandidates(filterStudents({ nextMaxScore: value }));
              }}
            />
            <Select
              label="判定"
              value={direction}
              onChange={(event) => {
                const value = event.target.value as SupportDirection | "";
                setDirection(value);
                applyCandidates(filterStudents({ nextDirection: value }));
              }}
            >
              <option value="">すべて</option>
              <option value="A">A 教職員関与</option>
              <option value="B">B 地域資源</option>
              <option value="C">C 専門機関</option>
            </Select>
          </div>
          {activeConditions.length > 0 && (
            <div className="student-search-active-row meeting-search-active-row">
              <span className="student-search-active-label">
                絞り込み条件：
              </span>
              <div className="active-chips">
                {activeConditions.map((condition) => (
                  <button
                    type="button"
                    className="active-chip"
                    key={condition.key}
                    onClick={condition.clear}
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
                onClick={clearAll}
              >
                すべてクリア
              </Button>
            </div>
          )}
          <div className="meeting-search-results">
            <div className="meeting-search-results-head">
              <h3>対象生徒を選択</h3>
              <span>{candidates.length}名が一致</span>
            </div>
            {candidates.length > 0 ? (
              <div className="meeting-search-candidates">
                {candidates.map((student) => {
                  const teacher = staff.find(
                    (member) => member.id === student.assignedTeacherId,
                  );
                  const isSelected = student.id === selectedId;
                  return (
                    <button
                      type="button"
                      className={`meeting-search-candidate${isSelected ? " is-selected" : ""}`}
                      key={student.id}
                      onClick={() => {
                        onStudentChange(student.id);
                        setIsSearchOpen(false);
                      }}
                      aria-current={isSelected ? "true" : undefined}
                    >
                      <span className="meeting-search-candidate-name">
                        {student.name}
                      </span>
                      <span>
                        {student.grade}年{student.className}組・
                        {student.attendanceNumber}番
                      </span>
                      <span>担当：{teacher?.name ?? "未設定"}</span>
                      <span>
                        スコア：{student.latestScreeningScore ?? "未実施"}
                      </span>
                      <ChevronDown
                        className="meeting-search-candidate-arrow"
                        size={17}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="meeting-search-no-result">
                条件に一致する生徒はいません。条件を変更してください。
              </p>
            )}
          </div>
          <span className="sr-only" aria-live="polite">
            {candidates.length}名が検索条件に一致
          </span>
        </div>
      )}
    </div>
  );
}
