import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MeetingSearchFilters } from "@/components/meetings/meeting-search-filters";
import type { Staff, Student } from "@/types";

const staff: Staff[] = [
  { id: "staff-1", name: "山田先生", role: "teacher", avatarInitials: "山田" },
];

const student = (
  id: string,
  score: number | null,
  supportDirections: Student["supportDirections"],
): Student => ({
  id,
  studentCode: id,
  name: `生徒${id}`,
  nameKana: "せいと",
  grade: 1,
  className: "1",
  attendanceNumber: Number(id),
  supportDirections,
  internalFlagIds: [],
  latestScreeningScore: score,
  previousScreeningScore: null,
  nextReviewDate: null,
  teamMeetingRequired: false,
  assignedTeacherId: "staff-1",
  lastUpdatedAt: "2026-08-01",
});

describe("会議画面の検索条件", () => {
  it("スコア範囲と判定を組み合わせて絞り込める", () => {
    const students = [
      student("1", 12, ["A"]),
      student("2", 24, ["B"]),
      student("3", 30, ["B", "C"]),
    ];

    render(
      <MeetingSearchFilters
        students={students}
        staff={staff}
        selectedId="1"
        onStudentChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("スコア（下限）"), {
      target: { value: "20" },
    });
    fireEvent.change(screen.getByLabelText("スコア（上限）"), {
      target: { value: "25" },
    });
    fireEvent.change(screen.getByLabelText("判定"), {
      target: { value: "B" },
    });

    expect(screen.getByText("1名が一致")).toBeInTheDocument();
    expect(screen.getByText("生徒2")).toBeInTheDocument();
    expect(screen.queryByText("生徒3")).not.toBeInTheDocument();
  });
});
