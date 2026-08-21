import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Preparation } from "@/components/screening/preparation";
import { useScreeningStore } from "@/stores";
import type { ScreeningItemDefinition, Staff, Student } from "@/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams("student=student-test"),
}));

const students: Student[] = [
  {
    id: "student-test",
    studentCode: "test",
    name: "テスト生徒",
    nameKana: "てすとせいと",
    grade: 1,
    className: "1",
    attendanceNumber: 1,
    supportDirections: [],
    internalFlagIds: [],
    latestScreeningScore: null,
    previousScreeningScore: null,
    nextReviewDate: null,
    teamMeetingRequired: false,
    assignedTeacherId: "staff-test",
    lastUpdatedAt: "2026-08-01",
  },
];
const staff: Staff[] = [
  {
    id: "staff-test",
    name: "テスト先生",
    role: "teacher",
    avatarInitials: "先生",
  },
];
const definitions: ScreeningItemDefinition[] = [
  {
    id: "school-adaptation-test",
    category: "school-adaptation",
    label: "テスト項目",
    description: "テスト説明",
    maxScore: 2,
  },
];

describe("スクリーニング準備画面", () => {
  beforeEach(() => {
    useScreeningStore.setState({
      sessions: [
        {
          id: "session-test",
          studentId: "student-test",
          academicYear: 2026,
          term: "1学期",
          meetingType: "screening",
          responses: [],
          sharedConcernNote: "",
          totalScore: 0,
          completedAt: null,
          updatedAt: "2026-08-01",
        },
      ],
    });
  });

  it("必要なときだけメモ入力欄を表示する", () => {
    render(
      <Preparation
        students={students}
        staff={staff}
        definitions={definitions}
      />,
    );

    expect(screen.queryByLabelText("観察された事実")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "メモを追加する" }));
    expect(screen.getByLabelText("観察された事実")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "メモ入力を閉じる" }));
    expect(screen.queryByLabelText("観察された事実")).not.toBeInTheDocument();
  });
});
